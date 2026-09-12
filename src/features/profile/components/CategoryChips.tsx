import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type CategoryChip<T extends string> = {
  value: T;
  label: string;
  /** Yorliq oldidagi belgi — masalan qulf ikonkasi */
  icon?: ReactNode;
  ariaLabel?: string;
};

type Props<T extends string> = {
  items: CategoryChip<T>[];
  value: T;
  onChange: (value: T) => void;
};

/**
 * Bo'lim tugmalari qatori — gorizontal scroll, nofaol chegara bilan (outline),
 * faol esa to'ldirilgan (solid).
 */
export default function CategoryChips<T extends string>({
  items,
  value,
  onChange,
}: Props<T>) {
  return (
    <div
      role="tablist"
      className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={item.ariaLabel ?? item.label}
            onClick={() => onChange(item.value)}
            className={cn(
              'flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              active
                ? 'border-accent bg-accent text-accent-fg'
                : 'border-border text-muted hover:border-primary hover:text-foreground',
            )}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
