import { Link } from 'react-router-dom';
import { getTool } from '../../models';
import type { ToolId } from '../../models';

interface ToolChipProps {
  toolId: ToolId;
  /** When false, renders a static pill instead of a link (e.g. inside another link). */
  asLink?: boolean;
}

/** Small pill for a math tool. Links to its tool page so any model surfaces the
 *  shared-mathematics navigation. */
export function ToolChip({ toolId, asLink = true }: ToolChipProps) {
  const tool = getTool(toolId);
  const inner = (
    <>
      <span className="font-mono text-gray-400 dark:text-gray-500">{tool.symbol}</span>
      <span>{tool.name.split(' & ')[0].split(' (')[0]}</span>
    </>
  );
  const base =
    'inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-2.5 py-0.5 ' +
    'text-xs text-gray-600 dark:border-gray-700 dark:text-gray-400';

  if (!asLink) {
    return <span className={base}>{inner}</span>;
  }
  return (
    <Link
      to={`/tools/${tool.id}`}
      className={`${base} transition-colors hover:border-gray-400 hover:text-gray-900 dark:hover:border-gray-500 dark:hover:text-gray-100`}
    >
      {inner}
    </Link>
  );
}
