import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'default' | 'brand' | 'success' | 'warning' | 'danger';
type Size = 'sm' | 'md';

type Props = HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant;
  size?: Size;
};

const VARIANT: Record<Variant, string> = {
  default: 'bg-surface-2 text-foreground',
  brand: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
};

const SIZE: Record<Size, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
};

export default function CusBadge({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...rest
}: Props) {
  return (
    <span
      {...rest}
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        VARIANT[variant],
        SIZE[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
