import type { ModelEntry } from './types';

// The single source of truth for every toy model. Index pages, the Matrix,
// and the cross-link exhibit are all derived from this list (see ./index.ts)
// — to add a model, add one entry here. Only `qv-correlation-lab` ships live
// today; the rest are `planned` and surface as "Next up" until built.
//
// Trimmed 2026-07-03 to live + next-up only (per docs/THESIS_RANKINGS.md and
// docs/CONTENT_PLAN.md, which retain the full longlist) so progress stays
// watchable instead of drowning in "Planned" cards.
export const MODELS: ModelEntry[] = [
  {
    id: 'qv-correlation-lab',
    title: 'Diversification & Correlation Lab',
    studio: 'quantviz',
    // `networks` tag dropped 2026-07-12 (PLAN.md R4): it's a secondary,
    // tag-only tool with no Map cell, so tagging it implied a cross-link
    // that points at nothing.
    tools: ['correlation'],
    blurb: 'Build a portfolio and watch the rolling correlation heatmap reveal true diversification.',
    status: 'live',
    route: '/quantviz',
    difficulty: 'intro',
    strength: 'flagship',
  },
  {
    id: 'nl-cross-correlogram',
    title: 'Cross-Correlogram & Functional Connectivity',
    studio: 'neurolearn',
    tools: ['correlation'],
    blurb: 'Sweep correlation across every time lag between two spike trains to answer "who drives whom?"',
    status: 'live',
    route: '/models/nl-cross-correlogram',
    difficulty: 'core',
    strength: 'flagship',
  },
  {
    id: 'nl-lif',
    title: 'Leaky Integrate-and-Fire Neuron',
    studio: 'neurolearn',
    // `stochastic` tag dropped 2026-07-12 (PLAN.md R1): the LIF as built is
    // deterministic cable+threshold — no noise term. Re-tag only if a
    // noisy-input variant is added (S2: no cross-link is a lie).
    tools: ['dynamical-systems'],
    blurb: 'Watch a membrane potential charge to threshold under step, ramp, and sinusoidal input.',
    status: 'planned',
    difficulty: 'intro',
    strength: 'flagship',
  },
  {
    id: 'qv-eigenportfolios',
    title: 'Factor & Eigenportfolio Decomposition',
    studio: 'quantviz',
    tools: ['linear-algebra'],
    blurb: 'Run PCA on returns to uncover the hidden factors that move the whole market.',
    status: 'planned',
    difficulty: 'core',
    strength: 'solid',
  },
  {
    id: 'ph-coherogram',
    title: 'Global Magnetometer Coherence',
    studio: 'physim',
    // Tagged `correlation` only for M1 (PLAN.md §2.2: "ships as the
    // correlation leg; the fourier triple is M3+"). It genuinely carries a
    // `fourier` dimension too (coherence is correlation resolved by
    // frequency via an FFT step), but S2's registry check requires a live
    // model's every tool tag to have a shipped canonical Compute Core module
    // — there is no lib/fourier.ts yet. Re-add the `fourier` tag once that
    // module (and its own triple) lands, same pattern as R1/R4's tag drops.
    tools: ['correlation'],
    blurb: 'Coherence across a planet-wide magnetometer array — correlation, resolved by frequency, on real geophysical data.',
    status: 'live',
    route: '/models/ph-coherogram',
    difficulty: 'advanced',
    strength: 'flagship',
  },
];
