import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom, Keyboard } from 'swiper/modules';
import { FiX } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/zoom';

type Props = {
  images: string[];
  initialIndex: number;
  itemName: string;
  onClose: () => void;
};

/** To'liq ekran galereya — ikki marta bosib yoki ikki barmoq bilan kattalashtiriladi */
export default function ItemLightbox({
  images,
  initialIndex,
  itemName,
  onClose,
}: Props) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex h-14 shrink-0 items-center justify-between px-4">
        <span className="text-sm font-medium text-white/80">
          {index + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <FiX size={20} />
        </button>
      </div>

      <Swiper
        modules={[Zoom, Keyboard]}
        zoom={{ maxRatio: 3 }}
        keyboard={{ enabled: true }}
        initialSlide={initialIndex}
        onSlideChange={(s) => setIndex(s.activeIndex)}
        spaceBetween={16}
        className="w-full flex-1"
      >
        {images.map((src, idx) => (
          <SwiperSlide key={src} className="flex items-center justify-center">
            <div className="swiper-zoom-container h-full w-full">
              <img
                src={src}
                alt={`${itemName} (${idx + 1})`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <p className="shrink-0 pb-6 pt-3 text-center text-xs text-white/50">
        Двойное касание — приблизить
      </p>
    </div>,
    document.body,
  );
}
