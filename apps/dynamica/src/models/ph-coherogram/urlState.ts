import { parseHashQuery, buildHashQuery } from '../../shell';

export interface CoherogramState {
  /** 'real' = bundled USGS snapshot (May 2024 storm); 'synthetic' = seeded test tones. */
  source: 'real' | 'synthetic';
  /** Only meaningful when source === 'synthetic'; kept in state either way for a stable codec. */
  seed: number;
}

const VALID_SOURCE = new Set(['real', 'synthetic']);

// Format: #/models/ph-coherogram?source=synthetic&seed=42
export function encodeState(state: CoherogramState): string {
  return buildHashQuery({ source: state.source, seed: state.seed });
}

export function decodeState(search: string): CoherogramState | null {
  const params = parseHashQuery(search);
  const { source, seed: seedParam } = params;
  if (!source || !seedParam) return null;
  if (!VALID_SOURCE.has(source)) return null;
  const seed = parseInt(seedParam, 10);
  if (isNaN(seed)) return null;
  return { source: source as 'real' | 'synthetic', seed };
}
