import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Badge, Button, Select, Slider } from '@settgast/ui';
import { MODELS, getStudio } from '../index';
import { ModelPageShell, ShellSectionTitle, queryFromHash } from '../../shell';
import { crossCorrelation, peakLag } from '../../lib/correlation';
import { generateSpikeTrainPair } from './spikeTrains';
import { encodeState, decodeState } from './urlState';
import { SpikeRaster } from './SpikeRaster';
import { Correlogram } from './Correlogram';

const MODEL = MODELS.find((m) => m.id === 'nl-cross-correlogram')!;
const STUDIO = getStudio('neurolearn');

// Fixed simulation constants (not exposed as controls — kept lean per §7
// "don't widen past M1"; nBins/baseRate tuned so the effect is legible at
// every driveStrength/trueLag/maxLag the controls allow).
const N_BINS = 500;
const BASE_RATE = 6;

const DEFAULT_STATE = { seed: 1, driveStrength: 0.7, trueLag: 4, maxLag: 20 as 10 | 20 | 30 };

const MAX_LAG_OPTIONS = [
  { value: '10', label: '±10 bins' },
  { value: '20', label: '±20 bins' },
  { value: '30', label: '±30 bins' },
];

export default function NlCrossCorrelogramPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [seed, setSeed] = useState(DEFAULT_STATE.seed);
  const [driveStrength, setDriveStrength] = useState(DEFAULT_STATE.driveStrength);
  const [trueLag, setTrueLag] = useState(DEFAULT_STATE.trueLag);
  const [maxLag, setMaxLag] = useState<10 | 20 | 30>(DEFAULT_STATE.maxLag);

  // ── URL state (S6): restore once on mount, then keep the hash in sync ─────
  const initialHashRef = useRef(location.hash);
  const restoredRef = useRef(false);

  useEffect(() => {
    const search = queryFromHash(initialHashRef.current);
    const restored = search ? decodeState(search) : null;
    if (restored) {
      setSeed(restored.seed);
      setDriveStrength(restored.driveStrength);
      setTrueLag(restored.trueLag);
      setMaxLag(restored.maxLag);
    }
    restoredRef.current = true;
  }, []);

  useEffect(() => {
    if (!restoredRef.current) return;
    const encoded = encodeState({ seed, driveStrength, trueLag, maxLag });
    const newHash = `#/models/nl-cross-correlogram?${encoded}`;
    if (window.location.hash !== newHash) {
      navigate(newHash.slice(1), { replace: true });
    }
  }, [seed, driveStrength, trueLag, maxLag, navigate]);

  // ── Compute (Compute Core: lib/correlation.ts — S2) ────────────────────────
  const { a, b } = useMemo(
    () => generateSpikeTrainPair({ seed, nBins: N_BINS, baseRate: BASE_RATE, driveStrength, trueLag }),
    [seed, driveStrength, trueLag],
  );
  const correlogram = useMemo(() => crossCorrelation(a, b, maxLag), [a, b, maxLag]);
  const best = useMemo(() => peakLag(correlogram), [correlogram]);

  const regenerate = () => setSeed(Math.floor(Math.random() * 1_000_000));

  return (
    <ModelPageShell
      model={MODEL}
      badges={<Badge variant="accent">Simulated data</Badge>}
      subtitle={`${N_BINS} bins · seed ${seed} · drive ${driveStrength.toFixed(2)} · true lag ${trueLag}`}
      provenance="Spike trains are simulated client-side (seeded PRNG) — this model needs no network data (manifesto §8: NeuroLearn is simulation-first)."
    >
      {/* Controls */}
      <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 sm:flex-row sm:items-center sm:flex-wrap">
        <Control label="Drive strength" value={driveStrength.toFixed(2)}>
          <Slider
            value={[driveStrength]}
            min={0}
            max={1}
            step={0.05}
            onValueChange={([v]) => setDriveStrength(v)}
            className="w-40"
          />
        </Control>
        <Control label="True lag (bins)" value={String(trueLag)}>
          <Slider
            value={[trueLag]}
            min={0}
            max={15}
            step={1}
            onValueChange={([v]) => setTrueLag(v)}
            className="w-40"
          />
        </Control>
        <Control label="Correlogram window">
          <Select
            options={MAX_LAG_OPTIONS}
            value={String(maxLag)}
            onValueChange={(v) => setMaxLag(parseInt(v, 10) as 10 | 20 | 30)}
            className="w-32"
          />
        </Control>
        <Button variant="secondary" size="sm" onClick={regenerate} className="sm:ml-auto">
          Regenerate spikes ↻
        </Button>
      </div>

      {/* Spike raster */}
      <div className="flex flex-col gap-3">
        <ShellSectionTitle>Spike Trains</ShellSectionTitle>
        <SpikeRaster a={a} b={b} driverColor={STUDIO.color} followerColor="#c4b5fd" />
      </div>

      {/* Correlogram */}
      <div className="flex flex-col gap-3">
        <ShellSectionTitle>Cross-Correlogram</ShellSectionTitle>
        <Correlogram data={correlogram} peakLagValue={best?.lag ?? null} color={STUDIO.color} />
      </div>

      {/* Narrative — the S7 "wow" */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {best && !isNaN(best.r) ? (
            <>
              The correlogram peaks at <strong className="text-[var(--color-text-primary)]">lag = {best.lag}</strong>{' '}
              (r = {best.r.toFixed(3)}) — B's firing echoes A's{' '}
              <strong className="text-[var(--color-text-primary)]">{best.lag}</strong> bins later, which is exactly
              the delay dialed into "true lag." A cross-correlogram is a rolling correlation swept across every
              possible time shift instead of one fixed window — the same Pearson coefficient CorrelationLab uses to
              read portfolio diversification, applied here to answer &ldquo;who drives whom?&rdquo; between two spike
              trains instead of &ldquo;how related are they right now?&rdquo;
            </>
          ) : (
            <>No reliable peak — with drive strength at 0 the two spike trains are independent; there is nothing for the correlogram to find.</>
          )}
        </p>
      </div>
    </ModelPageShell>
  );
}

function Control({ label, value, children }: { label: string; value?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 shrink-0 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
        {label}{value ? ` (${value})` : ''}
      </span>
      {children}
    </div>
  );
}
