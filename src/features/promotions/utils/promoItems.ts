import { MOCK_CATALOG, getItemById, type CatalogItem } from '@/features/catalog';
import type { Promotion } from '../helper.types.promotions';

/**
 * Aksiyada qatnashayotgan tovarlar.
 * Katalogdan topilmagan `id` tashlab yuboriladi — mockdata qo'lda yoziladi,
 * tovar o'chirilsa aksiya sahifasi buzilmasligi kerak.
 */
export function getPromotionItems(
  promo: Promotion,
  items: CatalogItem[] = MOCK_CATALOG,
): CatalogItem[] {
  if (!promo.itemIds?.length) return [];
  return promo.itemIds
    .map((id) => getItemById(id, items))
    .filter((item): item is CatalogItem => item !== null);
}

/** Kartada ko'rsatiladigan tovarlar soni ("12 моделей") */
export function promotionItemCount(promo: Promotion): number {
  return getPromotionItems(promo).length;
}
