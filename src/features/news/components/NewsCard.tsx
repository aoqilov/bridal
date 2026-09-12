import { Link } from 'react-router-dom';
import { PLATE_FRAME, PLATE_BORDER } from '@/components/ui';
import { cn } from '@/utils/cn';
import { newsPath } from '@/constants/routes';
import type { NewsItem } from '../helper.types.news';

type Props = {
  item: NewsItem;
  className?: string;
  /**
   * `wide`  — 16:9 muqova (lenta uchun)
   * `plate` — fonsiz karta, rasm yupqa ramkada (bosh sahifa)
   */
  variant?: 'default' | 'slide' | 'wide' | 'plate';
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function NewsCard({ item, className, variant = 'default' }: Props) {
  const plate = variant === 'plate';

  return (
    <Link
      to={newsPath(item.slug)}
      className={cn(
        'group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        plate
          ? 'rounded-xl bg-surface p-2 shadow-card transition-shadow hover:shadow-card-hover'
          : 'overflow-hidden rounded-2xl bg-surface shadow-card transition-shadow hover:shadow-card-hover',
        variant === 'slide' && 'h-full',
        className,
      )}
    >
      <div
        className={cn(
          // Soya butun kartada — ramka faqat chegara va oq maydonni beradi
          plate && cn(PLATE_FRAME, PLATE_BORDER, 'shadow-none'),
        )}
      >
        <div
          className={cn(
            'relative overflow-hidden bg-surface-2',
            plate && 'rounded-sm aspect-[4/3]',
            variant === 'wide' && 'aspect-video',
            variant !== 'wide' && !plate && 'aspect-[16/10]',
          )}
        >
          <img
            src={item.cover}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      <div className={cn(plate ? 'mt-3 space-y-1.5 px-1 pb-1' : 'space-y-1.5 p-3')}>
        <p
          className={cn(
            plate
              ? 'text-[9.5px] uppercase tracking-[0.14em] text-primary'
              : 'text-[11px] font-medium uppercase tracking-wide text-muted',
          )}
        >
          {formatDate(item.publishedAt)}
        </p>

        <h3
          className={cn(
            'line-clamp-2 text-foreground',
            plate ? 'font-serif text-[17px] leading-snug' : 'text-sm font-semibold',
          )}
        >
          {item.title}
        </h3>

        <p
          className={cn(
            'text-muted',
            plate ? 'line-clamp-3 text-[11.5px] leading-relaxed' : 'line-clamp-2 text-xs',
          )}
        >
          {item.excerpt}
        </p>
      </div>
    </Link>
  );
}
