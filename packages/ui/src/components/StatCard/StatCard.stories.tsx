import type { Meta, StoryObj } from '@storybook/react';
import { StatCard } from './StatCard';

const meta: Meta<typeof StatCard> = {
  title: 'Data/StatCard',
  component: StatCard,
};
export default meta;
type Story = StoryObj<typeof StatCard>;

export const Positive: Story = {
  args: { label: 'BTC/USD', value: '$67,420.00', change: 2.4 },
};
export const Negative: Story = {
  args: { label: 'ETH/USD', value: '$3,210.50', change: -1.8 },
};
export const Neutral: Story = {
  args: { label: 'Portfolio Value', value: '$24,350.00', change: 0 },
};
export const NoChange: Story = {
  args: { label: 'Available Cash', value: '$5,000.00' },
};
