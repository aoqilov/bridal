import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import type { ItemVariant } from '@/features/catalog';
import { cn } from '@/utils/cn';

type Props = {
  variant: ItemVariant;
  itemName: string;
};

export default function ItemGallery({ variant, itemName }: Props) {
  const images = [variant.mainImage, ...variant.otherImages];
  const [thumbs, setThumbs] = useState<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="bg-surface-2">
      <Swiper
        key={variant.id}
        modules={[Pagination, Thumbs]}
        pagination={{ clickable: true }}
        thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
        onSlideChange={(s) => setActiveIndex(s.activeIndex)}
        spaceBetween={0}
        slidesPerView={1}
        className="aspect-[3/4] w-full"
      >
        {images.map((src, idx) => (
          <SwiperSlide key={src}>
            <img
              src={src}
              alt={`${itemName} — ${variant.colorName} (${idx + 1})`}
              className="h-full w-full object-cover"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <Swiper
          onSwiper={setThumbs}
          modules={[Thumbs]}
          watchSlidesProgress
          slidesPerView="auto"
          spaceBetween={8}
          className="!mx-3 !my-3"
        >
          {images.map((src, idx) => (
            <SwiperSlide key={src} className="!w-[50px]">
              <button
                type="button"
                aria-label={`Показать ${idx + 1}`}
                className={cn(
                  'h-[50px] w-[50px] overflow-hidden rounded-md border-2 transition',
                  activeIndex === idx
                    ? 'border-primary'
                    : 'border-border-subtle opacity-70 hover:opacity-100',
                )}
              >
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
