// ── nl-cross-correlogram: synthetic spike-train generation ─────────────────
// Simulation-first (manifesto §8): NeuroLearn models generate data client-side,
// no Data Layer involved. Everything here is a pure, deterministic function of
// its inputs (seeded PRNG, never `Math.random`) so the model is reproducible,
// testable with known-value fixtures (S1-style), and offline-safe by
// construction (S5 — there is nothing to fail to fetch).

/** Deterministic PRNG (mulberry32) — small, fast, good enough statistical
 *  quality for a teaching toy. Same seed always produces the same stream. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Sample a Poisson-distributed integer with mean `lambda` via Knuth's
 *  algorithm. Adequate for the small lambdas (<20) this model uses; not
 *  intended for large-lambda performance. */
function samplePoisson(rng: () => number, lambda: number): number {
  if (lambda <= 0) return 0;
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= rng();
  } while (p > L);
  return k - 1;
}

export interface SpikeTrainParams {
  /** PRNG seed — same seed + params always reproduces the same pair. */
  seed: number;
  /** Number of time bins simulated. */
  nBins: number;
  /** Baseline mean spike count per bin (both series share this floor). */
  baseRate: number;
  /** 0..1 — how strongly B's rate follows A's spike count `trueLag` bins
   *  earlier. 0 = B is independent of A; 1 = B's rate is driven entirely by
   *  A's history (scaled to stay in a comparable range). */
  driveStrength: number;
  /** Bins by which A leads B when driveStrength > 0. Must be >= 0 and < nBins. */
  trueLag: number;
}

export interface SpikeTrainPair {
  /** Spike count per bin, series A (the potential "driver"). */
  a: number[];
  /** Spike count per bin, series B (the potential "follower"). */
  b: number[];
}

/** Generate two related binned spike trains: A is an independent Poisson
 *  process at `baseRate`; B's instantaneous rate blends `baseRate` with A's
 *  spike count from `trueLag` bins earlier, weighted by `driveStrength`. When
 *  `driveStrength` is 0 the two series are independent and the correlogram
 *  should show no reliable peak; as it grows toward 1, a peak should emerge
 *  at lag = +trueLag (A leads B — see `crossCorrelation`'s sign convention in
 *  `lib/correlation.ts`). This is the generative model the model's narrative
 *  invites the visitor to "discover" by reading the correlogram. */
export function generateSpikeTrainPair(params: SpikeTrainParams): SpikeTrainPair {
  const { seed, nBins, baseRate, driveStrength, trueLag } = params;
  const rng = mulberry32(seed);

  const a: number[] = [];
  for (let t = 0; t < nBins; t++) {
    a.push(samplePoisson(rng, baseRate));
  }

  const b: number[] = [];
  for (let t = 0; t < nBins; t++) {
    const driverCount = t - trueLag >= 0 ? a[t - trueLag] : baseRate;
    const rate = (1 - driveStrength) * baseRate + driveStrength * driverCount;
    b.push(samplePoisson(rng, rate));
  }

  return { a, b };
}
