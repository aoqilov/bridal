import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { FiArrowRight } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/free-mode';
import { MOCK_NEWS, NewsCard } from '@/features/news';

export default function NewsSlider() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="text-base font-bold text-foreground">Новости</h2>
        <Link
          to="/brand-news"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover"
        >
          Все <FiArrowRight size={14} />
        </Link>
      </div>

      <Swiper
        modules={[FreeMode]}
        freeMode
        slidesPerView={1.2}
        spaceBetween={12}
        className="!px-4"
      >
        {MOCK_NEWS.map((item) => (
          <SwiperSlide key={item.id} className="!h-auto">
            <NewsCard item={item} variant="slide" />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
