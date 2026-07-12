import { describe, it, expect } from 'vitest';
import { computeCoherogram } from '../models/ph-coherogram/computeCoherogram';

function lcg(seed: number) {
  let s = seed;
  return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
}

describe('computeCoherogram', () => {
  it('a shared tone across all stations produces a high-coherence peak near that frequency', () => {
    const fs = 1;
    const n = 2400;
    const tone = 0.03; // Hz
    const rand = lcg(11);
    const stations = Array.from({ length: 3 }, (_, si) => {
      const noiseRand = lcg(11 + si);
      const values = Array.from({ length: n }, (_, i) => Math.sin(2 * Math.PI * tone * i) + 0.1 * (noiseRand() - 0.5));
      return { values };
    });
    void rand;

    const result = computeCoherogram(stations, {
      fs, sliceSamples: 400, stepSamples: 200, nperseg: 128, maxFreqHz: 0.1,
    })!;

    expect(result).not.toBeNull();
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.peak).not.toBeNull();
    // The peak should land within one bin of the shared tone frequency.
    const binWidth = result.freqsHz[1] - result.freqsHz[0];
    expect(Math.abs(result.peak!.freqHz - tone)).toBeLessThan(binWidth * 1.5);
    expect(result.peak!.coherence).toBeGreaterThan(0.8);
  });

  it('independent noise across stations produces low coherence everywhere', () => {
    const fs = 1;
    const n = 2400;
    const stations = Array.from({ length: 3 }, (_, si) => {
      const rand = lcg(100 + si * 37);
      const values = Array.from({ length: n }, () => rand() - 0.5);
      return { values };
    });

    const result = computeCoherogram(stations, {
      fs, sliceSamples: 400, stepSamples: 200, nperseg: 128, maxFreqHz: 0.1,
    })!;

    expect(result).not.toBeNull();
    const allValues = result.data.flat();
    const mean = allValues.reduce((a, b) => a + b, 0) / allValues.length;
    expect(mean).toBeLessThan(0.35);
  });

  it('reports the correct number of pairs for the station count', () => {
    const stations = Array.from({ length: 4 }, () => ({ values: Array.from({ length: 500 }, (_, i) => Math.sin(i)) }));
    const result = computeCoherogram(stations, { fs: 1, sliceSamples: 128, stepSamples: 64, nperseg: 32, maxFreqHz: 0.5 })!;
    expect(result.nPairs).toBe(6); // C(4,2)
  });

  it('returns null when there is not enough data for even one window', () => {
    const stations = [{ values: [1, 2, 3] }, { values: [1, 2, 3] }];
    const result = computeCoherogram(stations, { fs: 1, sliceSamples: 128, stepSamples: 64, nperseg: 32, maxFreqHz: 0.5 });
    expect(result).toBeNull();
  });
});
