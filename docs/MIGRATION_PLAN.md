# Dynamica — Port-and-Decommission Migration Plan

> Execution blueprint for absorbing the four standalone GitHub Pages repos —
> **correlationlab, magnetometer-coherogram, LIF-project, application-tracker** — into
> dynamica and decommissioning them. Written 2026-07-16 (Fable frontier session), per the
> vault frontier-queue row opened 2026-07-13 from Strider's 2026-07-12 confirmation that
> all four port in and then get decommissioned. Sits **below** `docs/MANIFESTO.md` and
> **beside** `docs/PLAN.md` (the M1 build plan). Each phase is executable by a cold
> standard-tier session; every cross-cutting judgment is locked in §2.

---

## 1. Read-first list (load before anything else)

1. This file, in full.
2. `dynamica/CLAUDE.md` — workspace layout, gotchas (note: P1 fixes its stale sections).
3. `docs/MANIFESTO.md` §4 (scope hard-nos — load-bearing for D2) and §7 (invariants).
4. `docs/PLAN.md` §1 (the M1 bar this plan gates on) and §7 (executor notes).
5. For P4 only: `LIF-project/CLAUDE.md` (the governing equation + the **protected
   notebook rule**) and `LIF-project/web-app/frontend/` (the existing static sim).
6. For P5 only: `application-tracker/CLAUDE.md` (domain layer, store, discovery
   pipeline, deploy chaining).
7. Vault note `[[claude-md-audit-protocol]]` (`obsidian/02-areas/claude-workflow/`) —
   its repo table drops a row as each repo is absorbed.

## 1a. State of the world (verified 2026-07-16, this session)

| Repo | Ported into dynamica? | Pages hosting | Scheduled CI | Linked from StriderSettgast.com |
|---|---|---|---|---|
| correlationlab | **Yes** — `qv-correlation-lab` live at `#/quantviz` | legacy, `gh-pages` branch | **Mon–Fri 13:00 UTC full redeploy** (duplicate live site + wasted CI) | Yes (`2-correlation-lab.md`) |
| magnetometer-coherogram | **Yes** — `ph-coherogram` live at `#/models/ph-coherogram` (real USGS data) | legacy, `main` branch root | none | Yes (`1-magnetometer-network-coherogram.md`) |
| LIF-project | **No** — `nl-lif` is a registry stub, `status: planned`, deliberately post-M1 | workflow (`pages.yml`, publishes `web-app/frontend`) | none (push-triggered) | Yes (`3-leaky-integrate-and-fire-neuron-simulator.md`) |
| application-tracker | **No** — and it is *not a model* (see D2) | workflow (`deploy.yml`) | **daily `discover.yml` cron** (job-listing sweep → commit → redeploy) | No (personal tool) |

Other verified facts the plan leans on:

- `apps/correlationlab` and `apps/lif-project` are **vestigial git submodules**: zero
  imports from either anywhere in `apps/dynamica/src` (grepped), and `deploy.yml`
  checks out with `submodules: false`. Removing them changes nothing in the build.
- `dynamica/CLAUDE.md` is stale in two places: it documents a `packages/ui` workspace
  member that **does not exist** (the app consumes the *published* `@settgast/ui@0.2.0`
  from npm — see `pnpm-workspace.yaml`), and it presents the submodules as structural.
- All five sites share the origin `https://stridasaurus.github.io` — **localStorage is
  origin-scoped, not path-scoped**, so the tracker's `appTrackerData.v1` data survives
  any path move automatically.
- Bundle is at **247.5 KB gzip against the ≤250 KB S9 cap** — near-zero headroom;
  this constrains P4 (see invariant I5).

---

## 2. Decisions locked (do not re-litigate)

- **D1 — Gate: nothing decommissions before M1 ships.** Q5 (the M1 acceptance sweep in
  `PLAN.md`) must be green first. Redirect stubs send visitors — including recruiters —
  to dynamica; they must land on a polished, accepted site. P1 (housekeeping) may run
  before Q5; P2 onward may not.
