import React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import styles from './Tabs.module.css';

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ items, defaultValue, value, onValueChange, className = '' }: TabsProps) {
  const initial = defaultValue ?? items[0]?.value;
  return (
    <RadixTabs.Root
      defaultValue={initial}
      value={value}
      onValueChange={onValueChange}
      className={className}
    >
      <RadixTabs.List className={styles.list}>
        {items.map(item => (
          <RadixTabs.Trigger
            key={item.value}
            className={styles.trigger}
            value={item.value}
            disabled={item.disabled}
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map(item => (
        <RadixTabs.Content key={item.value} className={styles.content} value={item.value}>
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
