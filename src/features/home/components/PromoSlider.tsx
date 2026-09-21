import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { MOCK_PROMOTIONS, PromoCard } from '@/features/promotions';
import { ROUTES } from '@/constants/routes';

/** Bosh sahifada nechta aksiya ko'rsatiladi */
const LIMIT = 6;

/**
 * Aksiyalar lentasi — "Новости" ostida.
 * Tartib mockdata'dagidek qoladi (salon o'zi joylashtiradi), faqat
 * muddati o'tgan aksiya bosh sahifaga tushmaydi.
 */
export default function PromoSlider() {
  const items = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return MOCK_PROMOTIONS.filter((p) => p.endsAt >= today).slice(0, LIMIT);
  }, []);

  if (items.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-end justify-between px-4">
        <h2 className="font-serif text-xl leading-none text-foreground">Скидки</h2>
        <Link
          to={ROUTES.PROMOTIONS}
          className="inline-flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
        >
          Все
          <FiArrowRight size={12} />
        </Link>
      </div>

      <div className="flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-4 pb-5 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((promo) => (
          <div key={promo.id} className="w-[62%] max-w-[240px] shrink-0 snap-start">
            <PromoCard promo={promo} variant="slide" />
          </div>
        ))}
      </div>
    </section>
  );
}
