export function mean(arr: number[]): number {
  return arr.reduce((s, x) => s + x, 0) / arr.length;
}

export function stddev(arr: number[]): number {
  const m = mean(arr);
  const variance = arr.reduce((s, x) => s + (x - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

export function pearsonCorrelation(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return NaN;
  const ma = mean(a);
  const mb = mean(b);
  const sa = stddev(a);
  const sb = stddev(b);
  if (sa === 0 || sb === 0) return NaN;
  const cov = a.reduce((s, x, i) => s + (x - ma) * (b[i] - mb), 0) / a.length;
  return cov / (sa * sb);
}

/** One lag of a cross-correlogram: the Pearson correlation between series `a`
 *  and series `b` shifted by `lag` samples. */
export interface LagCorrelation {
  /** Shift applied to `b` relative to `a`, in samples. */
  lag: number;
  /** Pearson r over the overlapping region; NaN if the overlap is degenerate. */
  r: number;
}

/**
 * Lagged cross-correlation: Pearson r between `a` and `b` for every integer lag
 * in [-maxLag, +maxLag]. This is the SAME Pearson core as `pearsonCorrelation`
 * (S2 — no second correlation implementation); the only new idea is sliding one
 * series against the other and correlating the overlapping samples.
 *
 * Sign convention: a positive lag shifts `b` LATER, so `r` at lag=+k measures
 * how well `a(t)` predicts `b(t+k)` — i.e. `a` leads `b` by k. The peak lag
 * therefore reads as "who drives whom": a peak at positive lag means `a` drives
 * `b`. For spike trains, `a` and `b` are binned spike-count vectors.
 */
export function crossCorrelation(a: number[], b: number[], maxLag: number): LagCorrelation[] {
  const out: LagCorrelation[] = [];
  for (let lag = -maxLag; lag <= maxLag; lag++) {
    // Overlapping windows: correlate a[i] with b[i+lag] wherever both exist.
    const av: number[] = [];
    const bv: number[] = [];
    for (let i = 0; i < a.length; i++) {
      const j = i + lag;
      if (j < 0 || j >= b.length) continue;
      av.push(a[i]);
      bv.push(b[j]);
    }
    out.push({ lag, r: av.length >= 2 ? pearsonCorrelation(av, bv) : NaN });
  }
  return out;
}

/** The lag with the largest finite |r| in a cross-correlogram — the dominant
 *  lead/lag relationship. Returns null if no finite value exists. */
export function peakLag(cc: LagCorrelation[]): LagCorrelation | null {
  let best: LagCorrelation | null = null;
  for (const p of cc) {
    if (isNaN(p.r)) continue;
    if (best === null || Math.abs(p.r) > Math.abs(best.r)) best = p;
  }
  return best;
}

// ── Coherence: correlation, resolved by frequency ──────────────────────────
// Magnitude-squared coherence γ²(f) is Pearson r² computed per frequency bin
// instead of once over the whole series (PLAN.md §2.2 — this is why
// `ph-coherogram` carries both the `correlation` and `fourier` tags). It
// answers "how correlated are these two signals AT this frequency", the same
// diversification/lead-lag question `pearsonCorrelation`/`crossCorrelation`
// answer in the time domain, just decomposed across the spectrum. The only
// genuinely new primitive this requires is the FFT that gets each windowed
// segment into the frequency domain first.

/** Next power of 2 >= n (the FFT below requires a power-of-2 length). */
export function nextPow2(n: number): number {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

/**
 * In-place iterative Cooley-Tukey FFT. `re`/`im` must have equal, power-of-2
 * length (use `nextPow2` to size the buffers) and are overwritten with the
 * transform. Standard bit-reversal + butterfly implementation — this is
 * infrastructure the coherence estimator needs, not itself a "tool" in the
 * manifesto's taxonomy (the tool is coherence/correlation; the FFT is how
 * it's computed in the frequency domain).
 */
export function fft(re: Float64Array, im: Float64Array): void {
  const N = re.length;
  let j = 0;
  for (let i = 1; i < N; i++) {
    let bit = N >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= N; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wRe = Math.cos(ang);
    const wIm = Math.sin(ang);
    for (let i = 0; i < N; i += len) {
      let cRe = 1;
      let cIm = 0;
      for (let k = 0; k < len / 2; k++) {
        const uRe = re[i + k];
        const uIm = im[i + k];
        const vRe = re[i + k + len / 2] * cRe - im[i + k + len / 2] * cIm;
        const vIm = re[i + k + len / 2] * cIm + im[i + k + len / 2] * cRe;
        re[i + k] = uRe + vRe;
        im[i + k] = uIm + vIm;
        re[i + k + len / 2] = uRe - vRe;
        im[i + k + len / 2] = uIm - vIm;
        const tmp = cRe * wRe - cIm * wIm;
        cIm = cRe * wIm + cIm * wRe;
        cRe = tmp;
      }
    }
  }
}

export interface CoherenceResult {
  /** Frequency of each bin, Hz (index-0 is DC). */
  freqs: Float64Array;
  /** Magnitude-squared coherence gamma^2 in [0, 1] per bin — 1 = perfectly
   *  linearly related at that frequency, 0 = unrelated. */
  coherence: Float64Array;
  /** Cross-spectral phase per bin, radians. */
  phase: Float64Array;
  /** Number of Welch segments averaged (more = more reliable estimate). */
  nSeg: number;
}

/**
 * Welch magnitude-squared coherence between two equal-length real signals:
 * split into overlapping Hann-windowed segments of length `nperseg`
 * (50%-overlap, zero-padded to the next power of 2), FFT each, and average
 * the cross- and auto-spectra across segments before forming
 * gamma^2 = |Pxy|^2 / (Pxx * Pyy). This is the frequency-domain generalization
 * of `pearsonCorrelation` — same "how related are these two series" question,
 * decomposed per frequency bin instead of collapsed to one number. Returns
 * `null` if the signals are too short for at least one segment.
 */
export function welchCoherence(
  x: number[] | Float64Array,
  y: number[] | Float64Array,
  fs: number,
  nperseg: number,
): CoherenceResult | null {
  const N = nperseg;
  const step = N >> 1;
  const nfft = nextPow2(N);
  const half = (nfft >> 1) + 1;

  const win = new Float64Array(N);
  for (let i = 0; i < N; i++) win[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (N - 1)));

  const Pxx = new Float64Array(half);
  const Pyy = new Float64Array(half);
  const PxyRe = new Float64Array(half);
  const PxyIm = new Float64Array(half);
  let nSeg = 0;

  for (let s = 0; s + N <= x.length; s += step) {
    const rX = new Float64Array(nfft);
    const iX = new Float64Array(nfft);
    const rY = new Float64Array(nfft);
    const iY = new Float64Array(nfft);
    for (let i = 0; i < N; i++) {
      rX[i] = x[s + i] * win[i];
      rY[i] = y[s + i] * win[i];
    }
    fft(rX, iX);
    fft(rY, iY);
    for (let k = 0; k < half; k++) {
      Pxx[k] += rX[k] * rX[k] + iX[k] * iX[k];
      Pyy[k] += rY[k] * rY[k] + iY[k] * iY[k];
      PxyRe[k] += rX[k] * rY[k] + iX[k] * iY[k];
      PxyIm[k] += iX[k] * rY[k] - rX[k] * iY[k];
    }
    nSeg++;
  }
  if (!nSeg) return null;

  const coherence = new Float64Array(half);
  const freqs = new Float64Array(half);
  const phase = new Float64Array(half);
  for (let k = 0; k < half; k++) {
    freqs[k] = (k * fs) / nfft;
    const num = PxyRe[k] * PxyRe[k] + PxyIm[k] * PxyIm[k];
    const den = Pxx[k] * Pyy[k];
    coherence[k] = den > 1e-30 ? Math.min(1, num / den) : 0;
    phase[k] = Math.atan2(PxyIm[k], PxyRe[k]);
  }
  return { freqs, coherence, phase, nSeg };
}

export function dailyReturns(prices: number[]): number[] {
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  return returns;
}

export function normalizedCumulativeReturns(prices: number[]): number[] {
  if (prices.length === 0) return [];
  const base = prices[0];
  return prices.map((p) => p / base);
}

export function correlationMatrix(
  series: Record<string, number[]>
): { tickers: string[]; matrix: number[][] } {
  const tickers = Object.keys(series);
  const returns = tickers.map((t) => dailyReturns(series[t]));
  const matrix = tickers.map((_, i) =>
    tickers.map((_, j) => pearsonCorrelation(returns[i], returns[j]))
  );
  return { tickers, matrix };
}

export function avgPairwiseCorrelation(tickers: string[], matrix: number[][]): number {
  let sum = 0;
  let count = 0;
  for (let i = 0; i < tickers.length; i++) {
    for (let j = i + 1; j < tickers.length; j++) {
      sum += matrix[i][j];
      count++;
    }
  }
  return count === 0 ? NaN : sum / count;
}

export function annualizedVol(series: number[]): number {
  const rets = dailyReturns(series);
  if (rets.length === 0) return NaN;
  return stddev(rets) * Math.sqrt(252);
}

export function annualizedReturn(series: number[]): number {
  if (series.length < 2) return NaN;
  const totalReturn = series[series.length - 1] / series[0] - 1;
  const n = series.length - 1;
  return (1 + totalReturn) ** (252 / n) - 1;
}

// Sharpe ratio (0% risk-free). Computed from daily returns directly to avoid
// mixing geometric annualization of returns with arithmetic annualization of vol.
export function sharpe(series: number[]): number {
  const rets = dailyReturns(series);
  if (rets.length === 0) return NaN;
  const vol = stddev(rets);
  if (vol === 0) return NaN;
  return (mean(rets) / vol) * Math.sqrt(252);
}

export function extremePairs(
  tickers: string[],
  matrix: number[][]
): { mostCorrelated: [string, string, number]; leastCorrelated: [string, string, number] } {
  let maxVal = -Infinity;
  let minVal = Infinity;
  let maxPair: [string, string] = [tickers[0], tickers[1]];
  let minPair: [string, string] = [tickers[0], tickers[1]];

  for (let i = 0; i < tickers.length; i++) {
    for (let j = i + 1; j < tickers.length; j++) {
      const v = matrix[i][j];
      if (isNaN(v)) continue;
      if (v > maxVal) { maxVal = v; maxPair = [tickers[i], tickers[j]]; }
      if (v < minVal) { minVal = v; minPair = [tickers[i], tickers[j]]; }
    }
  }

  return {
    mostCorrelated: [...maxPair, maxVal] as [string, string, number],
    leastCorrelated: [...minPair, minVal] as [string, string, number],
  };
}
