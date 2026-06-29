import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@settgast/ui';
import { STUDIOS } from '../../models';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

const NAV_LINKS: [string, string][] = [
  ['Studios', 'explorer'],
  ['Frameworks', 'explorer'],
  ['Why it matters', 'why'],
  ['About', 'about'],
];

export default function SiteHeader() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--color-border)] backdrop-blur-xl backdrop-saturate-[160%]"
      style={{ background: 'color-mix(in srgb, var(--color-bg) 86%, transparent)' }}
    >
      <div className="mx-auto flex h-16 max-w-[1080px] items-center justify-between gap-6 px-8">
        {/* Wordmark */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 text-[17px] font-semibold tracking-tight text-[var(--color-text-primary)] no-underline"
        >
          <span
            className="block h-3 w-3 shrink-0 rounded-[3px]"
            style={{
              background: 'var(--color-brand)',
              boxShadow: '0 0 0 4px color-mix(in srgb, var(--color-brand) 14%, transparent)',
            }}
          />
          Dynamica
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-[34px]">
          {isHome ? (
            NAV_LINKS.map(([label, target]) => (
              <button
                key={label}
                onClick={() => scrollTo(target)}
                className="cursor-pointer border-0 bg-transparent p-0 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                {label}
              </button>
            ))
          ) : (
            <>
              {STUDIOS.map((studio) => (
                <Link
                  key={studio.id}
                  to={`/studios/${studio.id}`}
                  className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  {studio.name.replace(' Studio', '')}
                </Link>
              ))}
              <Link
                to="/tools"
                className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                By Tool
              </Link>
            </>
          )}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {isHome && (
            <button
              onClick={() => scrollTo('explorer')}
              className="flex h-9 cursor-pointer items-center rounded-[var(--radius-md)] border-0 bg-[var(--color-accent)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
            >
              Launch platform
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
