import { useState } from 'react';
import { Card, Badge } from '@settgast/ui';
import { PRESETS } from '../../store/quantvizStore';
import type { HoldingWithWeight } from '../../lib/types';

interface Props {
  holdings: HoldingWithWeight[];
  onAdd: (ticker: string) => Promise<void>;
  onRemove: (ticker: string) => void;
  onQtyChange: (ticker: string, qty: number) => void;
  onLoadPreset: (preset: typeof PRESETS[0]) => void;
  onClearAll: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastRefreshed: string | null;
}

const ASSET_BADGE: Record<string, 'default' | 'positive' | 'negative' | 'accent' | 'warning'> = {
  ETF: 'accent',
  Stock: 'default',
  Crypto: 'warning',
  'Mutual Fund': 'default',
  Commodity: 'positive',
  Forex: 'default',
  Index: 'default',
};

function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

export default function PortfolioBuilder({
  holdings,
  onAdd,
  onRemove,
  onQtyChange,
  onLoadPreset,
  onClearAll,
  onRefresh,
  isRefreshing,
  lastRefreshed,
}: Props) {
  const [tickerInput, setTickerInput] = useState('');
  const [addError, setAddError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const existingTickers = new Set(holdings.map((h) => h.ticker));
  const totalValue = holdings.reduce((s, h) => s + h.value, 0);

  const handleAdd = async () => {
    const t = tickerInput.trim().toUpperCase();
    if (!t) return;
    if (existingTickers.has(t)) {
      setAddError(`${t} is already in your portfolio`);
      return;
    }
    setAddError('');
    setIsAdding(true);
    try {
      await onAdd(t);
      setTickerInput('');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Holdings</h2>
        <div className="flex items-center gap-2">
          {lastRefreshed && (
            <span className="text-xs text-gray-400 dark:text-gray-600 hidden sm:block">
              as of {formatTimestamp(lastRefreshed)}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={isRefreshing || holdings.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRefreshing ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Refreshing…
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </>
            )}
          </button>
        </div>
      </div>

      {/* Ticker input */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={tickerInput}
          onChange={(e) => { setTickerInput(e.target.value.toUpperCase()); setAddError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="e.g. AAPL, BTC-USD, GC"
          className="flex-1 px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleAdd}
          disabled={isAdding || !tickerInput.trim()}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
        >
          {isAdding ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : null}
          Add
        </button>
      </div>
      {addError && <p className="text-xs text-red-600 mb-2">{addError}</p>}

      {/* Presets */}
      <div className="flex flex-wrap gap-1.5 items-center mb-4">
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide shrink-0">Presets</span>
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => onLoadPreset(p)}
            title={p.description}
            className="px-2.5 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
          >
            {p.name}
          </button>
        ))}
        {holdings.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-2.5 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Holdings table */}
      {holdings.length === 0 ? (
        <div className="text-sm text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-3">
          Pick a preset above or type a ticker to get started.
        </div>
      ) : (
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left pb-2 font-medium pl-1">Ticker</th>
                <th className="text-left pb-2 font-medium hidden sm:table-cell">Name</th>
                <th className="text-left pb-2 font-medium hidden sm:table-cell">Type</th>
                <th className="text-right pb-2 font-medium">Price</th>
                <th className="text-right pb-2 font-medium">Qty</th>
                <th className="text-right pb-2 font-medium">Value</th>
                <th className="text-right pb-2 font-medium">Weight</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.ticker} className="border-b border-gray-100 dark:border-gray-800 last:border-0 group">
                  <td className="py-2 pl-1 font-mono font-semibold text-gray-900 dark:text-gray-100">{h.ticker}</td>
                  <td className="py-2 text-gray-600 dark:text-gray-400 hidden sm:table-cell truncate max-w-[160px]">{h.name}</td>
                  <td className="py-2 hidden sm:table-cell">
                    <Badge variant={ASSET_BADGE[h.type] ?? 'default'}>{h.type}</Badge>
                  </td>
                  <td className="py-2 text-right font-mono text-gray-700 dark:text-gray-300">
                    ${h.price > 0 ? h.price.toFixed(2) : '—'}
                  </td>
                  <td className="py-2 text-right">
                    <input
                      type="number"
                      value={h.quantity}
                      min={0}
                      step={0.01}
                      onChange={(e) => onQtyChange(h.ticker, parseFloat(e.target.value) || 0)}
                      className="w-20 text-right px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="py-2 text-right font-mono text-gray-700 dark:text-gray-300">
                    ${h.value > 0 ? h.value.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'}
                  </td>
                  <td className="py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, h.weight * 100).toFixed(1)}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-gray-500 dark:text-gray-400 w-10 text-right">
                        {(h.weight * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-2 pl-2">
                    <button
                      onClick={() => onRemove(h.ticker)}
                      className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label={`Remove ${h.ticker}`}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                <td colSpan={5} className="pt-2 pl-1">Total</td>
                <td className="pt-2 text-right font-mono font-medium text-gray-700 dark:text-gray-300">
                  ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </Card>
  );
}
