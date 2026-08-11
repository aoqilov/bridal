import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import type { NewsItem } from '../helper.types.news';

type Props = {
  item: NewsItem;
  className?: string;
  variant?: 'default' | 'slide';
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
  return (
    <Link
      to={`/brand-news/${item.slug}`}
      className={cn(
        'group block overflow-hidden rounded-2xl bg-surface shadow-card transition-shadow hover:shadow-card-hover',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        variant === 'slide' && 'h-full',
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
        <img
          src={item.cover}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="space-y-1.5 p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
          {formatDate(item.publishedAt)}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">{item.title}</h3>
        <p className="line-clamp-2 text-xs text-muted">{item.excerpt}</p>
      </div>
    </Link>
  );
}
