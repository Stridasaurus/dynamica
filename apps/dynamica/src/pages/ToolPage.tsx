import { useParams, Link } from 'react-router-dom';
import { Breadcrumb } from '@settgast/ui';
import { TOOLS, getTool, getStudio, crossLinks } from '../models';
import type { ToolId } from '../models';
import { ModelCard } from '../components/catalog/ModelCard';

const VALID = new Set<string>(TOOLS.map((t) => t.id));

export default function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();

  if (!toolId || !VALID.has(toolId)) {
    return <NotFound />;
  }

  const tool = getTool(toolId as ToolId);
  const columns = crossLinks(tool.id);

  return (
    <div className="mx-auto max-w-[1080px] px-8 py-12">
      <Breadcrumb items={[{ label: 'Dynamica', href: '#/' }, { label: 'Map', href: '#/map' }, { label: tool.name }]} className="mb-6" />

      <div className="mb-8 flex items-start gap-4">
        <span className="select-none font-mono text-5xl leading-none text-[var(--color-text-muted)] opacity-40">
          {tool.symbol}
        </span>
        <div>
          <h1 className="text-[clamp(26px,3vw,36px)] font-semibold tracking-[-0.02em] text-[var(--color-text-primary)]">
            {tool.name}
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] text-[var(--color-text-secondary)]">{tool.blurb}</p>
        </div>
      </div>

      {/* The thesis — the reason this page exists */}
      <blockquote className="mb-10 border-l-2 border-[var(--color-accent)] pl-4 text-lg italic leading-relaxed text-[var(--color-text-secondary)]">
        {tool.thesis}
      </blockquote>

      <h2 className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
        The same idea, three fields
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {columns.map(({ studio: studioId, models }) => {
          const studio = getStudio(studioId);
          return (
            <div key={studioId}>
              <Link
                to={`/studios/${studioId}`}
                className={`mb-3 flex items-center gap-2 text-sm font-semibold no-underline ${studio.theme.text}`}
              >
                <span>{studio.icon}</span>
                {studio.field}
              </Link>
              {models.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {models.map((model) => (
                    <ModelCard key={model.id} model={model} hideStudioTag />
                  ))}
                </div>
              ) : (
                <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] p-4 text-sm text-[var(--color-text-muted)]">
                  No model yet in this field.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-[var(--color-text-muted)]">That tool doesn't exist.</p>
      <Link to="/map" className="mt-2 inline-block text-[var(--color-accent)] hover:underline">
        ← Back to the map
      </Link>
    </div>
  );
}
