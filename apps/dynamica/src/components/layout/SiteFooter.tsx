import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-[1080px] px-8 pb-16 pt-[54px]">
        <div className="flex flex-wrap justify-between gap-10">
          {/* Brand */}
          <div className="max-w-[300px]">
            <Link
              to="/"
              className="flex items-center gap-2.5 text-[17px] font-semibold text-[var(--color-text-primary)] no-underline"
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
            <p className="mt-3.5 text-sm leading-relaxed text-[var(--color-text-muted)]">
              Exploring dynamical systems across domains — from financial markets to neural dynamics.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap gap-16">
            <FooterCol title="Studios">
              <FooterLink to="/studios/quantviz">QuantViz</FooterLink>
              <FooterLink to="/studios/neurolearn">NeuroLearn</FooterLink>
              <FooterLink to="/studios/physim">PhySim</FooterLink>
            </FooterCol>
            <FooterCol title="Explore">
              <FooterLink to="/">By studio</FooterLink>
              <FooterLink to="/map">By framework</FooterLink>
            </FooterCol>
            <FooterCol title="More">
              <a
                href="https://stridasaurus.github.io/StriderSettgast.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block py-[5px] text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                About the author
              </a>
              <a
                href="https://stridasaurus.github.io/StriderSettgast.com/blog/"
                target="_blank"
                rel="noopener noreferrer"
                className="block py-[5px] text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                Blog ↗
              </a>
            </FooterCol>
          </div>
        </div>

        {/* Base row */}
        <div className="mt-11 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)] pt-5 text-xs text-[var(--color-text-muted)]">
          <span>© 2026 Dynamica · Strider Settgast</span>
          <span className="font-mono">dx = f(x,t)·dt + g(x,t)·dW</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3.5 font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
        {title}
      </h4>
      {children}
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="block py-[5px] text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
    >
      {children}
    </Link>
  );
}
