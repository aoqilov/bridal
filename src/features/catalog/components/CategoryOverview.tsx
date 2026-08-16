import { motion } from 'framer-motion';
import { FiChevronRight } from 'react-icons/fi';
import { cn } from '@/utils/cn';
import type { Category } from '@/features/catalog';
import { categoryLayoutId } from '../utils/categoryMotion';

type Props = {
  categories: Category[];
  countsByCategory: Record<string, number>;
  /** Tanlangan kategoriyalar — filtr belgisi uchun */
  selectedCategoryIds: Set<string>;
  onOpen: (category: Category) => void;
  className?: string;
};

/**
 * Обзор holati — 3 ustunli kategoriya gridi.
 * Plitka bosilganda kategoriya ochiladi (filtr tanlash emas — u ichkarida).
 */
export default function CategoryOverview({
  categories,
  countsByCategory,
  selectedCategoryIds,
  onOpen,
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
              <motion.div
                layoutId={categoryLayoutId(category.id)}
                style={{ borderRadius: 16 }}
                className={cn(
                  'relative aspect-square overflow-hidden bg-surface-2 shadow-card transition-shadow',
                  'group-hover:shadow-card-hover group-focus-visible:ring-2 group-focus-visible:ring-primary',
                  selected && 'ring-2 ring-primary',
                )}
              >
                {category.image && (
                  <img
                    src={category.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}

                <span className="absolute right-1 top-1 rounded-full bg-surface/90 px-1.5 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur">
                  {count}
                </span>

                {/* Ichida subkategoriya bor — davomi borligini bildiradi */}
                {subCount > 0 && (
                  <span className="absolute bottom-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-overlay-dark text-white backdrop-blur">
                    <FiChevronRight size={12} />
                  </span>
                )}
              </motion.div>

              <span className="mt-1.5 block line-clamp-2 text-center text-[11px] font-medium leading-tight text-foreground">
                {category.shortName ?? category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
