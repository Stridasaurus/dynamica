import { Card } from '@settgast/ui';
import type { WindowDays } from '../../lib/types';

interface Props {
  windowDays: WindowDays;
  onWindowChange: (w: WindowDays) => void;
  windowEndIdx: number;
  onWindowEndChange: (i: number) => void;
  maxIdx: number;
  filteredDates: string[];
}

const WINDOWS: WindowDays[] = [30, 60, 90, 180];

export default function RollingWindowPanel({
  windowDays,
  onWindowChange,
  windowEndIdx,
  onWindowEndChange,
  maxIdx,
  filteredDates,
}: Props) {
  const windowStart = filteredDates[Math.max(0, windowEndIdx - windowDays + 1)] ?? '';
  const windowEnd = filteredDates[windowEndIdx] ?? '';
  const canSlide = maxIdx >= windowDays;

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide shrink-0">
            Window
          </span>
          <div className="flex gap-1">
            {WINDOWS.map((w) => (
              <button
                key={w}
                onClick={() => onWindowChange(w)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  windowDays === w
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {w}d
              </button>
            ))}
          </div>
        </div>

        {canSlide ? (
          <div className="flex-1 flex items-center gap-3">
            <input
              type="range"
              min={windowDays - 1}
              max={maxIdx}
              value={windowEndIdx}
              onChange={(e) => onWindowEndChange(parseInt(e.target.value, 10))}
              className="flex-1 accent-indigo-600"
            />
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap shrink-0">
              {windowStart} → {windowEnd}
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-600">
            {windowEnd ? `${windowStart} → ${windowEnd}` : 'Window covers full range'}
          </span>
        )}
      </div>
    </Card>
  );
}
