import type { Meta, StoryObj } from '@storybook/react';
import { Sparkline } from './Sparkline';

const meta: Meta<typeof Sparkline> = {
  title: 'Data/Sparkline',
  component: Sparkline,
};
export default meta;
type Story = StoryObj<typeof Sparkline>;

const upTrend = [42, 44, 41, 46, 48, 45, 52, 58, 55, 62];
const downTrend = [62, 58, 55, 52, 48, 50, 45, 42, 44, 40];
const flat = [50, 51, 49, 52, 50, 48, 51, 50, 49, 51];

export const Positive: Story = { args: { data: upTrend, color: 'positive', width: 120, height: 40 } };
export const Negative: Story = { args: { data: downTrend, color: 'negative', width: 120, height: 40 } };
export const Neutral: Story = { args: { data: flat, color: 'neutral', width: 120, height: 40 } };
