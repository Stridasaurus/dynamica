import React from 'react';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  flat?: boolean;
}

export function Card({ hoverable, flat, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={[
        styles.card,
        hoverable ? styles.hoverable : '',
        flat ? styles.flat : '',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
