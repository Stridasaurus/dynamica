# Dynamica — Manifesto

> The single source of truth for Dynamica. Every SPEC, design, and `CLAUDE.md`
> inherits from this file. Stable lives here; volatile implementation detail
> lives down a layer in the specs and designs. This file is versioned with the
> code at `docs/MANIFESTO.md`; where it describes architecture the repo hasn't
> reached yet, that is marked explicitly in §6.

---

## 1. Purpose & the problem

Dynamica is a portfolio of **interactive toy models** that exists to make one
claim tangible: **finance, neuroscience, and physics are secretly running the
same mathematics.** Correlation that measures diversification in a portfolio is
the same operation that picks out a wavefront in a sensor array and the same one
that reveals co-firing between neurons. Convolution that smooths a price series
is the same kernel that defines a neuron's receptive field and the same one that
solves the heat equation.

Most sites with a Fourier widget or a correlation heatmap sell the *widget*.
Dynamica sells the **connection between widgets**. The toys are evidence; the
thesis is the product.

The problem this manifesto solves: Dynamica grew organically out of one or two
standalone apps (notably **CorrelationLab**, a working stock-correlation tool now
ported in as the first model) and a "coming soon" neuron stub. It accreted a
large surface with almost nothing built, no contract for what a model *is*, and a
math taxonomy nobody is sold on. This document fixes the spine so an agent — or a
human — can build the next model without re-deriving the rules each time.

**Why it is built this way:** Dynamica is simultaneously a **portfolio piece**
(it must impress and never render broken in front of a recruiter) and a
**learning project** (it must be honest and rigorous enough to actually teach).
Those two goals are co-equal and they pull cuts in opposite directions — breadth
and polish vs. correctness and clarity. The invariants below are tuned to serve
both at once.

---

## 2. Core users & concrete use cases

Two audiences, in priority order:

