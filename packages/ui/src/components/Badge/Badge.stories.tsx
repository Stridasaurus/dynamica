import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Data/Badge',
  component: Badge,
  args: { children: 'Label' },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};
export const Positive: Story = { args: { variant: 'positive', children: '+2.4%' } };
export const Negative: Story = { args: { variant: 'negative', children: '-1.8%' } };
export const Accent: Story = { args: { variant: 'accent', children: 'Live' } };
export const Warning: Story = { args: { variant: 'warning', children: 'Pending' } };
