import { CATEGORY_LABELS, type Provider } from './providers/types';

export function filterProviders(providers: Provider[], query: string): Provider[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return providers;
  return providers.filter((provider) => {
    const haystack = `${provider.name} ${provider.description} ${CATEGORY_LABELS[provider.category]}`;
    return haystack.toLowerCase().includes(needle);
  });
}
