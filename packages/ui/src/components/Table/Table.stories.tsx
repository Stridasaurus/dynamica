import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';
import { Badge } from '../Badge/Badge';

const meta: Meta<typeof Table> = {
  title: 'Data/Table',
  component: Table,
};
export default meta;
type Story = StoryObj<typeof Table>;

interface WatchlistRow { symbol: string; price: string; change: number; volume: string; }

const columns = [
  { key: 'symbol', header: 'Symbol', sortable: true },
  { key: 'price', header: 'Price', sortable: true },
  {
    key: 'change',
    header: 'Change',
    sortable: true,
    render: (row: WatchlistRow) => (
      <Badge variant={row.change >= 0 ? 'positive' : 'negative'}>
        {row.change >= 0 ? '+' : ''}{row.change}%
      </Badge>
    ),
  },
  { key: 'volume', header: 'Volume' },
];

const data: WatchlistRow[] = [
  { symbol: 'BTC/USD', price: '$67,420', change: 2.4, volume: '28.4B' },
  { symbol: 'ETH/USD', price: '$3,210', change: -1.8, volume: '12.1B' },
  { symbol: 'SOL/USD', price: '$142', change: 5.2, volume: '3.2B' },
  { symbol: 'AAPL', price: '$189.42', change: 0.8, volume: '55.3M' },
];

export const Watchlist: Story = {
  render: () => <Table columns={columns} data={data} getRowKey={r => r.symbol} />,
};

export const Loading: Story = {
  render: () => <Table columns={columns} data={[]} loading skeletonRows={5} />,
};
