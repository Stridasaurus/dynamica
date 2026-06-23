# Dynamica — Studio & Mathematical-Tool Content Plan

## Context

Dynamica is a portfolio of interactive toy models across **three fields** — finance, neuroscience,
signal processing — surfaced as three studios: **QuantViz**, **NeuroLearn**, **SignalViz**. The
project's distinctive bet is **dual navigation**: a visitor can browse *by studio* (a domain) **or**
*by mathematical tool* (the connective tissue). The same tool — correlation, Fourier, convolution —
recurs across all three fields, and the site makes that tangible (e.g. correlation measures
diversification in finance, picks out a global wavefront in a sensor array, and reveals co-firing in
neurons).

The repo is currently a shell: a working **QuantViz correlation tool** exists
(`apps/dynamica/src/lib/correlation.ts`, `components/quantviz/*`), NeuroLearn is a "coming soon"
stub, and SignalViz does not exist yet. The landing page already sketches a "Shared Mathematical
Foundation" (`pages/LandingPage.tsx`) — that section is the embryonic version of the math taxonomy.

**Goal of this document:** produce four deliberately *over-generated* lists so the weakest ideas can
be cut. The Math Taxonomy is presented **first** because it is the spine that the three studio lists
hang off of. Every studio item is tagged with its math tools, a feasibility rating for a static
client-side React site, and a strength tier to make cutting fast.

### Legend
- **Strength:** 🟢 flagship (keep) · 🟡 solid · 🔴 marginal (cut candidate)
- **Feasibility (static, in-browser):** `E` easy · `M` medium · `H` hard
- **Tags** reference the Math Taxonomy IDs (M1–M14) below.

---

## LIST D — Mathematical Taxonomy (the "browse by tool" spine)

Chosen so tools recur across studios. The **8 core** tools each appear in *all three* studios — these
are the spine and the strongest argument for the dual-nav concept. The remaining are secondary /
optional and can be folded into a core tool or cut.

### Core 8 (each spans all three studios)
- **M1 · Correlation & Covariance** — Pearson, auto/cross-correlation, covariance matrices. *The
  flagship tool; the user's own example.* 🟢
- **M2 · Fourier & Spectral Analysis** — DFT/FFT, power spectral density, spectrograms. 🟢
- **M3 · Convolution & Filtering** — impulse response, LTI systems, FIR/IIR, kernels, smoothing. 🟢
- **M4 · Stochastic Processes** — random walks, Brownian/Wiener, Ornstein–Uhlenbeck, Poisson. 🟢
- **M5 · Differential Equations & Dynamical Systems** — ODEs, phase planes, fixed points, limit
  cycles, bifurcations. *The literal root of "Dynamica."* 🟢
- **M6 · Linear Algebra & Dimensionality Reduction** — PCA/SVD, eigenvectors, decompositions. 🟢
- **M7 · Detection & Estimation** — matched filter, Kalman filter, signal detection theory,
  likelihood. *Beautiful cross-link: psychophysics ↔ radar share SDT.* 🟢
- **M8 · Information Theory & Entropy** — Shannon entropy, mutual information, channel capacity. 🟢

### Secondary 6 (strong in 1–2 studios; cut or merge candidates)
- **M9 · Probability Distributions & Tails** — Gaussian vs heavy tails, power laws, extreme values. 🟡
- **M10 · Markov Processes & State Models** — Markov chains, HMMs, regime switching, Viterbi. 🟡
- **M11 · Optimization** — gradient descent, convex optimization, Lagrange multipliers. 🟡
- **M12 · Networks & Graph Theory** — adjacency, graph Laplacian, community detection. 🟡 *(pairs
  naturally with M1; consider merging into "Correlation & Networks")*
- **M13 · Time-Frequency & Wavelets** — STFT, wavelet transform, scaleograms. 🔴 *(largely a child of
  M2; recommend merging into Fourier rather than a standalone category)*
- **M14 · Nonlinear Dynamics & Chaos** — Lyapunov exponents, attractors, fractals, criticality. 🔴
  *(fun but speculative in finance; recommend folding into M5)*

