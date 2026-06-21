import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface SelectProps {
  options?: SelectOption[];
  groups?: SelectGroup[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  groups,
  placeholder = 'Select…',
  className = '',
  ...props
}: SelectProps) {
  return (
    <RadixSelect.Root {...props}>
      <RadixSelect.Trigger className={[styles.trigger, className].filter(Boolean).join(' ')}>
        <RadixSelect.Value placeholder={placeholder} className={styles.value} />
        <RadixSelect.Icon><ChevronDown size={14} /></RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className={styles.content} position="popper" sideOffset={4}>
          <RadixSelect.Viewport className={styles.viewport}>
            {groups
              ? groups.map((group, gi) => (
                  <RadixSelect.Group key={gi}>
                    <RadixSelect.Label className={styles['group-label']}>{group.label}</RadixSelect.Label>
                    {group.options.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                        {opt.label}
                      </SelectItem>
                    ))}
                    {gi < groups.length - 1 && <RadixSelect.Separator className={styles.separator} />}
                  </RadixSelect.Group>
                ))
              : options?.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </SelectItem>
                ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

function SelectItem({ value, disabled, children }: { value: string; disabled?: boolean; children: React.ReactNode }) {
  return (
    <RadixSelect.Item className={styles.item} value={value} disabled={disabled}>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
}
