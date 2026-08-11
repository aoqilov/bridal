import type { CatalogItem } from '../helper.types.catalog';

export function getItemBySlug(slug: string, items: CatalogItem[]): CatalogItem | null {
  return items.find((i) => i.slug === slug) ?? null;
}

// id → element indeksi. Sharhlar lentasi har bir element uchun tovarni
// qidiradi, shu sabab bir marta tuzilgan Map ishlatiladi.
const byIdCache = new WeakMap<CatalogItem[], Map<string, CatalogItem>>();

export function getItemById(id: string, items: CatalogItem[]): CatalogItem | null {
  let index = byIdCache.get(items);
  if (!index) {
    index = new Map(items.map((i) => [i.id, i]));
    byIdCache.set(items, index);
  }
  return index.get(id) ?? null;
}

/** O'xshash tovarlar: avval bir xil subkategoriya, keyin bir xil kategoriya */
export function getRelatedItems(
  item: CatalogItem,
  items: CatalogItem[],
  limit = 6,
): CatalogItem[] {
  const pool = items.filter((i) => i.id !== item.id && i.isAvailable);
  const sameSub = item.subcategoryId
    ? pool.filter((i) => i.subcategoryId === item.subcategoryId)
    : [];
  const sameCat = pool.filter(
    (i) => i.categoryId === item.categoryId && !sameSub.includes(i),
  );
  return [...sameSub, ...sameCat].slice(0, limit);
}

/** Ko'ylakka mos aksessuarlar — "С этим платьем берут" bloki uchun */
export function getMatchingAccessories(items: CatalogItem[], limit = 6): CatalogItem[] {
  return items
    .filter((i) => i.kind === 'accessory' && i.isAvailable)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit);
}
