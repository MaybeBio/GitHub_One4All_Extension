import type { UrlContext } from './types';

export function repoSlug(ctx: UrlContext): string {
  return `${encodeURIComponent(ctx.owner)}/${encodeURIComponent(ctx.repo)}`;
}

export function encodeRef(ref: string): string {
  return ref.split('/').map(encodeURIComponent).join('/');
}

export function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}

export function blobUrl(ctx: UrlContext): string | null {
  if (ctx.pageType !== 'blob' || !ctx.ref || !ctx.path) return null;
  return `${ctx.repoUrl}/blob/${encodeRef(ctx.ref)}/${encodePath(ctx.path)}`;
}