1. **The visitor exploring the thesis.** A curious technical person (recruiter,
   peer, student) who lands on the site and should, within one or two clicks,
   hit a *"wait — those are the same equation?"* moment. They browse **by tool**
   ("show me correlation everywhere") or **by studio** ("show me the finance
   toys") and both paths must feel first-class.
   - *Use case:* Opens **CorrelationLab**, types `SPY, GLD, BTC-USD`, scrubs the
     rolling window, sees diversification break down in a crisis. Clicks the
     cross-link footer → lands on the same correlation math expressed as neuron
     co-firing, then as beamforming.
   - *Use case:* Enters the **tool page** for `convolution`, sees a
     moving-average, a receptive field, and the heat equation side by side, and
     realizes they are one operation.

2. **The builder (you, and the coding agent).** Adds a new model without
   inventing structure: drops a pure function into the compute core, composes the
   shared model shell, registers metadata, and the studio index, tool index, and
   cross-link matrix update themselves.
   - *Use case:* Builds the **LIF neuron** model — user types an input-current
     expression like `I(t) = 5*sin(t) + 2`, the simulator runs client-side and
     renders spikes plus phase-plane and ISI views — reusing the same shell and
     expression-input control CorrelationLab uses.

---

## 3. Project-level success criteria (measurable)

These are the executable definitions of done. S1–S2 and S4–S9 gate **every
milestone** over the models that milestone ships; S3 is the **full-project north
star**, reached milestone by milestone (see *Milestones* at the end of this
document). Specs make their slice of each precise; nothing here should be a
vibe.

| # | Criterion | How it's checked |
|---|-----------|------------------|
| S1 | **Every shipped math tool is correct.** | Each Compute Core tool has unit tests with known-value fixtures (e.g. `pearson(x, x) === 1`, `fft` of a pure tone has a single nonzero bin). Tests green is the merge gate. |
| S2 | **No cross-link is a lie.** | Each tool slug maps to exactly one Compute Core module (`lib/<slug>.ts`) exporting the canonical functions. An automated registry check statically verifies that every model imports from the module of every tool it is tagged with (grep/AST script in CI). A model tagged `correlation` that doesn't import the canonical correlation module fails the check. |
| S3 | **The thesis is fully covered** *(north star — full project, not a launch gate)*. | Every core tool has ≥1 model in each of the three studios. Verified by querying the registry; the cross-link matrix has no empty cells. |
| S4 | **Dual nav is derived, not duplicated.** | Studio indexes, tool indexes, and the cross-link matrix all build from the single registry. Grep proves there is no second hand-maintained list. |
| S5 | **Nothing renders broken offline.** | Every data-backed model produces a valid (possibly synthetic, clearly labeled) view with network disabled. Testable by blocking fetch. |
| S6 | **Every view is shareable.** | Each model encodes full state in the URL hash; `decode(encode(state)) === state` round-trips in a unit test. |
| S7 | **The "wow" lands** *(editorial — the one non-automatable bar)*. | Each flagship model's narrative delivers a one-sentence non-obvious surprise; each launch tool page delivers a clean three-field triple. Reviewed by eye, not by test — and flagged as such honestly. |
| S8 | **Nothing renders broken on a phone.** | Every page lays out usably on a small viewport. Models are desktop-first as *instruments*, but on mobile they must degrade gracefully — readable, scrollable, never clipped or overlapping. Checked in responsive dev tools before a model ships. |
| S9 | **Interactions feel instant.** | Initial JS bundle ≤ ~250 KB gzipped; control changes reflect in the viz in < 100 ms or show progressive feedback. Bundle size checked at build; latency by eye per model. |

---

## 4. Scope boundaries & non-goals

**In scope:** curated interactive toys, chosen for *cross-substrate recurrence*,
that run entirely in the browser on a static host.

**Explicit non-goals — state these as hard nos:**

- **NOT a trading platform, financial advice, or a research instrument.** Toys
  for intuition. Simplified models are fine; misleading ones are not.
- **NO runtime backend, auth, database, or server compute.** Everything runs in
  the browser or is baked at build time. (Honors the GitHub Pages deploy.)
- **NO real-time streaming.** Daily-fresh data is the ceiling; "live" means
  fetched-on-demand and cached, not websockets.
- **NO persistence beyond the URL.** Shareable URL state is the only memory.
- **NOT exhaustive coverage of any field.** A model earns its place by lighting
  up a tool triple, not by completing a curriculum.
- **Secondary tools (`distributions`, `markov`, `optimization`, `networks`) are
  tags, not pages, at launch.** They annotate models; they do not get dedicated
  tool pages yet.

---

## 5. The spine: two layers, three substrates

The connective tissue is **two families of math**, not three fields sharing a
toolbox. This reframe is what lets physics in and makes the cross-links honest.

- **Dynamics** — how a system *evolves*: differential equations & dynamical
  systems, stochastic processes, chaos. *("Dynamica" points here literally.)*
- **Analysis** — how we *measure and decompose* whatever is evolving:
  correlation, Fourier, convolution/filtering, linear algebra/PCA, detection &
  estimation, information theory.

The three **studios** are **substrates** where dynamics plays out and analysis is
applied:

- **QuantViz** — finance.
- **NeuroLearn** — neuroscience.
- **PhySim** — physical & engineered systems: mechanics (n-body, pendulums),
  stat-mech / thermodynamics (phase change), waves, **and a Signals & Systems
  neighborhood** (LTI systems, sampling, filtering, beamforming) so the
  signal-processing toys keep a natural home.

### The math taxonomy (the "browse by tool" spine)

Eight **core tools** form the spine; each produces a full three-substrate
triple. **The slug is the canonical name** — it is the `ToolId` in the registry
(`src/models/types.ts`), the Compute Core module name, and the tool page's URL
segment. (Earlier drafts used M-numbers; those are retired.)

**Analysis tools**
- `correlation` — Correlation & Covariance. *Flagship; CorrelationLab is the seed.*
- `fourier` — Fourier & Spectral Analysis. *(Time-frequency / wavelets fold in here.)*
- `convolution` — Convolution & Filtering.
- `linear-algebra` — Linear Algebra & Dimensionality Reduction (PCA/SVD/eigen).
- `detection` — Detection & Estimation (matched filter, Kalman, SDT).
- `information` — Information Theory & Entropy.

**Dynamics tools**
- `stochastic` — Stochastic Processes (random walk, Brownian/Wiener, OU, Poisson).
- `dynamical-systems` — Differential Equations & Dynamical Systems (phase
  planes, limit cycles, bifurcations; chaos folds in here).

**Secondary (tags only at launch):** `distributions` · `markov` ·
`optimization` · `networks`. Each can be promoted to a core tool later by
flipping its `core` flag — no model entries change.

### Why the spine is now stronger

The reframe didn't shrink the taxonomy — it *re-justified* it. Several triples
get a better physics leg than signal processing alone gave them:

- **`convolution`:** moving average (finance) = receptive field (neuro) = the
  **heat equation as Gaussian convolution** (physics). Same kernel, three faces.
- **`stochastic`:** GBM (finance) = Poisson spikes (neuro) = **Brownian
  motion** (physics — the *original*).
- **`information`:** entropy as diversification = neural coding = **Shannon
  meets thermodynamic entropy** (the link only physics can close).

**Cleanest triples: `correlation`, `convolution`, `stochastic`,
`dynamical-systems`.** Each is a *"same equation, different field"* moment a
visitor feels instantly. `detection` is strong but more technical; it's a
fast-follow. The build order over these is set in *Milestones* below.

---

## 6. Capability / module map (load-bearing)

**This section describes the target architecture**, not the repo as it stands —
see *Current state vs. target* below for the delta. Paths are relative to
`apps/dynamica/src/` in the Turborepo.

A clean dependency DAG. Leaves carry no volatile coupling; nothing depends on the
top. Each module is a coherent task an agent can finish in one focused session.

```
       @settgast/ui ─┐
                     ▼
  Compute Core ──► Model Shell ──► Models ──► Registry ──► Navigation
        ▲                            ▲
   Data Layer ───────────────────────┘
```

### Compute Core — `src/lib/`
- **Responsibility:** the math tools, as pure, deterministic, framework-free
  TypeScript functions. The *literal* connective tissue.
- **Owns:** the single canonical implementation of every core tool — one module
  per slug (`lib/correlation.ts`, `lib/fourier.ts`, …) — and its tests.
- **Does NOT own:** rendering, React, the DOM, data fetching, any I/O.
- **Depends on:** nothing. (Leaf — the most stable code in the repo.)

### Data Layer — `src/data/`
- **Responsibility:** get real-world series into models without a backend.
- **Owns:** the static-bake pipeline (Python + yfinance, refreshed by CI cron),
  the live client fetch (Stooq → Yahoo via CORS-proxy chain), caching/TTL, and
  the **synthetic fallback**. Exposes typed series to models.
- **Does NOT own:** math (calls Compute Core), viz, model state.
- **Depends on:** external sources only. (Leaf inside the app.)

### Model Shell / Anatomy — `src/shell/`
- **Responsibility:** the one skeleton every toy wears, built on `@settgast/ui`.
- **Owns:** the anatomy (metadata → controls → viz surface(s) → narrative →
  cross-link footer), shared control primitives **including the mathjs
  expression input**, and URL-hash state encode/decode.
- **Does NOT own:** any specific model's domain logic or chosen chart.
- **Depends on:** `@settgast/ui`, Compute Core, Data Layer.

### Models — `src/models/<id>/`
- **Responsibility:** one toy each = metadata + control config + viz + narrative,
  composed from the Shell, computing via Compute Core.
- **Owns:** its domain story and its specific visualization choices.
- **Does NOT own:** the math (imports it), the skeleton (inherits it).
- **Depends on:** Model Shell, Compute Core, sometimes Data Layer.
- **Rule:** every model names exactly one **studio** and one or more **tool
  tags** (first tag = primary tool).

### Registry — `src/models/registry.ts`
- **Responsibility:** the single source of truth — one entry per model
  (`{ id, title, studio, tools[], blurb, status, difficulty, strength }`).
- **Owns:** the canonical model list that drives *both* browse modes and the
  cross-link matrix.
- **Does NOT own:** any rendering; it is data.
- **Depends on:** model metadata. (Nothing computes from it but Navigation.)

### Navigation / Surfaces — `src/pages/`
- **Responsibility:** the landing page, studio indexes, tool indexes, and the
  cross-link matrix — the dual nav made visible.
- **Owns:** the co-equality of the two browse modes; it **derives** everything
  from the Registry and **asserts** nothing.
- **Does NOT own:** model logic, math, or data.
- **Depends on:** Registry. (Top of the DAG; nothing depends on it.)
- **Note on tool pages:** a tool page is a *derived exhibit* that assembles the
  studio models tagged with that tool plus the connective narrative. The
  "purest" canonical demo of a tool usually lives as a model inside **PhySim**'s
  Signals & Systems neighborhood (e.g. a bare convolution visualizer); the tool
  page frames it next to the finance and neuro expressions.

### Current state vs. target (as of 2026-07)

What the repo actually has today, so no reader mistakes the map above for the
territory:

- The third studio is still **`signalviz`** in code — 13 planned entries in
  `src/models/registry.ts`, plus `studios.ts`, routes, and theme classes. The
  PhySim decision (§8) is made but **not yet migrated**.
- `src/lib/` holds `correlation.ts` (pure, tested — the Compute Core pattern
  proven once) alongside `fetchTicker.ts` and `urlState.ts`, which belong to the
  future Data Layer and Model Shell respectively.
- There is **no `src/shell/`, no `src/data/`, no `src/models/<id>/`** yet. The
  one live model is hand-built (`src/components/quantviz/` +
  `src/pages/QuantVizPage.tsx`); all other models exist only as registry
  metadata. Registry → Navigation, however, already works exactly as specified.

Migration path (in order, each a bounded task):
1. **Retag `signalviz` → `physim`** in registry, `studios.ts`, routes, theme,
   and `CLAUDE.md` — cheap now, while every affected model is still `planned`.
   (Respect the Tailwind whole-class rule when writing the new theme.)
2. **Carve out the Model Shell** when building the second live model: extract
   URL-state, layout skeleton, and shared controls rather than designing the
   shell in the abstract.
3. **Split the Data Layer** out of `lib/` when a second model needs real-world
   data; until then `fetchTicker.ts` stays where it is.

---

## 7. Cross-cutting invariants & principles

Imperatives. The first three are load-bearing — break them and the project stops
being Dynamica.

- **One tool, one implementation. NEVER reimplement a tool inside a studio.**
  Every math tool is a single function/module in Compute Core; every model that
  uses it imports it. *If two studios' "correlation" are not the same function,
  the cross-link is a lie.* (Enforced by S2.)
- **The dual nav is derived, NEVER asserted.** Studio pages, tool pages, and the
  matrix all build from the one Registry. **NEVER hand-maintain a second list.**
  Studio-browse and tool-browse are co-equal peers — neither is a redirect to
  the other.
- **Compute Core is pure and tested. ALWAYS.** No I/O, no React, no DOM in
  `lib/`. A tool without passing known-value tests is **not done**.
- **Every model obeys the anatomy.** metadata → controls → viz → narrative →
  cross-link footer. A toy that won't fit the shell is a *shell* bug to escalate,
  not a snowflake to special-case.
- **Graceful degradation, ALWAYS.** Live data when available → bundled snapshot →
  clearly-labeled synthetic. **A model NEVER renders broken or empty in front of
  a visitor** — not offline (S5), not on a phone (S8).
- **Every view is shareable.** Full model state encodes into the URL hash;
  loading the URL reproduces the exact view.
- **Static-only at runtime.** No backend, no auth, no database. Browser or
  build-time, nothing else.
- **Honest math.** Models may simplify but must not mislead; every simplification
  is stated in the narrative, and synthetic/illustrative data is **labeled as
  synthetic**.
- **Name things once.** Every studio, tool, and model uses the glossary's exact
  name — for tools, the slug — from registry to UI to code.
- **Stable at the root, volatile in the leaves.** If this manifesto or a
  `CLAUDE.md` starts filling with implementation detail, that detail wants to
  move *down* into a SPEC or design — flag it.

---

## 8. Key decisions (with rationale) & open questions

### Decisions

- **Two-layer spine (Dynamics × Analysis) over "three fields share tools."**
  More honest, lets physics in, and strengthens the triples (heat-equation
  convolution, Brownian motion, thermodynamic entropy). *Cost:* radar/DSP toys
  lose signal-processing as a top-level home. *Mitigation:* PhySim contains a
  Signals & Systems neighborhood that keeps them — including the beamforming and
  inverse-beamforming models.
- **PhySim replaces SignalViz; signals are absorbed.** Gives the breadth wanted
  (n-body, phase change, oscillators) without orphaning the DSP toys. The name
  is **PhySim** (over `PhysViz`). *Not yet migrated in code* — see §6's current
  state; migration is step 1 of the path there.
- **NeuroLearn and PhySim are simulation-first.** Their models generate data
  client-side; the Data Layer's real-world surface (bake pipeline, live fetch)
  is a QuantViz concern. Specs should not assume fetched data outside QuantViz.
- **Co-equal dual nav is the thesis, not a feature.** The browse-by-tool mode is
  the original idea that inspired the project; it gets equal billing.
- **Compute Core is the connective tissue — in code, not just prose.** The
  shared-function rule is what makes the thesis *true* rather than asserted.
  (CorrelationLab already proves the pattern: a pure, exhaustively tested
  `correlation.ts`.)
- **Data: static bake + live CORS-proxy fetch + synthetic fallback, no backend.**
  Replicates CorrelationLab's proven approach (static JSON for curated tickers
  refreshed by a weekday GitHub Actions cron; Stooq→Yahoo live fetch through a
  public CORS-proxy chain for arbitrary input; deterministic synthetic series as
  last resort). Zero runtime cost, fully static-deployable, never breaks.
