import { cn } from '@/utils/cn';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Ekranda ko'rinmaydi — faqat skrinrider uchun */
  label: string;
  disabled?: boolean;
  className?: string;
};

/** Sozlamalar qatoridagi yoqish/o'chirish tugmasi */
export default function CusSwitch({
  checked,
  onChange,
  label,
  disabled,
  className,
}: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        checked ? 'bg-primary' : 'bg-surface-2 ring-1 ring-inset ring-border',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-card transition-transform',
          checked ? 'translate-x-[1.375rem]' : 'translate-x-0.5',
        )}
      />
    </button>
  );
}
