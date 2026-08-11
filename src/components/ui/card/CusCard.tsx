import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type Props = HTMLAttributes<HTMLDivElement> & {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md';
  interactive?: boolean;
};

const PADDING: Record<NonNullable<Props['padding']>, string> = {
  none: '',
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-4',
};

const SHADOW: Record<NonNullable<Props['shadow']>, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
};

export default function CusCard({
  padding = 'md',
  shadow = 'sm',
  interactive,
  className,
  children,
  ...rest
}: Props) {
  return (
    <div
      {...rest}
      className={cn(
        'rounded-xl border border-border-subtle bg-surface text-foreground',
        PADDING[padding],
        SHADOW[shadow],
        interactive && 'cursor-pointer transition hover:shadow-md active:scale-[0.99]',
        className,
      )}
    >
      {children}
    </div>
  );
}
