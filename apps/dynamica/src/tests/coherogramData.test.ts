import { describe, it, expect } from 'vitest';
import { firstDifference, generateSyntheticStations, SYNTHETIC_N_SAMPLES } from '../models/ph-coherogram/coherogramData';

describe('firstDifference', () => {
  it('computes consecutive differences', () => {
    expect(firstDifference([1, 3, 6, 10])).toEqual([2, 3, 4]);
  });

  it('output is one shorter than input', () => {
    expect(firstDifference([5, 5, 5, 5, 5])).toHaveLength(4);
  });
});

describe('generateSyntheticStations', () => {
  it('is deterministic: same seed reproduces the same dataset', () => {
    const a = generateSyntheticStations(42);
    const b = generateSyntheticStations(42);
    expect(a.stations.map((s) => s.values)).toEqual(b.stations.map((s) => s.values));
  });

  it('different seeds produce different data', () => {
    const a = generateSyntheticStations(1);
    const b = generateSyntheticStations(2);
    expect(a.stations[0].values).not.toEqual(b.stations[0].values);
  });

  it('produces the expected station count and sample length', () => {
    const d = generateSyntheticStations(7);
    expect(d.stations.length).toBeGreaterThanOrEqual(2);
    for (const s of d.stations) expect(s.values).toHaveLength(SYNTHETIC_N_SAMPLES);
  });

  it('is always labeled synthetic (honest math, manifesto §7)', () => {
    const d = generateSyntheticStations(3);
    expect(d.isReal).toBe(false);
    expect(d.label.toLowerCase()).toContain('synthetic');
  });
});
