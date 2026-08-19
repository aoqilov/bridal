import { useRef, useState } from 'react';
import {
  isDress,
  primaryPrice,
  type CatalogItem,
  type ItemVariant,
  type OfferType,
} from '@/features/catalog';

type Selection = {
  variantId: string;
  size: string | null;
  offer: OfferType;
};

function initialSelection(item: CatalogItem): Selection {
  const size = isDress(item)
    ? (item.sizes.find((s) => s.available)?.label ?? null)
    : (item.sizeLabels?.[0] ?? null);

  return {
    variantId: item.defaultVariantId,
    size,
    offer: primaryPrice(item)?.offer ?? item.offerTypes[0] ?? 'rent',
  };
}

/**
 * Tovar sahifasidagi tanlovlar: rang varianti, o'lcham va taklif turi.
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
    size: selection.size,
    offer: selection.offer,
    setVariantId: (variantId: string) =>
      setSelection((prev) => ({ ...prev, variantId })),
    setSize: (size: string) => setSelection((prev) => ({ ...prev, size })),
    setOffer: (offer: OfferType) => setSelection((prev) => ({ ...prev, offer })),
  };
}
