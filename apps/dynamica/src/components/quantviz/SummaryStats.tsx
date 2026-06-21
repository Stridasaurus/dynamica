import { Card } from '@settgast/ui';
import type { CorrelationData } from '../../lib/types';
import { avgPairwiseCorrelation, extremePairs, annualizedVol, annualizedReturn, sharpe } from '../../lib/correlation';

interface Props {
  data: CorrelationData;
  series: Record<string, number[]>;
  rangeLabel: string;
}

function fmt(n: number, decimals: number, suffix = ''): string {
  if (!isFinite(n) || isNaN(n)) return '—';
  return n.toFixed(decimals) + suffix;
}

export default function SummaryStats({ data, series, rangeLabel }: Props) {
  const { tickers, matrix } = data;
  if (tickers.length < 2) return null;

  const avg = avgPairwiseCorrelation(tickers, matrix);
  const { mostCorrelated, leastCorrelated } = extremePairs(tickers, matrix);

  const avgLabel = avg > 0.8
    ? 'Highly concentrated'
    : avg > 0.5
    ? 'Moderately diversified'
    : 'Well diversified';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Avg pairwise correlation</span>
          <span className="text-2xl font-semibold font-mono text-gray-900 dark:text-gray-100">{avg.toFixed(3)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{avgLabel}</span>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Most correlated pair</span>
          <span className="text-2xl font-semibold font-mono text-gray-900 dark:text-gray-100">{fmt(mostCorrelated[2], 3)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{mostCorrelated[0]} &amp; {mostCorrelated[1]}</span>
        </Card>
        <Card className="p-4 flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Least correlated pair</span>
          <span className="text-2xl font-semibold font-mono text-gray-900 dark:text-gray-100">{fmt(leastCorrelated[2], 3)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{leastCorrelated[0]} &amp; {leastCorrelated[1]}</span>
        </Card>
      </div>

      <Card className="p-4">
        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
          Annualized stats · {rangeLabel}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left pb-2 font-medium">Ticker</th>
                <th className="text-right pb-2 font-medium">Return</th>
                <th className="text-right pb-2 font-medium">Volatility</th>
                <th className="text-right pb-2 font-medium">Sharpe</th>
              </tr>
            </thead>
            <tbody>
              {tickers.map((ticker) => {
                const s = series[ticker];
                const ret = s ? annualizedReturn(s) : NaN;
                const vol = s ? annualizedVol(s) : NaN;
                const sh = s ? sharpe(s) : NaN;
                return (
                  <tr key={ticker} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                    <td className="py-2 font-mono font-medium text-gray-900 dark:text-gray-100">{ticker}</td>
                    <td className={`py-2 text-right font-mono ${isFinite(ret) ? (ret >= 0 ? 'text-emerald-600' : 'text-red-600') : 'text-gray-400'}`}>
                      {fmt(ret * 100, 1, '%')}
                    </td>
                    <td className="py-2 text-right font-mono text-gray-700 dark:text-gray-300">
                      {fmt(vol * 100, 1, '%')}
                    </td>
                    <td className={`py-2 text-right font-mono ${isFinite(sh) ? (sh >= 1 ? 'text-emerald-600' : sh >= 0 ? 'text-yellow-600' : 'text-red-600') : 'text-gray-400'}`}>
                      {fmt(sh, 2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
