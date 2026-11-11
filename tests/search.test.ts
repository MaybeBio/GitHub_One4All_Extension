import { describe, expect, it } from 'vitest';
import { BUILTIN_CATALOG } from '../utils/providers/catalog';
import { filterProviders } from '../utils/search';

describe('filterProviders', () => {
  it('returns everything for an empty query', () => {
    expect(filterProviders(BUILTIN_CATALOG, '')).toHaveLength(BUILTIN_CATALOG.length);
  });

  it('matches names case-insensitively', () => {
    const ids = filterProviders(BUILTIN_CATALOG, 'DEEPWIKI').map((provider) => provider.id);
    expect(ids).toEqual(['deepwiki']);
  });

  it('matches descriptions', () => {
    const ids = filterProviders(BUILTIN_CATALOG, 'podcast').map((provider) => provider.id);
    expect(ids).toContain('gitpodcast');
  });

  it('matches category labels', () => {
    const ids = filterProviders(BUILTIN_CATALOG, 'github built-ins').map((provider) => provider.id);
    expect(ids).toContain('archive-zip');
    expect(ids).toContain('releases-atom');
  });

  it('trims whitespace', () => {
    const ids = filterProviders(BUILTIN_CATALOG, '  zread  ').map((provider) => provider.id);
    expect(ids).toEqual(['zread']);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterProviders(BUILTIN_CATALOG, 'zzzz-no-match')).toHaveLength(0);
  });
});
