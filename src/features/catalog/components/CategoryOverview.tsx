import { motion } from 'framer-motion';
import { FiCheck, FiChevronRight } from 'react-icons/fi';
import { PLATE_FRAME, PLATE_BORDER, PLATE_BORDER_ACTIVE, PLATE_INNER } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { Category } from '@/features/catalog';
import { categoryLayoutId } from '../utils/categoryMotion';

type Props = {
  categories: Category[];
  countsByCategory: Record<string, number>;
  /** Tanlangan kategoriyalar — filtr belgisi uchun */
  selectedCategoryIds: Set<string>;
  onOpen: (category: Category) => void;
  /** Barcha mavjud tovarlar soni — tepadagi keng kartochka uchun */
  totalCount: number;
  /** Filtr bo'sh — ya'ni "Все товары" holati */
  allSelected: boolean;
  /** Tepadagi kartochka bosildi — filtrni tozalaydi */
  onSelectAll: () => void;
  className?: string;
};

/** "Все товары" kartochkasidagi rasm tasmasi — shuncha kategoriya rasmi olinadi */
const STRIP_IMAGES = 4;

/**
 * Обзор holati — 3 ustunli kategoriya gridi.
 * Plitka bosilganda kategoriya ochiladi (filtr tanlash emas — u ichkarida).
 */
export default function CategoryOverview({
  categories,
  countsByCategory,
  selectedCategoryIds,
  onOpen,
  totalCount,
  allSelected,
  onSelectAll,
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
    <div className={cn('subtle-scrollbar overflow-y-auto px-3 pb-6 pt-3', className)}>
      <div className="grid grid-cols-3 gap-3">
        {/* Tepadagi keng qator — filtrsiz holat, ya'ni butun katalog */}
        <button
          type="button"
          onClick={onSelectAll}
          aria-pressed={allSelected}
          aria-label={`Все товары, ${totalCount}`}
          className="group col-span-3 text-left focus:outline-none"
        >
          <div
            className={cn(
              PLATE_FRAME,
              allSelected ? PLATE_BORDER_ACTIVE : PLATE_BORDER,
              'group-hover:shadow-card-hover group-focus-visible:border-primary',
            )}
          >
            <div className={cn(PLATE_INNER, 'aspect-[16/5]')}>
              <div className="flex h-full w-full gap-px">
                {categories.slice(0, STRIP_IMAGES).map((c) => (
                  <span key={c.id} className="min-w-0 flex-1 overflow-hidden">
                    {c.image && (
                      <img
                        src={c.image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </span>
                ))}
              </div>

              {/* Rasm tasmasi ustidagi matn o'qilishi uchun qoplama */}
              <span className="absolute inset-0 grid place-items-center bg-overlay-dark backdrop-blur-[1px]">
                <span className="text-center">
                  <span className="block font-serif text-[19px] leading-tight text-overlay-fg">
                    Все товары
                  </span>
                  <span className="mt-0.5 block text-[9.5px] uppercase tracking-[0.14em] text-overlay-fg opacity-80">
                    {totalCount}
                  </span>
                </span>
              </span>

              {allSelected && (
                <span className="absolute left-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-fg shadow-card">
                  <FiCheck size={14} strokeWidth={3} />
                </span>
              )}
            </div>
          </div>
        </button>

        {categories.map((category) => {
          const count = countsByCategory[category.id] ?? 0;
          const subCount = category.subcategories?.length ?? 0;
          const selected = selectedCategoryIds.has(category.id);

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onOpen(category)}
              aria-label={`${category.name}, ${count} товаров`}
              className="group text-left focus:outline-none"
            >
              {/* Ramka klasslari CusPlate bilan bir xil — bu yerda motion.div kerak (morph) */}
              <motion.div
                layoutId={categoryLayoutId(category.id)}
                style={{ borderRadius: 4 }}
                className={cn(
                  PLATE_FRAME,
                  selected ? PLATE_BORDER_ACTIVE : PLATE_BORDER,
                  'group-hover:shadow-card-hover group-focus-visible:border-primary',
                )}
              >
                <div className={cn(PLATE_INNER, 'aspect-square')}>
                  {category.image && (
                    <img
                      src={category.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  )}

                  <span className="absolute right-1 top-1 rounded-full bg-overlay-light px-1.5 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur">
                    {count}
                  </span>

                  {/* Ichida subkategoriya bor — davomi borligini bildiradi */}
                  {subCount > 0 && (
                    <span className="absolute bottom-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-overlay-dark text-overlay-fg backdrop-blur">
                      <FiChevronRight size={12} />
                    </span>
                  )}
                </div>
              </motion.div>

              <span className="mt-1.5 block line-clamp-2 text-center text-[11px] leading-tight text-muted">
                {category.shortName ?? category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
