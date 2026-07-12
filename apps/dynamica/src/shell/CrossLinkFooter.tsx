import { Link } from 'react-router-dom';
import { crossLinks } from '../models';
import type { ModelEntry } from '../models';

interface Props {
  model: ModelEntry;
}

/** The shared "same math, other studios" cross-link footer every model wears
 *  (Model Shell anatomy: metadata → controls → viz → narrative → cross-link
 *  footer). Extracted from CorrelationLab during the Q1 shell carve-out —
 *  both QuantVizPage and every new model render this exact component so a
 *  cross-link is never a second hand-built list (S4/S2). */
export function CrossLinkFooter({ model }: Props) {
  const primaryTool = model.tools[0];
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-[var(--color-border)] pt-4 mt-2">
      <Link
        to={`/tools/${primaryTool}`}
        className="text-sm font-medium text-[var(--color-accent)] hover:underline"
      >
        Same math, other studios →
      </Link>
      {crossLinks(primaryTool)
        .filter((l) => l.studio !== model.studio)
        .map((l) => (
          <Link
            key={l.studio}
            to={`/studios/${l.studio}`}
            className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-text-muted)] hover:border-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            {l.models.length > 0 ? l.models[0].title : `No model yet in ${l.studio}`}
          </Link>
        ))}
    </div>
  );
}
