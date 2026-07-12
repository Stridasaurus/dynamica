import type { RangePreset } from '../../lib/types';

const RANGE_OPTIONS: RangePreset[] = ['3M', '6M', '1Y', '2Y', '5Y', '10Y', '20Y'];

interface Props {
  rangePreset: RangePreset;
  onRangeChange: (r: RangePreset) => void;
}

/** Time-range preset buttons. Rendered next to Summary Statistics because the
 *  range scopes the WHOLE analysis (stats, heatmap, returns, portfolio chart),
 *  not just the returns panel it used to live in (PLAN.md R2). */
export default function RangeSelector({ rangePreset, onRangeChange }: Props) {
  return (
    <div className="flex gap-1" role="group" aria-label="Time range">
      {RANGE_OPTIONS.map((r) => (
        <button
          key={r}
          onClick={() => onRangeChange(r)}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
            rangePreset === r
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
