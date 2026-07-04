import { useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Badge, Breadcrumb } from '@settgast/ui';
import { useQuantVizStore, PRESETS } from '../store/quantvizStore';
import { correlationMatrix, normalizedCumulativeReturns } from '../lib/correlation';
import { alignToReferenceDates, syntheticTicker, fetchTickerData } from '../lib/fetchTicker';
import { encodeURLState, decodeURLState } from '../lib/urlState';
import type { CorrelationData, HoldingWithWeight, ReturnsData, RangePreset } from '../lib/types';
import { MODELS, crossLinks } from '../models';
import PortfolioBuilder from '../components/quantviz/PortfolioBuilder';
import CorrelationHeatmap from '../components/quantviz/CorrelationHeatmap';
import CumulativeReturns from '../components/quantviz/CumulativeReturns';
import PortfolioChart from '../components/quantviz/PortfolioChart';
import SummaryStats from '../components/quantviz/SummaryStats';
import RollingWindowPanel from '../components/quantviz/RollingWindowPanel';

const MODEL = MODELS.find((m) => m.id === 'qv-correlation-lab')!;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{children}</h2>;
}

const RANGE_DAYS: Record<RangePreset, number> = {
  '3M': 63, '6M': 126, '1Y': 252, '2Y': 504,
  '5Y': 1260, '10Y': 2520, '20Y': 5040,
};

const EXTENDED_RANGES = new Set<RangePreset>(['5Y', '10Y', '20Y']);

