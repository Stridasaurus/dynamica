import { Link } from 'react-router-dom';
import { STUDIOS, coreTools, modelsByTool, TOOL_EQ } from '../../models';
import type { ModelEntry, Studio } from '../../models';

// The cross-link Matrix: rows = the 8 core tools, columns = the 3 studios.
// Derived entirely from the registry (coreTools / modelsByTool) — no
// hand-maintained coverage list. This one component is simultaneously the
// thesis made visible (read a row: same equation, three fields), both browse
// axes at once, and the progress tracker (cells fill in as models ship).
export function Matrix() {
  const tools = coreTools();

  return (
    <div>
      {/* Desktop / tablet: grid table */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <th className="w-[260px]" />
              {STUDIOS.map((s) => (
                <th
                  key={s.id}
                  className="pb-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em]"
                  style={{ color: s.color }}
                >
                  {s.name.replace(' Studio', '')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => {
              const models = modelsByTool(tool.id);
              return (
                <tr key={tool.id} className="border-t border-[var(--color-border)]">
                  <td className="py-4 pr-6">
                    <div className="text-sm font-semibold text-[var(--color-text-primary)]">{tool.name}</div>
                    <div className="mt-0.5 font-mono text-xs text-[var(--color-text-muted)]">
                      {TOOL_EQ[tool.id] ?? tool.symbol}
                    </div>
                  </td>
                  {STUDIOS.map((s) => (
                    <td key={s.id} className="py-4 pr-4">
                      <MatrixCell
                        studio={s}
                        toolId={tool.id}
                        model={models.find((m) => m.studio === s.id)}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards, one per tool, studio slots inline */}
      <div className="flex flex-col gap-4 sm:hidden">
        {tools.map((tool) => {
          const models = modelsByTool(tool.id);
          return (
            <div
              key={tool.id}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4"
            >
              <div className="text-sm font-semibold text-[var(--color-text-primary)]">{tool.name}</div>
              <div className="mt-0.5 font-mono text-xs text-[var(--color-text-muted)]">
                {TOOL_EQ[tool.id] ?? tool.symbol}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {STUDIOS.map((s) => (
                  <MatrixCell
                    key={s.id}
                    studio={s}
                    toolId={tool.id}
                    model={models.find((m) => m.studio === s.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MatrixCell({
  studio,
  toolId,
  model,
}: {
  studio: Studio;
  toolId: string;
  model?: ModelEntry;
}) {
  if (!model) {
    return (
      <span
        className="inline-block h-2 w-2 rounded-full opacity-25"
        style={{ background: 'var(--color-text-muted)' }}
        aria-label={`No model yet for ${studio.field}`}
      />
    );
  }

  if (model.status === 'live' && model.route) {
    return (
      <Link
        to={model.route}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white no-underline transition-opacity hover:opacity-90"
        style={{ background: studio.color }}
      >
        {model.title.split(/\s+/).slice(0, 3).join(' ')}
      </Link>
    );
  }

  return (
    <Link
      to={`/tools/${toolId}`}
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium no-underline transition-colors"
      style={{ borderColor: studio.color, color: studio.color }}
    >
      Next up
    </Link>
  );
}
