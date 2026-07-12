# Design pass Q4 — resolving the "harsh" visual language

> **Layer:** design decisions (PLAN.md Q4 / R3). Written 2026-07-12 (Fable frontier
> session) against the three real, populated M1 surfaces (CorrelationLab, the
> `nl-cross-correlogram`, the `ph-coherogram`) now that the triple is functionally
> complete. This document is the *decision record*; the token changes it specifies
> are implemented as a reversible dynamica-local override (see §5) and briefed for
> promotion into `@settgast/ui` (see §6).

## 1. Diagnosis — what actually reads "harsh"

The harshness is **not** in the component layouts or the information design — those are
clean. It is almost entirely in the **base color tokens** (`@settgast/ui`
`tokens.css`), which are built on four choices that each independently push toward a
clinical/severe feel, and compound:

1. **Pure white light background (`--color-bg: #ffffff`) against near-black text
   (`--color-text-primary: #111111`)** → **18.9 : 1** contrast. That is far above even
   WCAG AAA (7 : 1). Maximum contrast on pure white is the single strongest "harsh,
   clinical" signal in a UI — premium editorial interfaces deliberately sit lower, on
   an off-white ground with an off-black ink.
2. **Near-pure-black dark background (`--color-bg: #111111`) against `#f0f0f0` text**
   → **~17 : 1**. Near-black dark mode causes *halation* (light text visibly shimmers
   against very dark grounds) and reads harsh; both Apple HIG and Material explicitly
   steer away from pure black toward an elevated dark neutral.
3. **Weak background→surface separation in dark** (`#111111` → `#1a1a1a`, ~9 levels of
   lightness): Cards barely lift off the page, so the UI feels flat *and* severe at
   once.
4. **The coherogram's pure-black canvas mount (`bg-black` in `Heatmap.tsx`)**: a hard
   `#000000` rectangle butted against the card surface — a high-contrast seam. This is
   the specific "harsh exemplar" flagged at Q2. (The Inferno colormap itself is a
   perceptually-uniform scientific standard and stays; only its *mount* is the
   problem — Inferno's own floor is `rgb(0,1,4)`, so a pure-black frame adds a seam
   for no data reason.)

Non-issues, explicitly ruled out so they don't get "fixed": the accent blue, spacing
scale, radii, shadows, and Inter/JetBrains typography are all fine. The one *latent*
gap (no line-height / letter-spacing tokens) is noted as a follow-up in §7, not part
of this pass.

## 2. The design principle for the fix

**Soften the extremes without losing legibility.** Every value below stays at AAA-grade
contrast (≥ 12 : 1 for primary text) — this is a *refinement*, not a contrast
reduction that trades away readability. The move is: pull the ground off its pure
white/black corner, pull the ink a step off its pure black/white corner, and open the
dark elevation gap so surfaces read.

## 3. Token decisions (exact values)

Same token *names* (backwards-compatible — nothing consuming a token breaks); refined
*values* only.

### Light theme

| Token | Was | **Now** | Why |
|---|---|---|---|
| `--color-bg` | `#ffffff` | **`#fbfbfa`** | Off-white with a hair of warmth; kills the clinical edge, near-imperceptible as a color |
| `--color-surface` | `#f9f9f9` | **`#f4f3f1`** | Keeps a clear step below the new (no-longer-white) bg |
| `--color-border` | `#e8e8e8` | **`#e6e4e0`** | Warmer, softer hairline |
| `--color-text-primary` | `#111111` | **`#1f1f1f`** | Softer ink; **16.3 : 1** on the new bg (was 18.9) — still deep AAA |
| `--color-text-secondary` | `#555555` | `#555555` | Unchanged (7.4 : 1, fine) |
| `--color-text-muted` | `#888888` | `#888888` | Unchanged (muted/large-text only) |

### Dark theme

| Token | Was | **Now** | Why |
|---|---|---|---|
| `--color-bg` | `#111111` | **`#16171a`** | Elevated, faintly cool neutral — not pure black; removes halation |
| `--color-surface` | `#1a1a1a` | **`#1e2024`** | Lifts clearly above the new bg (real elevation) |
| `--color-border` | `#2a2a2a` | **`#2e3136`** | Reads against the lifted surface |
| `--color-text-primary` | `#f0f0f0` | **`#e8e8e6`** | Softer; **14.9 : 1** on the new bg (was ~17) — reduces shimmer, still deep AAA |
| `--color-text-secondary` | `#999999` | `#999999` | Unchanged |
| `--color-text-muted` | `#666666` | `#666666` | Unchanged |

Contrast figures above are computed, not estimated (WCAG relative-luminance formula).

### The accent — a deliberate NON-decision (left for Strider's design session)

