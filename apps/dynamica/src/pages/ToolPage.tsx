import { useParams, Link } from 'react-router-dom';
import { Breadcrumb } from '@settgast/ui';
import { coreTools, getTool, getStudio, crossLinks } from '../models';
import type { ToolId } from '../models';
import { ModelCard } from '../components/catalog/ModelCard';

// Only core tools get a dedicated page (secondary tools are tag-only —
// PLAN.md R4: no page, no Map cell, nothing for a chip to link to).
const VALID = new Set<string>(coreTools().map((t) => t.id));

// The connective narrative (PLAN.md Q3 / manifesto S7 — the one editorial,
// non-automatable bar): once a tool's triple is actually built, this is where
// an agent writes the "wait, those are the same equation?" payoff specific to
// the three real models, not the generic one-line `thesis` every tool carries
// regardless of what's shipped. Deliberately populated only for tools whose
// triple is complete — an empty triple has nothing concrete to connect yet,
// so it falls back to the thesis blockquote alone (§7: "don't widen past M1").
const CONNECTIVE_NARRATIVE: Partial<Record<string, string>> = {
  correlation:
    'All three models below compute the exact same quantity — Pearson r, imported from one ' +
    'shared function (lib/correlation.ts) — and differ only in what they hold fixed while they ' +
    'sweep it. CorrelationLab collapses r to one number per pair, then repeats that over a rolling ' +
    'window: correlation swept across TIME, read as "how has diversification changed." The ' +
    'cross-correlogram takes two spike trains and slides one against the other one bin at a time: ' +
    'correlation swept across LAG, read as "who drives whom." The magnetometer coherogram takes r ' +
    'and its cousin — the frequency-domain gamma-squared, still just |cross-spectrum|^2 normalized ' +
    'by the two auto-spectra — and sweeps it across FREQUENCY as well as time: correlation swept ' +
    'across BAND, read as "which wave is two stations sharing, and when." Same coefficient, three ' +
    'axes to slide it along; a portfolio, a pair of neurons, and a planet-wide sensor network all ' +
    'answer the same question — how related are these two series? — just posed differently.',
};

export default function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();

  if (!toolId || !VALID.has(toolId)) {
    return <NotFound />;
  }

  const tool = getTool(toolId as ToolId);
  const columns = crossLinks(tool.id);

  return (
    <div className="mx-auto max-w-[1080px] px-8 py-12">
      <Breadcrumb items={[{ label: 'Dynamica', href: '#/' }, { label: 'Map', href: '#/map' }, { label: tool.name }]} className="mb-6" />

      <div className="mb-8 flex items-start gap-4">
        <span className="select-none font-mono text-5xl leading-none text-[var(--color-text-muted)] opacity-40">
          {tool.symbol}
        </span>
        <div>
          <h1 className="text-[clamp(26px,3vw,36px)] font-semibold tracking-[-0.02em] text-[var(--color-text-primary)]">
            {tool.name}
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] text-[var(--color-text-secondary)]">{tool.blurb}</p>
        </div>
      </div>

      {/* The thesis — the reason this page exists */}
      <blockquote className="mb-6 border-l-2 border-[var(--color-accent)] pl-4 text-lg italic leading-relaxed text-[var(--color-text-secondary)]">
        {tool.thesis}
      </blockquote>

      {/* The connective narrative (S7 "wow") — only rendered once the
          triple is actually built; see CONNECTIVE_NARRATIVE above. */}
      {CONNECTIVE_NARRATIVE[tool.id] && (
        <p className="mb-10 max-w-[68ch] text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          {CONNECTIVE_NARRATIVE[tool.id]}
        </p>
      )}

      <h2 className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        The same idea, three fields
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {columns.map(({ studio: studioId, models }) => {
          const studio = getStudio(studioId);
          return (
            <div key={studioId}>
              <Link
                to={`/studios/${studioId}`}
                className={`mb-3 flex items-center gap-2 text-sm font-semibold no-underline ${studio.theme.text}`}
              >
                <span>{studio.icon}</span>
                {studio.field}
              </Link>
              {models.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {models.map((model) => (
                    <ModelCard key={model.id} model={model} hideStudioTag />
                  ))}
                </div>
              ) : (
                <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] p-4 text-sm text-[var(--color-text-muted)]">
                  No model yet in this field.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-[var(--color-text-muted)]">That tool doesn't exist.</p>
      <Link to="/map" className="mt-2 inline-block text-[var(--color-accent)] hover:underline">
        ← Back to the map
      </Link>
    </div>
  );
}
