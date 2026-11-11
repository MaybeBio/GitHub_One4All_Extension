import type { UrlContext, Provider } from './types';
import { blobUrl, encodePath, encodeRef, repoSlug } from './shared';

function folderUrl(ctx: UrlContext): string {
  if (ctx.pageType === 'tree' && ctx.ref) {
    const suffix = ctx.path ? `/${encodePath(ctx.path)}` : '';
    return `${ctx.repoUrl}/tree/${encodeRef(ctx.ref)}${suffix}`;
  }
  return ctx.repoUrl;
}

export const BUILTIN_PROVIDERS: Provider[] = [
  {
    id: 'download-directory',
    name: 'Download Directory',
    category: 'builtin',
    description: 'Download the current folder as ZIP',
    url: (ctx) => {
      if (ctx.pageType === 'blob') return null;
      return `https://download-directory.github.io/?url=${encodeURIComponent(folderUrl(ctx))}`;
    },
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'archive-zip',
    name: 'Archive ZIP',
    category: 'builtin',
    description: 'Download the whole repo as ZIP',
    url: (ctx) => {
      if (!ctx.ref) return null;
      return `https://github.com/${repoSlug(ctx)}/archive/${encodeRef(ctx.ref)}.zip`;
    },
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'plain-view',
    name: 'Plain view',
    category: 'builtin',
    description: 'Render the file as plain text',
    url: (ctx) => {
      const blob = blobUrl(ctx);
      return blob ? `${blob}?plain=1` : null;
    },
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'releases-atom',
    name: 'Releases feed',
    category: 'builtin',
    description: 'Atom feed of releases',
    url: (ctx) => `https://github.com/${repoSlug(ctx)}/releases.atom`,
    enabledByDefault: true,
    verified: true,
  },
  {
    id: 'commits-atom',
    name: 'Commits feed',
    category: 'builtin',
    description: 'Atom feed of commits',
    url: (ctx) => `https://github.com/${repoSlug(ctx)}/commits.atom`,
    enabledByDefault: true,
    verified: true,
  },
];
