import * as RadixSlider from '@radix-ui/react-slider';
import styles from './Slider.module.css';

interface SliderProps {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

export function Slider({ className = '', ...props }: SliderProps) {
  return (
    <RadixSlider.Root className={[styles.root, className].filter(Boolean).join(' ')} {...props}>
      <RadixSlider.Track className={styles.track}>
        <RadixSlider.Range className={styles.range} />
      </RadixSlider.Track>
      {(props.value ?? props.defaultValue ?? [0]).map((_, i) => (
        <RadixSlider.Thumb key={i} className={styles.thumb} aria-label={`Thumb ${i + 1}`} />
      ))}
    </RadixSlider.Root>
  );
}
