import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Forms/Select',
  component: Select,
};
export default meta;
type Story = StoryObj<typeof Select>;

const marketOptions = [
  { value: 'btc', label: 'BTC/USD' },
  { value: 'eth', label: 'ETH/USD' },
  { value: 'sol', label: 'SOL/USD' },
  { value: 'aapl', label: 'AAPL', disabled: true },
];

export const Default: Story = {
  args: { options: marketOptions, placeholder: 'Select market…' },
};

export const Grouped: Story = {
  args: {
    groups: [
      { label: 'Crypto', options: [{ value: 'btc', label: 'BTC/USD' }, { value: 'eth', label: 'ETH/USD' }] },
      { label: 'Stocks', options: [{ value: 'aapl', label: 'AAPL' }, { value: 'tsla', label: 'TSLA' }] },
    ],
  },
};
