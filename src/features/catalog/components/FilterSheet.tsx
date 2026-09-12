import { FiCheck } from 'react-icons/fi';
import CusSheet from '@/components/ui/sheet/CusSheet';
import CusSegment, { type SegmentItem } from '@/components/ui/segment/CusSegment';
import { KIND_LABELS, ITEM_KINDS } from '@/features/catalog';
import { cn } from '@/utils/cn';
import ShowResultsButton from './ShowResultsButton';
import type { Category } from '../helper.types.catalog';
import type { KindValue } from '../hooks/useKindFilter';

type Props = {
  open: boolean;
  onClose: () => void;
  /** Faol kind tabidagi kategoriyalar */
  categories: Category[];
  countsByCategory: Record<string, number>;
  countsBySubcategory: Record<string, number>;
  selectedCategoryIds: Set<string>;
  selectedSubcategoryIds: Set<string>;
  onToggleCategory: (categoryId: string, subIds: string[]) => void;
  onToggleSubcategory: (subcategoryId: string, categoryId: string) => void;
  onClear: () => void;
  kind: KindValue;
  onKindChange: (kind: KindValue) => void;
  /** Joriy filtr bo'yicha topilgan tovarlar soni */
  resultCount: number;
  /** "Показать" — natijalarga o'tish */
  onApply: () => void;
};

/**
 * Filtr paneli — o'ngdan butun ekranga ochiladi.
 *
 * Tanlov faqat matnli tugmalar (chip) bilan: rasm bu yerda ortiqcha, chunki
 * filtr tez skanerlanadigan ro'yxat bo'lishi kerak — rasmli gridni
 * "Категории" ekrani (`SubcategoryGrid`) ko'rsatadi.
 *
 * Tanlov darhol URL'ga yoziladi, shuning uchun "Применить" yo'q —
 * pastdagi tugma faqat panelni yopadi.
 */
export default function FilterSheet({
  open,
  onClose,
  categories,
  countsByCategory,
  countsBySubcategory,
  selectedCategoryIds,
  selectedSubcategoryIds,
  onToggleCategory,
  onToggleSubcategory,
  onClear,
  kind,
  onKindChange,
  resultCount,
  onApply,
}: Props) {
  const kindItems: SegmentItem<KindValue>[] = [
    { value: 'all', label: 'Все' },
    ...ITEM_KINDS.map<SegmentItem<KindValue>>((k) => ({ value: k, label: KIND_LABELS[k] })),
  ];

  return (
    <CusSheet
      open={open}
      onClose={onClose}
      title="Фильтр"
      side="right"
      panelClassName="max-w-none rounded-none"
      contentClassName="p-0"
    >
      <div className="px-4 pb-1 pt-3">
        <CusSegment items={kindItems} value={kind} onChange={onKindChange} size="sm" fullWidth />
      </div>

      <div className="px-4 pb-6">
        {categories.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">Категории не найдены</p>
        ) : (
          categories.map((category) => {
            const subs = category.subcategories ?? [];
            const subIds = subs.map((s) => s.id);
            const wholeSelected = selectedCategoryIds.has(category.id);
            const subSelectedCount = subs.filter((s) =>
              selectedSubcategoryIds.has(s.id),
            ).length;

            return (
              <section key={category.id} className="border-b border-border-subtle py-3.5 last:border-b-0">
                <div className="mb-2.5 flex items-baseline justify-between gap-2">
                  <h3 className="truncate font-serif text-[17px] leading-tight text-foreground">
                    {category.name}
                  </h3>
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
                        : `${countsByCategory[category.id] ?? 0} товаров`}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Chip
                    label="Все модели"
                    count={countsByCategory[category.id] ?? 0}
                    selected={wholeSelected}
                    onClick={() => onToggleCategory(category.id, subIds)}
                  />

                  {subs.map((sub) => (
                    <Chip
                      key={sub.id}
                      label={sub.name}
                      count={countsBySubcategory[sub.id] ?? 0}
                      selected={selectedSubcategoryIds.has(sub.id)}
                      /* "Все модели" yoqilganda alohida sub tanlash ma'nosiz */
                      disabled={wholeSelected}
                      onClick={() => onToggleSubcategory(sub.id, category.id)}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>

      <ShowResultsButton count={resultCount} onClick={onApply} onClear={onClear} />
    </CusSheet>
  );
}

type ChipProps = {
  label: string;
  count: number;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
};

/** Filtr tugmasi — nomi, tovar soni va tanlangan holat belgisi */
function Chip({ label, count, selected, disabled, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        selected
          ? 'border-primary bg-primary-soft text-primary'
          : 'border-border-subtle bg-surface-2 text-foreground hover:border-border',
        disabled && 'pointer-events-none opacity-40',
      )}
    >
      {selected && <FiCheck size={13} strokeWidth={3} className="shrink-0" />}
      <span className="truncate">{label}</span>
      <span className={cn('tabular-nums', selected ? 'opacity-70' : 'text-subtle')}>
        {count}
      </span>
    </button>
  );
}
