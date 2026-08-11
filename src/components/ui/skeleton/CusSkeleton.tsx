import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: 'rect' | 'circle' | 'text';
};

export default function CusSkeleton({
  variant = 'rect',
  className,
  style,
  ...rest
}: Props) {
  return (
    <div
      {...rest}
      style={style}
      className={cn(
        'animate-pulse bg-surface-2',
        variant === 'rect' && 'rounded-lg',
        variant === 'circle' && 'rounded-full',
        variant === 'text' && 'h-4 rounded',
        className,
      )}
    />
  );
}
