import { useMemo, type ReactNode } from 'react';
import CusSheet from '@/components/ui/sheet/CusSheet';
import CusSegment, { type SegmentItem } from '@/components/ui/segment/CusSegment';
import CusSelect, { type SelectOption } from '@/components/ui/select/CusSelect';
import { KIND_LABELS, ITEM_KINDS } from '@/features/catalog';
import { cn } from '@/utils/cn';
import ShowResultsButton from './ShowResultsButton';
import { buildFilterOptions, type AttributeKey } from '../utils/filterOptions';
import type { Category, CatalogItem } from '../helper.types.catalog';
import type { KindValue } from '../hooks/useKindFilter';

/** Xususiyat bo'limlari — tartibi ekranda ko'rinadigan tartib */
const ATTRIBUTE_SECTIONS: { key: AttributeKey; title: string; placeholder: string }[] = [
  { key: 'brands', title: 'Бренд', placeholder: 'Любой бренд' },
  { key: 'materials', title: 'Материал', placeholder: 'Любой материал' },
  { key: 'stones', title: 'Камни', placeholder: 'Любые камни' },
];

/** Kategoriya select'idagi "butun kategoriya" qatorining qiymati */
const ALL_VALUE = '__all__';

type Props = {
  open: boolean;
  onClose: () => void;
  /** Faol kind tabidagi kategoriyalar */
  categories: Category[];
  /** Xususiyat variantlari shu ro'yxatdan yig'iladi */
  items: CatalogItem[];
  countsByCategory: Record<string, number>;
  countsBySubcategory: Record<string, number>;
  selectedCategoryIds: Set<string>;
  selectedSubcategoryIds: Set<string>;
  onToggleCategory: (categoryId: string, subIds: string[]) => void;
  onToggleSubcategory: (subcategoryId: string, categoryId: string) => void;
  /** Brend / material / tosh tanlovi */
  selectedAttributes: Record<AttributeKey, Set<string>>;
  onToggleAttribute: (key: AttributeKey, value: string) => void;
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
 * Har bir bo'lim — ko'p tanlovli `CusSelect`. Rasmli plitka bu yerda ortiqcha:
 * filtr tez skanerlanadigan ro'yxat bo'lishi kerak, rasmli tanlovni esa
 * "Категории" ekrani (`SubcategoryGrid`) beradi.
 *
 * Tanlov darhol URL'ga yoziladi, shuning uchun "Применить" yo'q — pastdagi
 * tugma faqat panelni yopadi.
 */
export default function FilterSheet({
  open,
  onClose,
  categories,
  items,
  countsByCategory,
  countsBySubcategory,
  selectedCategoryIds,
  selectedSubcategoryIds,
  onToggleCategory,
  onToggleSubcategory,
  selectedAttributes,
  onToggleAttribute,
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

  const options = useMemo(() => buildFilterOptions(items), [items]);

  return (
    <CusSheet
      open={open}
      onClose={onClose}
      title="Фильтр"
      side="right"
      panelClassName="rounded-none"
      contentClassName="p-0"
    >
      <div className="px-4 pb-1 pt-3">
        <CusSegment items={kindItems} value={kind} onChange={onKindChange} size="sm" fullWidth />
      </div>

      <div className="px-4 pb-6">
        {/* Бренд · Цвет · Материал · Камни — variantlar katalogning o'zidan */}
        {ATTRIBUTE_SECTIONS.map(({ key, title, placeholder }) =>
          options[key].length === 0 ? null : (
            <Section key={key} title={title} chosen={selectedAttributes[key].size}>
              <CusSelect
                options={options[key]}
                selected={selectedAttributes[key]}
                onToggle={(value) => onToggleAttribute(key, value)}
                placeholder={placeholder}
              />
            </Section>
          ),
        )}

        {/* Kategoriyalar — har biri alohida select: "Все модели" + subkategoriyalar */}
        {categories.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">Категории не найдены</p>
        ) : (
          categories.map((category) => {
            const subs = category.subcategories ?? [];
            const subIds = subs.map((s) => s.id);
            const wholeSelected = selectedCategoryIds.has(category.id);
            const chosenSubs = subs.filter((s) => selectedSubcategoryIds.has(s.id));

            const categoryOptions: SelectOption[] = [
              {
                value: ALL_VALUE,
                label: 'Все модели',
                count: countsByCategory[category.id] ?? 0,
              },
              ...subs.map<SelectOption>((sub) => ({
                value: sub.id,
                label: sub.name,
                count: countsBySubcategory[sub.id] ?? 0,
                // "Все модели" yoqilganda alohida sub tanlash ma'nosiz
                disabled: wholeSelected,
              })),
            ];

            const chosenValues = new Set(
              wholeSelected ? [ALL_VALUE] : chosenSubs.map((s) => s.id),
            );

            return (
              <Section
                key={category.id}
                title={category.name}
                note={
                  wholeSelected
                    ? 'выбрано всё'
                    : chosenSubs.length > 0
                      ? `выбрано: ${chosenSubs.length}`
                      : `${countsByCategory[category.id] ?? 0} товаров`
                }
                active={wholeSelected || chosenSubs.length > 0}
              >
                <CusSelect
                  options={categoryOptions}
                  selected={chosenValues}
                  onToggle={(value) =>
                    value === ALL_VALUE
                      ? onToggleCategory(category.id, subIds)
                      : onToggleSubcategory(value, category.id)
                  }
                  placeholder="Любая подкатегория"
                />
              </Section>
            );
          })
        )}
      </div>

      <ShowResultsButton count={resultCount} onClick={onApply} onClear={onClear} />
    </CusSheet>
  );
}

type SectionProps = {
  title: string;
  /** O'ngdagi izoh — berilmasa tanlanganlar soni chiqadi */
  note?: string;
  chosen?: number;
  active?: boolean;
  children: ReactNode;
};

/** Filtr bo'limi — sarlavha, o'ngda holat matni va tanlov maydoni */
function Section({ title, note, chosen = 0, active, children }: SectionProps) {
  const highlighted = active ?? chosen > 0;
  const text = note ?? (chosen > 0 ? `выбрано: ${chosen}` : '');

  return (
    <section className="border-b border-border-subtle py-3.5 last:border-b-0">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h3 className="truncate font-serif text-[17px] leading-tight text-foreground">
          {title}
        </h3>
        {text && (
          <span
            className={cn(
              'shrink-0 text-[9.5px] uppercase tracking-[0.14em]',
              highlighted ? 'text-primary' : 'text-subtle',
            )}
          >
            {text}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
