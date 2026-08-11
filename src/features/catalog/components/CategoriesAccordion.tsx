import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { cn } from '@/utils/cn';
import type { Category } from '@/features/catalog';

type Props = {
  categories: Category[];
  countsByCategory: Record<string, number>;
  countsBySubcategory: Record<string, number>;
  selectedCategoryIds: Set<string>;
  selectedSubcategoryIds: Set<string>;
  onToggleCategory: (categoryId: string, subIds: string[]) => void;
  onToggleSubcategory: (subcategoryId: string, categoryId: string) => void;
};

export default function CategoriesAccordion({
  categories,
  countsByCategory,
  countsBySubcategory,
  selectedCategoryIds,
  selectedSubcategoryIds,
  onToggleCategory,
  onToggleSubcategory,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <ul className="divide-y divide-border-subtle">
      {categories.map((cat) => {
        const hasSubs = !!cat.subcategories && cat.subcategories.length > 0;
        const subIds = cat.subcategories?.map((s) => s.id) ?? [];
        const isCatChecked = selectedCategoryIds.has(cat.id);
        const partialCount =
          cat.subcategories?.filter((s) => selectedSubcategoryIds.has(s.id)).length ?? 0;
        const isPartial = !isCatChecked && partialCount > 0;
        const expanded = expandedId === cat.id;
        const totalCount = countsByCategory[cat.id] ?? 0;

        return (
          <li key={cat.id}>
            <div className="flex items-stretch">
              <button
                type="button"
                onClick={() => {
                  if (hasSubs) setExpandedId(expanded ? null : cat.id);
                  else onToggleCategory(cat.id, []);
                }}
                className="flex flex-1 items-center gap-3 px-4 py-3 text-left focus:outline-none focus-visible:bg-surface-2"
                aria-expanded={hasSubs ? expanded : undefined}
              >
                <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">{cat.name}</span>
                  <span className="block text-xs text-muted">
                    {isPartial
                      ? `${partialCount} выбрано · ${totalCount} товаров`
                      : `${totalCount} товаров`}
                  </span>
                </span>
                {hasSubs && (
                  <FiChevronDown
                    size={18}
                    className={cn(
                      'shrink-0 text-muted transition-transform',
                      expanded && 'rotate-180',
                    )}
                  />
                )}
              </button>

              <label className="flex cursor-pointer items-center pl-2 pr-4">
                <input
                  type="checkbox"
                  checked={isCatChecked}
                  onChange={() => onToggleCategory(cat.id, subIds)}
                  className="h-5 w-5 cursor-pointer rounded-md accent-primary"
                  aria-label={`Выбрать всё в «${cat.name}»`}
                />
              </label>
            </div>

            {hasSubs && expanded && (
              <div className="bg-surface-2/60 px-4 pb-4 pt-1">
                <div className="flex flex-wrap gap-2">
                  {cat.subcategories!.map((sub) => {
                    const selected = selectedSubcategoryIds.has(sub.id);
                    const disabled = isCatChecked;
                    const subTotal = countsBySubcategory[sub.id] ?? 0;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => onToggleSubcategory(sub.id, cat.id)}
                        className={cn(
                          'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                          selected
                            ? 'border-accent bg-accent-soft text-accent'
                            : 'border-border bg-surface text-foreground hover:border-primary',
                          disabled && 'pointer-events-none opacity-50',
                        )}
                      >
                        {sub.name}
                        <span className="ml-1 text-muted">· {subTotal}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