- **mathjs expression input over Pyodide.** User-defined functions (input
  currents, signals) are entered as light expressions (`sin(t) + 0.5`) —
  instant, tiny, covers the need. Pyodide's ~10MB is not worth it; revisit only
  if a model genuinely needs Python semantics.
- **`@settgast/ui` is the design system.** The Model Shell is built on it so
  every toy is visually consistent.

### Open questions

- **CORS-proxy fragility.** Public proxies are flaky and rate-limited. Accepted
  for a portfolio site with synthetic fallback as the safety net — but do we
  later stand up a self-hosted/serverless proxy or a scheduled job → KV store for
  reliability and intraday freshness? *(The one real production risk.)*
- **Milestone 2's exact cut.** Milestone 1 is locked (see *Milestones*); which
  marginal (🔴) models are dropped from the four-triple launch slice, and its
  exact model list, are still to be finalized.

---

## 9. Glossary (name once, everywhere)

- **Studio** — a domain surface: **QuantViz** (finance), **NeuroLearn**
  (neuroscience), **PhySim** (physical & engineered systems).
- **Substrate** — a studio viewed as a place where dynamics/analysis play out.
- **Tool** — a core math capability, named by its slug (`correlation`,
  `fourier`, `convolution`, `stochastic`, `dynamical-systems`, `linear-algebra`,
  `detection`, `information`); the unit of "browse by tool."
