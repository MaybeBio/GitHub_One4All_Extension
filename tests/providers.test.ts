import { describe, expect, it } from 'vitest';
import { BUILTIN_CATALOG, getAllProviders, isProviderEnabled } from '../utils/providers/catalog';
import { buildCustomUrl, createCustomProvider, validateCustomTemplate } from '../utils/providers/custom';
import type { Provider, UrlContext } from '../utils/providers/types';

function context(overrides: Partial<UrlContext> = {}): UrlContext {
  return {
    owner: 'facebook',
    repo: 'react',
    pageType: 'root',
    repoUrl: 'https://github.com/facebook/react',
    language: 'en-US',
    ...overrides,
  };
}

function provider(id: string): Provider {
  const found = BUILTIN_CATALOG.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown provider: ${id}`);
  return found;
}

describe('built-in transforms', () => {
  it('builds repository-scoped URLs', () => {
    expect(provider('deepwiki').url(context())).toBe('https://deepwiki.com/facebook/react');
    expect(provider('codewiki').url(context())).toBe(
      'https://codewiki.google/github.com/facebook/react',
    );
    expect(provider('gitmcp').url(context())).toBe('https://gitmcp.io/facebook/react');
    expect(provider('github-dev').url(context())).toBe('https://github.dev/facebook/react');
  });

  it('localizes Readmex only for non-Chinese languages', () => {
    expect(provider('readmex').url(context({ language: 'zh-CN' }))).toBe(
      'https://readmex.com/facebook/react',
    );
    expect(provider('readmex').url(context({ language: 'en-US' }))).toBe(
      'https://readmex.com/en-US/facebook/react',
    );
  });

  it('hides file-only tools outside blob pages', () => {
    expect(provider('git-history').url(context())).toBeNull();
    expect(provider('plain-view').url(context({ pageType: 'tree', ref: 'main' }))).toBeNull();
    const blob = context({
      pageType: 'blob',
      ref: 'main',
      path: 'src/index.js',
    });
    expect(provider('git-history').url(blob)).toBe(
      'https://github.githistory.xyz/facebook/react/blob/main/src/index.js',
    );
    expect(provider('plain-view').url(blob)).toBe(
      'https://github.com/facebook/react/blob/main/src/index.js?plain=1',
    );
  });

  it('builds Nbviewer URLs for root and blob pages', () => {
    expect(provider('nbviewer').url(context())).toBe(
      'https://nbviewer.org/github/facebook/react',
    );
    expect(
      provider('nbviewer').url(
        context({ pageType: 'blob', ref: 'main', path: 'notebooks/demo.ipynb' }),
      ),
    ).toBe('https://nbviewer.org/github/facebook/react/blob/main/notebooks/demo.ipynb');
  });

  it('builds Download Directory URLs from the current folder', () => {
    expect(provider('download-directory').url(context())).toBe(
      `https://download-directory.github.io/?url=${encodeURIComponent(
        'https://github.com/facebook/react',
      )}`,
    );
    expect(
      provider('download-directory').url(
        context({ pageType: 'tree', ref: 'main', path: 'packages/react' }),
      ),
    ).toBe(
      `https://download-directory.github.io/?url=${encodeURIComponent(
        'https://github.com/facebook/react/tree/main/packages/react',
      )}`,
    );
  });

  it('requires a ref for archive downloads', () => {
    expect(provider('archive-zip').url(context())).toBeNull();
    expect(provider('archive-zip').url(context({ pageType: 'tree', ref: 'main' }))).toBe(
      'https://github.com/facebook/react/archive/main.zip',
    );
  });

  it('keeps feed URLs repository-scoped', () => {
    expect(provider('releases-atom').url(context())).toBe(
      'https://github.com/facebook/react/releases.atom',
    );
    expect(provider('commits-atom').url(context())).toBe(
      'https://github.com/facebook/react/commits.atom',
    );
  });

  it('does not throw when a transform fails', () => {
    const failing: Provider = {
      id: 'broken',
      name: 'Broken',
      category: 'custom',
      description: 'Broken transform',
      url: () => {
        throw new Error('boom');
      },
      enabledByDefault: true,
      verified: false,
    };
    expect(() => failing.url(context())).toThrow();
  });
});

describe('custom providers', () => {
  it('validates templates', () => {
    expect(validateCustomTemplate('')).toBeTruthy();
    expect(validateCustomTemplate('http://example.com/{owner}')).toBeTruthy();
    expect(validateCustomTemplate('https://example.com/static')).toBeTruthy();
    expect(validateCustomTemplate('https://example.com/{owner}/{repo}')).toBeNull();
  });

  it('substitutes placeholders with encoded values', () => {
    expect(buildCustomUrl('https://example.com/{owner}/{repo}', context())).toBe(
      'https://example.com/facebook/react',
    );
  });

  it('merges custom providers after the built-ins', () => {
    const custom = createCustomProvider('My Tool', 'https://example.com/{repo}');
    const all = getAllProviders([custom]);
    expect(all.length).toBe(BUILTIN_CATALOG.length + 1);
    expect(all.at(-1)?.category).toBe('custom');
    expect(all.at(-1)?.url(context())).toBe('https://example.com/react');
  });

  it('resolves enabled state with defaults', () => {
    const deepwiki = provider('deepwiki');
    const optIn: Provider = { ...deepwiki, id: 'opt-in', enabledByDefault: false };
    expect(isProviderEnabled(deepwiki, {})).toBe(true);
    expect(isProviderEnabled(optIn, {})).toBe(false);
    expect(isProviderEnabled(optIn, { 'opt-in': true })).toBe(true);
    expect(isProviderEnabled(deepwiki, { deepwiki: false })).toBe(false);
  });
});
