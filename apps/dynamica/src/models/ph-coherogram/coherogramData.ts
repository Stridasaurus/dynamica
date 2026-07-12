// ── ph-coherogram: data acquisition ─────────────────────────────────────────
// Graceful degradation (manifesto §7, PLAN.md Q2): bundled real-data snapshot
// -> labeled synthetic fallback. This is the one PhySim model that touches
// real-world data (bridging mag-GIBF) rather than being purely simulation-
// first — PLAN.md Q2 calls that out explicitly as this model's exception to
// the "NeuroLearn/PhySim are simulation-first" default (manifesto §8).
//
// No live network fetch at runtime: the snapshot is baked into the repo
// (public/data/magnetometer-snapshot.json, fetched once from the USGS
// Geomagnetism web service — see the file's own `source` field) rather than
// fetched from USGS live, which would reintroduce the CORS/proxy fragility
// the manifesto's open-questions section already flags as a QuantViz-only
// accepted risk. Static-only at runtime (manifesto §7) — the "live" tier of
// the usual ladder is simply not attempted here; snapshot -> synthetic is the
// full ladder for this model, and both tiers are offline-safe (S5) once the
// snapshot is bundled.

const BASE = import.meta.env.BASE_URL;

export interface StationSeries {
  id: string;
  name: string;
  /** First-column (H-component) magnetic-field values, nT. */
  values: number[];
}

export interface StationDataset {
  /** Human-readable description of what real event/window this is, or the
   *  synthetic generator's label. Always shown to the visitor (honest math —
   *  manifesto §7: synthetic/illustrative data is always labeled). */
  label: string;
  /** true = bundled real USGS snapshot; false = deterministic synthetic. */
  isReal: boolean;
  /** Sample cadence, seconds. */
  cadenceSec: number;
  stations: StationSeries[];
}

interface SnapshotJSON {
  source: string;
  element: string;
  event: string;
  cadenceSec: number;
  stations: Array<{ id: string; name: string; lat: number; lon: number; t0: number; values: (number | null)[] }>;
}

/** Fetch the bundled real-data snapshot. Returns null if the fetch fails or
 *  the response doesn't parse — callers fall back to synthetic (S5). */
export async function loadSnapshot(): Promise<StationDataset | null> {
  try {
    const resp = await fetch(`${BASE}data/magnetometer-snapshot.json`);
    if (!resp.ok) return null;
    const json = (await resp.json()) as SnapshotJSON;
    if (!json.stations || json.stations.length < 2) return null;
    const stations: StationSeries[] = json.stations.map((s) => ({
      id: s.id,
      name: s.name,
      // Null gaps (rare in this snapshot) are forward-filled so downstream
      // FFT/coherence math never sees a non-finite sample.
      values: fillGaps(s.values),
    }));
    return { label: json.event, isReal: true, cadenceSec: json.cadenceSec, stations };
  } catch {
    return null;
  }
}

function fillGaps(values: (number | null)[]): number[] {
  const out: number[] = [];
  let last = values.find((v): v is number => v != null) ?? 0;
  for (const v of values) {
    if (v != null && isFinite(v)) last = v;
    out.push(last);
  }
  return out;
}

// ── Synthetic fallback: seeded Pc3/4/5 test tones + a substorm-like burst ──
// Deterministic mulberry32 PRNG, matching the pattern already established in
// nl-cross-correlogram/spikeTrains.ts (S1-style reproducibility, no
// Math.random). Ported from magnetometer-coherogram's generateSynthetic
// (Sites/magnetometer-coherogram/index.html), simplified: same multi-band
// structure (steady Pc4 hum, a Pc5 wave that ramps in, a mid-record Pc3
// burst, and a decaying "substorm" transient) so the coherogram has a real
// event to discover, but station count/params are fixed rather than
// user-configurable (lean per manifesto §7 — don't widen past M1).
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

const SYNTHETIC_STATIONS = [
  { id: 'SYN-A', name: 'Synthetic Station A', phaseOffset: 0.0, ampScale: 1.0 },
  { id: 'SYN-B', name: 'Synthetic Station B', phaseOffset: 0.15, ampScale: 0.92 },
  { id: 'SYN-C', name: 'Synthetic Station C', phaseOffset: 0.31, ampScale: 1.08 },
  { id: 'SYN-D', name: 'Synthetic Station D', phaseOffset: 0.22, ampScale: 0.97 },
];

export const SYNTHETIC_FS = 1; // Hz — full Pc3-Pc5 band resolvable (unlike 1-min real data)
export const SYNTHETIC_N_SAMPLES = 7200; // 2 hours at 1 Hz

/** Generate the fixed synthetic station network for a given seed. Same seed
 *  always reproduces the same dataset. */
export function generateSyntheticStations(seed: number): StationDataset {
  const stations = SYNTHETIC_STATIONS.map((s) => {
    const rng = mulberry32(seed + s.id.charCodeAt(4) * 1000);
    const n = SYNTHETIC_N_SAMPLES;
    const sig = new Array<number>(n);
    for (let i = 0; i < n; i++) sig[i] = (rng() - 0.5) * 2;

    const pc5 = 0.005;
    const ph5 = s.phaseOffset * 2 * Math.PI * pc5 * 200;
    const pc4 = 0.012;
    const ph4 = s.phaseOffset * 2 * Math.PI * pc4 * 150;
    const pc3 = 0.033;
    const ph3 = s.phaseOffset * 2 * Math.PI * pc3 * 80;

    for (let i = 0; i < n; i++) {
      const t = i / SYNTHETIC_FS;
      if (t > 1800) sig[i] += s.ampScale * Math.min(1, (t - 1800) / 600) * 8 * Math.sin(2 * Math.PI * pc5 * t + ph5);
      sig[i] += s.ampScale * 3 * Math.sin(2 * Math.PI * pc4 * t + ph4);
      if (t > 3600 && t < 5400) {
        sig[i] += s.ampScale * Math.sin((Math.PI * (t - 3600)) / 1800) * 5 * Math.sin(2 * Math.PI * pc3 * t + ph3);
      }
      if (t > 2700) sig[i] += s.ampScale * 25 * Math.exp(-(t - 2700) / 300) * Math.sin(2 * Math.PI * 0.008 * t);
    }
    return { id: s.id, name: s.name, values: sig };
  });

  return {
    label: `Synthetic Pc3/Pc4/Pc5 test tones + substorm transient (seed ${seed})`,
    isReal: false,
    cadenceSec: 1 / SYNTHETIC_FS,
    stations,
  };
}

/** First difference (emphasizes the ULF band by removing the slow diurnal
 *  trend) — preprocessing specific to how this model preps its input, not
 *  itself the correlation/coherence math (that lives in lib/correlation.ts). */
export function firstDifference(sig: number[]): number[] {
  const out = new Array<number>(sig.length - 1);
  for (let i = 0; i < out.length; i++) out[i] = sig[i + 1] - sig[i];
  return out;
}