- **Secondary tag** — a tag-only tool (`distributions`, `markov`,
  `optimization`, `networks`); annotates models, no dedicated page yet.
- **Model** — one interactive toy. Belongs to one studio, carries ≥1 tool tag.
- **Compute Core** — the pure, tested `lib/` functions; the canonical math.
- **Model Shell / Anatomy** — the shared skeleton every model wears.
- **Registry** — the single metadata list that drives all navigation.
- **Cross-link** — a pointer from a model to the same tool's models in the other
  studios.
- **Triple** — the three-substrate set of models for one tool; the payoff exhibit.
- **Dynamics / Analysis** — the two math families (evolve / measure).
- **Snapshot** — bundled static data shipped at build time.
- **Synthetic fallback** — deterministic generated data, always labeled, shown
  when no real data is reachable.
- **CorrelationLab** — the seed model (`correlation`, QuantViz); the proven
  reference implementation for compute purity, data strategy, and URL state.

---

## 10. Global tech stack (root level only)

Per-model chart choices and library specifics live in that model's design, not
here.

- **UI:** React 19 + TypeScript, Vite build.
- **Design system:** `@settgast/ui` on TailwindCSS (dark mode via the
  `[data-theme="dark"]` selector strategy).
- **Charts (default):** Recharts; model-specific viz libraries are leaf-level.
- **Expression input:** mathjs.
- **Tests:** Vitest (the gate for Compute Core correctness).
- **Data pipeline:** Python + yfinance, run in GitHub Actions (weekday cron).
- **Live fetch:** client-side, Stooq → Yahoo via public CORS-proxy chain, with
  synthetic fallback.
