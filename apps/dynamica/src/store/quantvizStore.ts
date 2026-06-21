import { create } from 'zustand';
import type {
  CorrelationData,
  ReturnsData,
  PricesData,
  Holding,
  CustomTickerEntry,
  RangePreset,
  WindowDays,
} from '../lib/types';
import { fetchTickerData, syntheticTicker } from '../lib/fetchTicker';

const BASE = import.meta.env.BASE_URL;

interface Preset {
  name: string;
  description: string;
  holdings: { ticker: string; allocation: number }[];
  totalValue: number;
  range?: RangePreset;
}

export const PRESETS: Preset[] = [
  {
    name: 'Diversified Core',
    description: 'Classic broad-market allocation: US equities, bonds, gold, emerging markets',
    totalValue: 50_000,
    holdings: [
      { ticker: 'SPY', allocation: 0.60 },
      { ticker: 'BND', allocation: 0.30 },
      { ticker: 'GLD', allocation: 0.07 },
      { ticker: 'VWO', allocation: 0.03 },
    ],
    range: '2Y',
  },
  {
    name: 'All-Weather',
    description: "Dalio's risk-parity balance across economic environments",
    totalValue: 50_000,
    holdings: [
      { ticker: 'SPY', allocation: 0.30 },
      { ticker: 'TLT', allocation: 0.40 },
      { ticker: 'IEF', allocation: 0.15 },
      { ticker: 'GLD', allocation: 0.075 },
      { ticker: 'DJP', allocation: 0.075 },
    ],
    range: '5Y',
  },
  {
    name: 'Crypto & Equities',
    description: 'Growth-oriented mix of equities, crypto, and gold hedge',
    totalValue: 25_000,
    holdings: [
      { ticker: 'SPY',     allocation: 0.40 },
      { ticker: 'QQQ',     allocation: 0.25 },
      { ticker: 'BTC-USD', allocation: 0.20 },
      { ticker: 'ETH-USD', allocation: 0.10 },
      { ticker: 'GLD',     allocation: 0.05 },
    ],
    range: '2Y',
  },
  {
    name: 'US Sectors',
    description: 'Equal-weight sector rotation: financials, energy, tech, health, utilities',
    totalValue: 50_000,
    holdings: [
      { ticker: 'XLF', allocation: 0.20 },
      { ticker: 'XLE', allocation: 0.20 },
      { ticker: 'XLK', allocation: 0.20 },
      { ticker: 'XLV', allocation: 0.20 },
      { ticker: 'XLU', allocation: 0.20 },
    ],
    range: '5Y',
  },
  {
    name: '2008 Crisis',
    description: 'See how equities, bonds, gold, real estate & financials diverged in 2008',
    totalValue: 75_000,
    holdings: [
      { ticker: 'SPY', allocation: 0.50 },
      { ticker: 'GLD', allocation: 0.20 },
      { ticker: 'TLT', allocation: 0.20 },
      { ticker: 'VNQ', allocation: 0.05 },
      { ticker: 'XLF', allocation: 0.05 },
    ],
    range: '20Y',
  },
  {
    name: 'Tech Concentration',
    description: "How correlated big tech became — includes ARKK's blowup and the 2022 rate-hike selloff",
    totalValue: 50_000,
    holdings: [
      { ticker: 'QQQ',  allocation: 0.30 },
      { ticker: 'XLK',  allocation: 0.25 },
      { ticker: 'ARKK', allocation: 0.20 },
      { ticker: 'SPY',  allocation: 0.15 },
      { ticker: 'VGT',  allocation: 0.10 },
    ],
    range: '5Y',
  },
  {
    name: 'Inflation Trade',
    description: 'Which "inflation hedges" actually hedged during the 2021–2023 cycle',
    totalValue: 50_000,
    holdings: [
      { ticker: 'GLD', allocation: 0.25 },
      { ticker: 'TIP', allocation: 0.25 },
      { ticker: 'XLE', allocation: 0.25 },
      { ticker: 'VNQ', allocation: 0.15 },
      { ticker: 'SPY', allocation: 0.10 },
    ],
    range: '5Y',
  },
  {
    name: 'Factor Rotation',
    description: 'Value vs growth vs small cap vs international — how factor correlations shift across cycles',
    totalValue: 50_000,
    holdings: [
      { ticker: 'SPY', allocation: 0.30 },
      { ticker: 'VTV', allocation: 0.20 },
      { ticker: 'VUG', allocation: 0.20 },
      { ticker: 'IWM', allocation: 0.15 },
      { ticker: 'VEA', allocation: 0.15 },
    ],
    range: '10Y',
  },
];

interface QuantVizState {
  holdings: Holding[];
  rangePreset: RangePreset;
  windowDays: WindowDays;
  windowEndIdx: number;
  customTickers: Record<string, CustomTickerEntry>;
  correlationData: CorrelationData | null;
  returnsData: ReturnsData | null;
  pricesData: PricesData | null;
  lastRefreshed: string | null;
  isRefreshing: boolean;
  dataError: string | null;

  setRange: (range: RangePreset) => void;
  setWindowDays: (days: WindowDays) => void;
  setWindowEndIdx: (idx: number | ((prev: number) => number)) => void;
  updateQuantity: (ticker: string, qty: number) => void;
  removeTicker: (ticker: string) => void;
  clearAll: () => void;
  loadStaticData: () => Promise<void>;
  addTicker: (ticker: string, refDates: string[]) => Promise<void>;
  loadPreset: (preset: Preset, refDates: string[]) => Promise<void>;
  refreshAll: (refDates: string[]) => Promise<void>;
  setHoldingsAndTickers: (holdings: Holding[], customTickers: Record<string, CustomTickerEntry>) => void;
}