**Recommended cut:** ship the Core 8 as first-class tool pages; treat M9–M12 as tags only (no
dedicated page yet); merge M13→M2 and M14→M5.

---

## LIST A — QuantViz Studio (Finance)

*Existing:* correlation heatmap, cumulative returns, rolling-window correlation, summary stats
(Sharpe/vol/return). These map to items A1 and the Summary utilities below.

| # | Toy model | One-line concept | Tags | Feas | Strength |
|---|-----------|------------------|------|------|----------|
| A1 | **Diversification / Correlation Lab** *(exists)* | Rolling correlation heatmap; correlation as a measure of portfolio diversity | M1, M12 | E | 🟢 |
| A2 | **Random Walk vs. Real Markets** | GBM simulator overlaid on real prices; test the random-walk hypothesis | M4 | E | 🟢 |
| A3 | **Monte Carlo Portfolio Paths** | Simulate thousands of future paths; distribution of outcomes & ruin risk | M4, M9 | M | 🟢 |
| A4 | **Efficient Frontier / Mean-Variance Optimizer** | Drag weights, trace the frontier, find the tangency portfolio | M11, M6 | M | 🟢 |
| A5 | **Factor / Eigenportfolio Decomposition** | PCA of returns — what hidden factors drive the market | M6 | M | 🟡 |
| A6 | **Mean Reversion & Pairs Trading** | OU process on a spread; entry/exit bands; Kalman-tracked hedge ratio | M5, M4, M7 | M | 🟢 |
| A7 | **Fat Tails & Value-at-Risk** | Empirical return distribution vs Gaussian; why "6-sigma" days happen | M9 | E | 🟢 |
| A8 | **Moving Averages as Filters** | SMA/EMA as convolution; the smoothing-vs-lag tradeoff | M3 | E | 🟡 |
| A9 | **Volatility Clustering (GARCH-lite)** | Autocorrelation of squared returns; calm and storm regimes | M1, M4 | M | 🟡 |
| A10 | **Regime Detection** | Bull/bear/sideways states via volatility thresholds or a 2-state HMM | M10 | M | 🟡 |
| A11 | **Correlation Networks / Systemic Risk** | Asset graph from the correlation matrix; clusters & contagion | M12, M1 | M | 🟡 |
| A12 | **Yield-Curve PCA** | Level / slope / curvature as the 3 dominant factors | M6 | M | 🔴 |
| A13 | **Spectral Analysis of Returns** | PSD of returns — are there real cycles, or just noise? | M2 | M | 🔴 |
| A14 | **Entropy & Diversification** | Portfolio entropy as a diversity metric vs naive correlation | M8 | E | 🔴 |
| — | **Summary Stats** *(exists, utility)* | Sharpe, annualized vol/return, drawdown | M9 | E | (keep, support) |

**Cut candidates:** A12 (niche/fixed-income-specific), A13 (weak/contested signal), A14 (subtle,
hard to make visceral). **Flagship set:** A1, A2, A3, A4, A6, A7.

---

## LIST B — NeuroLearn Studio (Neuroscience)

*Existing:* LIF neuron simulator stub (ported from the `lif-project` submodule) → item B1.

