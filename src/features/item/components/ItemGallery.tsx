import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper/types';
import { MdOutlineZoomOutMap } from 'react-icons/md';
import 'swiper/css';
import { VARIANT_KIND_LABELS, type ItemVariant } from '@/features/catalog';
import ItemLightbox from './ItemLightbox';

type Props = {
  images: string[];
  variant: ItemVariant;
  itemName: string;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSwiper: (swiper: SwiperClass) => void;
};

/** Asosiy rasm — sticky blok. Thumbnail lentasi alohida (`ItemThumbs`). */
export default function ItemGallery({
  images,
  variant,
  itemName,
  activeIndex,
  onActiveIndexChange,
  onSwiper,
}: Props) {
  const [zoomOpen, setZoomOpen] = useState(false);

  return (
    <div className="relative bg-surface-2">
      <Swiper
        key={variant.id}
        onSwiper={onSwiper}
        onSlideChange={(s) => onActiveIndexChange(s.activeIndex)}
        spaceBetween={0}
        slidesPerView={1}
        className="aspect-[3/4] w-full"
      >
        {images.map((src, idx) => (
          <SwiperSlide key={src}>
            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              aria-label="Открыть фото на весь экран"
              className="block h-full w-full"
            >
              <img
                src={src}
                alt={`${itemName} — ${VARIANT_KIND_LABELS[variant.kind]} (${idx + 1})`}
                className="h-full w-full object-cover"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Panel tugmalari yorug' rasmda ham ko'rinsin */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-overlay-gradient-t" />

      {/* Pastki chekka kartochka bilan yopiladi — hisoblagich undan tepada turadi */}
      <span className="pointer-events-none absolute bottom-14 right-3 z-10 flex items-center gap-1.5 rounded-full bg-overlay-dark px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
        <MdOutlineZoomOutMap size={12} />
        {activeIndex + 1} / {images.length}
      </span>

      {zoomOpen && (
        <ItemLightbox
          images={images}
          initialIndex={activeIndex}
          itemName={itemName}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </div>
  );
}
