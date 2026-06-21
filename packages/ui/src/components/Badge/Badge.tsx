import React from 'react';
import styles from './Badge.module.css';

type BadgeVariant = 'default' | 'positive' | 'negative' | 'accent' | 'warning';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={[styles.badge, styles[variant], className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </span>
  );
}
