import type { CatalogItem, OfferType } from '../helper.types.catalog';
import { OFFER_LABELS } from './labels';

export type PriceView = {
  /** Ko'rsatiladigan asosiy narx */
  amount: number;
  /** Chizilgan eski narx */
  old?: number;
  /** "Аренда" / "Продажа" */
  label: string;
  offer: OfferType;
};

/**
 * Kartada ko'rsatiladigan asosiy narx.
 * Ijara mavjud bo'lsa — ijara narxi ustuvor (salon uchun asosiy oqim).
 */
export function primaryPrice(item: CatalogItem): PriceView | null {
  if (item.offerTypes.includes('rent') && item.rentPrice) {
    return {
      amount: item.rentPrice,
      old: item.oldPrice,
      label: OFFER_LABELS.rent,
      offer: 'rent',
    };
  }
  if (item.offerTypes.includes('sale') && item.salePrice) {
    return {
      amount: item.salePrice,
      old: item.oldPrice,
      label: OFFER_LABELS.sale,
      offer: 'sale',
    };
  }
  return null;
}

/**
 * Aniq bir taklif turi bo'yicha narx — tovar sahifasidagi "Аренда / Покупка / Пошив"
 * pereklyuchateli uchun. `tailoring` da narx yo'q (o'lchovdan keyin hisoblanadi).
 * Chizilgan eski narx faqat asosiy taklifga tegishli.
 */
export function offerPrice(item: CatalogItem, offer: OfferType): PriceView | null {
  const primary = primaryPrice(item);
  const old = primary?.offer === offer ? primary.old : undefined;

  if (offer === 'rent' && item.rentPrice) {
    return { amount: item.rentPrice, old, label: OFFER_LABELS.rent, offer: 'rent' };
  }
  if (offer === 'sale' && item.salePrice) {
    return { amount: item.salePrice, old, label: OFFER_LABELS.sale, offer: 'sale' };
  }
  return null;
}

/** Ikkinchi darajali narx — kartada emas, faqat tovar sahifasida */
export function secondaryPrice(item: CatalogItem): PriceView | null {
  const primary = primaryPrice(item);
  if (primary?.offer === 'rent' && item.salePrice) {
    return { amount: item.salePrice, label: OFFER_LABELS.sale, offer: 'sale' };
  }
  return null;
}

export function discountPercent(item: CatalogItem): number {
  const price = primaryPrice(item);
  if (!price?.old || price.old <= price.amount) return 0;
  return Math.round(((price.old - price.amount) / price.old) * 100);
}
