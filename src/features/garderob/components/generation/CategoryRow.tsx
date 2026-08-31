import { MdChevronRight, MdCheck } from 'react-icons/md';
import { cn } from '@/utils/cn';

/** Pastki paneldagi 1-qator bo'limlari — 2-qator shunga qarab almashadi */
export type PickTab = 'face' | 'dress' | 'veil' | 'jewelry';

export const PICK_TABS: { value: PickTab; label: string }[] = [
  { value: 'face', label: 'Лицо' },
  { value: 'dress', label: 'Платье' },
  { value: 'veil', label: 'Фата' },
  { value: 'jewelry', label: 'Украшения' },
];

/** Tanlanmasa генерация boshlanmaydi — chipda oltin nuqta bilan belgilanadi */
export const REQUIRED_TABS: PickTab[] = ['face', 'dress'];

type Props = {
  value: PickTab;
  onChange: (tab: PickTab) => void;
  /** Bo'limda tanlov borligi — ✓ nishoni uchun */
  filled: Record<PickTab, boolean>;
  onOpenSetup: () => void;
  /** "Настройка · 4/4" — nechtasi tanlangani */
  setupChosen: number;
  setupTotal: number;
};

/**
 * 1-qator: Лицо · Платье · Фата · Украшения · Настройка →
 *
 * Oxirgi katak boshqalardan farq qiladi — u bo'limni almashtirmaydi, model
 * sozlamalari oynasini ochadi.
 */
export default function CategoryRow({
  value,
  onChange,
  filled,
  onOpenSetup,
  setupChosen,
  setupTotal,
}: Props) {
  return (
    <div
      role="tablist"
      aria-label="Части образа"
      className="flex items-center gap-2 overflow-x-auto px-4 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {PICK_TABS.map((tab) => {
        const active = value === tab.value;
        const done = filled[tab.value];
        // Majburiy-yu hali tanlanmagan bo'lim — e'tibor tortadigan nuqta
        const missing = REQUIRED_TABS.includes(tab.value) && !done;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              active
                ? 'border-primary bg-primary text-primary-fg'
                : 'border-border text-muted hover:border-primary hover:text-primary',
            )}
          >
            {tab.label}
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

      <button
        type="button"
        onClick={onOpenSetup}
        className={cn(
          'flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors',
          'hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        )}
      >
        Настройка
        <span className="text-[10px] text-subtle">
          {setupChosen}/{setupTotal}
        </span>
        <MdChevronRight size={15} aria-hidden />
      </button>
    </div>
  );
}
