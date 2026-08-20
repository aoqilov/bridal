import type { CatalogItem, ItemVariant } from '../helper.types.catalog';

/**
 * Kartochkalarda ko'rsatiladigan rang varianti.
 * `defaultVariantId` topilmasa — birinchisi (mockdata to'liq bo'lmasligi mumkin).
 */
export function defaultVariant(item: CatalogItem): ItemVariant {
  return item.variants.find((v) => v.id === item.defaultVariantId) ?? item.variants[0];
}
