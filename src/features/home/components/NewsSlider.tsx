import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { MOCK_NEWS, NewsCard } from '@/features/news';
import { ROUTES } from '@/constants/routes';

/** Bosh sahifada nechta yangilik ko'rsatiladi */
const LIMIT = 6;

/** Yangiliklar lentasi — ramkali muqova, serif sarlavha */
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
      <div className="mb-3 flex items-end justify-between px-4">
        <h2 className="font-serif text-xl leading-none text-foreground">Новости</h2>
        <Link
          to={ROUTES.NEWS}
          className="inline-flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
        >
          Все
          <FiArrowRight size={12} />
        </Link>
      </div>

      <div className="flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-4 pb-5 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <div key={item.id} className="w-[62%] max-w-[240px] shrink-0 snap-start">
            <NewsCard item={item} variant="plate" className="h-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
