# Thesis Rankings & Proposed Additions

> Companion to `CONTENT_PLAN.md` and `MANIFESTO.md` (2026-07-01). The registry's
> `strength` field rates *widget quality*; this document ranks everything by
> **thesis contribution** — how literally the math is identical across
> substrates, how surprising the identity is, and whether the model completes a
> triple. Use it to sequence builds and to justify cuts.

---

## 1. Core tools, strongest → weakest

| # | Tool | Why |
|---|------|-----|
| 1 | `correlation` | Diversification = co-firing = beamforming; literal same-function identity; seed model live; beamforming leg is genuinely surprising. |
| 2 | `stochastic` | GBM = Poisson spikes = Brownian motion, plus the best narrative hook in the project: **Bachelier modeled markets with Brownian motion in 1900 — five years before Einstein used it for physics.** |
| 3 | `convolution` | Moving average = receptive field = heat kernel. Heat-equation-as-Gaussian-blur is the best visual "wow" in the catalog. Finance leg (SMA) is its weakest. |
| 4 | `dynamical-systems` | Hidden gem: **the OU process, LIF subthreshold dynamics, and an overdamped particle in a harmonic well are the exact same SDE.** Mean-reversion, LIF, and Langevin models can share one `ou()` function — S2 at its most dramatic. |
| 5 | `fourier` | EEG bands and spectrograms are excellent; the finance leg is the catalog's weakest — returns have a flat spectrum. Rescue framing: *"a flat spectrum is the efficient-market hypothesis in one picture."* |
| 6 | `detection` | Most internally coherent (matched filter, Kalman, d′ are all likelihood ratios) but least visual and most technical. Fast-follow. |
| 7 | `linear-algebra` | Eigenportfolios + neural manifolds pair well, but ICA isn't a physics leg. Fix: **normal modes of coupled oscillators** — eigenvectors you can watch swing. |
| 8 | `information` | Deepest connection (Shannon meets Boltzmann), hardest to make tangible; entropy-as-diversification is the most forced finance leg. Build last; let it be the capstone. |

---

## 2. Models by thesis tier

**Rule that emerged:** a model's thesis value is almost entirely inherited from
its primary tool's triple. The weak models are orphans (primary tool is
tag-only, so no triple is possible) or domain-curriculum items rather than
connection items.

### Tier 1 — thesis-critical (complete triples for the top four tools)

1. `nl-cross-correlogram` — completes the flagship correlation triple (Milestone 1)
2. `sv-beamforming` — the surprising correlation leg (Milestone 1)
3. `sv-convolution` — canonical convolution; **reskin with the heat-equation framing**
4. `nl-receptive-fields` — kernel-as-edge-detector, very demo-able
5. `qv-mean-reversion` — half of the OU identity
6. `nl-lif` — the other half of the OU identity; port the stub
7. `qv-random-walk` — carries the Bachelier story
8. `nl-spike-stats` — Poisson trains / ISI histograms, easy win
9. `qv-moving-averages` — modest alone, load-bearing in the convolution triple

### Tier 2 — strong

10. `sv-aliasing` — wagon-wheel aliasing; most viscerally surprising single demo
11. `nl-brain-rhythms` — the best Fourier leg
12. `sv-fourier-builder` — canonical, if familiar
13. `nl-fitzhugh-nagumo` — cross-links tightly with the pendulum phase plane
14. `nl-signal-detection` · `sv-matched-filter` · `nl-drift-diffusion` — the detection cluster; strong as a set
15. `sv-cross-correlation` — good, somewhat redundant with beamforming
16. `qv-fat-tails` — honest and important; orphaned on tag-only `distributions` for now
17. `sv-spectrogram` — solid, curriculum-flavored

### Tier 3 — mid (real, but needing setup or a missing leg)

18–22. `qv-eigenportfolios`, `nl-neural-manifolds`, `sv-source-separation`
(linear-algebra cluster, waiting on a true physics leg), `sv-kalman`,
`qv-vol-clustering`, `qv-monte-carlo`

### Tier 4 — weakest by thesis (widgets or orphans)

