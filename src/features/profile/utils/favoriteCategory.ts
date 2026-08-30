import type { CatalogItem } from '@/features/catalog';
import {
  OUTFIT_CATEGORIES,
  OUTFIT_CATEGORY_LABELS,
  itemCategory,
  type OutfitCategory,
} from '@/features/garderob';

/** "Избранное" tab'idagi filtr bo'limlari — `all` barcha saqlanganlar */
export type FavoriteCategory = 'all' | OutfitCategory;

export const FAVORITE_CATEGORIES: FavoriteCategory[] = ['all', ...OUTFIT_CATEGORIES];

export const FAVORITE_CATEGORY_LABELS: Record<FavoriteCategory, string> = {
  all: 'Все',
  ...OUTFIT_CATEGORY_LABELS,
};

/** Tovar tanlangan bo'limga tushadimi */
export function matchesFavoriteCategory(
  item: CatalogItem,
  category: FavoriteCategory,
): boolean {
  return category === 'all' || itemCategory(item) === category;
}
