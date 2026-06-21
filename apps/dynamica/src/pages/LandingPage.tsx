import { Link } from 'react-router-dom';
import { Card, Badge } from '@settgast/ui';

export default function LandingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mb-4">
          Dynamica
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Research-grade tools for financial analysis and scientific simulation.
          Open-source, client-side, and always free.
        </p>
      </div>

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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              QuantViz Studio
            </h2>
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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              NeuroLearn Studio
            </h2>
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
    </div>
  );
}
