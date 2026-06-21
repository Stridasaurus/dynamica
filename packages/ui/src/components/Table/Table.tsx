import React, { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import styles from './Table.module.css';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  skeletonRows?: number;
  getRowKey?: (row: T, index: number) => string | number;
  className?: string;
}

type SortDir = 'asc' | 'desc';

export function Table<T>({
  columns,
  data,
  loading = false,
  skeletonRows = 5,
  getRowKey = (_, i) => i,
  className = '',
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortKey];
        const bv = (b as Record<string, unknown>)[sortKey];
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {columns.map(col => {
              const key = String(col.key);
              const isSorted = sortKey === key;
              const ariaSort = isSorted ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined;
              return (
                <th
                  key={key}
                  className={[styles.th, col.sortable ? styles['th-sortable'] : ''].filter(Boolean).join(' ')}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={col.sortable ? () => handleSort(key) : undefined}
                  aria-sort={ariaSort}
                >
                  {col.header}
                  {col.sortable && (
                    <span className={styles['sort-icon']}>
                      {isSorted
                        ? (sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)
                        : <ArrowUpDown size={12} />}
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {loading
            ? Array.from({ length: skeletonRows }).map((_, ri) => (
                <tr key={ri} className={[styles.tr, styles['skeleton-row']].join(' ')}>
                  {columns.map((col, ci) => (
                    <td key={ci} className={styles.td}>
                      <div className={styles['skeleton-cell']} style={{ width: `${60 + Math.random() * 30}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            : sorted.map((row, ri) => (
                <tr key={getRowKey(row, ri)} className={styles.tr}>
                  {columns.map(col => {
                    const key = String(col.key);
                    const value = col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[key] ?? '');
                    return <td key={key} className={styles.td}>{value}</td>;
                  })}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
