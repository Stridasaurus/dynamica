import type { Studio, StudioId } from './types';

// Each studio owns a color identity. Class strings are written in full (never
// composed at runtime) so Tailwind's content scanner keeps them in the build.
export const STUDIOS: Studio[] = [
  {
    id: 'quantviz',
    name: 'QuantViz Studio',
    field: 'Finance',
    lens: 'The Market Lens',
    icon: '📈',
    blurb:
      'Markets as stochastic dynamical systems. Build portfolios and watch ' +
      'correlation, risk, and returns evolve across time.',
    headline: 'Financial markets as stochastic systems.',
    color: '#1e63c4',
    theme: {
      text: 'text-indigo-600 dark:text-indigo-400',
      tint: 'bg-indigo-100 dark:bg-indigo-900/40',
      chip: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      hoverBorder: 'hover:border-indigo-300 dark:hover:border-indigo-700',
    },
  },
  {
    id: 'neurolearn',
    name: 'NeuroLearn Studio',
    field: 'Neuroscience',
    lens: 'The Neural Lens',
    icon: '🧠',
    blurb:
      'The brain as a network of excitable units. Simulate single neurons, ' +
      'spike statistics, and the dynamics of populations.',
    headline: 'Neural dynamics, from first principles.',
    color: '#6d3bd1',
    theme: {
      text: 'text-purple-600 dark:text-purple-400',
      tint: 'bg-purple-100 dark:bg-purple-900/40',
      chip: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-700',
    },
  },
  {
    id: 'signalviz',
    name: 'SignalViz Studio',
    field: 'Signal Processing',
    lens: 'The Signal Lens',
    icon: '📡',
    blurb:
      'The home of the shared toolkit. Decompose, filter, and detect — the ' +
      'operations that reappear in finance and neuroscience.',
    headline: 'Measurement mathematics, made visual.',
    color: '#0f8a6a',
    theme: {
      text: 'text-teal-600 dark:text-teal-400',
      tint: 'bg-teal-100 dark:bg-teal-900/40',
      chip: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
      hoverBorder: 'hover:border-teal-300 dark:hover:border-teal-700',
    },
  },
];

const STUDIO_MAP: Record<StudioId, Studio> = Object.fromEntries(
  STUDIOS.map((s) => [s.id, s]),
) as Record<StudioId, Studio>;

export function getStudio(id: StudioId): Studio {
  return STUDIO_MAP[id];
}
