import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import styles from './Drawer.module.css';

interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function Drawer({ open, onOpenChange, trigger, title, description, children }: DrawerProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={styles.overlay} />
        <RadixDialog.Content className={styles.content}>
          <div className={styles.header}>
            <div>
              {title && <RadixDialog.Title className={styles.title}>{title}</RadixDialog.Title>}
              {description && <RadixDialog.Description className={styles.description}>{description}</RadixDialog.Description>}
            </div>
            <RadixDialog.Close className={styles.close} aria-label="Close drawer">
              <X size={14} />
            </RadixDialog.Close>
          </div>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
