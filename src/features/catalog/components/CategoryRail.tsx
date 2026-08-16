import type { ReactNode } from 'react';
import { FiCheck } from 'react-icons/fi';
import { MdApps } from 'react-icons/md';
import { cn } from '@/utils/cn';
import type { Category } from '@/features/catalog';
import { ALL_CATEGORY_ID } from '../hooks/useActiveCategory';

type Props = {
  categories: Category[];
  activeCategoryId: string;
  selectedCategoryIds: Set<string>;
  selectedSubcategoryIds: Set<string>;
  /** Umumiy tanlov soni — «Все» elementidagi badge uchun */
  totalSelectedCount: number;
  onSelect: (categoryId: string) => void;
  className?: string;
};

/** Katalogning chap ustuni — «Все» + vertikal kategoriya navigatsiyasi, tanlov belgisi bilan */
export default function CategoryRail({
  categories,
  activeCategoryId,
  selectedCategoryIds,
  selectedSubcategoryIds,
  totalSelectedCount,
  onSelect,
  className,
}: Props) {
  return (
    <nav
      aria-label="Категории"
      className={cn(
        'subtle-scrollbar overflow-y-auto border-r border-border-subtle bg-surface-2/50',
        className,
      )}
    >
      <ul>
        <li>
          <RailItem
            label="Все"
            active={activeCategoryId === ALL_CATEGORY_ID}
            badge={totalSelectedCount > 0 ? totalSelectedCount : null}
            onClick={() => onSelect(ALL_CATEGORY_ID)}
          >
            <span className="grid h-full w-full place-items-center bg-primary-soft text-primary">
              <MdApps size={22} />
            </span>
          </RailItem>
        </li>

        {categories.map((cat) => {
          const wholeSelected = selectedCategoryIds.has(cat.id);
          const subSelectedCount =
            cat.subcategories?.filter((s) => selectedSubcategoryIds.has(s.id)).length ?? 0;

          return (
            <li key={cat.id}>
              <RailItem
                label={cat.shortName ?? cat.name}
                active={cat.id === activeCategoryId}
                badge={wholeSelected ? 'check' : subSelectedCount > 0 ? subSelectedCount : null}
                onClick={() => onSelect(cat.id)}
              >
                {cat.image && (
                  <img
                    src={cat.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
              </RailItem>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

type RailItemProps = {
  label: string;
  active: boolean;
  /** Raqam — nechta subkategoriya tanlangan; 'check' — butun kategoriya tanlangan */
  badge: number | 'check' | null;
  onClick: () => void;
  children: ReactNode;
};

function RailItem({ label, active, badge, onClick, children }: RailItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'relative flex w-full flex-col items-center gap-1.5 px-1.5 py-3 transition-colors',
        active ? 'bg-background' : 'hover:bg-background/60',
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-10 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
      )}

      <span className="relative">
        <span
          className={cn(
            'block h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface ring-1 transition-colors',
            active || badge !== null ? 'ring-primary' : 'ring-border-subtle',
          )}
        >
          {children}
        </span>

        {badge !== null && (
          <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-fg ring-2 ring-background">
            {badge === 'check' ? <FiCheck size={11} strokeWidth={3} /> : badge}
          </span>
        )}
      </span>

      <span
        className={cn(
          'line-clamp-2 text-center text-[11px] leading-tight',
          active ? 'font-semibold text-primary' : 'text-muted',
        )}
      >
        {label}
      </span>
    </button>
  );
}
