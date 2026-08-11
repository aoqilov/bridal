import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type SegmentItem<T extends string> = {
  value: T;
  label?: string;
  icon?: ReactNode;
  ariaLabel?: string;
};

type Props<T extends string> = {
  items: SegmentItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
};

export default function CusSegment<T extends string>({
  items,
  value,
  onChange,
  className,
  size = 'md',
  fullWidth = false,
}: Props<T>) {
  const paddingClasses = size === 'sm' ? 'px-2.5 py-1' : 'px-3 py-1.5';
  const textSizeClass = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div
      role="tablist"
      className={cn(
        'flex overflow-hidden rounded-xl border border-border-subtle bg-surface-2 p-1',
        fullWidth ? 'w-full' : 'inline-flex',
        className,
      )}
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
              'flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-medium transition-colors',
              textSizeClass,
              paddingClasses,
              fullWidth && 'flex-1',
              active
                ? 'bg-surface text-foreground shadow-card'
                : 'text-muted hover:text-foreground',
            )}
          >
            {item.icon}
            {item.label && <span>{item.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
