import type { CatalogItem, ItemVariant } from '../helper.types.catalog';

/**
 * Kartochkalarda ko'rsatiladigan rang varianti.
 * `defaultVariantId` topilmasa — birinchisi (mockdata to'liq bo'lmasligi mumkin).
 */
export function defaultVariant(item: CatalogItem): ItemVariant {
  return item.variants.find((v) => v.id === item.defaultVariantId) ?? item.variants[0];
}

/** "Платья с хиджабом" kategoriyasi — `mockdata.categories.real.ts` dagi `id` */
export const HIJAB_CATEGORY_ID = 'hijab';

/**
 * Tovar hijab uchunmi.
 *
 * `neckline: 'closed'` yoki `sleeve: 'long'` bo'yicha aniqlamang — yopiq yoqa va
 * uzun yeng oddiy ko'ylaklarda ham uchraydi. Yagona ishonchli belgi — kategoriya.
 * Hijab ko'ylaklari boshqa kategoriyaga ham tushadigan bo'lsa, o'zgarish faqat
 * shu funksiyada bo'ladi.
 */
export function isHijabItem(item: CatalogItem | null | undefined): boolean {
  return item?.categoryId === HIJAB_CATEGORY_ID;
}
