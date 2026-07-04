# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Overview

**Dynamica** is a Turborepo/pnpm monorepo of interactive toy models across three studios:
- **QuantViz Studio** — finance (portfolio correlation analysis is the only live model today)
- **NeuroLearn Studio** — neuroscience (planned: LIF neuron, spike stats, …)
- **SignalViz Studio** — signal processing (planned: Fourier, filters, beamforming, …)

The differentiator is **dual navigation**: browse *by studio* or *by mathematical tool* (the shared
math — e.g. correlation appears in all three). Both views and the cross-link matrix derive from a
single registry. To add a model, append one `ModelEntry` to `apps/dynamica/src/models/registry.ts`.
Roadmap: `docs/CONTENT_PLAN.md`. Root vision doc (thesis, invariants, milestones — every SPEC
inherits from it): `docs/MANIFESTO.md`. Note: the manifesto renames SignalViz → **PhySim**
(physics absorbs the signal-processing toys); the code has not been migrated yet.

Deployed as a static site to GitHub Pages at `https://stridasaurus.github.io/dynamica/`
(push to `master` → build → gh-pages).

## Workspace structure

```
dynamica/
├── apps/
│   ├── dynamica/          # Main Vite/React 19 app — @dynamica/app (the pnpm workspace member)
│   ├── correlationlab/    # git submodule — original correlation SPA (NOT in pnpm workspace)
│   └── lif-project/       # git submodule — LIF neuron sim (NOT in pnpm workspace)
├── packages/
│   └── ui/                # @settgast/ui — shared design-system component library
├── scripts/fetch_data.py  # Data pipeline → apps/dynamica/public/data/
└── .github/workflows/     # data-refresh.yml (Mon–Fri market data) · deploy.yml
```

Submodules need `git submodule update --init --recursive` after cloning; they manage their own deps.

## Commands

```bash
pnpm install                         # all workspace deps
pnpm --filter @settgast/ui build     # MUST build ui before the app can import from it
pnpm --filter @dynamica/app dev      # dev server, localhost:5173
pnpm build                           # build everything (turbo orders: ui → app)
pnpm typecheck
pnpm --filter @dynamica/app test     # app tests only (pnpm test runs all)

# Data pipeline (outputs {correlation,returns,prices}.json):
python scripts/fetch_data.py                                   # preset tickers
python scripts/fetch_data.py --tickers SPY BND GLD --period 5y
pip install -r scripts/requirements.txt
```

## Gotchas & non-obvious behavior

**`@settgast/ui` build step.** Built with tsup; you must run its build before the app can import
from it. Import the bundled CSS as `import '@settgast/ui/styles'`. This package is currently
duplicated with the standalone `settgast-ui` repo — edit **only this copy** until the two sources
are consolidated.

**Tailwind whole-class rule.** Class strings in `StudioTheme` (in the registry) must be written
whole, never interpolated, or Tailwind's content scanner won't see them and the styles vanish.

**Vite base path.** `vite.config.ts` sets `base: '/dynamica/'`, so production asset URLs are
prefixed with `/dynamica/`. Fetch static files via `import.meta.env.BASE_URL`, never absolute paths.

**Dark mode.** `[data-theme="dark"]` selector strategy (from ThemeProvider in `@settgast/ui`);
Tailwind config `darkMode: ['selector', '[data-theme="dark"]']` matches it.

**Extended ranges.** Static JSON covers the 20 preset ETFs at ~2Y. Everything else — custom
tickers, and *all* tickers at 5Y/10Y/20Y — is live-fetched; at those ranges the date axis derives
from the live data, not from the static `dates` array.

**Live data fallback chain** (`src/lib/fetchTicker.ts`): Stooq → Yahoo, each through CORS proxies
(corsproxy.io → allorigins.win → codetabs.com), then deterministic synthetic data seeded from the
ticker string if every proxy fails.

## Routes (HashRouter — required for GitHub Pages static hosting)

- `#/` — landing
- `#/studios/:studioId` — studio view (`quantviz` | `neurolearn` | `signalviz`)
- `#/tools` and `#/tools/:toolId` — cross-studio tool views
- `#/quantviz` — the live model; URL state e.g. `?t=SPY:10,BND:50&range=2Y&w=90`

## Model catalog (`apps/dynamica/src/models/`)

`registry.ts` is the single source of truth; `index.ts` exposes selectors (`modelsByStudio`,
`modelsByTool`, `crossLinks`) that drive both navigation views automatically. Add a model by
appending one `ModelEntry` — no other wiring needed.
