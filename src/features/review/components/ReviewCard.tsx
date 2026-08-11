import { Link } from 'react-router-dom';
import { MdCollections, MdStar, MdVerified } from 'react-icons/md';
import { cn } from '@/utils/cn';
import { itemPath } from '@/constants/routes';
import type { CatalogItem } from '@/features/catalog';
import type { Review } from '../helper.types.review';
import { formatReviewDate } from '../utils/formatReviewDate';
import ItemTagLink from './ItemTagLink';

type Props = {
  review: Review;
  item: CatalogItem;
  className?: string;
};

/** grid-2 ko'rinishi — rasm + muallif + qisqa matn + tovar chipi */
export default function ReviewCard({ review, item, className }: Props) {
  return (
    <article
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-card',
        className,
      )}
    >
      <Link
        to={itemPath(item.slug)}
        aria-label={`Отзыв о товаре: ${item.name}`}
        className="relative block aspect-square shrink-0 overflow-hidden bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        <img
          src={review.images[0]}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />

        {review.images.length > 1 && (
          <span className="absolute right-2 top-2 text-white drop-shadow">
            <MdCollections size={16} />
          </span>
        )}

        <span className="absolute bottom-2 left-2 flex items-center gap-0.5 rounded-full bg-overlay-dark px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
          <MdStar size={12} className="text-warning" />
          {review.rating}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-foreground">
          {review.title}
        </h3>

        {review.description && (
          <p className="line-clamp-2 text-[11px] leading-snug text-muted">
            {review.description}
          </p>
        )}

        <div className="flex items-center gap-1.5 pt-0.5">
          <img
            src={review.author.avatar}
            alt=""
            loading="lazy"
            className="h-5 w-5 shrink-0 rounded-full object-cover"
          />
          <span className="line-clamp-1 text-[10px] text-muted">
            {review.author.name}
          </span>
          {review.isVerifiedPurchase && (
            <MdVerified size={11} className="shrink-0 text-primary" />
          )}
          <span className="ml-auto shrink-0 text-[10px] text-subtle">
            {formatReviewDate(review.createdAt)}
          </span>
        </div>

        <ItemTagLink item={item} variant="compact" className="mt-auto" />
      </div>
    </article>
  );
}
