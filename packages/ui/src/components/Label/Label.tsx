import React from 'react';
import styles from './Label.module.css';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ required, className = '', children, ...props }: LabelProps) {
  return (
    <label className={[styles.label, className].filter(Boolean).join(' ')} {...props}>
      {children}
      {required && <span className={styles.required} aria-hidden="true"> *</span>}
    </label>
  );
}
