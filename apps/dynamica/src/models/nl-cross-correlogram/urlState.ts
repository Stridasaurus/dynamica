import { parseHashQuery, buildHashQuery } from '../../shell';

export interface CrossCorrelogramState {
  seed: number;
  /** 0..1 in steps of 0.05. */
  driveStrength: number;
  /** Integer bins, 0..15. */
  trueLag: number;
  /** Correlogram half-window, one of 10/20/30. */
  maxLag: 10 | 20 | 30;
}

const VALID_MAX_LAG = new Set([10, 20, 30]);

// Format: #/models/nl-cross-correlogram?seed=42&drive=0.8&lag=5&maxlag=20
export function encodeState(state: CrossCorrelogramState): string {
  return buildHashQuery({
    seed: state.seed,
    drive: state.driveStrength,
    lag: state.trueLag,
    maxlag: state.maxLag,
  });
}

export function decodeState(search: string): CrossCorrelogramState | null {
  const params = parseHashQuery(search);
  const { seed: seedParam, drive: driveParam, lag: lagParam, maxlag: maxLagParam } = params;
  if (!seedParam || !driveParam || !lagParam || !maxLagParam) return null;

  const seed = parseInt(seedParam, 10);
  const driveStrength = parseFloat(driveParam);
  const trueLag = parseInt(lagParam, 10);
  const maxLag = parseInt(maxLagParam, 10);

  if (isNaN(seed)) return null;
  if (isNaN(driveStrength) || driveStrength < 0 || driveStrength > 1) return null;
  if (isNaN(trueLag) || trueLag < 0 || trueLag > 15) return null;
  if (!VALID_MAX_LAG.has(maxLag)) return null;

  return { seed, driveStrength, trueLag, maxLag: maxLag as 10 | 20 | 30 };
}
