// ── Model catalog: shared types ──────────────────────────────────────────────
// The catalog is the single source of truth that drives BOTH navigation modes:
//   • browse by studio  (a scientific field)
//   • browse by tool    (the shared mathematics)
// Adding a model = adding one entry to `registry.ts`. Both index views and the
// cross-link matrix update automatically.

export type StudioId = 'quantviz' | 'neurolearn' | 'signalviz';

// Core tools (one dedicated page each) span all three studios. Secondary tools
// are tags-only for now; they can be promoted to `core` later without changing
// any model entries.
export type ToolId =
  | 'correlation'
  | 'fourier'
  | 'convolution'
  | 'stochastic'
  | 'dynamical-systems'
  | 'linear-algebra'
  | 'detection'
  | 'information'
  // secondary (tag-only)
  | 'distributions'
  | 'markov'
  | 'optimization'
  | 'networks';

export type ModelStatus = 'live' | 'planned';

/** Maps to the content plan's feasibility ratings: intro=E, core=M, advanced=H. */
export type Difficulty = 'intro' | 'core' | 'advanced';

/** Maps to the content plan's strength tiers (🟢/🟡/🔴). */
export type Strength = 'flagship' | 'solid' | 'marginal';

/** A studio's visual identity. Class strings are kept whole (never built by
 *  string concatenation) so Tailwind's content scanner can see them. */
export interface StudioTheme {
  /** accent text, e.g. links and the lens label */
  text: string;
  /** soft tint behind the icon glyph */
  tint: string;
  /** small pill used for studio chips */
  chip: string;
  /** hover border accent on cards */
  hoverBorder: string;
}

export interface Studio {
  id: StudioId;
  /** Display name, e.g. "QuantViz Studio" */
  name: string;
  /** Scientific field, e.g. "Finance" */
  field: string;
  /** Tagline, e.g. "The Market Lens" */
  lens: string;
  /** Emoji glyph for cards */
  icon: string;
  /** One-paragraph description */
  blurb: string;
  theme: StudioTheme;
}

export interface MathTool {
  id: ToolId;
  /** Display name, e.g. "Correlation & Covariance" */
  name: string;
  /** Mathematical glyph, e.g. "ρ" */
  symbol: string;
  /** What the tool is, in one sentence */
  blurb: string;
  /** The cross-domain "same idea, three fields" thesis line */
  thesis: string;
  /** Core tools get a dedicated page and headline the dual-nav concept */
  core: boolean;
}

export interface ModelEntry {
  /** Unique slug, e.g. "qv-correlation-lab" */
  id: string;
  title: string;
  studio: StudioId;
  /** Tool tags; the first entry is the model's PRIMARY tool. */
  tools: ToolId[];
  blurb: string;
  status: ModelStatus;
  /** Hash route for live models (omitted for planned ones). */
  route?: string;
  difficulty: Difficulty;
  strength: Strength;
}
