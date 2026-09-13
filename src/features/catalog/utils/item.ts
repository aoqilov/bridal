import type {
  CatalogItem,
  HemLength,
  ItemVariant,
  VariantKind,
} from '../helper.types.catalog';
import { isDress } from '../helper.types.catalog';

/**
 * Kartochkalarda ko'rsatiladigan variant (odatda `brand`).
 * `defaultVariantId` topilmasa — birinchisi (mockdata to'liq bo'lmasligi mumkin).
 */
export function defaultVariant(item: CatalogItem): ItemVariant {
  return item.variants.find((v) => v.id === item.defaultVariantId) ?? item.variants[0];
}

/**
 * Kerakli turdagi variant. Yo'q bo'lsa — `defaultVariant`, ya'ni chaqiruvchi
 * hech qachon bo'sh qolmaydi: `ai` fotosi hali yuklanmagan model ham
 * генерацияga brend fotosi bilan tushaveradi.
 */
export function variantOfKind(item: CatalogItem, kind: VariantKind): ItemVariant {
  return item.variants.find((v) => v.kind === kind) ?? defaultVariant(item);
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

/**
 * Ko'ylak etagi qayerda tugaydi.
 *
 * `hemLength` yozilmagan bo'lsa siluetdan taxmin qilinadi: `short` siluet —
 * kalta ko'ylak, qolgani polgacha. Taxmin faqat zaxira; aniq qiymat kerak
 * bo'lganda mockdata'ga `hemLength` yozing.
 */
export function hemLengthOf(item: CatalogItem | null | undefined): HemLength {
  if (!item || !isDress(item)) return 'floor';
  if (item.hemLength) return item.hemLength;
  return item.silhouette === 'short' ? 'short' : 'floor';
}

/**
 * Etak ostidan oyoq (va demak tufli) ko'rinadimi.
 * Примерка'da tufli bo'limi shu shart bilan ochiladi — polgacha ko'ylakda
 * tanlangan tufli natijada ko'rinmaydi, referens esa bekorga ketadi.
 */
export function showsFeet(item: CatalogItem | null | undefined): boolean {
  return hemLengthOf(item) !== 'floor';
}
