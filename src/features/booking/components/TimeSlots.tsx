import { FITTING_SLOTS } from '@/constants/app';
import { cn } from '@/utils/cn';

type Props = {
  value: string | null;
  onChange: (slot: string) => void;
  /** Tanlangan kunda band bo'lgan vaqtlar */
  takenSlots?: string[];
  disabled?: boolean;
};

export default function TimeSlots({ value, onChange, takenSlots = [], disabled }: Props) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground">Время</p>
      <div className="grid grid-cols-3 gap-2">
        {FITTING_SLOTS.map((slot) => {
          const taken = takenSlots.includes(slot);
          const selected = value === slot;
          return (
            <button
              key={slot}
              type="button"
              disabled={disabled || taken}
              onClick={() => onChange(slot)}
              className={cn(
                'rounded-xl border py-2.5 text-sm font-medium transition',
                (disabled || taken) &&
                  'cursor-not-allowed border-border-subtle bg-surface-2 text-subtle',
                !disabled && !taken && selected && 'border-primary bg-primary-soft text-primary',
                !disabled &&
                  !taken &&
                  !selected &&
                  'border-border bg-surface text-foreground hover:border-primary',
              )}
            >
              {slot}
            </button>
          );
        })}
      </div>
      {disabled && <p className="mt-2 text-xs text-muted">Сначала выберите дату</p>}
    </div>
  );
}
