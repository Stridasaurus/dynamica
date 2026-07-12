import { describe, it, expect } from 'vitest';
import { generateSpikeTrainPair } from '../models/nl-cross-correlogram/spikeTrains';
import { crossCorrelation, peakLag } from '../lib/correlation';

describe('generateSpikeTrainPair', () => {
  it('is deterministic: same seed + params reproduces the same pair', () => {
    const params = { seed: 42, nBins: 100, baseRate: 5, driveStrength: 0.8, trueLag: 3 };
    const first = generateSpikeTrainPair(params);
    const second = generateSpikeTrainPair(params);
    expect(second).toEqual(first);
  });

  it('different seeds produce different pairs', () => {
    const base = { nBins: 100, baseRate: 5, driveStrength: 0.8, trueLag: 3 };
    const a = generateSpikeTrainPair({ ...base, seed: 1 });
    const b = generateSpikeTrainPair({ ...base, seed: 2 });
    expect(a).not.toEqual(b);
  });

  it('produces nBins-length non-negative integer counts for both series', () => {
    const { a, b } = generateSpikeTrainPair({ seed: 7, nBins: 50, baseRate: 4, driveStrength: 0.5, trueLag: 2 });
    expect(a).toHaveLength(50);
    expect(b).toHaveLength(50);
    for (const v of [...a, ...b]) {
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(0);
    }
  });

  it('driveStrength=1 makes B track A: cross-correlation recovers the true lag', () => {
    // Known-value-style fixture (S1): with B driven entirely by A's history,
    // the correlogram's peak must land at lag = +trueLag (A leads B — see
    // lib/correlation.ts's sign convention). Verified stable across seeds
    // 1/7/42/123 before being locked in as a fixture.
    const { a, b } = generateSpikeTrainPair({
      seed: 42, nBins: 800, baseRate: 8, driveStrength: 1, trueLag: 5,
    });
    const best = peakLag(crossCorrelation(a, b, 15))!;
    expect(best.lag).toBe(5);
    expect(best.r).toBeGreaterThan(0.5);
  });

  it('driveStrength=0 leaves A and B independent: no reliable correlogram peak', () => {
    const { a, b } = generateSpikeTrainPair({
      seed: 42, nBins: 800, baseRate: 8, driveStrength: 0, trueLag: 5,
    });
    const best = peakLag(crossCorrelation(a, b, 15))!;
    expect(Math.abs(best.r)).toBeLessThan(0.3);
  });
});