export default function QuantVizPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    holdings, rangePreset, windowDays, windowEndIdx,
    customTickers, returnsData, pricesData, correlationData,
    isRefreshing, lastRefreshed, dataError,
    setRange, setWindowDays, setWindowEndIdx,
    updateQuantity, removeTicker, clearAll,
    loadStaticData, addTicker, loadPreset, refreshAll,
    setHoldingsAndTickers,
  } = useQuantVizStore();

  // Load static JSON on mount
  useEffect(() => {
    loadStaticData();
  }, [loadStaticData]);

  // ── Derived date axis ──────────────────────────────────────────────────────
  const allDates = useMemo(() => {
    if (EXTENDED_RANGES.has(rangePreset)) {
      let longest: string[] = [];
      for (const entry of Object.values(customTickers)) {
        if (entry.dates.length > longest.length) longest = entry.dates;
      }
      return longest;
    }
    return returnsData?.dates ?? [];
  }, [rangePreset, returnsData, customTickers]);

  // ── Merged series (static + custom) ───────────────────────────────────────
  const mergedSeries = useMemo(() => {
    if (!returnsData) return {};
    const activeTickers = new Set(holdings.map((h) => h.ticker));
    const series: Record<string, number[]> = {};
    if (!EXTENDED_RANGES.has(rangePreset)) {
      for (const [t, vals] of Object.entries(returnsData.series)) {
        if (activeTickers.has(t)) series[t] = vals;
      }
    }
    for (const [ticker, entry] of Object.entries(customTickers)) {
      if (allDates.length === 0) continue;
      const aligned = alignToReferenceDates(
        { dates: entry.dates, closes: entry.closes, name: entry.name, assetType: entry.assetType },
        allDates,
      );
      series[ticker] = normalizedCumulativeReturns(aligned);
    }
    return series;
  }, [returnsData, customTickers, allDates, holdings, rangePreset]);

  // ── Range-filtered returns ─────────────────────────────────────────────────
  const filteredReturns = useMemo((): ReturnsData => {
    if (!returnsData) return { dates: [], series: {}, synthetic: false };
    const maxDays = RANGE_DAYS[rangePreset];
    const startIdx = Math.max(0, allDates.length - maxDays);
    const filteredDates = allDates.slice(startIdx);
    const filteredSeries: Record<string, number[]> = {};
    for (const [t, vals] of Object.entries(mergedSeries)) {
      const sliced = vals.slice(startIdx);
      filteredSeries[t] = normalizedCumulativeReturns(sliced);
    }
    return { dates: filteredDates, series: filteredSeries, synthetic: returnsData.synthetic };
  }, [returnsData, mergedSeries, rangePreset, allDates]);

  // Clamp window index when date range changes
  useEffect(() => {
    const newMax = Math.max(0, filteredReturns.dates.length - 1);
    setWindowEndIdx((prev: number) => {
      if (prev === 0 || prev > newMax) return newMax;
      return prev;
    });
  }, [filteredReturns.dates.length, setWindowEndIdx]);

  // ── Rolling correlation ────────────────────────────────────────────────────
  const rollingCorrelation = useMemo((): CorrelationData => {
    const { dates, series } = filteredReturns;
    const tickers = Object.keys(series);
    if (tickers.length === 0 || dates.length === 0) {
      return { tickers: [], matrix: [], generated_at: '', synthetic: false };
    }
    const startIdx = Math.max(0, windowEndIdx - windowDays + 1);
    const endIdx = windowEndIdx + 1;
    const windowed: Record<string, number[]> = {};
    for (const t of tickers) windowed[t] = series[t].slice(startIdx, endIdx);
    const { tickers: corrTickers, matrix } = correlationMatrix(windowed);
    return {
      tickers: corrTickers,
      matrix,
      generated_at: `${dates[startIdx] ?? ''} → ${dates[windowEndIdx] ?? ''}`,
      synthetic: filteredReturns.synthetic || Object.values(customTickers).some((e) => e.synthetic),
    };
  }, [filteredReturns, windowEndIdx, windowDays, customTickers]);

  // ── Enriched holdings ─────────────────────────────────────────────────────
  const enrichedHoldings: HoldingWithWeight[] = useMemo(() => {
    const priceMap: Record<string, { price: number; name: string; type: string }> = {};
    if (pricesData) {
      for (const [t, meta] of Object.entries(pricesData.tickers)) {
        priceMap[t] = { price: meta.price, name: meta.name, type: meta.type };
      }
    }
    for (const [t, entry] of Object.entries(customTickers)) {
      priceMap[t] = { price: entry.latestPrice, name: entry.name, type: entry.assetType };
    }
    const totalValue = holdings.reduce((s, h) => s + (priceMap[h.ticker]?.price ?? 0) * h.quantity, 0);
    return holdings.map((h) => {
      const meta = priceMap[h.ticker] ?? { price: 0, name: h.ticker, type: 'Unknown' };
      const value = meta.price * h.quantity;
      return { ...h, price: meta.price, name: meta.name, type: meta.type, value, weight: totalValue > 0 ? value / totalValue : 0 };
    });
  }, [holdings, pricesData, customTickers]);

  // ── URL state ─────────────────────────────────────────────────────────────
  const initialHashRef = useRef(location.hash);
  const restoredRef = useRef(false);
  const restoreAttemptedRef = useRef(false);

  // Restore from URL hash (e.g. #/quantviz?t=SPY:10&range=2Y&w=90)
  useEffect(() => {
    if (!returnsData || restoreAttemptedRef.current) return;
    restoreAttemptedRef.current = true;

    // The hash is like "#/quantviz?t=SPY:10..." — extract the query part
    const hashStr = initialHashRef.current;
    const qIdx = hashStr.indexOf('?');
    const search = qIdx >= 0 ? hashStr.slice(qIdx) : '';
    const urlState = search ? decodeURLState(search) : null;

    if (!urlState) {
      loadPreset(PRESETS[0], returnsData.dates).then(() => { restoredRef.current = true; });
      return;
    }

    const { holdings: urlHoldings, range, windowDays: urlWindowDays } = urlState;
    setRange(range);
    setWindowDays(urlWindowDays);

    const refDates = returnsData.dates;
    Promise.all(
      urlHoldings.map(async ({ ticker }) => {
        let fetched = await fetchTickerData(ticker, range);
        let isSynthetic = false;
        if (!fetched) {
          fetched = syntheticTicker(ticker, refDates);
          isSynthetic = true;
        }
        return { ticker, fetched, isSynthetic, latestPrice: fetched.closes[fetched.closes.length - 1] ?? 0 };
      })
    ).then((results) => {
      const newCustomTickers: typeof customTickers = {};
      const newHoldings: typeof holdings = [];
      for (const { ticker, fetched, isSynthetic, latestPrice } of results) {
        newCustomTickers[ticker] = { closes: fetched.closes, dates: fetched.dates, name: fetched.name, latestPrice, synthetic: isSynthetic, assetType: fetched.assetType };
        const urlH = urlHoldings.find((h) => h.ticker === ticker);
        newHoldings.push({ ticker, quantity: urlH?.quantity ?? 0 });
      }
      setHoldingsAndTickers(newHoldings, newCustomTickers);
      restoredRef.current = true;
    }).catch(() => { restoredRef.current = true; });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnsData]);

  // Write URL hash when portfolio changes (after restoration)
  useEffect(() => {
    if (!restoredRef.current) return;
    const encoded = encodeURLState(holdings, rangePreset, windowDays);
    const newHash = encoded ? `#/quantviz?${encoded}` : '#/quantviz';
    if (window.location.hash !== newHash) {
      navigate(newHash.slice(1), { replace: true });
    }
  }, [holdings, rangePreset, windowDays, navigate]);

  // Re-fetch all custom tickers when range changes
  const prevRangeRef = useRef<RangePreset>(rangePreset);
  useEffect(() => {
    const prev = prevRangeRef.current;
    prevRangeRef.current = rangePreset;
    if (prev !== rangePreset && restoredRef.current) {
      const refDates = returnsData?.dates ?? [];
      Object.keys(customTickers).forEach((t) => addTicker(t, refDates));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangePreset]);

  const maxWindowIdx = Math.max(0, filteredReturns.dates.length - 1);
  const hasSyntheticCustom = Object.values(customTickers).some((e) => e.synthetic);
  const isSynthetic = correlationData?.synthetic || hasSyntheticCustom;

  if (dataError) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-mono">{dataError}</p>
          <p className="text-gray-500 mt-2 text-sm">Could not load static data files.</p>
        </div>
      </div>
    );
  }

  if (!correlationData || !returnsData || !pricesData) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 dark:text-gray-600 text-lg">Loading portfolio data…</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">
      <Breadcrumb
        items={[
          { label: 'Dynamica', href: '#/' },
          { label: 'QuantViz Studio', href: '#/studios/quantviz' },
          { label: MODEL.title },
        ]}
      />

      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{MODEL.title}</h1>
            {isSynthetic && !hasSyntheticCustom && <Badge variant="warning">Synthetic data</Badge>}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {filteredReturns.dates.length} trading days
            {correlationData.generated_at && ` · Data: ${correlationData.generated_at.slice(0, 10)}`}
            {hasSyntheticCustom && (
              <span className="ml-2 text-amber-600 dark:text-amber-400">· Some tickers use synthetic data</span>
            )}
          </p>
        </div>
      </div>

      {/* Portfolio Builder */}
      <PortfolioBuilder
        holdings={enrichedHoldings}
        onAdd={(t) => addTicker(t, allDates.length > 0 ? allDates : returnsData.dates)}
        onRemove={removeTicker}
        onQtyChange={updateQuantity}
        onLoadPreset={(p) => loadPreset(p, allDates.length > 0 ? allDates : returnsData.dates)}
        onClearAll={clearAll}
        onRefresh={() => refreshAll(allDates.length > 0 ? allDates : returnsData.dates)}
        isRefreshing={isRefreshing}
        lastRefreshed={lastRefreshed}
      />

      {/* Summary Statistics */}
      <div className="flex flex-col gap-3">
        <SectionTitle>Summary Statistics</SectionTitle>
        <SummaryStats
          data={rollingCorrelation}
          series={filteredReturns.series}
          rangeLabel={rangePreset}
        />
      </div>

      {/* Correlation Heatmap + rolling window controls */}
      <div className="flex flex-col gap-3">
        <SectionTitle>Correlation Heatmap</SectionTitle>
        <RollingWindowPanel
          windowDays={windowDays}
          onWindowChange={setWindowDays}
          windowEndIdx={windowEndIdx}
          onWindowEndChange={setWindowEndIdx}
          maxIdx={maxWindowIdx}
          filteredDates={filteredReturns.dates}
        />
        <CorrelationHeatmap data={rollingCorrelation} />
      </div>

      {/* Cumulative Returns */}
      <CumulativeReturns
        data={filteredReturns}
        rangePreset={rangePreset}
        onRangeChange={setRange}
      />

      {/* Portfolio Weighted Return */}
      <div className="flex flex-col gap-3">
        <SectionTitle>Portfolio Weighted Return</SectionTitle>
        <p className="text-xs text-gray-400 dark:text-gray-500 -mt-2">
          Blended portfolio return weighted by current holdings.
        </p>
        <PortfolioChart returnsData={filteredReturns} holdings={enrichedHoldings} />
      </div>

      {/* Cross-link footer: same math, other studios */}
      <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 dark:border-gray-800 pt-4 mt-2">
        <Link
          to={`/tools/${MODEL.tools[0]}`}
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Same math, other studios →
        </Link>
        {crossLinks(MODEL.tools[0])
          .filter((l) => l.studio !== MODEL.studio)
          .map((l) => (
            <Link
              key={l.studio}
              to={`/studios/${l.studio}`}
              className="rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1 text-xs text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              {l.models.length > 0 ? l.models[0].title : `No model yet in ${l.studio}`}
            </Link>
          ))}
      </div>

      {/* Provenance footer */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-600 border-t border-gray-200 dark:border-gray-800 pt-4">
        {correlationData.synthetic
          ? 'Using synthetic data — live market data unavailable in this environment.'
          : 'Market data via yfinance (pre-built) and Yahoo Finance (live additions). Not financial advice.'}
      </p>
    </div>
  );
}
