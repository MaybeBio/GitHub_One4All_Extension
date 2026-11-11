import { browser } from 'wxt/browser';
import { readDomVisibility } from './dom';

interface CachedVisibility {
  isPrivate: boolean;
  ts: number;
}

const CACHE_TTL_MS = 60 * 60 * 1000;

export async function isRepoPublic(
  owner: string,
  repo: string,
  doc: Document = document,
): Promise<boolean> {
  const domVisibility = readDomVisibility(doc);
  if (domVisibility !== null) return !domVisibility;

  const key = `visibility:${owner}/${repo}`;
  try {
    const cached = (await browser.storage.local.get(key))[key] as CachedVisibility | undefined;
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return !cached.isPrivate;
  } catch {
    // Cache is best-effort; fall through to the API.
  }

  let isPrivate: boolean;
  try {
    const response = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
      {
        credentials: 'omit',
        headers: { Accept: 'application/vnd.github+json' },
      },
    );
    if (response.status === 200) {
      isPrivate = false;
    } else if (response.status === 404) {
      isPrivate = true;
    } else {
      return false;
    }
  } catch {
    return false;
  }

  try {
    await browser.storage.local.set({ [key]: { isPrivate, ts: Date.now() } });
  } catch {
    // Ignore cache write failures.
  }
  return !isPrivate;
}
