import type { CustomProvider } from './providers/types';

export interface ExtensionState {
  enabledProviders: Record<string, boolean>;
  customProviders: CustomProvider[];
}

export function emptyState(): ExtensionState {
  return { enabledProviders: {}, customProviders: [] };
}

export function normalizeCustomProviders(value: unknown): CustomProvider[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is CustomProvider => {
    if (entry === null || typeof entry !== 'object') return false;
    const candidate = entry as Partial<CustomProvider>;
    return (
      typeof candidate.id === 'string' &&
      typeof candidate.name === 'string' &&
      typeof candidate.urlTemplate === 'string'
    );
  });
}

export function normalizeState(raw: {
  enabledProviders?: unknown;
  customProviders?: unknown;
}): ExtensionState {
  const enabledProviders =
    raw.enabledProviders !== null &&
    typeof raw.enabledProviders === 'object' &&
    !Array.isArray(raw.enabledProviders)
      ? (raw.enabledProviders as Record<string, boolean>)
      : {};
  return {
    enabledProviders,
    customProviders: normalizeCustomProviders(raw.customProviders),
  };
}
