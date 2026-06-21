import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: 'Search…' } };
export const WithValue: Story = { args: { defaultValue: 'BTC-USD' } };
export const Error: Story = { args: { placeholder: 'Quantity', validation: 'error', hint: 'Must be greater than 0' } };
export const Warning: Story = { args: { placeholder: 'Quantity', validation: 'warning', hint: 'Near position limit' } };
export const Success: Story = { args: { placeholder: 'Quantity', validation: 'success', hint: 'Order valid' } };
export const Disabled: Story = { args: { placeholder: 'Disabled', disabled: true } };
