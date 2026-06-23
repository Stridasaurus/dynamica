import { Link } from 'react-router-dom';
import { Card } from '@settgast/ui';
import { STUDIOS, coreTools, liveCount, modelsByStudio } from '../models';

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-6xl">
          Dynamica
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-gray-500 dark:text-gray-400">
          Interactive toy models for dynamical systems — across finance, neuroscience, and signal
          processing.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          The same mathematics runs through all three fields. Browse by{' '}
          <span className="font-medium text-gray-700 dark:text-gray-300">studio</span> to explore one
          field, or by{' '}
          <Link to="/tools" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            mathematical tool
          </Link>{' '}
          to see one idea expressed in all three.
        </p>
      </div>

      {/* Browse by studio */}
      <section className="mb-16">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Browse by studio
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {STUDIOS.map((studio) => {
            const total = modelsByStudio(studio.id).length;
            const live = liveCount(studio.id);
            return (
              <Link key={studio.id} to={`/studios/${studio.id}`} className="group block">
                <Card
                  hoverable
                  className={`flex h-full flex-col border border-transparent p-6 transition-all group-hover:shadow-lg ${studio.theme.hoverBorder}`}
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${studio.theme.tint}`}
                  >
                    {studio.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {studio.name}
                  </h3>
                  <p
                    className={`mb-3 text-xs font-medium uppercase tracking-widest ${studio.theme.text}`}
                  >
                    {studio.lens}
                  </p>
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    {studio.blurb}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {live > 0 ? `${live} live · ` : ''}
                    {total} models
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Browse by tool */}
      <section className="mb-16">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Browse by mathematical tool
          </h2>
          <Link
            to="/tools"
            className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            See all →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {coreTools().map((tool) => (
            <Link
              key={tool.id}
              to={`/tools/${tool.id}`}
              className="group flex items-center gap-3 rounded-xl border border-gray-200 p-4 transition-colors hover:border-gray-400 dark:border-gray-800 dark:hover:border-gray-600"
            >
              <span className="select-none font-mono text-2xl text-gray-400 dark:text-gray-600">
                {tool.symbol}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {tool.name.split(' & ')[0]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Thesis */}
      <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        Correlation measures diversification in a portfolio, co-firing between neurons, and the
        direction of a wavefront across a sensor array. Dynamica is built around connections like
        this — the dual navigation makes them tangible.
      </p>
    </div>
  );
}
