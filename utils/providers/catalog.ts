import { AI_PROVIDERS } from './ai';
import { ANALYTICS_PROVIDERS } from './analytics';
import { BUILTIN_PROVIDERS } from './builtin';
import { CONTEXT_PROVIDERS } from './context';
import { customToProvider } from './custom';
import { IDE_PROVIDERS } from './ide';
import type { CustomProvider, Provider } from './types';

export { BUILTIN_PROVIDERS };

export const BUILTIN_CATALOG: Provider[] = [
  ...AI_PROVIDERS,
  ...CONTEXT_PROVIDERS,
  ...IDE_PROVIDERS,
  ...ANALYTICS_PROVIDERS,
  ...BUILTIN_PROVIDERS,
];

export function getAllProviders(customs: CustomProvider[] = []): Provider[] {
  return [...BUILTIN_CATALOG, ...customs.map(customToProvider)];
}

export function isProviderEnabled(
  provider: Provider,
  enabledMap: Record<string, boolean>,
): boolean {
  return provider.id in enabledMap ? enabledMap[provider.id] === true : provider.enabledByDefault;
}

export function getEnabledProviders(
  customs: CustomProvider[],
  enabledMap: Record<string, boolean>,
): Provider[] {
  return getAllProviders(customs).filter((provider) => isProviderEnabled(provider, enabledMap));
}
