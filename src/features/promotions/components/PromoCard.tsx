import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import type { Promotion } from '../helper.types.promotions';

type Props = {
  promo: Promotion;
  className?: string;
  variant?: 'default' | 'slide';
};

const accentBadge: Record<NonNullable<Promotion['accentColor']>, string> = {
  primary: 'bg-primary text-primary-fg',
  accent: 'bg-accent text-accent-fg',
  danger: 'bg-danger text-white',
};

function formatDateRange(startsAt: string, endsAt: string): string {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const fmt = (d: Date) =>
    d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  return `${fmt(start)} — ${fmt(end)}`;
}

export default function PromoCard({ promo, className, variant = 'default' }: Props) {
  const accent = accentBadge[promo.accentColor ?? 'primary'];

  return (
    <Link
      to={`/promotions/${promo.slug}`}
      className={cn(
        'group relative block overflow-hidden rounded-2xl bg-surface-2 shadow-card transition-shadow hover:shadow-card-hover',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        variant === 'slide' ? 'aspect-[4/5] h-full' : 'aspect-[16/10]',
        className,
      )}
    >
      <img
        src={promo.cover}
        alt={promo.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {promo.discountPercent && (
        <span
          className={cn(
            'absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold shadow-card',
            accent,
          )}
        >
          −{promo.discountPercent}%
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-overlay-gradient-b p-3 pt-10 text-white">
        <p className="text-[10px] font-medium uppercase tracking-wide text-white/80">
          {formatDateRange(promo.startsAt, promo.endsAt)}
        </p>
        <h3 className="mt-1 line-clamp-2 text-base font-bold leading-tight">{promo.title}</h3>
        {promo.subtitle && (
          <p className="mt-0.5 line-clamp-1 text-xs text-white/90">{promo.subtitle}</p>
        )}
      </div>
    </Link>
  );
}
