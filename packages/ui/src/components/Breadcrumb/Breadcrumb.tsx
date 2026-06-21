import React from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './Breadcrumb.module.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={[styles.nav, className].filter(Boolean).join(' ')}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            <span className={styles.item}>
              {isLast || !item.href ? (
                <span className={isLast ? styles.current : styles.link} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className={styles.link}>{item.label}</a>
              )}
            </span>
            {!isLast && <ChevronRight size={14} className={styles.separator} aria-hidden="true" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
