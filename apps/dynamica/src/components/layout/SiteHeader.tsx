import { Link } from 'react-router-dom';
import { ThemeToggle } from '@settgast/ui';
import { STUDIOS } from '../../models';

export default function SiteHeader() {
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

        {/* Nav — identical on every page */}
        <nav className="flex items-center gap-[34px]">
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
            to="/map"
            className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            Map
          </Link>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
