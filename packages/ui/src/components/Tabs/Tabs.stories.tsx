import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';
import { Body } from '../Typography/Typography';

const meta: Meta<typeof Tabs> = { title: 'Navigation/Tabs', component: Tabs };
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs
      items={[
        { value: 'chart', label: 'Chart', content: <Body size="sm" color="secondary">Chart view</Body> },
        { value: 'orderbook', label: 'Order Book', content: <Body size="sm" color="secondary">Order book view</Body> },
        { value: 'trades', label: 'Recent Trades', content: <Body size="sm" color="secondary">Recent trades</Body> },
        { value: 'info', label: 'Info', content: <Body size="sm" color="secondary">Asset information</Body>, disabled: true },
      ]}
    />
  ),
};
