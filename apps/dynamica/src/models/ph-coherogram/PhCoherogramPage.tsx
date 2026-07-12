import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, Button, Select } from '@settgast/ui';
import { MODELS } from '../index';
import { ModelPageShell, ShellSectionTitle, queryFromHash } from '../../shell';
import { loadSnapshot, generateSyntheticStations, SYNTHETIC_FS, type StationDataset } from './coherogramData';
import { computeCoherogram, type CoherogramResult } from './computeCoherogram';
import { encodeState, decodeState, type CoherogramState } from './urlState';
import { Heatmap } from './Heatmap';

const MODEL = MODELS.find((m) => m.id === 'ph-coherogram')!;

const DEFAULT_STATE: CoherogramState = { source: 'real', seed: 1 };

const SOURCE_OPTIONS = [
  { value: 'real', label: 'Real — May 2024 storm (USGS)' },
  { value: 'synthetic', label: 'Synthetic — Pc3/4/5 test tones' },
];

// Real snapshot: 1-min cadence -> Nyquist ~8.3 mHz, so only the low end of the
// ULF band (Pc5, edge of Pc4) is resolvable — clamp to fs/2 rather than
// implying the coherogram can see Pc3 in 1-minute data (honest math, §7).
// Synthetic: 1 Hz -> the full Pc3-Pc5 band (2-50 mHz) is resolvable.
function paramsFor(dataset: StationDataset) {
  const fs = 1 / dataset.cadenceSec;
  if (dataset.isReal) {
    return { fs, sliceSamples: 180, stepSamples: 60, nperseg: 32, maxFreqHz: fs / 2 };
  }
  return { fs, sliceSamples: 600, stepSamples: 60, nperseg: 128, maxFreqHz: 0.05 };
}

export default function PhCoherogramPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [source, setSource] = useState<CoherogramState['source']>(DEFAULT_STATE.source);
  const [seed, setSeed] = useState(DEFAULT_STATE.seed);
  const [dataset, setDataset] = useState<StationDataset | null>(null);
  const [fellBackToSynthetic, setFellBackToSynthetic] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── URL state (S6): restore once on mount, then keep the hash in sync ─────
  const initialHashRef = useRef(location.hash);
  const restoredRef = useRef(false);

  useEffect(() => {
    const search = queryFromHash(initialHashRef.current);
    const restored = search ? decodeState(search) : null;
    if (restored) {
      setSource(restored.source);
      setSeed(restored.seed);
    }
    restoredRef.current = true;
  }, []);

  useEffect(() => {
    if (!restoredRef.current) return;
    const encoded = encodeState({ source, seed });
    const newHash = `#/models/ph-coherogram?${encoded}`;
    if (window.location.hash !== newHash) {
      navigate(newHash.slice(1), { replace: true });
    }
  }, [source, seed, navigate]);

  // ── Data acquisition: bundled real snapshot -> labeled synthetic fallback ──
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFellBackToSynthetic(false);

    if (source === 'synthetic') {
      setDataset(generateSyntheticStations(seed));
      setLoading(false);
      return;
    }

    loadSnapshot().then((snap) => {
      if (cancelled) return;
      if (snap) {
        setDataset(snap);
      } else {
        // Graceful degradation (S5): the bundled snapshot should always be
        // reachable, but if it isn't (offline dev server oddity, CDN miss on
        // deploy), never render broken — fall back to labeled synthetic.
        setDataset(generateSyntheticStations(seed));
        setFellBackToSynthetic(true);
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [source, seed]);

  // ── Compute (Compute Core: lib/correlation.ts's welchCoherence — S2) ──────
  const coherogram: CoherogramResult | null = useMemo(() => {
    if (!dataset) return null;
    return computeCoherogram(dataset.stations, paramsFor(dataset));
  }, [dataset]);

  const regenerate = () => setSeed(Math.floor(Math.random() * 1_000_000));
  const isSynthetic = source === 'synthetic' || fellBackToSynthetic;

  return (
    <ModelPageShell
      model={MODEL}
      badges={
        isSynthetic ? (
          <Badge variant="accent">Synthetic data</Badge>
        ) : (
          <Badge variant="positive">Real data — USGS</Badge>
        )
      }
      subtitle={
        dataset
          ? `${dataset.stations.length} stations · ${dataset.stations.map((s) => s.id).join(', ')} · ${dataset.label}`
          : 'Loading…'
      }
      provenance={
        fellBackToSynthetic
          ? 'The bundled real-data snapshot could not be loaded — showing labeled synthetic data instead (graceful degradation).'
          : isSynthetic
            ? 'Spike-train-style seeded synthetic data — a Pc4 hum, a ramping Pc5 wave, and a substorm-like transient, all deterministic.'
            : 'Real H-component magnetometer data from four USGS observatories during the 2024-05-10/11 G5 geomagnetic superstorm, fetched once from geomag.usgs.gov and bundled as a static snapshot (no live network fetch at runtime).'
      }
    >
      {/* Controls */}
      <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
            Data source
          </span>
          <Select
            options={SOURCE_OPTIONS}
            value={source}
            onValueChange={(v) => setSource(v as CoherogramState['source'])}
            className="w-64"
          />
        </div>
        {source === 'synthetic' && (
          <Button variant="secondary" size="sm" onClick={regenerate} className="sm:ml-auto">
            Regenerate stations &#8635;
          </Button>
        )}
      </div>

      {/* Coherogram */}
      <div className="flex flex-col gap-3">
        <ShellSectionTitle>Network Coherogram</ShellSectionTitle>
        {loading || !coherogram ? (
          <div className="flex h-[260px] items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
            {loading ? 'Loading…' : 'Not enough data to compute a coherogram.'}
          </div>
        ) : (
          <Heatmap result={coherogram} />
        )}
      </div>

      {/* Narrative — the S7 "wow" */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {coherogram?.peak ? (
            <>
              The brightest cell sits at{' '}
              <strong className="text-[var(--color-text-primary)]">
                {(coherogram.peak.freqHz * 1000).toFixed(2)} mHz
              </strong>
              , around{' '}
              <strong className="text-[var(--color-text-primary)]">
                t = {coherogram.peak.windowCenterMin.toFixed(0)} min
              </strong>{' '}
              (&gamma;&sup2; = {coherogram.peak.coherence.toFixed(3)}) — averaged across{' '}
              {coherogram.nPairs} station pairs. Coherence is the same Pearson-style "how related are
              these two series" question CorrelationLab asks of stock returns and the cross-correlogram
              asks of spike trains, just answered separately at every frequency instead of once over
              the whole record: a ground-magnetic disturbance travels the globe as a wave, so distant
              stations only look correlated in the narrow band that wave occupies — everywhere else
              they're just noise next to each other.
            </>
          ) : (
            <>Not enough overlapping data to find a coherence peak.</>
          )}
        </p>
      </div>
    </ModelPageShell>
  );
}
