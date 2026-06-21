import React, { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  className?: string;
}

export function StatCard({ label, value, change, changeLabel, className = '' }: StatCardProps) {
  const prevValue = useRef(value);
  const [flash, setFlash] = useState<'positive' | 'negative' | null>(null);

  useEffect(() => {
    if (prevValue.current !== value) {
      const prev = parseFloat(String(prevValue.current));
      const curr = parseFloat(String(value));
      if (!isNaN(prev) && !isNaN(curr)) {
        setFlash(curr > prev ? 'positive' : 'negative');
        const t = setTimeout(() => setFlash(null), 600);
        prevValue.current = value;
        return () => clearTimeout(t);
      }
      prevValue.current = value;
    }
  }, [value]);

  const changeDir = change == null ? null : change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';

  return (
    <div className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.label}>{label}</div>
      <div className={[styles.value, flash ? styles[`flash-${flash}`] : ''].filter(Boolean).join(' ')}>
        {value}
      </div>
      {change != null && (
        <div className={[styles.change, styles[`change-${changeDir}`]].filter(Boolean).join(' ')}>
          {changeDir === 'positive' && <TrendingUp size={13} />}
          {changeDir === 'negative' && <TrendingDown size={13} />}
          {changeDir === 'neutral' && <Minus size={13} />}
          {changeLabel ?? `${change > 0 ? '+' : ''}${change}%`}
        </div>
      )}
    </div>
  );
}
