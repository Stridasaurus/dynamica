import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import styles from './Checkbox.module.css';

interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
  className?: string;
}

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <RadixCheckbox.Root className={styles.root} {...props}>
        <RadixCheckbox.Indicator>
          <Check size={11} strokeWidth={3} color="white" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {label && <label className={styles.label} htmlFor={props.id}>{label}</label>}
    </div>
  );
}
