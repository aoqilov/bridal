import { FiCheck } from 'react-icons/fi';
import { cn } from '@/utils/cn';
import type { Category } from '@/features/catalog';

type Props = {
  categories: Category[];
  activeCategoryId: string | null;
  selectedCategoryIds: Set<string>;
  selectedSubcategoryIds: Set<string>;
  onSelect: (categoryId: string) => void;
  className?: string;
};

/** Katalogning chap ustuni — vertikal kategoriya navigatsiyasi + tanlov belgisi */
export default function CategoryRail({
  categories,
  activeCategoryId,
  selectedCategoryIds,
  selectedSubcategoryIds,
  onSelect,
  className,
}: Props) {
  return (
    <nav
      aria-label="Категории"
      className={cn('overflow-y-auto border-r border-border-subtle bg-surface-2/50', className)}
    >
      <ul>
        {categories.map((cat) => {
          const active = cat.id === activeCategoryId;
          const wholeSelected = selectedCategoryIds.has(cat.id);
          const subSelectedCount =
            cat.subcategories?.filter((s) => selectedSubcategoryIds.has(s.id)).length ?? 0;
          const hasSelection = wholeSelected || subSelectedCount > 0;

          return (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => onSelect(cat.id)}
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
                      active || hasSelection ? 'ring-primary' : 'ring-border-subtle',
                    )}
                  >
                    {cat.image && (
                      <img
                        src={cat.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </span>

                  {hasSelection && (
                    <span
                      className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-fg ring-2 ring-background"
                      aria-label={`Выбрано в категории «${cat.name}»`}
                    >
                      {wholeSelected ? <FiCheck size={11} strokeWidth={3} /> : subSelectedCount}
                    </span>
                  )}
                </span>

                <span
                  className={cn(
                    'line-clamp-2 text-center text-[11px] leading-tight',
                    active ? 'font-semibold text-primary' : 'text-muted',
                  )}
                >
                  {cat.shortName ?? cat.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
