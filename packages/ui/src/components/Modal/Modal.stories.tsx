import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../Button/Button';
import { Body } from '../Typography/Typography';

const meta: Meta<typeof Modal> = { title: 'Overlays/Modal', component: Modal };
export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => (
    <Modal
      trigger={<Button>Open Modal</Button>}
      title="Confirm Order"
      description="Review your order details before submitting."
      footer={
        <>
          <Button variant="secondary">Cancel</Button>
          <Button>Confirm</Button>
        </>
      }
    >
      <Body size="sm" color="secondary">
        Buy 0.1 BTC at market price (~$67,420). This action cannot be undone.
      </Body>
    </Modal>
  ),
};
