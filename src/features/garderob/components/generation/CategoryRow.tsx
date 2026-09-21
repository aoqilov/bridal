import { MdChevronRight, MdCheck } from 'react-icons/md';
import { cn } from '@/utils/cn';

/** To'liq rejimdagi pastki paneldagi 1-qator bo'limlari */
export type PickTab = 'face' | 'dress' | 'veil' | 'jewelry' | 'shoes';

export const PICK_TAB_LABELS: Record<PickTab, string> = {
  face: 'Лицо',
  dress: 'Платье',
  veil: 'Фата',
  jewelry: 'Украшения',
  shoes: 'Туфли',
};

/**
 * Doimiy bo'limlar. "Туфли" bu yerda yo'q — u faqat etagi kalta ko'ylakda
 * qo'shiladi (`FullGeneration`), chunki polgacha ko'ylakda oyoq ko'rinmaydi.
 */
export const PICK_TABS: PickTab[] = ['face', 'dress', 'veil', 'jewelry'];

/** Tanlanmasa генерация boshlanmaydi — chipda oltin nuqta bilan belgilanadi */
export const REQUIRED_TABS: PickTab[] = ['face', 'dress'];

type Props<T extends string> = {
  /** Ko'rsatiladigan bo'limlar — to'liq rejimda ko'ylakka qarab o'zgaradi */
  tabs: T[];
  /** Bo'lim kaliti → ekrandagi rus yorlig'i */
  labels: Record<T, string>;
  value: T;
  onChange: (tab: T) => void;
  /** Bo'limda tanlov borligi — ✓ nishoni uchun */
  filled: Record<T, boolean>;
  /** Tanlanmasa generatsiya boshlanmaydigan bo'limlar — e'tibor nuqtasi uchun */
  required: T[];
  /**
   * "Настройка · 4/4" katagi. Sodda rejimda berilmaydi: u yerda mijozning
   * o'z surati poza, gavda va fonni belgilaydi, ya'ni sozlanadigan narsa yo'q.
   */
  setup?: {
    chosen: number;
    total: number;
    onOpen: () => void;
  };
};

/**
 * 1-qator: bo'lim chiplar qatori — Лицо · Платье · Фата · Украшения · Настройка →
 *
 * Ikkala generatsiya rejimi ham shuni ishlatadi, faqat boshqa bo'limlar ro'yxati
 * bilan. Oxirgi katak boshqalardan farq qiladi — u bo'limni almashtirmaydi,
 * model sozlamalari oynasini ochadi, va u faqat `setup` berilganda chiqadi.
 */
export default function CategoryRow<T extends string>({
  tabs,
  labels,
  value,
  onChange,
  filled,
  required,
  setup,
}: Props<T>) {
  return (
    <div
      role="tablist"
      aria-label="Части образа"
      className="flex items-center gap-2 overflow-x-auto px-4 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {tabs.map((tab) => {
        const active = value === tab;
        const done = filled[tab];
        // Majburiy-yu hali tanlanmagan bo'lim — e'tibor tortadigan nuqta
        const missing = required.includes(tab) && !done;

        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              active
                ? 'border-accent bg-accent text-accent-fg'
                : 'border-border text-muted hover:border-primary hover:text-primary',
            )}
          >
            {labels[tab]}
            {done && (
              <MdCheck
                size={13}
                className={active ? 'text-primary-fg' : 'text-primary'}
                aria-hidden
              />
            )}
            {missing && (
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  active ? 'bg-primary-fg' : 'bg-primary',
                )}
                aria-hidden
              />
            )}
          </button>
        );
      })}

      {setup && (
        <button
          type="button"
          onClick={setup.onOpen}
          className={cn(
            'flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors',
            'hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          )}
        >
          Настройка
          <span className="text-[10px] text-subtle">
            {setup.chosen}/{setup.total}
          </span>
          <MdChevronRight size={15} aria-hidden />
        </button>
      )}
    </div>
  );
}
