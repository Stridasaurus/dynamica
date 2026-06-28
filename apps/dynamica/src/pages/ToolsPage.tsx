import { Link } from 'react-router-dom';
import { Breadcrumb, Divider } from '@settgast/ui';
import { TOOLS, crossLinks } from '../models';
import type { MathTool } from '../models';

export default function ToolsPage() {
  const core = TOOLS.filter((t) => t.core);
  const secondary = TOOLS.filter((t) => !t.core);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: 'Dynamica', href: '#/' }, { label: 'By Tool' }]} className="mb-6" />

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Browse by Mathematical Tool</h1>
      <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
        The connective tissue of Dynamica. Each tool reappears across finance, neuroscience, and
        signal processing — open one to see the same idea in all three.
      </p>

      <div className="mt-8 space-y-3">
        {core.map((tool) => (
          <ToolRow key={tool.id} tool={tool} />
        ))}
      </div>

      <Divider className="my-8" />
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        Also tagged
      </h2>
      <div className="space-y-3">
        {secondary.map((tool) => (
          <ToolRow key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}

function ToolRow({ tool }: { tool: MathTool }) {
  const coverage = crossLinks(tool.id).filter((c) => c.models.length > 0).length;
  return (
    <Link
      to={`/tools/${tool.id}`}
      className="group flex items-start gap-4 rounded-xl border border-gray-200 p-4 transition-colors hover:border-gray-400 dark:border-gray-800 dark:hover:border-gray-600"
    >
      <span className="mt-0.5 w-8 shrink-0 select-none text-center font-mono text-2xl text-gray-400 dark:text-gray-600">
        {tool.symbol}
      </span>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{tool.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{tool.blurb}</p>
      </div>
      <span className="mt-0.5 shrink-0 text-xs text-gray-400 dark:text-gray-500">
        {coverage} / 3 fields
      </span>
    </Link>
  );
}
