import * as RadixSwitch from '@radix-ui/react-switch';
import styles from './Toggle.module.css';

interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
  className?: string;
}

export function Toggle({ label, className = '', ...props }: ToggleProps) {
  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <RadixSwitch.Root className={styles.root} {...props}>
        <RadixSwitch.Thumb className={styles.thumb} />
      </RadixSwitch.Root>
      {label && <label className={styles.label} htmlFor={props.id}>{label}</label>}
    </div>
  );
}