export const useQuantVizStore = create<QuantVizState>((set, get) => ({
  holdings: [],
  rangePreset: '2Y',
  windowDays: 90,
  windowEndIdx: 0,
  customTickers: {},
  correlationData: null,
  returnsData: null,
  pricesData: null,
  lastRefreshed: null,
  isRefreshing: false,
  dataError: null,

  setRange: (range) => set({ rangePreset: range }),
  setWindowDays: (days) => set({ windowDays: days }),
  setWindowEndIdx: (idx) => set((s) => ({ windowEndIdx: typeof idx === 'function' ? idx(s.windowEndIdx) : idx })),

  updateQuantity: (ticker, qty) =>
    set((s) => ({ holdings: s.holdings.map((h) => h.ticker === ticker ? { ...h, quantity: qty } : h) })),

  removeTicker: (ticker) =>
    set((s) => {
      const next = { ...s.customTickers };
      delete next[ticker];
      return { holdings: s.holdings.filter((h) => h.ticker !== ticker), customTickers: next };
    }),

  clearAll: () => set({ holdings: [], customTickers: {} }),

  setHoldingsAndTickers: (holdings, customTickers) => set({ holdings, customTickers }),

  loadStaticData: async () => {
    try {
      const [corr, ret, prices] = await Promise.all([
        fetch(`${BASE}data/correlation.json`).then((r) => r.json()),
        fetch(`${BASE}data/returns.json`).then((r) => r.json()),
        fetch(`${BASE}data/prices.json`).then((r) => r.json()),
      ]);
      set({ correlationData: corr, returnsData: ret, pricesData: prices, dataError: null });
    } catch (e) {
      set({ dataError: String(e) });
    }
  },

  addTicker: async (ticker, refDates) => {
    const { rangePreset } = get();
    let fetched = await fetchTickerData(ticker, rangePreset);
    let isSynthetic = false;
    if (!fetched) {
      fetched = syntheticTicker(ticker, refDates);
      isSynthetic = true;
    }
    const latestPrice = fetched.closes[fetched.closes.length - 1] ?? 0;
    set((s) => ({
      customTickers: {
        ...s.customTickers,
        [ticker]: { closes: fetched!.closes, dates: fetched!.dates, name: fetched!.name, latestPrice, synthetic: isSynthetic, assetType: fetched!.assetType },
      },
      holdings: s.holdings.find((h) => h.ticker === ticker)
        ? s.holdings
        : [...s.holdings, { ticker, quantity: 0 }],
    }));
  },

  loadPreset: async (preset, refDates) => {
    const targetRange = preset.range ?? get().rangePreset;
    set({ holdings: [], customTickers: {}, isRefreshing: true });
    if (preset.range) set({ rangePreset: preset.range });

    const results = await Promise.all(
      preset.holdings.map(async ({ ticker, allocation }) => {
        let fetched = await fetchTickerData(ticker, targetRange);
        let isSynthetic = false;
        if (!fetched) {
          fetched = syntheticTicker(ticker, refDates);
          isSynthetic = true;
        }
        const latestPrice = fetched.closes[fetched.closes.length - 1] ?? 1;
        const quantity = latestPrice > 0
          ? Math.round((preset.totalValue * allocation) / latestPrice * 100) / 100
          : 0;
        return { ticker, fetched, isSynthetic, latestPrice, quantity };
      })
    );

    const newCustomTickers: Record<string, CustomTickerEntry> = {};
    const newHoldings: Holding[] = [];
    for (const { ticker, fetched, isSynthetic, latestPrice, quantity } of results) {
      newCustomTickers[ticker] = { closes: fetched.closes, dates: fetched.dates, name: fetched.name, latestPrice, synthetic: isSynthetic, assetType: fetched.assetType };
      newHoldings.push({ ticker, quantity });
    }
    set({ customTickers: newCustomTickers, holdings: newHoldings, isRefreshing: false, lastRefreshed: new Date().toISOString() });
  },

  refreshAll: async (refDates) => {
    const { holdings, rangePreset } = get();
    if (holdings.length === 0) return;
    set({ isRefreshing: true });
    const results = await Promise.all(
      holdings.map(async ({ ticker, quantity }) => {
        let fetched = await fetchTickerData(ticker, rangePreset);
        let isSynthetic = false;
        if (!fetched) {
          fetched = syntheticTicker(ticker, refDates);
          isSynthetic = true;
        }
        const latestPrice = fetched.closes[fetched.closes.length - 1] ?? 0;
        return { ticker, quantity, fetched, isSynthetic, latestPrice };
      })
    );
    const newCustomTickers: Record<string, CustomTickerEntry> = {};
    const newHoldings: Holding[] = [];
    for (const { ticker, quantity, fetched, isSynthetic, latestPrice } of results) {
      newCustomTickers[ticker] = { closes: fetched.closes, dates: fetched.dates, name: fetched.name, latestPrice, synthetic: isSynthetic, assetType: fetched.assetType };
      newHoldings.push({ ticker, quantity });
    }
    set({ customTickers: newCustomTickers, holdings: newHoldings, isRefreshing: false, lastRefreshed: new Date().toISOString() });
  },
}));
