import { Link } from 'react-router-dom';
import { Card, Badge } from '@settgast/ui';

const PILLARS = [
  {
    icon: '∿',
    title: 'Stochastic Processes',
    body: 'Price returns and neural membrane noise both arise from Wiener process dynamics. Understanding one sharpens intuition for the other.',
  },
  {
    icon: '∂',
    title: 'Differential Equations',
    body: 'Market microstructure models and leaky integrate-and-fire neurons are both described by coupled ODEs. The same solution methods apply.',
  },
  {
    icon: '≈',
    title: 'Information & Measurement',
    body: 'Pearson correlation, Shannon entropy, and signal detection theory connect portfolio analysis to neural coding. Math is the common language.',
  },
];

export default function LandingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mb-4">
          Dynamica
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Quantitative tools for exploring dynamical systems — from financial markets to neural dynamics.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-600 mt-2">
          Open-source, client-side, and always free.
        </p>
      </div>

      {/* Throughline */}
      <p className="text-center max-w-2xl mx-auto text-sm text-gray-500 dark:text-gray-400 mb-12">
        Financial markets and neural networks are both complex dynamical systems — driven by differential
        equations, stochastic processes, and the mathematics of measurement. The tools here apply a shared
        quantitative framework to visualize and simulate these systems across domains.
      </p>

      {/* App cards */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* QuantViz Studio */}
        <Link to="/quantviz" className="group block">
          <Card hoverable className="h-full p-6 transition-shadow group-hover:shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-2xl">
                📈
              </div>
              <Badge variant="positive">Live</Badge>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
              QuantViz Studio
            </h2>
            <p className="text-xs font-medium uppercase tracking-widest text-indigo-400 mb-3">
              The Market Lens
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
              Build a portfolio of stocks, ETFs, crypto, and commodities. Visualize rolling
              correlations, cumulative returns, and risk metrics across 3-month to 20-year windows.
            </p>
            <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-indigo-500">✓</span> Rolling correlation heatmap with time slider
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-500">✓</span> Cumulative returns &amp; portfolio chart
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-500">✓</span> 8 curated preset portfolios
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-500">✓</span> Sharpe ratio, volatility, annualized return
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-500">✓</span> Shareable URL state
              </li>
            </ul>
            <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:gap-2.5 transition-all">
              Open QuantViz <span aria-hidden>→</span>
            </div>
          </Card>
        </Link>

        {/* NeuroLearn Studio — coming soon */}
        <div className="opacity-60 cursor-not-allowed">
          <Card className="h-full p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-2xl">
                🧠
              </div>
              <Badge variant="warning">Coming soon</Badge>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
              NeuroLearn Studio
            </h2>
            <p className="text-xs font-medium uppercase tracking-widest text-purple-400 mb-3">
              The Neural Lens
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
              Interactive leaky integrate-and-fire neuron simulator. Explore membrane
              potential dynamics, spiking thresholds, and input current patterns —
              all running in-browser via a JavaScript engine.
            </p>
            <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-purple-400">◦</span> Real-time membrane potential plots
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">◦</span> Configurable neuron parameters
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">◦</span> Step, ramp, and sinusoidal inputs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400">◦</span> Ported from the LIF-project simulation engine
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Shared Mathematical Foundation */}
      <div className="mt-20">
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            The Shared Mathematical Foundation
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            The same quantitative tools describe both systems.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="border border-gray-200 dark:border-gray-800 rounded-xl p-5"
            >
              <div className="text-2xl font-mono text-gray-400 dark:text-gray-600 mb-3 select-none">
                {p.icon}
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {p.title}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
