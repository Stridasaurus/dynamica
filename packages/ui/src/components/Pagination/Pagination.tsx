import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function getPages(page: number, total: number, siblings: number): (number | '…')[] {
  const totalShown = siblings * 2 + 5;
  if (total <= totalShown) return range(1, total);

  const leftSibling = Math.max(page - siblings, 1);
  const rightSibling = Math.min(page + siblings, total);

  const showLeft = leftSibling > 2;
  const showRight = rightSibling < total - 1;

  if (!showLeft && showRight) return [...range(1, 3 + siblings * 2), '…', total];
  if (showLeft && !showRight) return [1, '…', ...range(total - (3 + siblings * 2 - 1), total)];
  return [1, '…', ...range(leftSibling, rightSibling), '…', total];
}

export function Pagination({ page, totalPages, onPageChange, siblingCount = 1, className = '' }: PaginationProps) {
  const pages = getPages(page, totalPages, siblingCount);
  return (
    <nav aria-label="Pagination" className={[styles.nav, className].filter(Boolean).join(' ')}>
      <button
        className={styles.button}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={14} />
      </button>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className={styles.ellipsis}>…</span>
        ) : (
          <button
            key={p}
            className={[styles.button, p === page ? styles['button-active'] : ''].filter(Boolean).join(' ')}
            onClick={() => onPageChange(p as number)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}
      <button
        className={styles.button}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={14} />
      </button>
    </nav>
  );
}