| # | Toy model | One-line concept | Tags | Feas | Strength |
|---|-----------|------------------|------|------|----------|
| B1 | **Leaky Integrate-and-Fire Neuron** *(stub)* | Membrane potential charging to threshold; step/ramp/sine input | M5, M4 | E | 🟢 |
| B2 | **FitzHugh–Nagumo Phase Plane** | 2D excitable system; nullclines, limit cycles, "all-or-none" spikes | M5 | M | 🟢 |
| B3 | **Hodgkin–Huxley Action Potential** | Ion-channel conductances generate the real spike waveform | M5 | M | 🟡 |
| B4 | **Spike-Train Statistics** | Poisson spiking, ISI histograms, Fano factor, refractory effects | M4, M9 | E | 🟢 |
| B5 | **Cross-Correlogram / Functional Connectivity** | Correlation between neurons → who drives whom | M1 | E | 🟢 |
| B6 | **Receptive Fields & Convolution** | A visual receptive field as a convolution kernel; edge detection | M3 | M | 🟢 |
| B7 | **Brain Rhythms / EEG Explorer** | Delta–gamma bands; spectrogram of an oscillating signal | M2, M13 | M | 🟢 |
| B8 | **Drift-Diffusion Decision Model** | Evidence accumulation to a bound; predicts reaction-time distributions | M4, M7 | M | 🟢 |
| B9 | **Signal Detection Theory / Psychophysics** | d′, ROC curves, hits vs false alarms | M7 | E | 🟢 |
| B10 | **Hebbian Learning / STDP** | "Fire together, wire together"; spike-timing-dependent plasticity | M11 | M | 🟡 |
| B11 | **Population Dynamics / Neural Manifolds** | PCA of many neurons → low-dimensional state trajectory | M6 | M | 🟡 |
| B12 | **Neural Coding & Mutual Information** | How many bits about a stimulus does a spike train carry | M8 | M | 🟡 |
| B13 | **Wilson–Cowan E/I Oscillations** | Excitatory/inhibitory populations produce rhythms | M5 | M | 🔴 |
| B14 | **Hopfield Attractor Memory** | Energy landscape; pattern completion from a partial cue | M5, M6 | M | 🟡 |
| B15 | **Neural Avalanches / Criticality** | Power-law cascade sizes; brain at the edge of chaos | M9, M14 | M | 🔴 |

**Cut candidates:** B13 (overlaps B2/B7), B15 (speculative, hard to render compellingly), B3 (B2 is a
better pedagogical phase-plane and easier to build). **Flagship set:** B1, B2, B4, B5, B6, B8, B9.

---

## LIST C — SignalViz Studio (Signal Processing)

New studio. Signal processing is the natural *home* of many tools, which makes it the anchor that
"explains" why correlation/Fourier/convolution matter in the other two studios.

| # | Toy model | One-line concept | Tags | Feas | Strength |
|---|-----------|------------------|------|------|----------|
| C1 | **Fourier Builder / Spectrum Analyzer** | Add sines to build a signal; watch its spectrum form | M2 | E | 🟢 |
| C2 | **Convolution Visualizer** | Slide a kernel across a signal; impulse response & LTI intuition | M3 | E | 🟢 |
| C3 | **Digital Filter Designer** | FIR/IIR low/high/band-pass; frequency response live | M3, M2 | M | 🟢 |
| C4 | **Sampling & Aliasing (Nyquist)** | Under-sample a signal and watch a wagon-wheel alias appear | M2 | E | 🟢 |
| C5 | **Spectrogram / Time-Frequency Studio** | STFT of chirps, speech, music; the trade between time & freq | M2, M13 | M | 🟢 |
| C6 | **Cross-Correlation & Time-Delay Estimation** | Find an echo/lag between two signals | M1, M7 | E | 🟢 |
| C7 | **Sensor Array / Beamforming** | Many sensors; correlation picks out a global wavefront & its direction | M1, M6 | H | 🟢 |
| C8 | **Matched Filter / Radar Detection** | Detect a known pulse buried in noise | M7, M1 | M | 🟢 |
| C9 | **Kalman Filter Tracker** | Track a noisy moving target; predict–update loop | M7 | M | 🟡 |
| C10 | **Noise & SNR Lab** | White/pink/brown noise; denoise by filtering & averaging | M4, M3 | E | 🟡 |
| C11 | **PCA/ICA Source Separation (Cocktail Party)** | Unmix overlapping signals | M6 | H | 🟡 |
| C12 | **Channel Capacity & Coding** | Shannon limit; bits through a noisy channel; error correction | M8 | M | 🟡 |
| C13 | **Wavelet / Multi-Resolution** | Scaleogram; catch transients Fourier misses | M13 | H | 🔴 |
| C14 | **Modulation (AM/FM)** | Carrier, modulate, demodulate; how radio works | M2 | M | 🔴 |
| C15 | **Phase-Locked Loop / Oscillator Sync** | Two oscillators lock phase; control & synchronization | M5 | M | 🔴 |
| C16 | **Transform Coding / Compression (DCT)** | A JPEG-style demo; throw away coefficients, watch quality drop | M2, M8 | M | 🟡 |

