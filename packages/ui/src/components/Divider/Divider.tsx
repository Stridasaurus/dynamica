import * as RadixSeparator from '@radix-ui/react-separator';
import styles from './Divider.module.css';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  className?: string;
}

export function Divider({ orientation = 'horizontal', decorative = true, className = '' }: DividerProps) {
  return (
    <RadixSeparator.Root
      className={[styles.root, className].filter(Boolean).join(' ')}
      orientation={orientation}
      decorative={decorative}
    />
  );
}
