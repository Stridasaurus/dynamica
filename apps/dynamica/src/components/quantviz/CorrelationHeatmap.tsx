import { useState } from 'react';
import { Card } from '@settgast/ui';
import type { CorrelationData } from '../../lib/types';

interface Props {
  data: CorrelationData;
}

function corrColor(val: number): string {
  const clamped = Math.max(-1, Math.min(1, val));
  if (clamped >= 0) {
    const g = Math.round(255 * (1 - clamped));
    const b = Math.round(255 * (1 - clamped));
    return `rgb(255,${g},${b})`;
  } else {
    const r = Math.round(255 * (1 + clamped));
    const g = Math.round(255 * (1 + clamped));
    return `rgb(${r},${g},255)`;
  }
}

function textColor(val: number): string {
  return Math.abs(val) > 0.6 ? '#fff' : '#374151';
}

function corrLabel(val: number): string {
  if (val > 0.8) return 'Strongly correlated';
  if (val > 0.5) return 'Moderately correlated';
  if (val > 0.2) return 'Weakly correlated';
  if (val < -0.5) return 'Negatively correlated';
  return 'Near-uncorrelated';
}

export default function CorrelationHeatmap({ data }: Props) {
  const { tickers, matrix } = data;
  const [tooltip, setTooltip] = useState<{ i: number; j: number } | null>(null);

  if (tickers.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-gray-400 dark:text-gray-600 text-center">
          Add at least 2 assets to see the correlation matrix.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4 overflow-x-auto">
      <div className="inline-block min-w-full">
        {/* Column headers */}
        <div className="flex" style={{ marginLeft: '80px' }}>
          {tickers.map((t) => (
            <div
              key={t}
              className="flex-1 text-center text-xs font-mono font-semibold text-gray-500 dark:text-gray-400 pb-1 truncate"
              style={{ minWidth: '60px' }}
            >
              {t}
            </div>
          ))}
        </div>

        {/* Rows */}
        {tickers.map((rowTicker, i) => (
          <div key={rowTicker} className="flex items-center">
            <div
              className="text-xs font-mono font-semibold text-gray-500 dark:text-gray-400 text-right pr-2 shrink-0"
              style={{ width: '78px' }}
            >
              {rowTicker}
            </div>
            {tickers.map((_, j) => {
              const val = matrix[i][j];
              const isHovered = tooltip?.i === i && tooltip?.j === j;
              return (
                <div
                  key={j}
                  className="flex-1 relative cursor-pointer transition-transform hover:scale-105 hover:z-10"
                  style={{ minWidth: '60px', minHeight: '52px' }}
                  onMouseEnter={() => setTooltip({ i, j })}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <div
                    className="w-full h-full flex items-center justify-center rounded-sm m-px text-xs font-mono font-semibold select-none"
                    style={{ backgroundColor: corrColor(val), color: textColor(val), minHeight: '50px' }}
                  >
                    {val.toFixed(2)}
                  </div>
                  {isHovered && (
                    <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white rounded-lg text-xs shadow-lg whitespace-nowrap pointer-events-none">
                      <div className="font-semibold">{tickers[i]} × {tickers[j]}</div>
                      <div>r = {val.toFixed(4)}</div>
                      <div className="text-gray-400">{corrLabel(val)}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center gap-3 mt-4 ml-20">
          <span className="text-xs text-gray-500 dark:text-gray-400">−1</span>
          <div
            className="h-3 flex-1 rounded"
            style={{ background: 'linear-gradient(to right, rgb(0,0,255), rgb(255,255,255), rgb(255,0,0))' }}
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">+1</span>
        </div>
      </div>
    </Card>
  );
}
