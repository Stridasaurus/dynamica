import * as RadixRadio from '@radix-ui/react-radio-group';
import styles from './RadioGroup.module.css';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  className?: string;
}

export function RadioGroup({
  options,
  orientation = 'vertical',
  className = '',
  ...props
}: RadioGroupProps) {
  return (
    <RadixRadio.Root
      className={[styles.group, className].filter(Boolean).join(' ')}
      orientation={orientation}
      {...props}
    >
      {options.map(opt => (
        <div key={opt.value} className={styles['item-wrapper']}>
          <RadixRadio.Item
            className={styles.item}
            value={opt.value}
            id={opt.value}
            disabled={opt.disabled}
          >
            <RadixRadio.Indicator className={styles.indicator} />
          </RadixRadio.Item>
          <label className={styles.label} htmlFor={opt.value}>{opt.label}</label>
        </div>
      ))}
    </RadixRadio.Root>
  );
}
