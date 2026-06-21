import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Heading, Body } from '../Typography/Typography';

const meta: Meta<typeof Card> = { title: 'Layout/Card', component: Card };
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 320 }}>
      <Heading level={4}>Portfolio Summary</Heading>
      <Body size="sm" color="secondary" style={{ marginTop: 8 }}>Total value across all positions.</Body>
    </Card>
  ),
};

export const Hoverable: Story = {
  render: () => (
    <Card hoverable style={{ maxWidth: 320 }}>
      <Heading level={4}>BTC/USD</Heading>
      <Body size="sm" color="secondary" style={{ marginTop: 8 }}>Click to open chart</Body>
    </Card>
  ),
};
