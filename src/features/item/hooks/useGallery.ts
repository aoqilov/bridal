import { useMemo, useRef, useState } from 'react';
import type { Swiper as SwiperClass } from 'swiper/types';
import type { ItemVariant } from '@/features/catalog';

/**
 * Galereya holati — asosiy rasm (sticky blok) va thumbnail lentasi (kartochka ichida)
 * turli joylarda render bo'lgani uchun holat yuqorida saqlanadi.
 */
export function useGallery(variant: ItemVariant) {
  const images = useMemo(
    () => [variant.mainImage, ...variant.otherImages],
    [variant.mainImage, variant.otherImages],
  );

  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Rang varianti almashganda galereya boshidan ochiladi
  const lastVariantId = useRef(variant.id);
  if (lastVariantId.current !== variant.id) {
    lastVariantId.current = variant.id;
    setActiveIndex(0);
  }

  const goTo = (index: number) => {
    swiper?.slideTo(index);
    setActiveIndex(index);
  };

  return { images, activeIndex, setActiveIndex, setSwiper, goTo };
}