**Cut candidates:** C13 (subsumed by C5 if M13 is merged), C14 (narrow), C15 (better placed as a
dynamical-systems cross-link than a standalone). **Flagship set:** C1, C2, C3, C4, C6, C7, C8.

---

## The Cross-Link Matrix (the payoff of dual navigation)

Each Core tool's page becomes a "same idea, three fields" exhibit. These eight triples are the
strongest demonstrations of the project's thesis:

| Tool | QuantViz | NeuroLearn | SignalViz |
|------|----------|------------|-----------|
| **M1 Correlation** | Diversification (A1) | Neuron co-firing (B5) | Beamforming / delay (C6, C7) |
| **M2 Fourier** | Return cycles (A13) | Brain rhythms (B7) | Spectrum analyzer (C1) |
| **M3 Convolution** | Moving averages (A8) | Receptive fields (B6) | Filter designer (C2, C3) |
| **M4 Stochastic** | Random walk / GBM (A2) | Spike noise / Poisson (B4) | Noise & SNR (C10) |
| **M5 Dynamical systems** | Mean reversion (A6) | LIF / FitzHugh-Nagumo (B1, B2) | PLL / oscillators (C15) |
| **M6 Linear algebra/PCA** | Eigenportfolios (A5) | Neural manifolds (B11) | Source separation (C11) |
| **M7 Detection & estimation** | Pairs trading / Kalman (A6) | Signal detection theory (B9) | Matched filter / radar (C8) |
| **M8 Information theory** | Entropy diversification (A14) | Neural coding (B12) | Channel capacity (C12) |

> Note: M1, M3, M5, M7 produce the *cleanest* triples and the most surprising "wait, those are the
> same equation?" moments — prioritize these four tool pages for launch.

---

## Recommended launch slice (if cutting hard)

- **Tools:** M1 Correlation, M3 Convolution, M5 Dynamical Systems, M7 Detection & Estimation (the
  four cleanest triples) + M2 Fourier and M4 Stochastic as fast-follows.
- **QuantViz:** A1 (done), A2, A6, A7.
- **NeuroLearn:** B1 (port stub), B2, B5, B9.
- **SignalViz:** C1, C2, C6, C8.
- This yields ~12 models that *together* fully populate 4 tool pages with a complete cross-domain
  triple each — the minimum that proves the dual-nav concept end to end.

---

## Light site-architecture implication (not the focus, but it shapes content)

Dual nav means every model needs metadata: `{ id, title, studio, mathTags[], blurb, difficulty }`.
A single registry (e.g. `apps/dynamica/src/models/registry.ts`) can drive **both** the studio index
pages and the math-tool index pages from one source of truth, plus auto-generate the cross-link
matrix above. The existing landing-page "Shared Mathematical Foundation" section
(`pages/LandingPage.tsx`) becomes the entry point to the math-tool browse mode. This is noted so the
content lists stay registry-friendly; detailed implementation is out of scope for *this* plan.

---

## Verification (how we'll know the plan is right)

This is a **content/narrative** deliverable, so "verification" is editorial, not test-driven:
1. **Coverage check:** every Core tool (M1–M8) has at least one model in each studio — confirmed by
   the Cross-Link Matrix (all 8 rows are full).
2. **Cut check:** every list has clearly-tiered 🔴 marginal items so the user can prune without
   re-deriving rationale.
3. **Feasibility check:** flagship sets contain mostly `E`/`M` items so a first build is achievable
   on a static, client-side React/Vite site (no server compute).
4. **Thesis check:** the four "cleanest triple" tools (M1, M3, M5, M7) each have a vivid,
   non-obvious cross-domain story — the core reason the site exists.

Next step after approval: lock the cuts with the user, then turn the surviving rows into the model
registry + studio/tool index pages.
