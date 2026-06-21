import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: 'positive' | 'negative' | 'neutral' | string;
  className?: string;
}

function toPath(data: number[], w: number, h: number): string {
  if (data.length < 2) return '';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - pad * 2) + pad;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });
  return `M ${points.join(' L ')}`;
}

const COLOR_MAP: Record<string, string> = {
  positive: 'var(--color-positive)',
  negative: 'var(--color-negative)',
  neutral: 'var(--color-text-muted)',
};

export function Sparkline({ data, width = 80, height = 32, color = 'neutral', className }: SparklineProps) {
  const stroke = COLOR_MAP[color] ?? color;
  const path = toPath(data, width, height);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {path && <path d={path} stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}
