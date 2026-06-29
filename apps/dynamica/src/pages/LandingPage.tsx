import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { STUDIOS, coreTools, modelsByStudio, modelsByTool } from '../models';
import type { StudioId } from '../models';

// ── Constants ────────────────────────────────────────────────────────────────

const TOOL_EQ: Record<string, string> = {
  correlation: 'ρ(X,Y) = Cov(X,Y)/σₓσᵧ',
  fourier: 'X(f) = ∫ x(t) e⁻ⁱ²πft dt',
  convolution: '(f ∗ g)(t) = ∫ f(τ) g(t−τ) dτ',
  stochastic: 'dX = μ dt + σ dW',
  'dynamical-systems': 'dx/dt = f(x, t)',
  'linear-algebra': 'A = U Σ Vᵀ',
  detection: 'x̂ = E[x | y]',
  information: 'H(X) = −Σ p log p',
};

const WHY_TOOLS = [
  {
    name: 'Stochastic calculus',
    code: 'Itô / SDEs',
    desc: 'Models randomness over time — asset prices in finance, membrane noise in neurons.',
  },
  {
    name: 'Differential equations',
    code: 'ODEs / PDEs',
    desc: 'Describes how state evolves — volatility surfaces, action potentials, diffusion.',
  },
  {
    name: 'State-space models',
    code: 'Kalman / filtering',
    desc: 'Infers hidden state from noisy measurement — tracking, estimation, control.',
  },
  {
    name: 'Spectral & transform methods',
    code: 'Fourier / wavelet',
    desc: 'Decomposes signals into structure — frequency, scale, and information content.',
  },
];

const SHOWCASE: {
  studioId: StudioId;
  model: string;
  desc: string;
  features: string[];
  reverse: boolean;
}[] = [
  {
    studioId: 'quantviz',
    model: 'Correlation Lab',
    desc: 'Estimate and stress-test dependence structure across assets — eigen-portfolios, factor exposure, and the geometry of a covariance matrix, made visual.',
    features: ['Factor models', 'Eigen-decomposition', 'Risk metrics'],
    reverse: false,
  },
  {
    studioId: 'neurolearn',
    model: 'LIF Neuron Lab',
    desc: 'Drive a leaky integrate-and-fire neuron and watch membrane potential, spike trains, and the subthreshold dynamics that the very same SDEs govern in finance.',
    features: ['Membrane dynamics', 'Spike rasters', 'Channel noise'],
    reverse: true,
  },
  {
    studioId: 'signalviz',
    model: 'Spectral Workbench',
    desc: 'Fourier and wavelet decomposition, beamforming, and Kalman estimation — the measurement mathematics that ties the markets and the minds together.',
    features: ['Fourier / wavelet', 'Beamforming', 'Kalman filtering'],
    reverse: false,
  },
];

// ── SVG glyphs ────────────────────────────────────────────────────────────────

function QuantVizGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l5-6 4 3 5-8" />
      <path d="M3 21h18" />
    </svg>
  );
}

function NeuroLearnGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l2-6 3 14 2-9 2 4h5" />
    </svg>
  );
}

function SignalVizGlyph({ size = 22 }: { size?: number }) {
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
  signalviz: SignalVizGlyph,
};

// ── Tool icons ────────────────────────────────────────────────────────────────

