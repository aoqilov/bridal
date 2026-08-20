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
      {/*
        `left` ni aniq berish shart: brauzer <button> ichidagi matnni markazlashtiradi,
        `left: auto` da esa absolyut element o'sha markazdan boshlanadi va knob
        yo'lakchadan chiqib ketadi. Yo'lak 44px, knob 20px, chetdan 2px joy.
      */}
      <span
        className={cn(
          'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-card transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  );
}
