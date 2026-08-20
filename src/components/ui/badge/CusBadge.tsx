import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type Variant =
  | 'default'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  /* Quyidagi uchtasi — rasm ustida turadigan to'ldirilgan (solid) variantlar */
  | 'accent-solid'
  | 'danger-solid'
  | 'overlay';
type Size = 'xs' | 'sm' | 'md';

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

  'accent-solid': 'bg-accent text-accent-fg',
  'danger-solid': 'bg-danger text-danger-fg',
  overlay: 'bg-overlay-dark text-overlay-fg',
};

/** Rasm ustidagi variantlar — fon shovqinida o'qilishi uchun qalinroq */
const SOLID: ReadonlySet<Variant> = new Set<Variant>([
  'accent-solid',
  'danger-solid',
  'overlay',
]);

const SIZE: Record<Size, string> = {
  xs: 'px-1.5 py-0.5 text-[9px]',
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
        'inline-flex items-center rounded-full',
        SOLID.has(variant) ? 'font-semibold' : 'font-medium',
        VARIANT[variant],
        SIZE[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