function ToolIcon({ id }: { id: string }) {
  const map: Record<string, React.ReactNode> = {
    correlation: (
      <svg viewBox="0 0 24 24" width={21} height={21} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 20L20 4" strokeDasharray="2 2" />
        <circle cx="6" cy="17" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="9" cy="14" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="13" cy="10" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="17" cy="7" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    fourier: (
      <svg viewBox="0 0 24 24" width={21} height={21} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 16c2 0 2-8 4-8s2 8 4 8" />
        <path d="M14 18V8M17 18v-6M20 18v-9" />
      </svg>
    ),
    convolution: (
      <svg viewBox="0 0 24 24" width={21} height={21} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h4l2-5 2 10 2-7 2 4h5" />
      </svg>
    ),
    stochastic: (
      <svg viewBox="0 0 24 24" width={21} height={21} fill="currentColor">
        <circle cx="6" cy="8" r="1.2" /><circle cx="10" cy="14" r="1.2" />
        <circle cx="9" cy="6" r="1.2" /><circle cx="14" cy="10" r="1.2" />
        <circle cx="17" cy="16" r="1.2" /><circle cx="19" cy="7" r="1.2" />
        <circle cx="13" cy="18" r="1.2" />
      </svg>
    ),
    'dynamical-systems': (
      <svg viewBox="0 0 24 24" width={21} height={21} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M4 18c4 0 5-12 9-12 3 0 4 8 7 8" />
        <path d="M3 21h18" />
      </svg>
    ),
    'linear-algebra': (
      <svg viewBox="0 0 24 24" width={21} height={21} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="1.5" />
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      </svg>
    ),
    detection: (
      <svg viewBox="0 0 24 24" width={21} height={21} fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
      </svg>
    ),
    information: (
      <svg viewBox="0 0 24 24" width={21} height={21} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M5 18V10M9 18V8M13 18V12M17 18V6M21 18H3" />
      </svg>
    ),
  };
  return <>{map[id] ?? null}</>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// ── Bridge row sub-component ──────────────────────────────────────────────────

function BridgeRow({ studioId, label, sublabel }: { studioId: string; label: string; sublabel: string }) {
  const studio = STUDIOS.find((s) => s.id === studioId)!;
  const Glyph = GLYPHS[studioId];
  return (
    <div className="flex items-center gap-4">
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]"
        style={{ color: studio.color }}
      >
        {Glyph && <Glyph size={28} />}
      </div>
      <div>
        <b className="block text-sm font-semibold text-[var(--color-text-primary)]">{label}</b>
        <span className="text-[12.5px] text-[var(--color-text-muted)]">{sublabel}</span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [explorerView, setExplorerView] = useState<'studio' | 'math'>('studio');
  const tools = coreTools();

  useEffect(() => {
    document.documentElement.classList.add('ready');
    return () => {
      document.documentElement.classList.remove('ready');
    };
  }, []);

  return (
    <div>
      {/* ── Hero: Bridge ─────────────────────────────────────────────────── */}
      <section className="px-8 pb-16 pt-[92px]">
        <div className="mx-auto grid max-w-[1080px] items-center gap-14 [grid-template-columns:1.05fr_0.95fr]">
          {/* Left column */}
          <div>
            <div className="rise d1 font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Mathematical modeling across domains
            </div>
            <h1 className="rise d2 mt-4 text-[clamp(34px,4.6vw,58px)] font-semibold leading-[1.04] tracking-[-0.025em] text-[var(--color-text-primary)]">
              The same equations describe markets, minds, and signals.
            </h1>
            <p className="rise d3 mt-5 max-w-[56ch] text-lg leading-relaxed text-[var(--color-text-secondary)]">
              A stock price, a spiking neuron, and a radar return obey the same underlying law —
              deterministic drift perturbed by noise. Dynamica makes that shared structure explicit
              across three studios, and lets you explore it across disciplines.
            </p>
            <div className="rise d4 mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollTo('explorer')}
                className="flex h-[46px] cursor-pointer items-center rounded-[var(--radius-md)] border-0 bg-[var(--color-accent)] px-5 text-[15px] font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                Explore the platform
              </button>
              <button
                onClick={() => scrollTo('why')}
                className="flex h-[46px] cursor-pointer items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-transparent px-5 text-[15px] font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-text-muted)]"
              >
                Why it matters
              </button>
            </div>
          </div>

          {/* Right column: bridge visual */}
          <div className="rise d3 flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[30px]">
            <BridgeRow studioId="quantviz" label="Financial market" sublabel="Geometric Brownian motion" />
            <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] p-3.5 text-center">
              <div className="font-mono text-base tracking-[0.01em] text-[var(--color-text-primary)]">
                dx = f(x,t)·dt + g(x,t)·dW
              </div>
              <div className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                drift + stochastic forcing — one law, every domain
              </div>
            </div>
            <BridgeRow studioId="neurolearn" label="Spiking neuron" sublabel="Leaky integrate-and-fire" />
            <BridgeRow studioId="signalviz" label="Measured signal" sublabel="Fourier / spectral estimation" />
          </div>
        </div>
      </section>

      {/* ── Dual-view explorer ──────────────────────────────────────────────── */}
      <section id="explorer" className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-[1080px] px-8 py-[76px]">
          {/* Head + toggle */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[64ch]">
              <div className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                The dual-view explorer
              </div>
              <h2 className="text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.12] tracking-[-0.02em] text-[var(--color-text-primary)]">
                One library, organized two ways.
              </h2>
              <p className="mt-4 text-[17px] text-[var(--color-text-secondary)]">
                Toggle between domain and mathematics. Every model lives in a studio — and under a
                framework it shares with models from other studios.
              </p>
            </div>
            {/* Pill toggle */}
            <div className="flex rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] p-1">
              {(['studio', 'math'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setExplorerView(v)}
                  className={[
                    'cursor-pointer rounded-full border-0 px-5 py-2.5 text-sm font-medium transition-all',
                    explorerView === v
                      ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]'
                      : 'bg-transparent text-[var(--color-text-secondary)]',
                  ].join(' ')}
                >
                  {v === 'studio' ? 'Studio view' : 'Mathematical view'}
                </button>
              ))}
            </div>
          </div>

          {/* Studio view */}
          {explorerView === 'studio' && (
            <div className="grid grid-cols-3 gap-5">
              {STUDIOS.map((studio) => {
                const flagships = modelsByStudio(studio.id)
                  .filter((m) => m.strength === 'flagship')
                  .slice(0, 4);
                const Glyph = GLYPHS[studio.id];
                return (
                  <Link
                    key={studio.id}
                    to={`/studios/${studio.id}`}
                    className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] p-6 no-underline transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `color-mix(in srgb, ${studio.color} 40%, var(--color-border))`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '';
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)]"
                        style={{
                          color: studio.color,
                          background: `color-mix(in srgb, ${studio.color} 8%, var(--color-bg))`,
                        }}
                      >
                        {Glyph && <Glyph size={22} />}
                      </div>
                      <div>
                        <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-[var(--color-text-primary)]">
                          {studio.name}
                        </h3>
                        <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                          {studio.field.toLowerCase()} models
                        </div>
                      </div>
                    </div>
                    <ul className="m-0 list-none p-0">
                      {flagships.map((m, i) => (
                        <li
                          key={m.id}
                          className={`flex items-center gap-2.5 py-[7px] text-sm text-[var(--color-text-secondary)] ${i > 0 ? 'border-t border-[var(--color-border)]' : ''}`}
                        >
                          <span
                            className="h-[5px] w-[5px] shrink-0 rounded-full opacity-40"
                            style={{ background: studio.color }}
                          />
                          {m.title}
                        </li>
                      ))}
                    </ul>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Mathematical view */}
          {explorerView === 'math' && (
            <div className="flex flex-col gap-3.5">
              {tools.map((tool) => {
                const toolModels = modelsByTool(tool.id).slice(0, 5);
                return (
                  <div
                    key={tool.id}
                    className="grid items-start gap-7 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-5 [grid-template-columns:300px_1fr]"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                        <ToolIcon id={tool.id} />
                      </div>
                      <div>
                        <h3 className="text-[16.5px] font-semibold tracking-[-0.01em] text-[var(--color-text-primary)]">
                          {tool.name}
                        </h3>
                        <div className="mt-0.5 font-mono text-[12.5px] text-[var(--color-text-muted)]">
                          {TOOL_EQ[tool.id] ?? tool.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {toolModels.map((m) => {
                        const s = STUDIOS.find((s) => s.id === m.studio)!;
                        return (
                          <span
                            key={m.id}
                            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[13px] text-[var(--color-text-primary)]"
                          >
                            {m.title.split(/\s+/).slice(0, 3).join(' ')}
                            <span
                              className="font-mono text-[10px] uppercase tracking-[0.06em]"
                              style={{ color: s.color }}
                            >
                              {s.field}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Studio legend */}
              <div className="mt-5 flex flex-wrap gap-4 text-[12.5px] text-[var(--color-text-muted)]">
                {STUDIOS.map((s) => (
                  <span key={s.id} className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                    {s.name.replace(' Studio', '')}
                  </span>
                ))}
                <span>Every framework draws models from two or more studios.</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Why this matters ─────────────────────────────────────────────────── */}
      <section id="why" className="border-t border-[var(--color-border)]">
        <div className="mx-auto grid max-w-[1080px] items-center gap-14 px-8 py-[76px] [grid-template-columns:1.1fr_1fr]">
          <div>
            <span className="mb-3.5 block font-mono text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              Why this matters
            </span>
            <h2 className="text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.12] tracking-[-0.02em] text-[var(--color-text-primary)]">
              The intellectual core is the shared toolbox.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[var(--color-text-secondary)]">
              Different fields, same mathematics. A handful of tools — borrowed freely between
              disciplines — are enough to model a portfolio, a cortical column, or a radar return.
              That transfer is the whole point of Dynamica.
            </p>
          </div>
          <div>
            {WHY_TOOLS.map((tool, i) => (
              <div
                key={tool.name}
                className={`flex gap-4 py-[18px] ${i > 0 ? 'border-t border-[var(--color-border)]' : ''}`}
              >
                <div className="min-w-[200px]">
                  <span className="text-[15px] font-semibold text-[var(--color-text-primary)]">
                    {tool.name}
                  </span>
                  <code className="mt-1 block font-mono text-[12.5px] font-normal text-[var(--color-text-muted)]">
                    {tool.code}
                  </code>
                </div>
                <div className="text-sm text-[var(--color-text-secondary)]">{tool.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Studios showcase ─────────────────────────────────────────────────── */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-[1080px] px-8 py-[76px]">
          <div className="mb-12">
            <span className="mb-3.5 block font-mono text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              Inside the studios
            </span>
            <h2 className="text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.12] tracking-[-0.02em] text-[var(--color-text-primary)]">
              Research-grade tools, one design language.
            </h2>
            <p className="mt-4 text-[17px] text-[var(--color-text-secondary)]">
              Each studio is a suite of interactive web apps — built to visualize and simulate, not
              just plot.
            </p>
          </div>
          <div className="flex flex-col gap-12">
            {SHOWCASE.map(({ studioId, model, desc, features, reverse }) => {
              const studio = STUDIOS.find((s) => s.id === studioId)!;
              const Glyph = GLYPHS[studioId];
              return (
                <div
                  key={studioId}
                  className={`grid items-center gap-11 ${reverse ? '[grid-template-columns:1.25fr_1fr]' : '[grid-template-columns:1fr_1.25fr]'}`}
                >
                  <div className={reverse ? 'order-2' : ''}>
                    <div
                      className="font-mono text-[11px] uppercase tracking-[0.1em]"
                      style={{ color: studio.color }}
                    >
                      {studio.name}
                    </div>
                    <h3 className="mt-2.5 text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[var(--color-text-primary)]">
                      {model}
                    </h3>
                    <p className="mt-3.5 text-[15.5px] leading-relaxed text-[var(--color-text-secondary)]">
                      {desc}
                    </p>
                    <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                      {features.map((f) => (
                        <li
                          key={f}
                          className="rounded-full border border-[var(--color-border)] px-3 py-[5px] text-[12.5px] text-[var(--color-text-secondary)]"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Placeholder visual */}
                  <div
                    className={`flex aspect-[16/10] items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-md)] ${reverse ? 'order-1' : ''}`}
                    style={{ background: `color-mix(in srgb, ${studio.color} 5%, var(--color-bg))` }}
                  >
                    <div style={{ color: studio.color, opacity: 0.35 }}>
                      {Glyph && <Glyph size={72} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────────────────────── */}
      <section id="about" className="border-t border-[var(--color-border)]">
        <div className="mx-auto grid max-w-[1080px] items-center gap-12 px-8 py-[76px] [grid-template-columns:1fr_1fr]">
          <div>
            <span className="mb-3.5 block font-mono text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              About Dynamica
            </span>
            <h2 className="text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.12] tracking-[-0.02em] text-[var(--color-text-primary)]">
              The portfolio of a quantitative scientist.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[var(--color-text-secondary)]">
              Dynamica is one researcher's argument that finance, neuroscience, and signal processing
              are a single discipline wearing three coats. The platform is the evidence; the blog is
              the long-form version.
            </p>
            <div className="mt-6">
              <a
                href="https://stridasaurus.github.io/StriderSettgast.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[38px] items-center rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 text-sm font-medium text-[var(--color-text-primary)] no-underline transition-colors hover:border-[var(--color-text-muted)]"
              >
                About the author
              </a>
            </div>
          </div>

          {/* Featured essay card */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] p-7 transition-all hover:border-[var(--color-text-muted)] hover:shadow-[var(--shadow-sm)]">
            <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-accent)]">
              Featured essay
            </div>
            <h3 className="mt-3 text-[22px] font-semibold leading-[1.2] tracking-[-0.01em] text-[var(--color-text-primary)]">
              Intersections of finance, neuro, and physics
            </h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--color-text-secondary)]">
              Why a Brownian particle, a stock price, and a noisy neuron are, mathematically, the
              same story — and what you can learn by reading them together.
            </p>
            <a
              href="https://stridasaurus.github.io/StriderSettgast.com/blog/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] no-underline"
            >
              Read on the blog
              <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
