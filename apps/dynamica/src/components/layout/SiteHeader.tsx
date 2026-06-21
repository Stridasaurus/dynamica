import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@settgast/ui';

export default function SiteHeader() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-sm dark:bg-gray-900/90 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
            Dynamica
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/quantviz"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/quantviz'
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            QuantViz
          </Link>
          <span
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 dark:text-gray-600 cursor-not-allowed"
            title="Coming soon"
          >
            NeuroLearn
          </span>
          <a
            href="https://stridasaurus.github.io/StriderSettgast.com/blog/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Blog ↗
          </a>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
