import React from 'react';
import styles from './Typography.module.css';

type HeadingLevel = 1 | 2 | 3 | 4;
type BodySize = 'lg' | 'md' | 'sm';
type TextColor = 'primary' | 'secondary' | 'muted';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  color?: TextColor;
}

export function Heading({ level = 1, color, className = '', children, ...props }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
  const colorClass = color === 'secondary' ? styles.secondary : color === 'muted' ? styles.muted : '';
  return (
    <Tag className={[styles[`h${level}`], colorClass, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </Tag>
  );
}

interface BodyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: BodySize;
  color?: TextColor;
  as?: 'p' | 'span' | 'div';
}

export function Body({ size = 'md', color, as: Tag = 'p', className = '', children, ...props }: BodyProps) {
  const colorClass = color === 'secondary' ? styles.secondary : color === 'muted' ? styles.muted : '';
  return (
    <Tag className={[styles[`body-${size}`], colorClass, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </Tag>
  );
}

interface CaptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: 'span' | 'p' | 'div';
}

export function Caption({ as: Tag = 'span', className = '', children, ...props }: CaptionProps) {
  return (
    <Tag className={[styles.caption, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </Tag>
  );
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  block?: boolean;
}

export function Code({ block = false, className = '', children, ...props }: CodeProps) {
  if (block) {
    return (
      <code className={[styles['code-block'], className].filter(Boolean).join(' ')} {...props}>
        {children}
      </code>
    );
  }
  return (
    <code className={[styles['code-inline'], className].filter(Boolean).join(' ')} {...props}>
      {children}
    </code>
  );
}
