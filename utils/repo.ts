import type { PageType, UrlContext } from './providers/types';

const RESERVED_OWNERS = new Set([
  'settings',
  'orgs',
  'topics',
  'trending',
  'explore',
  'marketplace',
  'notifications',
  'sponsors',
  'features',
  'pricing',
  'about',
  'apps',
  'site',
  'collections',
  'events',
  'readme',
  'security',
  'enterprise',
  'customer-stories',
]);

export interface ParsedRepo {
  context: UrlContext;
  tail?: string;
}

export function parseRepo(rawUrl: string, language: string): ParsedRepo | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }
  if (url.hostname !== 'github.com' && url.hostname !== 'www.github.com') return null;

  const rawSegments = url.pathname.split('/').filter(Boolean);
  if (rawSegments.length < 2) return null;

  let segments: string[];
  try {
    segments = rawSegments.map((segment) => decodeURIComponent(segment));
  } catch {
    return null;
  }

  const owner = segments[0];
  const repo = segments[1];
  if (!owner || !repo) return null;
  if (RESERVED_OWNERS.has(owner.toLowerCase())) return null;

  const third = segments[2];
  const pageType: PageType = third === 'tree' ? 'tree' : third === 'blob' ? 'blob' : 'root';
  const repoUrl = `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;

  let ref: string | undefined;
  let path: string | undefined;
  let tail: string | undefined;

  if (pageType !== 'root') {
    const rest = segments.slice(3);
    const first = rest[0];
    if (!first) return null;
    tail = rest.join('/');
    ref = first;
    path = rest.slice(1).join('/') || undefined;
  }

  return {
    context: { owner, repo, pageType, ref, path, repoUrl, language },
    tail,
  };
}

export function withResolvedRef(context: UrlContext, ref: string, tail: string): UrlContext {
  let path: string | undefined;
  if (tail === ref) {
    path = undefined;
  } else if (tail.startsWith(`${ref}/`)) {
    path = tail.slice(ref.length + 1) || undefined;
  } else {
    path = context.path;
  }
  return { ...context, ref, path };
}

export function resolveRefFromDom(
  owner: string,
  repo: string,
  tail: string,
  doc: Document,
): string | null {
  const labels = new Set<string>();
  const candidates = new Set<string>();

  const selectors = [
    '.ref-selector-button-text-container',
    'button[aria-label$=" branch"]',
    '[data-testid="branch-name"]',
    '#branch-select-menu',
    '.ref-selector button',
    'summary[data-ga-click*="find ref"]',
  ];
  for (const selector of selectors) {
    for (const element of doc.querySelectorAll(selector)) {
      const text = element.textContent?.trim();
      if (text) labels.add(text);
    }
  }

  if (!tail) {
    return labels.values().next().value ?? null;
  }
  for (const label of labels) candidates.add(label);

  const needle = `/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/`;
  for (const anchor of doc.querySelectorAll<HTMLAnchorElement>('a[href]')) {
    const href = anchor.getAttribute('href');
    if (!href) continue;
    const index = href.indexOf(needle);
    if (index === -1) continue;
    const rest = href.slice(index + needle.length).replace(/[?#].*$/, '');
    const match = rest.match(/^(?:tree|blob)\/(.+)$/);
    if (!match?.[1]) continue;
    try {
      candidates.add(decodeURIComponent(match[1]));
    } catch {
      // Ignore malformed hrefs.
    }
  }

  let best: string | null = null;
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (tail !== candidate && !tail.startsWith(`${candidate}/`)) continue;
    if (best === null || candidate.length < best.length) best = candidate;
  }
  return best;
}
