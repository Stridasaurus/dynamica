import { useParams, Link } from 'react-router-dom';
import { STUDIOS, getStudio, getTool, modelsByStudio, crossLinks, coreTools } from '../models';
import type { StudioId, ToolId } from '../models';
import { ModelCard } from '../components/catalog/ModelCard';

// ── Types & constants ─────────────────────────────────────────────────────────

interface FeaturedMeta {
  equation: string;
  equationNote: string;
  params: string[];
}

const FEATURED: Record<string, FeaturedMeta> = {
  'qv-correlation-lab': {
    equation: 'Σ = Σᵢ λᵢ vᵢ vᵢᵀ',
    equationNote: 'Eigendecomposition of the sample covariance matrix',
    params: ['Rolling window (days)', 'Asset count', 'Date range'],
  },
};

// ── Inline SVG glyphs (studio identity) ───────────────────────────────────────

function QuantVizGlyph({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l5-6 4 3 5-8" />
      <path d="M3 21h18" />
    </svg>
  );
}

function NeuroLearnGlyph({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l2-6 3 14 2-9 2 4h5" />
    </svg>
  );
}

function PhySimGlyph({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c2 0 2-7 4-7s2 14 4 14 2-10 4-10 2 5 4 5h2" />
    </svg>
  );
}

type GlyphProps = { size?: number };
const GLYPHS: Record<string, React.ComponentType<GlyphProps>> = {
  quantviz: QuantVizGlyph,
  neurolearn: NeuroLearnGlyph,
  physim: PhySimGlyph,
};

// ── Component ─────────────────────────────────────────────────────────────────

const VALID = new Set<string>(STUDIOS.map((s) => s.id));

