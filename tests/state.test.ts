import { describe, expect, it } from 'vitest';
import { normalizeState } from '../utils/state';

describe('normalizeState', () => {
  it('falls back to empty defaults', () => {
    expect(normalizeState({})).toEqual({ enabledProviders: {}, customProviders: [] });
  });

  it('rejects malformed enabled maps', () => {
    expect(normalizeState({ enabledProviders: null }).enabledProviders).toEqual({});
    expect(normalizeState({ enabledProviders: ['deepwiki'] }).enabledProviders).toEqual({});
  });

  it('keeps valid enabled maps', () => {
    expect(normalizeState({ enabledProviders: { deepwiki: false } }).enabledProviders).toEqual({
      deepwiki: false,
    });
  });

  it('keeps only well-formed custom providers', () => {
    const state = normalizeState({
      customProviders: [
        { id: 'a', name: 'A', urlTemplate: 'https://a.com/{owner}' },
        { id: 'b', name: 'B' },
        null,
        'nope',
      ],
    });
    expect(state.customProviders).toHaveLength(1);
    expect(state.customProviders[0]?.id).toBe('a');
  });
});
