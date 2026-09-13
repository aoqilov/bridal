import type { CatalogItem } from '../helper.types.catalog';
import { isDress } from '../helper.types.catalog';
import { FABRIC_LABELS } from './labels';

/** Filtr bo'limidagi bitta variant */
export type FilterOption = {
  value: string;
  label: string;
  /** Shu variantga to'g'ri keladigan tovarlar soni */
  count: number;
};

/** Filtrlanadigan xususiyatlar — URL parametri nomi ham shundan olinadi */
export type AttributeKey = 'brands' | 'materials' | 'stones';

/**
 * Aksessuardagi `material` — erkin matn ("Экокожа, атлас"), ya'ni bitta tovarda
 * bir nechta mato bo'lishi mumkin. Vergul bo'yicha bo'linadi va bosh harf
 * birxillashtiriladi, aks holda "Атлас" va "атлас" ikki xil variant bo'lib chiqadi.
 */
function splitMaterial(raw: string): string[] {
  return raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());
}

/**
 * Tovarning xususiyat qiymatlari. Variantlar ro'yxati ham, moslik tekshiruvi ham
 * shu funksiyalardan oziqlanadi — ikkisi bir-biridan ayrilib qolmasin.
 */
export function itemAttributeValues(item: CatalogItem, key: AttributeKey): string[] {
  switch (key) {
    case 'brands':
      return item.brand ? [item.brand] : [];
    case 'materials': {
      if (isDress(item)) return item.fabrics;
      // Toshlar aksessuarda `material` matni ichida ham yozilgan
      // ("Металл, жемчуг"). `stones` da e'lon qilingani materialdan chiqib
      // ketadi — aks holda bitta qiymat ikkala bo'limda takrorlanadi.
      const stones = new Set(item.stones ?? []);
      return splitMaterial(item.material ?? '').filter((m) => !stones.has(m));
    }
    case 'stones':
      return item.stones ?? [];
  }
}

/** Mato enum qiymati ruscha yorliqqa, qolgani o'zi qanday bo'lsa shunday */
function optionLabel(key: AttributeKey, value: string): string {
  if (key !== 'materials') return value;
  return FABRIC_LABELS[value as keyof typeof FABRIC_LABELS] ?? value;
}

function collect(items: CatalogItem[], key: AttributeKey): FilterOption[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const value of itemAttributeValues(item, key)) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([value, count]) => ({
      value,
      label: optionLabel(key, value),
      count,
    }))
    // Ko'p uchragani yuqorida — foydalanuvchi ko'pincha shularni qidiradi
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'ru'));
}

/**
 * Filtr bo'limlarining variantlari — katalogning o'zidan yig'iladi.
 * Ma'lumot yo'q bo'lim bo'sh ro'yxat qaytaradi va UI uni ko'rsatmaydi, ya'ni
 * mockdata'ga `brand` yoki `stones` yozilishi bilan bo'lim o'zi paydo bo'ladi.
 */
export function buildFilterOptions(
  items: CatalogItem[],
): Record<AttributeKey, FilterOption[]> {
  return {
    brands: collect(items, 'brands'),
    materials: collect(items, 'materials'),
    stones: collect(items, 'stones'),
  };
}
