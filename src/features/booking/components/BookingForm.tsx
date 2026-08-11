import { LuPhone, LuUser } from 'react-icons/lu';
import { CusInput } from '@/components/ui';
import { cn } from '@/utils/cn';

export type ContactValues = {
  name: string;
  phone: string;
  size: string;
  comment: string;
};

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

type Props = {
  values: ContactValues;
  errors: ContactErrors;
  sizeOptions: string[];
  onChange: <K extends keyof ContactValues>(key: K, value: ContactValues[K]) => void;
};

export default function BookingForm({ values, errors, sizeOptions, onChange }: Props) {
  return (
    <div className="space-y-4">
      <CusInput
        name="name"
        label="Ваше имя"
        placeholder="Мадина"
        value={values.name}
        error={errors.name}
        leftIcon={<LuUser size={16} />}
        onChange={(e) => onChange('name', e.target.value)}
      />

      <CusInput
        name="phone"
        type="tel"
        inputMode="tel"
        label="Телефон"
        placeholder="+998 90 123 45 67"
        value={values.phone}
        error={errors.phone}
        hint="Позвоним для подтверждения записи"
        leftIcon={<LuPhone size={16} />}
        onChange={(e) => onChange('phone', e.target.value)}
      />

      {sizeOptions.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Размер для примерки</p>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((size) => {
              const selected = values.size === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onChange('size', size)}
                  className={cn(
                    'rounded-xl border px-3 py-2 text-sm font-medium transition',
                    selected
                      ? 'border-primary bg-primary-soft text-primary'
                      : 'border-border bg-surface text-foreground hover:border-primary',
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="booking-comment"
          className="mb-1 block text-sm font-medium text-foreground"
        >
          Комментарий
        </label>
        <textarea
          id="booking-comment"
          rows={3}
          placeholder="Например: приду с мамой, интересует пошив на заказ"
          value={values.comment}
          onChange={(e) => onChange('comment', e.target.value)}
          className={cn(
            'w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition',
            'placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary-soft',
          )}
        />
      </div>
    </div>
  );
}