export default function StudioPage() {
  const { studioId } = useParams<{ studioId: string }>();

  if (!studioId || !VALID.has(studioId)) {
    return <NotFound />;
  }

  const studio = getStudio(studioId as StudioId);
  const models = modelsByStudio(studio.id);
  const Glyph = GLYPHS[studio.id];

  // ── Unique tools used by this studio's models ──────────────────────────────
  const studioToolIds = Array.from(new Set(models.flatMap((m) => m.tools)));
  const studioTools = studioToolIds
    .map((id) => {
      try { return getTool(id as ToolId); } catch { return null; }
    })
    .filter(Boolean);

  // ── Featured model (first live, else first flagship) ──────────────────────
  const featuredModel =
    models.find((m) => m.status === 'live') ??
    models.find((m) => m.strength === 'flagship') ??
    models[0];
  const featuredMeta = featuredModel ? FEATURED[featuredModel.id] : undefined;

  // ── Cross-studio links ─────────────────────────────────────────────────────
  const coreToolList = coreTools();
  const studioCoreToolIds = studioToolIds.filter((id) =>
    coreToolList.some((t) => t.id === id),
  );
  const crossStudioLinks = studioCoreToolIds.flatMap((toolId) => {
    const links = crossLinks(toolId as ToolId);
    return links
      .filter((l) => l.studio !== studio.id && l.models.length > 0)
      .map((l) => ({ toolId, ...l }));
  });

  // deduplicate by studio+tool
  const seen = new Set<string>();
  const uniqueCrossLinks = crossStudioLinks.filter(({ studio: s, toolId: t }) => {
    const key = `${s}:${t}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--color-border)] px-8 pb-12 pt-[72px]">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-8 flex items-start gap-6">
            <div
              className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)]"
              style={{
                color: studio.color,
                background: `color-mix(in srgb, ${studio.color} 8%, var(--color-bg))`,
              }}
            >
              {Glyph && <Glyph size={32} />}
            </div>
            <div>
              <div
                className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em]"
                style={{ color: studio.color }}
              >
                {studio.field} · {studio.lens}
              </div>
              <h1 className="text-[clamp(26px,3vw,38px)] font-semibold leading-[1.1] tracking-[-0.022em] text-[var(--color-text-primary)]">
                {studio.headline}
              </h1>
              <p className="mt-3 max-w-[68ch] text-[16.5px] leading-relaxed text-[var(--color-text-secondary)]">
                {studio.blurb}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mathematical frameworks pills ─────────────────────────────────── */}
      {studioTools.length > 0 && (
        <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-3 px-8 py-4">
            <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
              Frameworks
            </span>
            {studioTools.map((tool) => (
              <Link
                key={tool!.id}
                to={`/tools/${tool!.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-3.5 py-1.5 text-[13px] text-[var(--color-text-secondary)] no-underline transition-colors hover:border-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                <span className="font-mono text-[13px]" style={{ color: studio.color }}>
                  {tool!.symbol}
                </span>
                {tool!.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Model grid ────────────────────────────────────────────────────── */}
      <section className="px-8 py-12">
        <div className="mx-auto max-w-[1080px]">
          <h2 className="mb-7 text-[22px] font-semibold tracking-[-0.015em] text-[var(--color-text-primary)]">
            {studio.name.replace(' Studio', '')} models
          </h2>
          <div className="grid grid-cols-2 gap-5">
            {models.map((model) => (
              <ModelCard key={model.id} model={model} hideStudioTag />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured model ────────────────────────────────────────────────── */}
      {featuredModel && (
        <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-12">
          <div className="mx-auto max-w-[1080px]">
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] p-8">
              <div className="grid items-start gap-10 [grid-template-columns:1fr_1fr]">
                {/* Left */}
                <div>
                  <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                    Featured model
                  </div>
                  <h3 className="text-[24px] font-semibold tracking-[-0.018em] text-[var(--color-text-primary)]">
                    {featuredModel.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
                    {featuredModel.blurb}
                  </p>

                  {featuredMeta && (
                    <div className="mt-5">
                      <div className="mb-2 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
                        Parameters
                      </div>
                      <ul className="m-0 list-none p-0">
                        {featuredMeta.params.map((p, i) => (
                          <li
                            key={p}
                            className={`flex items-center gap-2.5 py-2 text-sm text-[var(--color-text-secondary)] ${i > 0 ? 'border-t border-[var(--color-border)]' : ''}`}
                          >
                            <span
                              className="h-[5px] w-[5px] shrink-0 rounded-full opacity-40"
                              style={{ background: studio.color }}
                            />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {featuredModel.status === 'live' && featuredModel.route ? (
                    <Link
                      to={featuredModel.route}
                      className="mt-6 inline-flex h-[42px] items-center rounded-[var(--radius-md)] px-5 text-sm font-medium text-white no-underline transition-colors"
                      style={{ background: studio.color }}
                    >
                      Open simulation →
                    </Link>
                  ) : (
                    <div className="mt-6 inline-flex h-[42px] items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-5 text-sm font-medium text-[var(--color-text-muted)]">
                      Coming soon
                    </div>
                  )}
                </div>

                {/* Right: equation box */}
                {featuredMeta ? (
                  <div>
                    <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                      Governing equation
                    </div>
                    <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-7 text-center">
                      <div className="font-mono text-[22px] font-light tracking-[0.01em] text-[var(--color-text-primary)]">
                        {featuredMeta.equation}
                      </div>
                      <div className="mt-3 text-[13px] text-[var(--color-text-muted)]">
                        {featuredMeta.equationNote}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex aspect-[4/3] items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)]"
                    style={{ background: `color-mix(in srgb, ${studio.color} 5%, var(--color-bg))`, color: studio.color, opacity: 0.4 }}
                  >
                    {Glyph && <Glyph size={56} />}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Cross-studio shared mathematics ───────────────────────────────── */}
      {uniqueCrossLinks.length > 0 && (
        <section className="border-t border-[var(--color-border)] px-8 pb-16 pt-12">
          <div className="mx-auto max-w-[1080px]">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              Shared mathematics
            </div>
            <h2 className="mb-7 text-[22px] font-semibold tracking-[-0.015em] text-[var(--color-text-primary)]">
              These frameworks connect to other studios.
            </h2>
            <div className="flex flex-col gap-2.5">
              {uniqueCrossLinks.map(({ toolId, studio: targetStudioId, models: linkedModels }) => {
                const tool = coreToolList.find((t) => t.id === toolId);
                const targetStudio = STUDIOS.find((s) => s.id === targetStudioId)!;
                const model = linkedModels[0];
                if (!tool || !model) return null;
                return (
                  <Link
                    key={`${toolId}:${targetStudioId}`}
                    to={`/studios/${targetStudioId}`}
                    className="flex items-center gap-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-4 no-underline transition-all hover:border-[var(--color-text-muted)]"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: targetStudio.color }}
                    />
                    <span className="flex-1 text-sm text-[var(--color-text-primary)]">
                      {model.title}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                      {targetStudio.name.replace(' Studio', '')}
                    </span>
                    <span
                      className="font-mono text-sm"
                      style={{ color: studio.color }}
                    >
                      {tool.symbol}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-[var(--color-text-muted)]">That studio doesn't exist.</p>
      <Link
        to="/"
        className="mt-2 inline-block text-[var(--color-accent)] hover:underline"
      >
        ← Back to Dynamica
      </Link>
    </div>
  );
}
