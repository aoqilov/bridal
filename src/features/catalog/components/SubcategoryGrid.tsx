import { FiCheck } from 'react-icons/fi';
import { CusPlate } from '@/components/ui';
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
  /** Butun qatorni egallaydi — birinchi ("Все модели") kartochka */
  wide?: boolean;
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
    <div className={cn('subtle-scrollbar overflow-y-auto px-3 pb-6', className)}>
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
            wide: true,
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
            <div className="sticky top-0 z-[1] -mx-3 flex items-baseline justify-between gap-2 bg-background px-3 pb-2.5 pt-3">
              <h2 className="truncate font-serif text-[19px] leading-tight text-foreground">
                {category.name}
              </h2>
              <span
                className={cn(
                  'shrink-0 text-[9.5px] uppercase tracking-[0.14em]',
                  wholeSelected || subSelectedCount > 0 ? 'text-primary' : 'text-subtle',
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
                    tileItem.wide && 'col-span-2',
                    tileItem.disabled && 'pointer-events-none opacity-50',
                  )}
                >
                  <CusPlate
                    ratio={tileItem.wide ? 'aspect-[16/7]' : 'aspect-[3/4]'}
                    active={tileItem.selected}
                    className="group-hover:shadow-card-hover group-focus-visible:border-primary"
                  >
                    {tileItem.image && (
                      <img
                        src={tileItem.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}

                    <span className="absolute right-1.5 top-1.5 rounded-full bg-overlay-light px-2 py-0.5 text-[11px] font-semibold text-foreground backdrop-blur">
                      {tileItem.count}
                    </span>

                    {tileItem.selected && (
                      <span className="absolute left-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-fg shadow-card">
                        <FiCheck size={14} strokeWidth={3} />
                      </span>
                    )}
                  </CusPlate>

                  <span
                    className={cn(
                      'mt-2 block text-center text-xs',
                      tileItem.selected ? 'text-primary' : 'text-muted',
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
