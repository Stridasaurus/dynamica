import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ open, onOpenChange, trigger, title, description, children, footer }: ModalProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={styles.overlay} />
        <RadixDialog.Content className={styles.content}>
          {(title || description) && (
            <div className={styles.header}>
              <div>
                {title && <RadixDialog.Title className={styles.title}>{title}</RadixDialog.Title>}
                {description && <RadixDialog.Description className={styles.description}>{description}</RadixDialog.Description>}
              </div>
              <RadixDialog.Close className={styles.close} aria-label="Close">
                <X size={14} />
              </RadixDialog.Close>
            </div>
          )}
          {children}
          {footer && <div className={styles.footer}>{footer}</div>}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
