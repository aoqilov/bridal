import { useRef, useState } from 'react';
import {
  primaryPrice,
  type CatalogItem,
  type ItemVariant,
  type OfferType,
} from '@/features/catalog';

type Selection = {
  variantId: string;
  offer: OfferType;
};

function initialSelection(item: CatalogItem): Selection {
  return {
    variantId: item.defaultVariantId,
    offer: primaryPrice(item)?.offer ?? item.offerTypes[0] ?? 'rent',
  };
}

/**
 * Tovar sahifasidagi tanlovlar: rang varianti va taklif turi.
 * O'lcham tanlanmaydi — u faqat ko'rsatiladi (`ItemSizes`).
 *
 * "Похожие модели" orqali boshqa tovarga o'tganda komponent qayta yaratilmaydi —
 * shuning uchun tovar id'si o'zgarganda tanlovlar render paytida tiklanadi
 * (React'ning "prop o'zgarganda state'ni to'g'rilash" namunasi).
 */
export function useItemSelection(item: CatalogItem) {
  const [selection, setSelection] = useState<Selection>(() => initialSelection(item));
  const lastItemId = useRef(item.id);

  if (lastItemId.current !== item.id) {
    lastItemId.current = item.id;
    setSelection(initialSelection(item));
  }

  const variant: ItemVariant =
    item.variants.find((v) => v.id === selection.variantId) ?? item.variants[0];

  return {
    variant,
    offer: selection.offer,
    setVariantId: (variantId: string) =>
      setSelection((prev) => ({ ...prev, variantId })),
    setOffer: (offer: OfferType) => setSelection((prev) => ({ ...prev, offer })),
  };
}
