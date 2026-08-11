import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const CusInput = forwardRef<HTMLInputElement, Props>(function CusInput(
  { label, error, hint, leftIcon, rightIcon, className, id, ...rest },
  ref,
) {
  const inputId = id ?? rest.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {leftIcon}
          </span>
        )}

        <input
          {...rest}
          id={inputId}
          ref={ref}
          className={cn(
            'w-full rounded-xl border bg-surface text-sm text-foreground outline-none transition',
            'placeholder:text-muted',
            'h-11 py-2',
            leftIcon ? 'pl-10' : 'pl-4',
            rightIcon ? 'pr-10' : 'pr-4',
            error
              ? 'border-danger focus:ring-2 focus:ring-danger-soft'
              : 'border-border focus:border-primary focus:ring-2 focus:ring-primary-soft',
            'disabled:cursor-not-allowed disabled:opacity-60',
            className,
          )}
        />

        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
            {rightIcon}
          </span>
        )}
      </div>

      {error ? (
        <p className="mt-1 text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
});

export default CusInput;
