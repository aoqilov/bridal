import { FiCheck } from 'react-icons/fi';
import { cn } from '@/utils/cn';
import type { Category } from '@/features/catalog';

type Props = {
  /** Bitta kategoriya yoki «Все» rejimida barchasi — har biri alohida bo'lim */
  categories: Category[];
  countsByCategory: Record<string, number>;
  countsBySubcategory: Record<string, number>;
  selectedCategoryIds: Set<string>;
  selectedSubcategoryIds: Set<string>;
  onToggleCategory: (categoryId: string, subIds: string[]) => void;
  onToggleSubcategory: (subcategoryId: string, categoryId: string) => void;
  className?: string;
};

type Tile = {
  key: string;
  name: string;
  image?: string;
  count: number;
  selected: boolean;
  /** "Все модели" tanlangan bo'lsa alohida subkategoriya ortiqcha */
  disabled?: boolean;
  onClick: () => void;
};

/** Katalogning o'ng paneli — kategoriya bo'limlari, har biri 2 ustunli grid */
export default function SubcategoryGrid({
  categories,
  countsByCategory,
  countsBySubcategory,
  selectedCategoryIds,
  selectedSubcategoryIds,
  onToggleCategory,
  onToggleSubcategory,
  className,
}: Props) {
  if (categories.length === 0) {
    return (
      <div className={cn('grid place-items-center p-6 text-sm text-muted', className)}>
        Категории не найдены
      </div>
    );
  }

  return (
    <div className={cn('overflow-y-auto px-3 pb-6', className)}>
      {categories.map((category) => {
        const total = countsByCategory[category.id] ?? 0;
        const subs = category.subcategories ?? [];
        const subIds = subs.map((s) => s.id);
        const wholeSelected = selectedCategoryIds.has(category.id);
        const subSelectedCount = subs.filter((s) => selectedSubcategoryIds.has(s.id)).length;

        // Birinchi kartochka — butun kategoriya (subkategoriyasiz kategoriyalar uchun yagona yo'l)
        const tiles: Tile[] = [
          {
            key: `${category.id}-all`,
            name: 'Все модели',
            image: category.image,
            count: total,
            selected: wholeSelected,
            onClick: () => onToggleCategory(category.id, subIds),
          },
          ...subs.map<Tile>((sub) => ({
            key: sub.id,
            name: sub.name,
            image: sub.image,
            count: countsBySubcategory[sub.id] ?? 0,
            selected: selectedSubcategoryIds.has(sub.id),
            disabled: wholeSelected,
            onClick: () => onToggleSubcategory(sub.id, category.id),
          })),
        ];

        return (
          <section key={category.id}>
            <div className="sticky top-0 z-[1] -mx-3 flex items-baseline justify-between gap-2 bg-background/95 px-3 pb-2 pt-3 backdrop-blur">
              <h2 className="truncate font-serif text-lg font-semibold text-foreground">
                {category.name}
              </h2>
              <span
                className={cn(
                  'shrink-0 text-xs',
                  wholeSelected || subSelectedCount > 0 ? 'text-primary' : 'text-muted',
                )}
              >
                {wholeSelected
                  ? 'выбрано всё'
                  : subSelectedCount > 0
                    ? `выбрано: ${subSelectedCount}`
                    : `${total} товаров`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {tiles.map((tileItem) => (
                <button
                  key={tileItem.key}
                  type="button"
                  onClick={tileItem.onClick}
                  disabled={tileItem.disabled}
                  aria-pressed={tileItem.selected}
                  className={cn(
                    'group text-left focus:outline-none',
                    tileItem.disabled && 'pointer-events-none opacity-50',
                  )}
                >
                  <div
                    className={cn(
                      'relative aspect-square overflow-hidden rounded-2xl bg-surface-2 shadow-card transition',
                      'group-hover:shadow-card-hover group-focus-visible:ring-2 group-focus-visible:ring-primary',
                      tileItem.selected &&
                        'ring-2 ring-primary ring-offset-2 ring-offset-background',
                    )}
                  >
                    {tileItem.image && (
                      <img
                        src={tileItem.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}

                    <span className="absolute right-2 top-2 rounded-full bg-surface/90 px-2 py-0.5 text-[11px] font-semibold text-foreground backdrop-blur">
                      {tileItem.count}
                    </span>

                    {tileItem.selected && (
                      <span className="absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-fg shadow-card">
                        <FiCheck size={14} strokeWidth={3} />
                      </span>
                    )}
                  </div>

                  <span
                    className={cn(
                      'mt-2 block text-center text-xs',
                      tileItem.selected
                        ? 'font-semibold text-primary'
                        : 'font-medium text-foreground',
                    )}
                  >
                    {tileItem.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