- **Deploy:** GitHub Pages, static, on push + scheduled data refresh.

---

## Milestones

Success criteria S1–S2 and S4–S9 apply to everything each milestone ships; S3
is reached when Milestone 3 completes.

### Milestone 1 — prove the thesis (one triple)

The smallest artifact that demonstrates *"those are the same equation"* across
all three substrates: the **`correlation` tool page** with a complete triple.

- **QuantViz:** CorrelationLab *(live today)*.
- **NeuroLearn:** Cross-Correlogram & Connectivity *(build)*.
- **PhySim:** Sensor Array & Beamforming *(build)*.

Two new models, one tool page, and — built along the way — the first cut of the
Model Shell and the S2 registry check. Ship this before widening.

### Milestone 2 — launch slice (four triples)

Four tool pages, each with a complete three-substrate triple: `correlation`,
`convolution`, `stochastic`, `dynamical-systems` (the four cleanest). `fourier`
and `detection` as fast-follows.

- **QuantViz:** CorrelationLab *(done)*, Random-Walk vs Markets *(`stochastic`)*,
  Mean-Reversion / OU *(`dynamical-systems`)*, Moving-Averages-as-Filters
  *(`convolution`)*.
- **NeuroLearn:** LIF neuron *(`dynamical-systems`, port the stub)*,
  Cross-Correlogram *(done in M1)*, Spike-Train / Poisson *(`stochastic`)*,
  Receptive Fields *(`convolution`)*.
