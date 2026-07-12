import { describe, it, expect } from 'vitest';
import { encodeState, decodeState } from '../models/ph-coherogram/urlState';
import type { CoherogramState } from '../models/ph-coherogram/urlState';

describe('ph-coherogram urlState', () => {
  it('round-trips: decode(encode(state)) === state (S6)', () => {
    const state: CoherogramState = { source: 'synthetic', seed: 42 };
    expect(decodeState('?' + encodeState(state))).toEqual(state);
  });

  it('round-trips the real-data source too', () => {
    const state: CoherogramState = { source: 'real', seed: 1 };
    expect(decodeState('?' + encodeState(state))).toEqual(state);
  });

  it('returns null for missing params', () => {
    expect(decodeState('')).toBeNull();
    expect(decodeState('?source=real')).toBeNull();
  });

  it('returns null for an invalid source', () => {
    expect(decodeState('?source=bogus&seed=1')).toBeNull();
  });

  it('returns null for a non-numeric seed', () => {
    expect(decodeState('?source=real&seed=abc')).toBeNull();
  });
});
