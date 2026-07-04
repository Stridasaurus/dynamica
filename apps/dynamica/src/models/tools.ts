import type { MathTool, ToolId } from './types';

// The mathematical spine. Core tools (core: true) each span all three studios
// and get a dedicated page — they are the heart of the "browse by tool" idea.
// Secondary tools are tag-only for now and can be promoted by flipping `core`.
export const TOOLS: MathTool[] = [
  {
    id: 'correlation',
    name: 'Correlation & Covariance',
    symbol: 'ρ',
    blurb: 'How two signals move together — Pearson, auto/cross-correlation, covariance matrices.',
    thesis:
      'The same coefficient measures portfolio diversification, neuron co-firing, and the direction ' +
      'of a wavefront crossing a sensor array.',
    core: true,
  },
  {
    id: 'fourier',
    name: 'Fourier & Spectral Analysis',
    symbol: 'ℱ',
    blurb: 'Decomposing a signal into frequencies — DFT/FFT, power spectra, spectrograms.',
    thesis:
      'Brain rhythms, market cycles, and an audio spectrum are all the same transform looking for ' +
      'periodic structure.',
    core: true,
  },
  {
    id: 'convolution',
    name: 'Convolution & Filtering',
    symbol: '∗',
    blurb: 'Sliding a kernel over a signal — impulse responses, LTI systems, smoothing.',
    thesis:
      'A moving-average price filter, a neuron’s receptive field, and a digital low-pass filter are ' +
      'one operation.',
    core: true,
  },
  {
    id: 'stochastic',
    name: 'Stochastic Processes',
    symbol: '∿',
    blurb: 'Randomness in motion — random walks, Brownian/Wiener, Ornstein–Uhlenbeck, Poisson.',
    thesis:
      'A stock price, a noisy membrane potential, and a noise generator all evolve as driven random ' +
      'processes.',
    core: true,
  },
  {
    id: 'dynamical-systems',
    name: 'Differential Equations & Dynamical Systems',
    symbol: '∂',
    blurb: 'Systems that evolve by rule — ODEs, phase planes, fixed points, limit cycles.',
    thesis:
      'Mean-reverting spreads, spiking neurons, and locking oscillators are all trajectories in a ' +
      'phase space.',
    core: true,
  },
  {
    id: 'linear-algebra',
    name: 'Linear Algebra & Dimensionality Reduction',
    symbol: 'Λ',
    blurb: 'Structure in high dimensions — PCA/SVD, eigenvectors, decompositions.',
    thesis:
      'Eigenportfolios, neural manifolds, and source separation all find the few directions that ' +
      'explain the many.',
    core: true,
  },
  {
    id: 'detection',
    name: 'Detection & Estimation',
    symbol: 'd′',
    blurb: 'Finding signal in noise — matched filters, Kalman filtering, signal detection theory.',
    thesis:
      'A radar matched filter and a psychophysics experiment share one math: deciding whether a ' +
      'signal is really there.',
    core: true,
  },
  {
    id: 'information',
    name: 'Information Theory & Entropy',
    symbol: 'H',
    blurb: 'Measuring uncertainty and content — Shannon entropy, mutual information, capacity.',
    thesis:
      'Portfolio diversity, neural coding, and channel capacity all count the same thing: bits.',
    core: true,
  },
  // ── Secondary (tag-only) ──────────────────────────────────────────────────
  {
    id: 'distributions',
    name: 'Probability Distributions & Tails',
    symbol: '𝒩',
    blurb: 'Shapes of randomness — Gaussian vs heavy tails, power laws, extreme values.',
    thesis: 'Fat-tailed returns and bursty inter-spike intervals both defy the bell curve.',
    core: false,
  },
  {
    id: 'markov',
    name: 'Markov Processes & State Models',
    symbol: 'π',
    blurb: 'Memoryless transitions — Markov chains, hidden states, regime switching.',
    thesis: 'Bull/bear market regimes and brain up/down states are both hidden-state models.',
    core: false,
  },
  {
    id: 'optimization',
    name: 'Optimization',
    symbol: '∇',
    blurb: 'Finding the best configuration — gradient descent, convex optimization.',
    thesis: 'The efficient frontier and a synaptic learning rule are both optimization in disguise.',
    core: false,
  },
  {
    id: 'networks',
    name: 'Networks & Graph Theory',
    symbol: '⬡',
    blurb: 'Relationships as graphs — adjacency, Laplacians, community detection.',
    thesis: 'Correlation networks of assets and functional connectomes are the same object.',
    core: false,
  },
];

// Governing-equation display strings for the 8 core tools — the row labels in
// the cross-link Matrix and the landing hero. Secondary tools fall back to
// their `symbol`.
export const TOOL_EQ: Record<string, string> = {
  correlation: 'ρ(X,Y) = Cov(X,Y)/σₓσᵧ',
  fourier: 'X(f) = ∫ x(t) e⁻ⁱ²πft dt',
  convolution: '(f ∗ g)(t) = ∫ f(τ) g(t−τ) dτ',
  stochastic: 'dX = μ dt + σ dW',
  'dynamical-systems': 'dx/dt = f(x, t)',
  'linear-algebra': 'A = U Σ Vᵀ',
  detection: 'x̂ = E[x | y]',
  information: 'H(X) = −Σ p log p',
};

const TOOL_MAP: Record<ToolId, MathTool> = Object.fromEntries(
  TOOLS.map((t) => [t.id, t]),
) as Record<ToolId, MathTool>;

export function getTool(id: ToolId): MathTool {
  return TOOL_MAP[id];
}

export function coreTools(): MathTool[] {
  return TOOLS.filter((t) => t.core);
}
