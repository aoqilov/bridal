import { useMemo } from 'react';
import type { Category, CatalogItem } from '../helper.types.catalog';
import { isDress } from '../helper.types.catalog';
import {
  ACCESSORY_TYPE_LABELS,
  FABRIC_LABELS,
  SHADE_LABELS,
  SILHOUETTE_LABELS,
} from '../utils/labels';

/** Matn bo'yicha qidiruv: nom, tavsif, teg, silueti, mato, rang, kategoriya */
export function useSearchItems(
  query: string,
  items: CatalogItem[],
  categories: Category[],
): CatalogItem[] {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matchingCategoryIds = new Set(
      categories.filter((c) => c.name.toLowerCase().includes(q)).map((c) => c.id),
    );

    return items.filter((item) => {
      if (!item.isAvailable) return false;
      if (matchingCategoryIds.has(item.categoryId)) return true;
      if (item.name.toLowerCase().includes(q)) return true;
      if (item.description?.toLowerCase().includes(q)) return true;
      if (item.tags?.some((t) => t.toLowerCase().includes(q))) return true;

      if (isDress(item)) {
        if (SILHOUETTE_LABELS[item.silhouette].toLowerCase().includes(q)) return true;
        if (SHADE_LABELS[item.shade].toLowerCase().includes(q)) return true;
        if (item.fabrics.some((f) => FABRIC_LABELS[f].toLowerCase().includes(q))) return true;
      } else {
        if (ACCESSORY_TYPE_LABELS[item.accessoryType].toLowerCase().includes(q)) return true;
        if (item.material?.toLowerCase().includes(q)) return true;
      }

      return false;
    });
  }, [query, items, categories]);
}
