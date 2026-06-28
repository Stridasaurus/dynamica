import { Link } from 'react-router-dom';
import { Card, Badge } from '@settgast/ui';
import { getStudio } from '../../models';
import type { ModelEntry } from '../../models';
import { ToolChip } from './ToolChip';

const DIFFICULTY_LABEL: Record<ModelEntry['difficulty'], string> = {
  intro: 'Intro',
  core: 'Core',
  advanced: 'Advanced',
};

interface ModelCardProps {
  model: ModelEntry;
  /** Hide the studio accent dot (e.g. when already grouped under one studio). */
  hideStudioTag?: boolean;
}

/** A catalog card for a single toy model. Live models link to their app; planned
 *  models render as a muted, non-navigating card with a "Planned" badge. */
export function ModelCard({ model, hideStudioTag = false }: ModelCardProps) {
  const studio = getStudio(model.studio);
  const isLive = model.status === 'live' && model.route;

  const body = (
    <Card
      hoverable={!!isLive}
      className={[
        'flex h-full flex-col p-5 transition-all',
        isLive
          ? `border border-transparent group-hover:shadow-lg ${studio.theme.hoverBorder}`
          : 'opacity-70',
      ].join(' ')}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        {!hideStudioTag && (
          <span className={`text-xs font-medium uppercase tracking-widest ${studio.theme.text}`}>
            {studio.field}
          </span>
        )}
        {isLive ? (
          <Badge variant="positive">Live</Badge>
        ) : (
          <Badge variant="warning">Planned</Badge>
        )}
      </div>

      <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{model.title}</h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        {model.blurb}
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {model.tools.map((t) => (
          // asLink=false: the whole card is already a link for live models, and
          // nesting interactive elements would be invalid.
          <ToolChip key={t} toolId={t} asLink={!isLive} />
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400 dark:border-gray-800 dark:text-gray-500">
        <span>{DIFFICULTY_LABEL[model.difficulty]}</span>
        {isLive && (
          <span className={`inline-flex items-center gap-1 font-medium ${studio.theme.text}`}>
            Open <span aria-hidden>→</span>
          </span>
        )}
      </div>
    </Card>
  );

  if (isLive) {
    return (
      <Link to={model.route!} className="group block">
        {body}
      </Link>
    );
  }
  return <div>{body}</div>;
}
