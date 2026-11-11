import { describe, expect, it } from 'vitest';
import { parseRepo, withResolvedRef } from '../utils/repo';

const LANGUAGE = 'en-US';

describe('parseRepo', () => {
  it('parses a repository root', () => {
    const parsed = parseRepo('https://github.com/facebook/react', LANGUAGE);
    expect(parsed?.context).toMatchObject({
      owner: 'facebook',
      repo: 'react',
      pageType: 'root',
      repoUrl: 'https://github.com/facebook/react',
      language: LANGUAGE,
    });
    expect(parsed?.tail).toBeUndefined();
  });

  it('parses a blob page with ref and path', () => {
    const parsed = parseRepo(
      'https://github.com/facebook/react/blob/main/packages/react/index.js',
      LANGUAGE,
    );
    expect(parsed?.context.pageType).toBe('blob');
    expect(parsed?.context.ref).toBe('main');
    expect(parsed?.context.path).toBe('packages/react/index.js');
    expect(parsed?.tail).toBe('main/packages/react/index.js');
  });

  it('parses a tree page without a path', () => {
    const parsed = parseRepo('https://github.com/facebook/react/tree/main', LANGUAGE);
    expect(parsed?.context.pageType).toBe('tree');
    expect(parsed?.context.ref).toBe('main');
    expect(parsed?.context.path).toBeUndefined();
  });

  it('treats repo subpages as root', () => {
    const parsed = parseRepo('https://github.com/facebook/react/issues/42', LANGUAGE);
    expect(parsed?.context.pageType).toBe('root');
  });

  it('ignores query strings and hashes', () => {
    const parsed = parseRepo('https://github.com/facebook/react?tab=readme#top', LANGUAGE);
    expect(parsed?.context.owner).toBe('facebook');
    expect(parsed?.context.repo).toBe('react');
  });

  it('rejects reserved owners', () => {
    expect(parseRepo('https://github.com/settings/profile', LANGUAGE)).toBeNull();
    expect(parseRepo('https://github.com/marketplace/actions', LANGUAGE)).toBeNull();
  });

  it('rejects profiles and non-GitHub hosts', () => {
    expect(parseRepo('https://github.com/facebook', LANGUAGE)).toBeNull();
    expect(parseRepo('https://gitlab.com/facebook/react', LANGUAGE)).toBeNull();
  });

  it('decodes percent-encoded segments', () => {
    const parsed = parseRepo('https://github.com/owner/repo/tree/main/a%20b', LANGUAGE);
    expect(parsed?.context.path).toBe('a b');
  });
});

describe('withResolvedRef', () => {
  it('rebuilds the path when the ref contains slashes', () => {
    const parsed = parseRepo(
      'https://github.com/owner/repo/blob/feature/x/src/index.ts',
      LANGUAGE,
    );
    expect(parsed).not.toBeNull();
    const resolved = withResolvedRef(parsed!.context, 'feature/x', parsed!.tail!);
    expect(resolved.ref).toBe('feature/x');
    expect(resolved.path).toBe('src/index.ts');
  });

  it('clears the path when the tail is exactly the ref', () => {
    const parsed = parseRepo('https://github.com/owner/repo/tree/main', LANGUAGE);
    const resolved = withResolvedRef(parsed!.context, 'main', parsed!.tail!);
    expect(resolved.ref).toBe('main');
    expect(resolved.path).toBeUndefined();
  });
});
