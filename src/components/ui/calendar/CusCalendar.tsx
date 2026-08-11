import { useMemo } from 'react';
import {
  ChakraProvider,
  DatePicker,
  createSystem,
  defaultConfig,
} from '@chakra-ui/react';
import { parseDate } from '@internationalized/date';
import { APP_LOCALE } from '@/constants/app';

// Chakra faqat shu komponent ichida ishlaydi — preflight o'chirilgan,
// aks holda Chakra reset'i Tailwind base bilan urishadi.
// Semantik ranglar loyihaning CSS o'zgaruvchilariga bog'langan,
// shu sabab dark mode `.dark` klassi orqali avtomatik ishlaydi.
const system = createSystem(defaultConfig, {
  preflight: false,
  theme: {
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: 'var(--color-background)' },
          panel: { value: 'var(--color-surface)' },
          subtle: { value: 'var(--color-surface)' },
          muted: { value: 'var(--color-surface-2)' },
          emphasized: { value: 'var(--color-surface-2)' },
        },
        fg: {
          DEFAULT: { value: 'var(--color-foreground)' },
          muted: { value: 'var(--color-muted)' },
          subtle: { value: 'var(--color-subtle)' },
        },
        border: {
          DEFAULT: { value: 'var(--color-border)' },
          subtle: { value: 'var(--color-border-subtle)' },
          muted: { value: 'var(--color-border-subtle)' },
        },
        brand: {
          solid: { value: 'var(--color-primary)' },
          contrast: { value: 'var(--color-primary-fg)' },
          fg: { value: 'var(--color-primary)' },
          subtle: { value: 'var(--color-primary-soft)' },
          muted: { value: 'var(--color-primary-soft)' },
          emphasized: { value: 'var(--color-primary-hover)' },
          focus: { value: 'var(--color-primary)' },
          focusRing: { value: 'var(--color-primary)' },
        },
      },
    },
  },
});

type Props = {
  /** Tanlangan sana, `YYYY-MM-DD` */
  value?: string | null;
  onChange?: (date: string) => void;
  /** Berilsa — faqat shu sanalar tanlanadi (qolganlari o'chirilgan) */
  availableDates?: string[];
  /** `YYYY-MM-DD` chegaralar */
  min?: string;
  max?: string;
  locale?: string;
};

export default function CusCalendar({
  value,
  onChange,
  availableDates,
  min,
  max,
  locale = APP_LOCALE,
}: Props) {
  const availableSet = useMemo(
    () => (availableDates ? new Set(availableDates) : null),
    [availableDates],
  );

  const selected = useMemo(() => (value ? [parseDate(value)] : []), [value]);

  return (
    <ChakraProvider value={system}>
      <DatePicker.Root
        inline
        colorPalette="brand"
        locale={locale}
        value={selected}
        min={min ? parseDate(min) : undefined}
        max={max ? parseDate(max) : undefined}
        isDateUnavailable={
          availableSet
            ? (date) => !availableSet.has(date.toString())
            : undefined
        }
        onValueChange={(details) => {
          const picked = details.value[0];
          if (picked) onChange?.(picked.toString());
        }}
      >
        <DatePicker.View view="day">
          <DatePicker.Header />
          <DatePicker.DayTable />
        </DatePicker.View>

        <DatePicker.View view="month">
          <DatePicker.Header />
          <DatePicker.MonthTable />
        </DatePicker.View>

        <DatePicker.View view="year">
          <DatePicker.Header />
          <DatePicker.YearTable />
        </DatePicker.View>
      </DatePicker.Root>
    </ChakraProvider>
  );
}
