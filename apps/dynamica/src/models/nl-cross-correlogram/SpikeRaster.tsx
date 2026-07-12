import { Card } from '@settgast/ui';

interface Props {
  a: number[];
  b: number[];
  /** Series colors — passed in from the owning studio's theme (NeuroLearn
   *  purple, full vs. muted) rather than hardcoded, so this component stays
   *  studio-agnostic if reused. */
  driverColor: string;
  followerColor: string;
}

const MAX_BARS = 150; // cap rendered bars so the DOM stays light on long runs

/** Two-row binned spike-count raster: series A (driver) on top, series B
 *  (follower) below, sharing a time axis. A plain flex/div bar chart — no
 *  charting library needed for this shape, keeping the bundle small (S9). */
export function SpikeRaster({ a, b, driverColor, followerColor }: Props) {
  const n = a.length;
  const step = Math.max(1, Math.ceil(n / MAX_BARS));
  const idxs: number[] = [];
  for (let i = 0; i < n; i += step) idxs.push(i);

  const maxCount = Math.max(1, ...a, ...b);

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3">
        <Raster label="A (driver)" color={driverColor} values={idxs.map((i) => a[i])} maxCount={maxCount} />
        <Raster label="B (follower)" color={followerColor} values={idxs.map((i) => b[i])} maxCount={maxCount} />
      </div>
      <p className="mt-3 text-xs text-[var(--color-text-muted)]">
        {n} bins · showing {idxs.length} sampled columns · bar height = spike count in that bin
      </p>
    </Card>
  );
}

function Raster({ label, color, values, maxCount }: { label: string; color: string; values: number[]; maxCount: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-xs font-mono text-[var(--color-text-secondary)]">{label}</span>
      <div className="flex flex-1 items-end gap-px h-10">
        {values.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${Math.max(2, (v / maxCount) * 100)}%`,
              background: color,
              opacity: v === 0 ? 0.12 : 0.55 + 0.45 * (v / maxCount),
            }}
          />
        ))}
      </div>
    </div>
  );
}
