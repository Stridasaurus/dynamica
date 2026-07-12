// ── ph-coherogram: sliding-window network coherogram ────────────────────────
// Orchestration only — every actual coherence number comes from
// `welchCoherence` in lib/correlation.ts (S2: no reimplementation). This file
// just slides a window across time, calls welchCoherence once per station
// pair per window, and averages the pairs into one "mean network coherence"
// row — the same aggregation `dsp.worker.js`'s runDSP used in the original
// magnetometer-coherogram app, simplified for a small fixed station count
// (4 stations / 6 pairs) so no Web Worker is needed at this scale.
import { welchCoherence, nextPow2 } from '../../lib/correlation';
import { firstDifference } from './coherogramData';

export interface CoherogramResult {
  /** Frequency of each row, Hz, DC bin excluded. */
  freqsHz: number[];
  /** Center time of each column, minutes from the start of the record. */
  windowCenterMin: number[];
  /** data[timeIdx][freqIdx] = mean pairwise gamma^2 across the station network. */
  data: number[][];
  /** Largest single cell value and its coordinates — the "wow" callout. */
  peak: { coherence: number; freqHz: number; windowCenterMin: number } | null;
  nPairs: number;
}

export interface CoherogramParams {
  fs: number;
  sliceSamples: number;
  stepSamples: number;
  nperseg: number;
  maxFreqHz: number;
}

export function computeCoherogram(
  stations: Array<{ values: number[] }>,
  params: CoherogramParams,
): CoherogramResult | null {
  const { fs, sliceSamples, stepSamples, nperseg, maxFreqHz } = params;
  const diffs = stations.map((s) => firstDifference(s.values));
  const nSamples = diffs[0].length;
  if (nSamples < sliceSamples) return null;

  // Frequency grid, from the FFT size alone (doesn't depend on the data).
  const nfft = nextPow2(nperseg);
  const half = (nfft >> 1) + 1;
  const allFreqs: number[] = [];
  for (let k = 0; k < half; k++) allFreqs.push((k * fs) / nfft);
  // Exclude DC (k=0, unstable after first-differencing) and anything above the requested band.
  const ulfBins: number[] = [];
  for (let k = 1; k < half; k++) if (allFreqs[k] <= maxFreqHz) ulfBins.push(k);
  if (ulfBins.length === 0) return null;
  const freqsHz = ulfBins.map((k) => allFreqs[k]);

  const nPairs = (stations.length * (stations.length - 1)) / 2;
  const data: number[][] = [];
  const windowCenterMin: number[] = [];
  let peak: CoherogramResult['peak'] = null;

  for (let start = 0; start + sliceSamples <= nSamples; start += stepSamples) {
    windowCenterMin.push((start + sliceSamples / 2) / fs / 60);
    const sumCoh = new Array<number>(ulfBins.length).fill(0);
    let pairCount = 0;

    for (let i = 0; i < diffs.length; i++) {
      for (let j = i + 1; j < diffs.length; j++) {
        const a = diffs[i].slice(start, start + sliceSamples);
        const b = diffs[j].slice(start, start + sliceSamples);
        const res = welchCoherence(a, b, fs, nperseg);
        if (!res) continue;
        for (let u = 0; u < ulfBins.length; u++) sumCoh[u] += res.coherence[ulfBins[u]];
        pairCount++;
      }
    }

    const row = pairCount > 0 ? sumCoh.map((s) => s / pairCount) : sumCoh.map(() => 0);
    data.push(row);
    const tCenter = windowCenterMin[windowCenterMin.length - 1];
    for (let u = 0; u < row.length; u++) {
      if (!peak || row[u] > peak.coherence) {
        peak = { coherence: row[u], freqHz: freqsHz[u], windowCenterMin: tCenter };
      }
    }
  }

  return { freqsHz, windowCenterMin, data, peak, nPairs };
}
