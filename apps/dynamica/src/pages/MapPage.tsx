import { STUDIOS } from '../models';
import { Matrix } from '../components/catalog/Matrix';

export default function MapPage() {
  return (
    <div className="mx-auto max-w-[1080px] px-8 py-16">
      <span className="mb-3.5 block font-mono text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        The map
      </span>
      <h1 className="max-w-[42ch] text-[clamp(28px,3.6vw,42px)] font-semibold leading-[1.12] tracking-[-0.02em] text-[var(--color-text-primary)]">
        One toolkit, three fields, read two ways.
      </h1>
      <p className="mt-4 max-w-[64ch] text-[17px] leading-relaxed text-[var(--color-text-secondary)]">
        Every row is one piece of mathematics; every column is a scientific field. Read across a
        row and the same equation reappears in finance, neuroscience, and physics — read down a
        column and you get a studio's model library. This grid is both browse modes at once, and
        it fills in as models ship.
      </p>

      <div className="mt-12 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
        <Matrix />
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-[var(--color-text-muted)]">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-text-secondary)]" />
          Live model
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full border border-[var(--color-text-secondary)]" />
          Next up (planned)
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full opacity-25 bg-[var(--color-text-muted)]" />
          Not yet built
        </span>
        <span className="ml-auto flex items-center gap-3">
          {STUDIOS.map((s) => (
            <span key={s.id} className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              {s.field}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
