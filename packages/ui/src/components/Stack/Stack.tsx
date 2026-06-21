import React from 'react';

type Direction = 'row' | 'column';
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

const justifyMap: Record<Justify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: Direction;
  gap?: number | string;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  as?: React.ElementType;
}

export function Stack({
  direction = 'column',
  gap = 'var(--space-4)',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  as: Tag = 'div',
  style,
  children,
  ...props
}: StackProps) {
  const gapValue = typeof gap === 'number' ? `${gap}px` : gap;
  return (
    <Tag
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: gapValue,
        alignItems: align,
        justifyContent: justifyMap[justify],
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}