`--color-accent` (`#2563eb` light / `#3b82f6` dark) is the default Tailwind blue-600/500.
It is *functional* and not the source of the harshness, but it is **generic** — the one
place a considered brand hue would lift Dynamica from "clean" to "identity." This is a
subjective identity choice, not an objective legibility fix, so this pass **does not
change it** and instead hands three grounded options to the Claude Design session:
- **(a) Keep** the Tailwind blue — safe, zero risk.
- **(b) Slightly desaturate + cool** toward `#2f6fe0` / `#4a86f0` — same family, less
  "stock."
- **(c) Distinctive hue** — an indigo/violet (`#5b5bd6`-ish) reads more "mathematical
  instrument" and differentiates from the finance-blue every quant tool uses. This is
  the highest-identity, highest-subjectivity option; it wants Strider's eye in the
  live design UI, which is exactly the tool he prefers for this call.

The studio accent colors (`ModelEntry.color` per studio) are likewise identity choices
left to that session; §3's neutrals are the objective floor they sit on.

## 4. The coherogram mount fix (dynamica-local)

`Heatmap.tsx`: the canvas wrapper's `bg-black` → **`bg-[#0a0a0e]`** (a near-black that
matches the Inferno floor rather than a pure-black seam). The existing
`rounded-[var(--radius-md)] border border-[var(--color-border)]` stays — with the new
border token and the lifted mount, the heatmap sits *in* the card instead of punching a
hole in it. No colormap change (Inferno is correct and stays).

## 5. What was implemented this session (reversible, dynamica-local)

Because dynamica consumes the **published** `@settgast/ui@0.2.0` (tokens baked into its
shipped `dist`), the proper home for §3 (the library `tokens.css`) can only change via
an npm republish cycle (§6) — an outward-facing action left to Strider. To make the
improvement **now, safely, and reversibly**, the §3 values are applied as a
**dynamica-local override** in `apps/dynamica/src/index.css`: a `:root` block and a
`[data-theme='dark']` block that cascade *over* the library defaults (dynamica imports
`./index.css` after `@settgast/ui/styles.css`, so equal-specificity later-source wins).

- **Only dynamica is affected** (it is the sole `@settgast/ui` consumer today, and the
  destination all other sites port into anyway).
- **Fully reversible:** delete the override block to revert to library defaults.
- **The heatmap fix (§4)** is in `Heatmap.tsx` (dynamica-local regardless).

This is deliberately the *objective* half of the pass (legibility-grounded neutrals +
the seam fix). The *subjective* half (accent hue §3, studio palette personality) is
left intact for the Claude Design session, which can tweak the same override block
live.

## 6. Promotion brief — moving §3 into `@settgast/ui` (next publish, not this session)

When Strider next publishes the library (or asks a standard-tier session to):
1. Apply the §3 values to `packages/ui/src/tokens/tokens.css` (same names, new values).
2. `pnpm changeset` (minor bump — visual refinement, backwards-compatible token
   values, no API change) → `pnpm changeset version` → `pnpm release`.
3. `pnpm update @settgast/ui` in dynamica → **delete the override block** from
   `apps/dynamica/src/index.css` (§5), since the library now ships the refined values.
4. Verify the built dynamica surfaces are visually identical before/after the swap
   (the override and the library values are the same numbers, so this should be a
   no-op render — that equality *is* the test).

Until then the override is the source of truth and is correct; do not partially apply
(don't move some tokens to the library and leave others in the override — that splits
the source of truth).

## 7. Follow-ups (out of scope for Q4, logged so they aren't lost)

- **Tokenize line-height / letter-spacing** in `@settgast/ui` (`--leading-*`,
  `--tracking-*`) so text density is systematic rather than ad-hoc Tailwind classes.
  Small, and a real polish lever, but not a harshness fix.
- **Bundle ceiling:** total JS gzip is **247.5 KB against the ~250 KB S9 ceiling**
  (the charts vendor chunk alone is 109.8 KB). This design pass adds **zero** JS (CSS
  token values only). But any *future* component work must not blow the budget — the
  pressure valve is route-based code-splitting of the chart-heavy pages, deferred until
  a change actually needs the room. Flagged here because Q5 (M1 acceptance) checks S9.

## 8. Verification (this session)

- `npm run build` (dynamica): green after the override + heatmap change.
- Contrast values in §3 computed against the new grounds: primary text 16.3 : 1
  (light) / 14.9 : 1 (dark) — both deep AAA, softer than the 18.9/17 they replace.
- Full test suite unaffected (CSS-only + one className change): **115/115**.
- The change is CSS/className only — no logic, no new dependency, no bundle growth.
