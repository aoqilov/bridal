import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { MOCK_NEWS, NewsCard } from '@/features/news';
import { ROUTES } from '@/constants/routes';

/** Bosh sahifada nechta yangilik ko'rsatiladi */
const LIMIT = 6;

/** Yangiliklar lentasi — 16:9 muqovali gorizontal slayder */
export default function NewsSlider() {
  const items = useMemo(
    () =>
      [...MOCK_NEWS]
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
        .slice(0, LIMIT),
    [],
  );

  if (items.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="font-serif text-lg font-semibold text-foreground">Новости</h2>
        <Link
          to={ROUTES.NEWS}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover"
        >
          Все
          <FiArrowRight size={14} />
        </Link>
      </div>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <div key={item.id} className="w-[82%] max-w-[320px] shrink-0 snap-start">
            <NewsCard item={item} variant="wide" />
          </div>
        ))}
      </div>
    </section>
  );
}
