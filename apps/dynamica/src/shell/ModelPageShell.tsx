import type { ReactNode } from 'react';
import { Breadcrumb } from '@settgast/ui';
import { getStudio } from '../models';
import type { ModelEntry } from '../models';
import { CrossLinkFooter } from './CrossLinkFooter';

interface Props {
  model: ModelEntry;
  /** Badges rendered next to the title, e.g. a "Synthetic data" warning. */
  badges?: ReactNode;
  /** One-line status/meta text under the title (e.g. sample count, data date). */
  subtitle?: ReactNode;
  /** The model's controls + viz surface(s) + narrative — everything between
   *  the title row and the cross-link footer. Model Shell owns the anatomy's
   *  skeleton; it does not own this content (manifesto §6). */
  children: ReactNode;
  /** Small print at the very bottom (data provenance / synthetic-data note). */
  provenance?: ReactNode;
}

/** The one skeleton every Dynamica model wears: breadcrumb → title row →
 *  model content → cross-link footer → provenance footer. Carved out of the
 *  CorrelationLab page during Q1 (manifesto §6 migration step 2 — "extract
 *  when building the second live model, not in the abstract") so every model
 *  after this one composes the shell instead of hand-rolling this layout. */
export function ModelPageShell({ model, badges, subtitle, children, provenance }: Props) {
  const studio = getStudio(model.studio);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">
      <Breadcrumb
        items={[
          { label: 'Dynamica', href: '#/' },
          { label: studio.name, href: `#/studios/${studio.id}` },
          { label: model.title },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-end gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{model.title}</h1>
            {badges}
          </div>
          {subtitle && (
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {children}

      <CrossLinkFooter model={model} />

      {provenance && (
        <p className="text-center text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-4">
          {provenance}
        </p>
      )}
    </div>
  );
}

/** Shared section heading used across model content blocks. */
export function ShellSectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-base font-semibold text-[var(--color-text-primary)]">{children}</h2>;
}
