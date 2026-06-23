import { useParams, Link } from 'react-router-dom';
import { Breadcrumb } from '@settgast/ui';
import { STUDIOS, getStudio, modelsByStudio, liveCount } from '../models';
import type { StudioId } from '../models';
import { ModelCard } from '../components/catalog/ModelCard';

const VALID = new Set<string>(STUDIOS.map((s) => s.id));

export default function StudioPage() {
  const { studioId } = useParams<{ studioId: string }>();

  if (!studioId || !VALID.has(studioId)) {
    return <NotFound />;
  }

  const studio = getStudio(studioId as StudioId);
  const models = modelsByStudio(studio.id);
  const live = liveCount(studio.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumb
        items={[
          { label: 'Dynamica', href: '#/' },
          { label: studio.name },
        ]}
        className="mb-6"
      />

      <div className="mb-8 flex items-start gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl ${studio.theme.tint}`}
        >
          {studio.icon}
        </div>
        <div>
          <p className={`text-xs font-medium uppercase tracking-widest ${studio.theme.text}`}>
            {studio.field} · {studio.lens}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{studio.name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">{studio.blurb}</p>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            {live > 0 ? `${live} live · ` : ''}
            {models.length} models
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => (
          <ModelCard key={model.id} model={model} hideStudioTag />
        ))}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-gray-500 dark:text-gray-400">That studio doesn’t exist.</p>
      <Link to="/" className="mt-2 inline-block text-indigo-600 hover:underline dark:text-indigo-400">
        ← Back to Dynamica
      </Link>
    </div>
  );
}
