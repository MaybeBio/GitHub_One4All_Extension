import { browser } from 'wxt/browser';
import { emptyState, normalizeState, type ExtensionState } from './state';

export async function loadState(): Promise<ExtensionState> {
  try {
    const raw = await browser.storage.sync.get(['enabledProviders', 'customProviders']);
    return normalizeState(raw);
  } catch {
    return emptyState();
  }
}

export function subscribeState(listener: (state: ExtensionState) => void): () => void {
  const onChange = (
    changes: Record<string, { newValue?: unknown }>,
    area: string,
  ): void => {
    if (area !== 'sync') return;
    if (!('enabledProviders' in changes) && !('customProviders' in changes)) return;
    void loadState().then(listener);
  };
  browser.storage.onChanged.addListener(onChange);
  return () => browser.storage.onChanged.removeListener(onChange);
}