23. `qv-efficient-frontier` — good widget; orphaned until `optimization` is promoted (see §4)
24. `sv-filter-designer` — a great *widget* with no cross-substrate story (exactly what the manifesto says we don't sell)
25. `nl-hodgkin-huxley` — gorgeous but curriculum-deep; FitzHugh–Nagumo already delivers the cross-link
26. `qv-regime-detection` — orphaned on tag-only `markov`
27. `nl-stdp` — orphaned on tag-only `optimization` (fixable, §4)
28. `qv-correlation-networks` — orphaned on tag-only `networks`
29. `nl-neural-coding` · `sv-channel-capacity` · `sv-compression` — information cluster; deep, hard, last
30. `nl-hopfield` — orphaned *as registered*, but rescuable to Tier 1 via the Ising pairing (§4)
31. `sv-noise-snr` — grab-bag, no single identity

### Registry gaps (blockers)

The manifesto's Milestone 2 assumes three PhySim models that are **not in the
registry**: Brownian motion, the heat-equation visualizer (unless
`sv-convolution` is reskinned), and the pendulum phase plane. The `stochastic`
and `dynamical-systems` triples cannot currently be completed from registered
models.

---

## 3. Decision rule

**Never build a model whose primary tool has no path to a triple.** Tag-only
orphans are where effort dies, thesis-wise. Corollary: promoting a tag to core
must come with a credible three-leg plan, or not at all.

---

## 4. Proposed additions

### Promote `optimization` → core, as "Optimization & Gradient Descent"

Not "machine learning" — ML is a field, not a tool; naming it as a tool would
break the substrate/tool distinction. Gradient descent is the tool, and the
identity is physical, not metaphorical: **gradient descent is overdamped
physical dynamics** — a ball rolling downhill on an energy landscape; add noise
and you get simulated annealing, i.e. finite-temperature physics.

- *QuantViz:* `qv-efficient-frontier` (already registered) — descending the risk-return landscape
- *NeuroLearn:* new — delta-rule / tiny perceptron; watch a decision boundary learn (rehabilitates the STDP neighborhood)
- *PhySim:* new — loss-landscape ball-roll with a temperature slider (annealing when hot)

One shared `gradientDescent()` in Compute Core drives all three. Cheapest new
triple available, and the one recruiters recognize instantly. ML itself becomes
a possible **capstone exhibit**: "build a tiny neural net from parts you've
already met" — convolution + linear algebra + gradient descent + information
theory, composed from existing Compute Core blocks.

### Four new PhySim models

| Model | Tool | Note |
|-------|------|------|
| Brownian motion | `stochastic` | Particle sim, MSD ∝ t; carries the Bachelier/Einstein story |
| Pendulum phase plane | `dynamical-systems` | Cross-links with FitzHugh–Nagumo |
| Heat-equation diffusion | `convolution` | Or fold into `sv-convolution` as its reskin |
| Coupled oscillators / normal modes | `linear-algebra` | The missing physics leg; watchable eigenvectors |

### The Hopfield rescue: add an Ising model

The Hopfield energy function **is** the Ising Hamiltonian — a literal identity.
A PhySim Ising / phase-transition model turns `nl-hopfield` from orphan into one
of the best cross-links on the site (memory retrieval = magnetization settling)
and gives `markov` a physics leg for free. Highest-leverage single addition
after gradient descent.

---

## 5. The pipeline direction (growth thesis)

The tools are composable parts of data-processing pipelines — this is what
quant research, DSP, and ML engineering actually are. Three commitments:

1. **Compute Core as composable transforms.** Give tool functions a compatible
   shape (roughly `Series → Series` / `Series → Matrix`) so a model's
   computation is literal function composition:
   `correlate(window(detrend(prices)))`. Designing this API well is the real
   software-engineering exercise in the project.
2. **Render the pipeline.** Because S2 forces canonical imports, every model
   already *is* a DAG of Compute Core blocks. Add an "under the hood" panel to
   the Model Shell showing that signal-flow diagram, each block linking to its
   tool page. Makes the thesis visible; no other portfolio site has it.
   (Visitor-composable sandbox = post-launch stretch goal; scope trap before
   then.)
3. **Write the identity before the code.** One-page derivation per triple,
   proving the identity is real, *before* building the models. It is the spec
   for the narrative block and where the learning consolidates.

### The identity ledger (derivations to write)

- OU process = LIF subthreshold membrane = overdamped Langevin (one SDE)
- Heat kernel = Gaussian convolution (diffusion is blurring)
- Hopfield energy = Ising Hamiltonian
- Gradient flow = overdamped dynamics; +noise = simulated annealing
- Flat return spectrum = efficient-market hypothesis
- Bachelier (1900) → Einstein (1905): finance had Brownian motion first