- **PhySim:** Convolution / Heat-equation visualizer *(`convolution`,
  canonical)*, Beamforming *(done in M1)*, Brownian motion *(`stochastic`)*,
  n-body or pendulum phase plane *(`dynamical-systems`)*.

~12 models that *together* fill four tool pages with a full triple each.

### Milestone 3+ — full coverage (S3)

Remaining core tools — `fourier`, `linear-algebra`, `detection`, `information` —
each completed to a triple, until the cross-link matrix has no empty cells.

---

## What this manifesto implies downstream

This document hands the next layer a clean set of seams. The SPECs it most
directly implies, each taking one module and making it precise:

1. **`SPEC: compute-core`** — the tool-function contract: the slug ↔ module
   convention (`lib/<slug>.ts`), signature and purity rules, the known-value
   test fixtures that satisfy S1, and the registry import-check that satisfies
   S2.
2. **`SPEC: model-anatomy`** — the shared shell: the metadata schema, control
   primitives (incl. the mathjs expression input), viz-surface slots, narrative
   block, cross-link footer, and the URL-state codec (S6).
3. **`SPEC: data-layer`** — the static-bake pipeline, the live-fetch proxy chain,
   TTL/caching, and the synthetic-fallback contract that satisfies S5.
4. **`SPEC: registry-and-nav`** — the registry schema and the derivation of
   studio indexes, tool indexes, and the cross-link matrix (S3, S4).
5. **Per-model SPECs** — one per milestone model, each inheriting the glossary,
   invariants, and its tool's Compute Core function from this root.
