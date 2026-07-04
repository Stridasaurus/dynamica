// Public surface of the model catalog. Import from '../models' everywhere.
export * from './types';
export { STUDIOS, getStudio } from './studios';
export { TOOLS, getTool, coreTools, TOOL_EQ } from './tools';
export { MODELS } from './registry';

import { MODELS } from './registry';
import { STUDIOS } from './studios';
import type { ModelEntry, StudioId, ToolId } from './types';

/** All models in a studio, flagships first. */
export function modelsByStudio(studio: StudioId): ModelEntry[] {
  return MODELS.filter((m) => m.studio === studio).sort(byStrength);
}

/** All models tagged with a tool. Models where it's the PRIMARY tool come first. */
export function modelsByTool(tool: ToolId): ModelEntry[] {
  return MODELS.filter((m) => m.tools.includes(tool)).sort((a, b) => {
    const ap = a.tools[0] === tool ? 0 : 1;
    const bp = b.tools[0] === tool ? 0 : 1;
    return ap - bp || byStrength(a, b);
  });
}

/** Number of live (built) models in a studio. */
export function liveCount(studio: StudioId): number {
  return MODELS.filter((m) => m.studio === studio && m.status === 'live').length;
}

export interface ToolCrossLink {
  studio: StudioId;
  models: ModelEntry[];
}

/** The cross-domain triple for a tool: its models grouped by studio, in studio
 *  display order. This powers the "same idea, three fields" exhibit. */
export function crossLinks(tool: ToolId): ToolCrossLink[] {
  const tagged = modelsByTool(tool);
  return STUDIOS.map((s) => ({
    studio: s.id,
    models: tagged.filter((m) => m.studio === s.id),
  }));
}

const STRENGTH_RANK = { flagship: 0, solid: 1, marginal: 2 } as const;
function byStrength(a: ModelEntry, b: ModelEntry): number {
  return STRENGTH_RANK[a.strength] - STRENGTH_RANK[b.strength];
}
