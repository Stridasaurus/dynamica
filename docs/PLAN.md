# Dynamica — Build Plan (M1 launch bar)

> Execution plan for the next several build sessions. Sits **below** `docs/MANIFESTO.md`
> (the single source of truth) and **above** the per-module SPECs the manifesto's closing
> section implies. Written 2026-07-07 (Fable planning session). Decisions here are locked
> unless a later session records a superseding one; the build queue is the ordered work.
>
> **What this document is for:** an executing agent (Sonnet) should be able to open this,
> pick the top unfinished queue item, write its SPEC(s) if not yet written, and build — with
> every cross-cutting decision already made so no session re-litigates naming, tags, or scope.

---

## 1. The launch bar (what "done for August 2026" means)

**Target: Milestone 1 — one complete `correlation` triple, polished, no broken surfaces.**
This is the smallest credible portfolio artifact and the honest one: it *proves the thesis*
(same equation across three substrates) rather than gesturing at breadth. Everything gets cut
against this bar. M2's four-triple launch slice is explicitly **not** the August target —
RV-prediction and IV Observatory carry the quant-applications portfolio alongside it, so
Dynamica competes on quality of the one triple, not model count.

**M1 is done when all of:**
1. Three live `correlation` models — one per studio — each obeying the manifesto anatomy.
2. The `/tool/correlation` page assembles the triple with connective narrative (the "wait, those
   are the same equation?" payoff).
3. All three import the **one** canonical `lib/correlation.ts` (S2 registry check passes — no
   reimplementation).
4. One design pass has resolved the "harsh" visual language (see §4).
5. S1–S9 hold over the three shipped models (tests green, offline-safe, phone-safe, shareable URL,
   ≤250 KB bundle).

**Deliberately deferred past August:** eigenportfolios, LIF-as-flagship, the convolution /
stochastic / dynamical-systems triples (M2), the Hawkes triple (§5). They stay in the registry/
content plan as the roadmap, not the launch scope.

---

## 2. Locked decisions

These close every open question that was blocking build sessions. Each is final for M1.

### 2.1 The six post-review items (from the 2026-07-04 Sonnet review)

| # | Item | Decision |
|---|------|----------|
| R1 | `nl-lif` tagged `stochastic` but built as deterministic cable+threshold | **Drop the `stochastic` tag.** LIF as built has no noise term; the tag makes a cross-link the model can't honor (S2 = "no cross-link is a lie"). If a noisy-input variant is ever added, re-tag then. LIF is also **not** an M1 model — see §3 — so this is a registry-hygiene fix, do it in the R-items pass. |
| R2 | CorrelationLab time-range selector buried in the Returns section | **Move it adjacent to Summary Statistics.** Time range scopes the whole analysis, not just returns; it belongs with the top-level summary controls. Layout-only change in `QuantVizPage.tsx` / the relevant panel. |
| R3 | Visual design reads "harsh" | See §4 — sequenced, not a one-line fix. |
| R4 | `qv-correlation-lab` tagged `networks` (a secondary, non-core tool) renders a "Networks" chip that points at nothing on the Map | **Drop the `networks` tag from `qv-correlation-lab`.** Do not promote `networks` to core (it doesn't span all three studios with a clean triple — it's finance/graph-heavy). The manifesto already lists `networks` as tag-only; a tag-only tool should not render a Map-linking chip. **Also a shell/Matrix fix:** secondary tags must render visually distinct from core-tool chips and must not imply a Map cell. Capture that rule in the model-anatomy SPEC. |
| R5 | Is "Map"/"framework"/"tool" the right vocabulary for the browse-by-math axis? | **Keep "Tool" as the glossary term for the math capability (matches the manifesto §9 glossary), and keep "Map" as the name of the cross-link matrix surface.** Rationale: the manifesto already commits to `Tool` as the registry `ToolId` and "browse by tool"; renaming ripples through registry, code, and every SPEC for no proven gain. "Framework" was never adopted. This item is **resolved as: no change** — recorded so it stops re-surfacing. (If Strider later wants a warmer public-facing word, it's a display-label swap in nav copy only, never a `ToolId` change.) |
| R6 | SiteFooter nav not working + visually asymmetric (Studios column vs Explore column whose "By studio" duplicates it) | **Rebuild the footer.** Functional bug fix (the reported broken links) + layout rebalance. Decision on content: Studios column (3 studio links) + Explore column (**By tool / Map**, About) — drop the duplicated "By studio" link from Explore since the Studios column already is browse-by-studio. Do this in the R-items pass. |

### 2.2 Naming & taxonomy

- Third studio is **PhySim** everywhere. The code migration `signalviz → physim` is **already done**
  (commit `e3bfca9`, 2026-07-04). Registry, routes, theme all say `physim`. No further rename work.
- Tool slugs are the manifesto §5 set, frozen: `correlation`, `fourier`, `convolution`, `stochastic`,
  `dynamical-systems`, `linear-algebra`, `detection`, `information`. Secondary tags-only:
  `distributions`, `markov`, `optimization`, `networks`.
- **The correlation triple's PhySim leg is the magnetometer coherogram** (`ph-coherogram`), already a
  registry stub. Coherence = frequency-resolved correlation → it carries both `correlation` and
  `fourier` tags; for M1 it ships as the `correlation` leg (the `fourier` triple is M3+). This also
  bridges to mag-GIBF and puts real geophysical data on the site.

### 2.3 Registry hygiene (fold into the R-items pass, before building models)

- `qv-correlation-lab`: tags become `['correlation']` (drop `networks`).
- `nl-lif`: tags become `['dynamical-systems']` (drop `stochastic`).
- No other registry entries change for M1.

---

## 3. Build queue (ordered)

Each item is a bounded session. **Do them in order** — the shell is carved out during the first
model build, not designed in the abstract (manifesto §6 migration path step 2).

**Q0 — R-items + registry-hygiene pass** *(no new models)*
Land R1, R2, R4, R6 and the §2.3 tag edits. Small, mechanical, unblocks a clean base. Includes the
Matrix/shell rule that secondary tags don't render a Map-linking chip (R4). Verify the S2 registry
check still passes after tag edits.

**Q1 — Carve out the Model Shell + build the NeuroLearn correlation leg (`nl-cross-correlogram`)**
The manifesto's M1 NeuroLearn model: **Cross-Correlogram & Functional Connectivity** — correlation
between spike trains reveals who drives whom. This is the first *new* model, so it's where
`src/shell/` gets extracted (URL-state codec, anatomy skeleton, shared controls) rather than invented
abstractly. Add the registry entry (studio `neurolearn`, tools `['correlation']`, status `planned`→
`live` on completion). Simulation-first (manifesto §8): generate spike trains client-side, no data
layer needed. **Must import `lib/correlation.ts`** — the cross-correlogram is the same Pearson/
cross-correlation core applied at lags. If the core lacks a lagged cross-correlation export, add it to
`lib/correlation.ts` with known-value tests (S1), do not write a second correlation function.

**Q2 — Build the PhySim correlation leg (`ph-coherogram`)**
Port `Sites/magnetometer-coherogram` (vanilla JS + Web Worker DSP) into a Dynamica model on the shell
from Q1. Coherence is frequency-resolved correlation on real magnetometer data. Graceful degradation
is load-bearing here (real geophysical data → snapshot → labeled synthetic, S5). The coherence
computation shares the correlation core; the frequency resolution adds an FFT step (this is why it
also carries `fourier`). Registry entry already exists as a stub — flip to `live` on completion.
*Open sub-decisions to settle at build time (from nav-plan §7):* coherogram title, whether SuperMAG
data is included in the shipped snapshot.

**Q3 — Build the `/tool/correlation` page (the triple exhibit)**
`ToolPage.tsx` already exists and derives from the registry. This session writes the **connective
narrative** that frames CorrelationLab + cross-correlogram + coherogram as one operation. This is the
S7 "wow" — the editorial, non-automatable bar. It's the actual product; budget real attention.

**Q4 — Design pass (see §4)**
After the triple is functionally complete, one pass fixes the "harsh" visual language across all
surfaces, potentially touching `@settgast/ui`.

**Q5 — M1 acceptance sweep**
Verify S1–S9 over the three models: tests green, S2 registry check passes, offline render, phone
layout, URL round-trip, bundle ≤250 KB. Ship.

---

## 4. Design sequencing (R3) — recommendation

**Recommended: design pass *after* the M1 triple is functionally complete (Q4), not before.**

Reasoning, since you asked for guidance:
- The launch bar is "M1 triple **+ polish**" — the harsh-design concern *is* the polish gate, so it
  can't be skipped, but it also shouldn't front-run the models.
- Doing it first means designing the system against one existing model (CorrelationLab) and two
  imagined ones — you'd be calibrating tokens against surfaces that don't exist yet.
- The retrofit cost people fear (build models, then restyle them) is **small here**: only two new
  models get built before the pass, and both wear the same shell, so a token/`@settgast/ui` change
  propagates through the shell rather than requiring per-model rework. The shell is the leverage point
  that makes "build then polish" cheap.
- The design pass is a **Claude Design session** (Strider's stated preference — he liked the
  Claude.ai design UI), run against the three real, populated surfaces. If it implicates
  `@settgast/ui` itself, that change lands in the component library and every Dynamica surface inherits
  it — which is exactly why the shell-first ordering pays off.

**Caveat that would flip this:** if the harshness is bad enough that building two more models in it is
demoralizing or the screenshots would embarrass, do a *quick* token-level pass first (color ramp,
spacing, contrast) and save the deep restyle for Q4. That's a 30-minute triage, not the real pass.
Left to Strider's eye at Q1 start.

---

## 5. The Hawkes hook (reserved, not scheduled)

Dynamica will *eventually* host a **Hawkes / self-exciting point-process triple** — the cross-substrate
identity order-flow clustering = neural spike-train bursting = geomagnetic/seismic cascades. This is a
natural Dynamica exhibit and on-thesis.

**But per both manifestos it is a future hook only, never an M1 dependency:**
- The Hawkes toolkit's own ROADMAP invariant: "Dynamica integration is a future hook only — never a
  phase, never a dependency."
- Where it will land when it comes: most likely a new **`point-processes`** tool (or under
  `stochastic` as a specialized model), with the toolkit's Ogata-thinning simulator becoming a
  Compute Core candidate (`lib/hawkes.ts`, pure + tested like every other tool). The triple would be
  order-flow (QuantViz) / spike-train bursting (NeuroLearn) / cascade (PhySim, bridges mag-GIBF again).
- **Blocked upstream:** the toolkit hasn't passed GOF on any real substrate yet (N3-alt frontier — see
  the toolkit ROADMAP; E6/E7 spikes pending). No Dynamica Hawkes work until the toolkit produces a
  passing, shippable engine. Do **not** scaffold `lib/hawkes.ts` speculatively.

Action for now: **none in code.** This section exists so a future session knows the seat is reserved
and where it goes, without any M1 work bending toward it.

---

## 6. SPEC index (what Sonnet writes, per the research cascade)

Per Strider's Roadmap→Manifesto→SPEC→Design methodology, the manifesto's closing section implies one
SPEC per module. For the **M1 slice**, only these are needed (the rest wait for M2+):

1. **`SPEC: compute-core`** *(may already be partly satisfied by the tested `correlation.ts`)* — the
   slug↔module convention, purity/signature rules, known-value fixtures (S1), and the registry
   import-check (S2). M1 needs the correlation core to expose lagged cross-correlation and the
   coherence primitive; spec those additions.
2. **`SPEC: model-anatomy`** — the shared shell carved out in Q1: metadata schema, control primitives
   (incl. mathjs expression input), viz-surface slots, narrative block, cross-link footer, URL-state
   codec (S6). **Must encode the R4 rule:** secondary tags render distinct from core-tool chips and do
   not imply a Map cell.
3. **`SPEC: registry-and-nav`** — registry schema + derivation of studio indexes, tool indexes, and
   the Map (S3/S4). Largely built already (`index.ts`, `Matrix.tsx`); spec captures the contract and
   the R4/R6 fixes.
4. **Per-model SPECs** — one each for `nl-cross-correlogram` and `ph-coherogram` (Q1/Q2), inheriting
   glossary, invariants, and `lib/correlation.ts` from the manifesto.

**`SPEC: data-layer`** is *not* on the M1 critical path — only `ph-coherogram` touches real data, and
its snapshot+synthetic fallback can be specced inside the per-model SPEC. Split the general data layer
out at M2 when a second data-backed model appears (manifesto §6 migration step 3).

Cascade-lint: run `claude-dotfiles/scripts/validate_cascade.py` on the produced SPEC/design artifacts.

---

## 7. Notes for the executing agent

- **Don't widen past M1.** The registry was deliberately trimmed to live+next-up (commit metadata,
  2026-07-03). Resist adding M2 models "while you're in there."
- **The one-function rule is the whole point** — if you find yourself writing a second correlation
  implementation for the coherogram or the correlogram, stop: extend `lib/correlation.ts` instead.
  That shared import is what makes the thesis *true* rather than asserted (S2, manifesto §7).
- **Simulation-first for NeuroLearn/PhySim compute**, data-layer only for QuantViz (manifesto §8).
- Every model ships shareable (URL codec), offline-safe, phone-safe before it's "done" — these are
  merge gates, not polish.
