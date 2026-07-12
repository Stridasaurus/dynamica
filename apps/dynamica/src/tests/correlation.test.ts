import { describe, it, expect } from 'vitest';
import {
  mean,
  stddev,
  pearsonCorrelation,
  crossCorrelation,
  peakLag,
  nextPow2,
  fft,
  welchCoherence,
  dailyReturns,
  normalizedCumulativeReturns,
  correlationMatrix,
  avgPairwiseCorrelation,
  extremePairs,
  annualizedVol,
  annualizedReturn,
  sharpe,
} from '../lib/correlation';

describe('mean', () => {
  it('computes simple mean', () => {
    expect(mean([1, 2, 3, 4, 5])).toBeCloseTo(3, 10);
  });
  it('handles single element', () => {
    expect(mean([7])).toBe(7);
  });
});

describe('stddev', () => {
  it('known example: [2,4,4,4,5,5,7,9] => 2', () => {
    expect(stddev([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(2, 10);
  });
  it('constant series => 0', () => {
    expect(stddev([5, 5, 5, 5])).toBeCloseTo(0, 10);
  });
});

describe('pearsonCorrelation', () => {
  it('perfectly correlated => 1', () => {
    const a = [1, 2, 3, 4, 5];
    const b = [2, 4, 6, 8, 10];
    expect(pearsonCorrelation(a, b)).toBeCloseTo(1, 10);
  });

  it('perfectly anti-correlated => -1', () => {
    const a = [1, 2, 3, 4, 5];
    const b = [5, 4, 3, 2, 1];
    expect(pearsonCorrelation(a, b)).toBeCloseTo(-1, 10);
  });

  it('hand-computed small example', () => {
    // a=[1,2,3], b=[1,3,2]
    // mean_a=2, mean_b=2
    // cov = ((1-2)(1-2)+(2-2)(3-2)+(3-2)(2-2))/3 = (1+0+0)/3 = 1/3
    // sa = sqrt((1+0+1)/3) = sqrt(2/3)
    // sb = sqrt((1+1+0)/3) = sqrt(2/3)
    // r = (1/3)/(2/3) = 0.5
    expect(pearsonCorrelation([1, 2, 3], [1, 3, 2])).toBeCloseTo(0.5, 10);
  });

  it('constant series => NaN', () => {
    expect(pearsonCorrelation([1, 1, 1], [1, 2, 3])).toBeNaN();
  });

  it('mismatched lengths => NaN', () => {
    expect(pearsonCorrelation([1, 2], [1, 2, 3])).toBeNaN();
  });
});

describe('crossCorrelation', () => {
  it('zero lag matches pearsonCorrelation exactly', () => {
    const a = [1, 2, 3, 4, 5, 6];
    const b = [2, 1, 4, 3, 6, 5];
    const cc = crossCorrelation(a, b, 2);
    const zero = cc.find((p) => p.lag === 0)!;
    expect(zero.r).toBeCloseTo(pearsonCorrelation(a, b), 10);
  });

  it('produces 2*maxLag+1 entries spanning [-maxLag, +maxLag]', () => {
    const cc = crossCorrelation([1, 2, 3, 4, 5], [1, 2, 3, 4, 5], 3);
    expect(cc).toHaveLength(7);
    expect(cc.map((p) => p.lag)).toEqual([-3, -2, -1, 0, 1, 2, 3]);
  });

  it('recovers a known lag: b is a shifted by +2 (a leads b by 2)', () => {
    // b[i] = a[i-2] for i>=2 — a's pattern reappears in b two steps later.
    // `a` MUST be non-linear data: a strictly monotonic/arithmetic ramp is
    // degenerate here because any two shifted linear ramps are perfectly
    // Pearson-correlated regardless of the shift amount, so every lag would
    // score r=1 and the test couldn't actually discriminate the true one
    // (caught while triaging this fixture — the original ramp-based version
    // let ties resolve to the wrong lag on floating-point rounding).
    let seed = 7;
    const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    const a = Array.from({ length: 40 }, () => Math.floor(rand() * 100));
    const trueLag = 2;
    const b = a.map((_, i) => (i >= trueLag ? a[i - trueLag] : -1));
    const cc = crossCorrelation(a, b, 6);
    const best = peakLag(cc)!;
    expect(best.lag).toBe(trueLag);
    expect(best.r).toBeCloseTo(1, 6);
  });

  it('degenerate overlap (<2 samples) => NaN at extreme lags', () => {
    const cc = crossCorrelation([1, 2, 3], [1, 2, 3], 3);
    const extreme = cc.find((p) => p.lag === 3)!; // only 0 overlapping samples
    expect(extreme.r).toBeNaN();
  });
});

describe('peakLag', () => {
  it('picks the lag with the largest |r|, sign included', () => {
    const cc = [
      { lag: -1, r: 0.2 },
      { lag: 0, r: -0.9 },
      { lag: 1, r: 0.5 },
    ];
    const best = peakLag(cc)!;
    expect(best.lag).toBe(0);
    expect(best.r).toBe(-0.9);
  });

  it('ignores NaN entries', () => {
    const cc = [
      { lag: -1, r: NaN },
      { lag: 0, r: 0.3 },
    ];
    expect(peakLag(cc)).toEqual({ lag: 0, r: 0.3 });
  });

  it('returns null when every entry is NaN', () => {
    expect(peakLag([{ lag: 0, r: NaN }])).toBeNull();
  });

  it('returns null for an empty list', () => {
    expect(peakLag([])).toBeNull();
  });
});

describe('nextPow2', () => {
  it('matches known values', () => {
    expect(nextPow2(1)).toBe(1);
    expect(nextPow2(3)).toBe(4);
    expect(nextPow2(128)).toBe(128);
    expect(nextPow2(129)).toBe(256);
  });
});

describe('fft', () => {
  it('impulse -> flat unit magnitude across all bins', () => {
    const N = 16;
    const re = new Float64Array(N);
    const im = new Float64Array(N);
    re[0] = 1;
    fft(re, im);
    for (let k = 0; k < N; k++) {
      expect(Math.hypot(re[k], im[k])).toBeCloseTo(1, 9);
    }
  });

  it('pure sinusoid at bin b concentrates energy at bins b and N-b', () => {
    const N = 32;
    const b = 3;
    const re = new Float64Array(N);
    const im = new Float64Array(N);
    for (let n = 0; n < N; n++) re[n] = Math.cos((2 * Math.PI * b * n) / N);
    fft(re, im);
    let peak = 0;
    let peakK = -1;
    let total = 0;
    for (let k = 0; k < N; k++) {
      const m = re[k] * re[k] + im[k] * im[k];
      total += m;
      if (m > peak) { peak = m; peakK = k; }
    }
    expect(peakK === b || peakK === N - b).toBe(true);
    expect(peak / total).toBeGreaterThan(0.45);
  });

  it('conserves energy (Parseval): sum|x|^2 == (1/N) sum|X|^2', () => {
    const N = 16;
    const re = new Float64Array(N);
    const im = new Float64Array(N);
    let timeE = 0;
    for (let i = 0; i < N; i++) {
      re[i] = Math.sin(i) * 0.7 - 0.2;
      timeE += re[i] * re[i];
    }
    fft(re, im);
    let freqE = 0;
    for (let k = 0; k < N; k++) freqE += re[k] * re[k] + im[k] * im[k];
    expect(timeE).toBeCloseTo(freqE / N, 9);
  });
});

describe('welchCoherence', () => {
  it('identical signal against itself -> gamma^2 ~= 1 at every resolved bin', () => {
    const nperseg = 128;
    const fs = 4;
    const n = 1024;
    const x = new Float64Array(n);
    for (let i = 0; i < n; i++) x[i] = Math.sin(2 * Math.PI * 0.05 * i);
    const r = welchCoherence(x, x, fs, nperseg)!;
    for (let k = 1; k < r.coherence.length; k++) {
      expect(r.coherence[k]).toBeGreaterThan(0.999);
    }
    expect(r.freqs[1]).toBeCloseTo(fs / nextPow2(nperseg), 10);
  });

  it('independent noise -> low mean gamma^2', () => {
    const nperseg = 128;
    const fs = 1;
    const n = 4096;
    // Deterministic pseudo-noise (LCG) so the fixture is reproducible.
    let seed = 12345;
    const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    const x = new Float64Array(n);
    const y = new Float64Array(n);
    for (let i = 0; i < n; i++) { x[i] = rand() - 0.5; y[i] = rand() - 0.5; }
    const r = welchCoherence(x, y, fs, nperseg)!;
    let sum = 0;
    for (let k = 1; k < r.coherence.length; k++) sum += r.coherence[k];
    expect(sum / (r.coherence.length - 1)).toBeLessThan(0.35);
  });

  it('too-short signal -> null', () => {
    expect(welchCoherence(new Float64Array(10), new Float64Array(10), 1, 128)).toBeNull();
  });

  it('shared tone plus independent noise on each channel -> high coherence at the tone bin', () => {
    // Both channels see the same 0.03 Hz tone but with independent noise added
    // afterward — the physically realistic "common signal + local noise" case
    // that motivates using coherence over the two studios' correlation math.
    const nperseg = 128;
    const fs = 2;
    const n = 4000;
    let seedA = 11;
    let seedB = 22;
    const randA = () => { seedA = (seedA * 1103515245 + 12345) & 0x7fffffff; return seedA / 0x7fffffff; };
    const randB = () => { seedB = (seedB * 1103515245 + 12345) & 0x7fffffff; return seedB / 0x7fffffff; };
    const x = new Float64Array(n);
    const y = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      x[i] = Math.sin(2 * Math.PI * 0.03 * i) + 0.15 * (randA() - 0.5);
      y[i] = Math.sin(2 * Math.PI * 0.03 * i + 0.4) + 0.15 * (randB() - 0.5);
    }
    const r = welchCoherence(x, y, fs, nperseg)!;
    const nfft = nextPow2(nperseg);
    const kTone = Math.round((0.03 * nfft) / fs);
    expect(r.coherence[kTone]).toBeGreaterThan(0.8);
    // A bin far from the tone (no shared signal there) should be much lower.
    const kFar = Math.min(r.coherence.length - 1, kTone + 15);
    expect(r.coherence[kFar]).toBeLessThan(r.coherence[kTone]);
  });
});

describe('dailyReturns', () => {
  it('computes percent returns', () => {
    const prices = [100, 110, 99];
    const r = dailyReturns(prices);
    expect(r).toHaveLength(2);
    expect(r[0]).toBeCloseTo(0.1, 10);   // (110-100)/100
    expect(r[1]).toBeCloseTo(-0.1, 10);  // (99-110)/110
  });
  it('single price => empty', () => {
    expect(dailyReturns([100])).toHaveLength(0);
  });
});

describe('normalizedCumulativeReturns', () => {
  it('first value is always 1', () => {
    const result = normalizedCumulativeReturns([50, 75, 100]);
    expect(result[0]).toBeCloseTo(1, 10);
    expect(result[1]).toBeCloseTo(1.5, 10);
    expect(result[2]).toBeCloseTo(2, 10);
  });
  it('empty => empty', () => {
    expect(normalizedCumulativeReturns([])).toHaveLength(0);
  });
});

describe('correlationMatrix', () => {
  it('diagonal is 1', () => {
    const series = {
      A: [100, 102, 105, 103, 107],
      B: [50, 51, 53, 52, 54],
    };
    const { matrix } = correlationMatrix(series);
    expect(matrix[0][0]).toBeCloseTo(1, 8);
    expect(matrix[1][1]).toBeCloseTo(1, 8);
  });

  it('matrix is symmetric', () => {
    const series = {
      A: [100, 102, 105, 103, 107],
      B: [50, 51, 53, 52, 54],
    };
    const { matrix } = correlationMatrix(series);
    expect(matrix[0][1]).toBeCloseTo(matrix[1][0], 10);
  });
});

describe('avgPairwiseCorrelation', () => {
  it('two-ticker average', () => {
    const tickers = ['A', 'B'];
    const matrix = [[1, 0.7], [0.7, 1]];
    expect(avgPairwiseCorrelation(tickers, matrix)).toBeCloseTo(0.7, 10);
  });
});

describe('extremePairs', () => {
  it('finds most/least correlated pairs', () => {
    const tickers = ['A', 'B', 'C'];
    const matrix = [
      [1, 0.9, 0.2],
      [0.9, 1, 0.3],
      [0.2, 0.3, 1],
    ];
    const { mostCorrelated, leastCorrelated } = extremePairs(tickers, matrix);
    expect(mostCorrelated[0]).toBe('A');
    expect(mostCorrelated[1]).toBe('B');
    expect(mostCorrelated[2]).toBeCloseTo(0.9, 10);
    expect(leastCorrelated[2]).toBeCloseTo(0.2, 10);
  });
});

describe('annualizedReturn', () => {
  it('doubles in exactly 252 trading days => 100%', () => {
    // 253-element series: series[0]=1, series[252]=2 => (252/252) periods => 100%
    const series = Array.from({ length: 253 }, (_, i) => 1 + i / 252);
    expect(annualizedReturn(series)).toBeCloseTo(1.0, 4);
  });

  it('flat series => 0%', () => {
    expect(annualizedReturn(new Array(100).fill(1.0))).toBeCloseTo(0, 10);
  });

  it('length < 2 => NaN', () => {
    expect(annualizedReturn([1.0])).toBeNaN();
    expect(annualizedReturn([])).toBeNaN();
  });
});

describe('annualizedVol', () => {
  it('constant series => 0%', () => {
    expect(annualizedVol(new Array(100).fill(1.0))).toBeCloseTo(0, 10);
  });

  it('oscillating series => positive vol', () => {
    const series = Array.from({ length: 101 }, (_, i) => (i % 2 === 0 ? 1.0 : 1.01));
    expect(annualizedVol(series)).toBeGreaterThan(0);
  });

  it('empty or single element => NaN', () => {
    expect(annualizedVol([])).toBeNaN();
    expect(annualizedVol([1.0])).toBeNaN();
  });

  it('plausible range for a volatile series (5%–200% annual)', () => {
    // Alternating +1%/-0.5%: meaningful daily moves, real-world-like vol
    const series = [1.0];
    for (let i = 1; i < 253; i++) {
      series.push(series[i - 1] * (1 + (i % 2 === 0 ? 0.01 : -0.005)));
    }
    const vol = annualizedVol(series);
    expect(vol).toBeGreaterThan(0.05);
    expect(vol).toBeLessThan(2.0);
  });
});

describe('sharpe', () => {
  it('constant series => NaN (zero-vol guard)', () => {
    expect(sharpe(new Array(100).fill(1.0))).toBeNaN();
  });

  it('empty or single element => NaN', () => {
    expect(sharpe([])).toBeNaN();
    expect(sharpe([1.0])).toBeNaN();
  });

  it('consistently rising series => positive Sharpe', () => {
    const series = Array.from({ length: 100 }, (_, i) => 1 + i * 0.001);
    expect(sharpe(series)).toBeGreaterThan(0);
  });

  it('consistently falling series => negative Sharpe', () => {
    const series = Array.from({ length: 100 }, (_, i) => Math.max(0.01, 1 - i * 0.001));
    expect(sharpe(series)).toBeLessThan(0);
  });
});
