import { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { MOCK_CATALOG, getItemById } from '@/features/catalog';
import ItemThumb from '@/features/catalog/components/ItemThumb';
import { useRecentlyViewedStore } from '@/store/zustand';

export default function RecentlyViewed() {
  const ids = useRecentlyViewedStore((s) => s.ids);
  const clear = useRecentlyViewedStore((s) => s.clear);

  const items = useMemo(
    () =>
      ids
        .map((id) => getItemById(id, MOCK_CATALOG))
        .filter((p): p is NonNullable<typeof p> => p !== null),
    [ids],
  );

  if (items.length === 0) return null;

  return (
    <section id="profile-recent" className="scroll-mt-4">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="text-base font-bold text-foreground">
          Вы смотрели
          <span className="ml-1.5 text-sm font-normal text-muted">
            {items.length}
          </span>
        </h2>
        <button
          type="button"
          onClick={clear}
          className="text-xs font-semibold text-muted hover:text-foreground"
        >
          Очистить
        </button>
      </div>

      <Swiper
        modules={[FreeMode]}
        freeMode
        slidesPerView={3.4}
        spaceBetween={8}
        className="!px-4"
      >
        {items.map((p) => (
          <SwiperSlide key={p.id} className="!h-auto">
            <ItemThumb item={p} className="rounded-xl" />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
