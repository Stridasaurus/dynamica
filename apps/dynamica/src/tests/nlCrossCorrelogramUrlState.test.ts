import { describe, it, expect } from 'vitest';
import { encodeState, decodeState } from '../models/nl-cross-correlogram/urlState';
import type { CrossCorrelogramState } from '../models/nl-cross-correlogram/urlState';

const state: CrossCorrelogramState = { seed: 42, driveStrength: 0.8, trueLag: 5, maxLag: 20 };

describe('nl-cross-correlogram urlState', () => {
  it('round-trips: decode(encode(state)) === state (S6)', () => {
    const encoded = encodeState(state);
    const decoded = decodeState('?' + encoded);
    expect(decoded).toEqual(state);
  });

  it('produces the expected query format', () => {
    expect(encodeState(state)).toBe('seed=42&drive=0.8&lag=5&maxlag=20');
  });

  it('decodes without a leading ?', () => {
    expect(decodeState('seed=1&drive=0&lag=0&maxlag=10')).toEqual({
      seed: 1, driveStrength: 0, trueLag: 0, maxLag: 10,
    });
  });

  it('returns null for empty search', () => {
    expect(decodeState('')).toBeNull();
    expect(decodeState('?')).toBeNull();
  });

  it('returns null when a required param is missing', () => {
    expect(decodeState('?seed=1&drive=0.5&lag=3')).toBeNull();
  });

  it('returns null for an out-of-range driveStrength', () => {
    expect(decodeState('?seed=1&drive=1.5&lag=3&maxlag=10')).toBeNull();
  });

  it('returns null for an out-of-range trueLag', () => {
    expect(decodeState('?seed=1&drive=0.5&lag=99&maxlag=10')).toBeNull();
  });

  it('returns null for an invalid maxLag', () => {
    expect(decodeState('?seed=1&drive=0.5&lag=3&maxlag=15')).toBeNull();
  });

  it('returns null for a non-numeric seed', () => {
    expect(decodeState('?seed=abc&drive=0.5&lag=3&maxlag=10')).toBeNull();
  });
});
