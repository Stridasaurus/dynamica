import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@settgast/ui';
import { STUDIOS } from '../../models';

const linkBase = 'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors';
const linkActive = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300';
const linkIdle =
  'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800';

export default function SiteHeader() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-sm dark:bg-gray-900/90 dark:border-gray-800">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
            Dynamica
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {STUDIOS.map((studio) => {
            const to = `/studios/${studio.id}`;
            const active = pathname === to;
            return (
              <Link
                key={studio.id}
                to={to}
                className={`${linkBase} ${active ? linkActive : linkIdle}`}
              >
                {studio.name.replace(' Studio', '')}
              </Link>
            );
          })}
          <Link
            to="/tools"
            className={`${linkBase} ${pathname.startsWith('/tools') ? linkActive : linkIdle}`}
          >
            By Tool
          </Link>
          <a
            href="https://stridasaurus.github.io/StriderSettgast.com/blog/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkBase} ${linkIdle}`}
          >
            Blog ↗
          </a>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
