import { describe, it, expect } from 'vitest';
import {
  mean,
  stddev,
  pearsonCorrelation,
  crossCorrelation,
  peakLag,
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
