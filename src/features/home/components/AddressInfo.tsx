import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { ADDRESSES, type AddressPoint } from '@/constants/contact';
import AddressCard from './AddressCard';
import MapOverlay from './MapOverlay';

export default function AddressInfo() {
  const [fullscreen, setFullscreen] = useState<AddressPoint | null>(null);

  if (ADDRESSES.length === 0) return null;

  // Bitta manzilda peek kerak emas — karta to'liq kenglikni egallaydi
  const hasMany = ADDRESSES.length > 1;

  return (
    <>
      <section>
        <h2 className="mb-3 px-4 text-base font-bold text-foreground">Где нас найти</h2>

        <Swiper
          grabCursor
          slidesPerView={hasMany ? 1.75 : 1}
          spaceBetween={12}
          className="!px-4"
        >
          {ADDRESSES.map((point) => (
            <SwiperSlide key={point.id} className="!h-auto">
              <AddressCard point={point} onOpenMap={setFullscreen} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {fullscreen && (
        <MapOverlay point={fullscreen} onClose={() => setFullscreen(null)} />
      )}
    </>
  );
}
