import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { STUDIOS } from '../models';
import { Matrix } from '../components/catalog/Matrix';

// ── Constants ────────────────────────────────────────────────────────────────

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

function PhySimGlyph({ size = 22 }: { size?: number }) {
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
                onClick={() => scrollTo('map')}
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
            <BridgeRow studioId="physim" label="Measured signal" sublabel="Fourier / spectral estimation" />
          </div>
        </div>
      </section>

      {/* ── The Map ──────────────────────────────────────────────────────────── */}
      <section id="map" className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-[1080px] px-8 py-[76px]">
          <div className="mb-8 max-w-[64ch]">
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              The map
            </div>
            <h2 className="text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.12] tracking-[-0.02em] text-[var(--color-text-primary)]">
              One library, organized two ways at once.
            </h2>
            <p className="mt-4 text-[17px] text-[var(--color-text-secondary)]">
              Rows are mathematics, columns are studios. Read across a row and the same equation
              reappears in finance, neuroscience, and physics — read down a column and you get a
              studio's model library.
            </p>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg)] p-6 sm:p-8">
            <Matrix />
          </div>

          <div className="mt-6">
            <Link
              to="/map"
              className="text-sm font-medium text-[var(--color-accent)] no-underline hover:underline"
            >
              Open the full map →
            </Link>
          </div>
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
