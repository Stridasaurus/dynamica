import { Card } from '@settgast/ui';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import type { ReturnsData } from '../../lib/types';

interface Props {
  data: ReturnsData;
}

const COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#f97316', '#ec4899',
];

const SUBSAMPLE = 252;

function subsample<T>(arr: T[], target: number): T[] {
  if (arr.length <= target) return arr;
  const step = Math.floor(arr.length / target);
  const result: T[] = [];
  for (let i = 0; i < arr.length; i += step) result.push(arr[i]);
  if (result[result.length - 1] !== arr[arr.length - 1]) result.push(arr[arr.length - 1]);
  return result;
}

// Time-range selector moved out to <RangeSelector /> next to Summary
// Statistics (PLAN.md R2) — the range scopes the whole analysis, not just
// this panel.
export default function CumulativeReturns({ data }: Props) {
  const { dates, series } = data;
  const tickers = Object.keys(series);

  const fullChartData = dates.map((d, i) => {
    const row: Record<string, string | number> = { date: d };
    for (const t of tickers) row[t] = parseFloat(((series[t][i] - 1) * 100).toFixed(2));
    return row;
  });

  const chartData = subsample(fullChartData, SUBSAMPLE);

  const formatPct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex-1">
          Normalized Returns
          <span className="ml-1.5 text-xs font-normal text-gray-400 dark:text-gray-500">
            (vs. period start)
          </span>
        </h3>
      </div>

      {tickers.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-8">
          Add assets to see returns.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={formatPct}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />
            <Tooltip
              formatter={(val: number) => [formatPct(val)]}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {tickers.map((t, i) => (
              <Line
                key={t}
                type="monotone"
                dataKey={t}
                stroke={COLORS[i % COLORS.length]}
                dot={false}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