- **D2 — application-tracker ports as a sibling static app, never a registry model.**
  Manifesto §4 hard-nos exclude it from the product surface ("NO persistence beyond the
  URL" — the tracker is localStorage-centric; it is a personal tool, not a
  cross-substrate toy). It moves into the monorepo as `apps/tracker`, deploys under
  `https://stridasaurus.github.io/dynamica/tracker/` from the same gh-pages artifact,
  and appears **nowhere** in the registry, nav, or Map. The Dynamica *product* is
  untouched; the *repo* becomes the deploy vehicle. ⚠️ **Ratify with Strider before P5
  starts** — the 07-12 confirmation that it "ports into dynamica" was one word deep and
  predates this reading (stop-and-ask T1).
- **D3 — Uniform decommission pattern: freeze → redirect stub → portfolio link →
  archive. Never delete.** Archiving keeps the Pages site serving (the stub keeps
  redirecting indefinitely), kills scheduled crons, preserves history (including the
  protected LIF class-submission notebook), and is reversible. Deletion is not.
- **D4 — Redirects are static stubs.** github.io offers no server-side redirects. Each
  stub is one `index.html`: `<meta http-equiv="refresh">` + `<link rel="canonical">` +
  `location.replace(...)` + a visible fallback link. Old URL-hash state is not
  translated (the apps' state schemas differ; a translation layer is not worth building
  for decommissioned sites).
- **D5 — Both submodules are removed, not retained.** Verified vestigial (§1a). The
  original code lives on in the archived source repos.
- **D6 — `nl-lif` is a fresh build on the Model Shell, not a code copy.** The dynamica
  model follows the manifesto anatomy (simulation-first, URL-state codec, shell
  controls); the LIF-project `web-app` JS and the notebook are *references* for the
  math (`τ_m·dV/dt = −(V − V_rest) + R(t)·I(t)`, forward Euler, parameter functions
  I(t)/V_thr(t)/R(t)), not source to transplant. The notebook itself is never modified
  (its protected-file rule holds until the moment the repo is archived, and archiving
  preserves it verbatim).
- **D7 — Phase order: correlationlab → magnetometer-coherogram → LIF → tracker.**
  Pure decommissions first (replacements already live; zero build risk; correlationlab
  first because it burns a Mon–Fri CI cron and serves a duplicate site). The one real
  model build (P4) next. The live personal tool (P5) last — it is in daily use for the
  application campaign and moves only after its new home is verified.
- **D8 — The discovery cron migrates with the workflow_run chaining pattern.** Pushes
  made with `GITHUB_TOKEN` do not trigger other workflows — this is exactly why
  dynamica's `deploy.yml` already has a `workflow_run` trigger on "Refresh Market
  Data". The migrated discovery workflow gets the same treatment: cron sweep → commit
  `discovered-jobs.json` `[skip ci]` → `deploy.yml` fires via `workflow_run`.
- **D9 — StriderSettgast.com project cards are updated in the same phase as each
  stub** (link swap to the dynamica model page). Whether the three cards later collapse
  into one "Dynamica" card is Strider's portfolio-content call, out of scope here.

**Non-goals:** no M2 models "while you're in there"; no `settgast-ui` repo
consolidation (that's `DESIGN_Q4.md` §6's brief); no new tools or registry entries
beyond flipping `nl-lif` to `live`; no custom domain / Cloudflare work.

---

## 3. Ordered build queue

Each phase is one bounded session. **P1 may run any time; P2–P5 gate on Q5 (D1).**

### P0 — Preflight (start of every phase)
`git fetch` + ff-pull dynamica and the phase's source repo on the executing machine
(stale clones bit the 07-16 session: the Mac was 19 behind). Confirm Q5 status in
`PLAN.md`/vault before P2+. Confirm the phase's prior phases actually landed
(check the Done-log at the bottom of this file, which each phase appends to).

### P1 — Dynamica housekeeping (no behavior change)
1. Remove both submodules: `git rm apps/correlationlab apps/lif-project`, delete
   `.gitmodules`, commit.
2. Fix `CLAUDE.md`: delete the submodule lines and the `packages/ui` workspace claim;
   document that `@settgast/ui` is consumed as a published npm package (promotion
   brief: `DESIGN_Q4.md` §6); delete the "Submodules need `git submodule update`" line.
