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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumb
        items={[
          { label: 'Dynamica', href: '#/' },
          { label: 'By Tool', href: '#/tools' },
          { label: tool.name },
        ]}
        className="mb-6"
      />

      <div className="mb-8 flex items-start gap-4">
        <span className="select-none font-mono text-5xl leading-none text-gray-300 dark:text-gray-700">
          {tool.symbol}
        </span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{tool.name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">{tool.blurb}</p>
        </div>
      </div>

      {/* The thesis — the reason this page exists */}
      <blockquote className="mb-10 border-l-2 border-indigo-300 pl-4 text-lg italic leading-relaxed text-gray-700 dark:border-indigo-700 dark:text-gray-300">
        {tool.thesis}
      </blockquote>

      <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        The same idea, three fields
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {columns.map(({ studio: studioId, models }) => {
          const studio = getStudio(studioId);
          return (
            <div key={studioId}>
              <Link
                to={`/studios/${studioId}`}
                className={`mb-3 flex items-center gap-2 text-sm font-semibold ${studio.theme.text}`}
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
                <p className="rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-400 dark:border-gray-800 dark:text-gray-600">
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
      <p className="text-gray-500 dark:text-gray-400">That tool doesn’t exist.</p>
      <Link to="/tools" className="mt-2 inline-block text-indigo-600 hover:underline dark:text-indigo-400">
        ← All tools
      </Link>
    </div>
  );
}
