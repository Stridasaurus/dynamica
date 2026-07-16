# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Overview

**Dynamica** is a Turborepo/pnpm monorepo of interactive toy models across three studios:
- **QuantViz Studio** — finance (portfolio correlation analysis is the only live model today)
- **NeuroLearn Studio** — neuroscience (next up: LIF neuron)
- **PhySim Studio** — physical & engineered systems, incl. the signals-and-systems toolkit
  (next up: Global Magnetometer Coherence)

The differentiator is **dual navigation**: browse *by studio* or *by mathematical tool* (the shared
math — e.g. correlation appears in all three), unified in the cross-link **Matrix** at `/map`. Both
views derive from a single registry. To add a model, append one `ModelEntry` to
`apps/dynamica/src/models/registry.ts` (currently trimmed to live + next-up only — the full
longlist lives in `docs/CONTENT_PLAN.md` and `docs/THESIS_RANKINGS.md`). Root vision doc (thesis,
invariants, milestones — every SPEC inherits from it): `docs/MANIFESTO.md`.

Deployed as a static site to GitHub Pages at `https://stridasaurus.github.io/dynamica/`
(push to `master` → build → gh-pages).

## Workspace structure

```
dynamica/
├── apps/
│   └── dynamica/          # Main Vite/React 19 app — @dynamica/app (the sole pnpm workspace member)
├── scripts/fetch_data.py  # Data pipeline → apps/dynamica/public/data/
└── .github/workflows/     # data-refresh.yml (Mon–Fri market data) · deploy.yml
```

`@settgast/ui` is consumed as the **published npm package** (`@settgast/ui@0.2.0`, see
`pnpm-workspace.yaml`), not a workspace member — it is developed in the standalone `settgast-ui`
repo and republished there; promotion brief for pending token changes: `docs/DESIGN_Q4.md` §6.

## Commands

```bash
pnpm install                         # all workspace deps, incl. @settgast/ui from npm
pnpm --filter @dynamica/app dev      # dev server, localhost:5173
pnpm build                           # build everything
pnpm typecheck
pnpm --filter @dynamica/app test     # app tests only (pnpm test runs all)

# Data pipeline (outputs {correlation,returns,prices}.json):
python scripts/fetch_data.py                                   # preset tickers
python scripts/fetch_data.py --tickers SPY BND GLD --period 5y
pip install -r scripts/requirements.txt
```

## Gotchas & non-obvious behavior

**`@settgast/ui` source of truth.** Consumed here as a plain npm dependency (`^0.2.0`), not edited
in this repo. Import the bundled CSS as `import '@settgast/ui/styles'`. Component/token changes go
into the standalone `settgast-ui` repo and land here on its next npm publish.

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
- `#/studios/:studioId` — studio view (`quantviz` | `neurolearn` | `physim`); `/studios/signalviz`
  redirects to `/studios/physim`
- `#/map` — the cross-link Matrix (thesis visual + both browse axes + progress tracker); `/tools`
  redirects here
- `#/tools/:toolId` — cross-studio tool exhibit ("same idea, three fields")
- `#/quantviz` — the live model; URL state e.g. `?t=SPY:10,BND:50&range=2Y&w=90`

## Model catalog (`apps/dynamica/src/models/`)

`registry.ts` is the single source of truth; `index.ts` exposes selectors (`modelsByStudio`,
`modelsByTool`, `crossLinks`) that drive both navigation views automatically. Add a model by
appending one `ModelEntry` — no other wiring needed.