3. **Verify:** `pnpm install && pnpm build && pnpm --filter @dynamica/app test` all
   green; a fresh `git clone` (no submodule init) builds; site deploys and renders.

### P2 — Decommission correlationlab
1. On `main`: delete `.github/workflows/deploy.yml` (kills the Mon–Fri cron cleanly
   rather than relying on archive-disable), commit.
2. Push the redirect stub as the final `gh-pages` commit — target
   `https://stridasaurus.github.io/dynamica/#/quantviz`. Include `404.html` as a copy
   of the stub.
3. StriderSettgast.com: update `src/content/projects/2-correlation-lab.md` `link:` to
   the dynamica URL; deploy; verify the card links through.
4. Archive the repo: `gh repo archive Stridasaurus/correlationlab -y`.
5. **Verify:** `curl -s https://stridasaurus.github.io/correlationlab/ | grep dynamica`
   shows the stub (Pages can lag a minute); browser follow-through lands on the
   QuantViz model; `gh api repos/Stridasaurus/correlationlab --jq .archived` → `true`.

### P3 — Decommission magnetometer-coherogram
1. On `main` (Pages serves this branch's root directly): replace `index.html` with the
   redirect stub — target `https://stridasaurus.github.io/dynamica/#/models/ph-coherogram`
   — and replace `about.html` with the same stub. Commit ("decommissioned — ported to
   dynamica ph-coherogram; full app in history").
2. StriderSettgast.com: update `1-magnetometer-network-coherogram.md` `link:`; deploy.
3. Archive the repo.
4. **Verify:** as P2.5, against both `/` and `/about.html`.

### P4 — Port LIF, then decommission LIF-project
1. Write the `nl-lif` per-model SPEC (inherits `PLAN.md` §6.4 conventions): governing
   equation + units table from `LIF-project/CLAUDE.md`, parameter-function controls
   (I(t), V_thr(t), R(t) — mathjs expression inputs per the model-anatomy spec, **not**
   `eval`), 3-panel viz (V_m + threshold, input current, spikes), URL-state codec.
2. Build it on the Model Shell; registry entry flips `planned` → `live`
   (tags stay `['dynamical-systems']` — the R1 decision; no `stochastic`).
3. **Bundle check (I5):** if the gzip total exceeds 250 KB, convert model pages to
   route-level `React.lazy` imports — that is the sanctioned fix, not raising the cap.
4. Decommission: replace `LIF-project/web-app/frontend/` contents with the stub
   (its `pages.yml` publishes that directory), targeting the live `nl-lif` route;
   let the workflow deploy; update `3-leaky-integrate-and-fire-neuron-simulator.md`;
   archive the repo. The notebook is untouched throughout.
5. **Verify:** dynamica tests + build green; `nl-lif` renders on phone width + offline;
   URL round-trip works; old URL redirects; repo archived.

### P5 — Port application-tracker, then decommission it *(gate: D2 ratified — T1)*
1. Move the app to `apps/tracker` (own `package.json`, added to `pnpm-workspace.yaml`;
   npm→pnpm is mechanical — keep Vitest config and the 58+ tests green). The
   `discovery/` directory moves with it.
2. Build with `VITE_BASE=/dynamica/tracker/`. In `deploy.yml`, compose one publish
   directory: app dist at root + tracker dist under `tracker/`.
3. Migrate `discover.yml` into dynamica: same daily cron, runs `node
   apps/tracker/discovery/run.js`, commits `apps/tracker/public/discovered-jobs.json`
   `[skip ci]`, chains to deploy via `workflow_run` (D8). Move the four Actions
   secrets (`USAJOBS_API_KEY`, `USAJOBS_EMAIL`, `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`) to
   the dynamica repo — **secrets do not transfer; Strider must re-enter them** (T5).
4. Cutover, in this order: (a) Strider exports a JSON backup from the old app
   (⋯ menu) — belt-and-suspenders only; (b) deploy the new path and verify **his
   existing data appears at the new URL with zero import** (same origin, same
   localStorage key); (c) only then stub the old site (replace the deploy workflow's
   artifact with the stub, or commit a static stub build) and archive the repo.
5. **Verify:** new URL shows Strider's live board (his confirmation, not a fresh-seed
   render); next scheduled discovery run commits + redeploys + fresh listings appear;
   old URL redirects; repo archived.
6. Timing note: the tracker is load-bearing for the Aug-2026 campaign. The cutover is
   low-risk (data is origin-scoped, the old site keeps working until step 4c), but run
   P5 on a quiet day, not the week applications go out.

---

## 4. Invariants / must-nots

- **I1 — Replacement before removal.** No stub, no archive, until the dynamica
  replacement is live and verified (P2/P3: already live; P4/P5: their port steps).
- **I2 — Archive, never delete** (D3). The LIF notebook's protected-file rule survives
  as an archived artifact; history is the provenance record.
- **I3 — localStorage is shared across every path on the origin.** During the P5
  overlap window the old and new tracker read/write the *same* `appTrackerData.v1`
  key. Do not bump `SCHEMA_VERSION` or run a store migration in the same change as the
  move — cutover must be a pure relocation of identical code.
- **I4 — Stub ordering.** Kill or bypass a repo's deploy automation *before* pushing
  its stub, or the next scheduled/triggered run repaves the stub with the full site
  (correlationlab's Mon–Fri cron is the live instance of this trap).
- **I5 — S9 bundle cap (≤250 KB gzip) is a merge gate**, and headroom is ~2.5 KB.
  Route-level lazy loading is the approved response; widening the cap is not.
- **I6 — The one-function rule holds for nl-lif**: any math the model shares with
  existing cores extends `lib/` with tests — never a private reimplementation.
  (LIF is `dynamical-systems`; it likely shares nothing with `correlation.ts`, but the
  Euler stepper becomes `lib/` material the moment a second dynamics model wants it.)
- **I7 — No `eval` enters the app.** The notebook's string-`eval` parameter functions
  are a Jupyter-era convenience; the model uses the shell's mathjs expression input.
- **I8 — Fix flags where they live.** Each phase that changes external reality updates
  the things that assert the old reality in the same pass: the StriderSettgast.com card
  (D9), this file's Done-log, and (vault side) the `[[claude-md-audit-protocol]]` repo
  row + frontier-queue status.

## 5. Stop-and-ask triggers

- **T1** — P5 reached and Strider has not ratified D2 (tracker = sibling app, not model).
- **T2** — Strider's data does *not* appear at the new tracker URL at P5.4b, or any
  sign of localStorage divergence during overlap. Halt before 4c; the old site is
  still intact.
- **T3** — P4 bundle exceeds 250 KB even after route-level lazy loading.
- **T4** — An old repo turns out to have live consumers beyond the known ones (inbound
  links, an open PR/issue, a fork depending on it) — surface before archiving.
- **T5** — Discovery secrets: if any of the four keys can't be re-entered into
  dynamica's Actions secrets, ask rather than shipping a silently degraded sweep.
- **T6** — Any temptation to touch the published `@settgast/ui` or the notebook file.

## 6. Done-check

The migration is complete when **all** of:

1. Four repos archived on GitHub; none deleted.
2. All four old URLs serve redirect stubs that land on the correct dynamica surface
   (curl + browser verified, recorded in the Done-log below).
3. StriderSettgast.com's three project cards link to dynamica pages.
4. `nl-lif` is `live` in the registry, S1–S9 hold (tests, offline, phone, URL
   round-trip, bundle ≤250 KB).
5. The tracker runs at `/dynamica/tracker/` with Strider-confirmed data continuity,
   and a post-migration scheduled discovery run has completed end-to-end
   (sweep → commit → redeploy → fresh listings visible).
6. Dynamica CI is green across all three workflows (deploy, data-refresh, discovery).
7. Vault closed out: frontier-queue row moved to Log; `[[claude-md-audit-protocol]]`
   decommissioned rows dropped; the Dynamica entry in `active-projects.md` reflects
   the new state.

## Done-log (executor appends one line per phase landed)

- *(empty — no phase executed as of 2026-07-16)*
