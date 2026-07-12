import { Card } from '@settgast/ui';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell, ResponsiveContainer,
} from 'recharts';
import type { LagCorrelation } from '../../lib/correlation';

interface Props {
  data: LagCorrelation[];
  peakLagValue: number | null;
  color: string;
}

/** The cross-correlogram itself: Pearson r at each lag, the peak highlighted.
 *  This IS the payoff visualization — the bar at the peak lag is where the
 *  "who drives whom" answer lives. */
export function Correlogram({ data, peakLagValue, color }: Props) {
  const chartData = data.map((p) => ({ lag: p.lag, r: isNaN(p.r) ? null : parseFloat(p.r.toFixed(4)) }));

  return (
    <Card className="p-4">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="lag"
            tick={{ fontSize: 11 }}
            tickLine={false}
            label={{ value: 'lag (bins)', position: 'insideBottom', offset: -2, fontSize: 11 }}
          />
          <YAxis domain={[-1, 1]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
          <ReferenceLine y={0} stroke="var(--color-text-muted)" />
          <ReferenceLine x={0} stroke="var(--color-text-muted)" strokeDasharray="3 3" />
          <Tooltip
            formatter={(val: number | string) => [typeof val === 'number' ? val.toFixed(3) : 'n/a', 'r']}
            labelFormatter={(lag) => `lag = ${lag}`}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Bar dataKey="r" isAnimationActive={false}>
            {chartData.map((entry) => (
              <Cell
                key={entry.lag}
                fill={entry.lag === peakLagValue ? color : 'var(--color-text-muted)'}
                opacity={entry.lag === peakLagValue ? 1 : 0.35}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
