import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { MdStar, MdVerified, MdFavoriteBorder } from 'react-icons/md';
import 'swiper/css';
import 'swiper/css/pagination';
import { cn } from '@/utils/cn';
import { reviewPath } from '@/constants/routes';
import type { CatalogItem } from '@/features/catalog';
import type { Review } from '../helper.types.review';
import { formatReviewDate } from '../utils/formatReviewDate';
import ItemTagLink from './ItemTagLink';

type Props = {
  review: Review;
  item: CatalogItem;
  className?: string;
};

function ReviewImage({
  src,
  item,
  reviewId,
}: {
  src: string;
  item: CatalogItem;
  reviewId: string;
}) {
  return (
    <Link
      to={reviewPath(reviewId)}
      aria-label={`Отзыв о товаре: ${item.name}`}
      className="relative block aspect-[3/4] overflow-hidden bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    >
      <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
    </Link>
  );
}

/** post ko'rinishi — rasm, sarlavha, tavsif, so'ng tovar havolasi */
export default function ReviewPostCard({ review, item, className }: Props) {
  const multiple = review.images.length > 1;

  return (
    <article className={cn('border-b border-border-subtle pb-4', className)}>
      {multiple ? (
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          slidesPerView={1}
          className="[--swiper-pagination-color:theme(colors.primary.fg)]"
        >
          {review.images.map((src) => (
            <SwiperSlide key={src}>
              <ReviewImage src={src} item={item} reviewId={review.id} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <ReviewImage src={review.images[0]} item={item} reviewId={review.id} />
      )}

      <div className="space-y-2 px-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <MdStar
                key={i}
                size={15}
                className={i < review.rating ? 'text-warning' : 'text-subtle'}
              />
            ))}
          </div>

          {review.likeCount !== undefined && (
            <span className="flex items-center gap-1 text-xs text-muted">
              <MdFavoriteBorder size={15} />
              {review.likeCount}
            </span>
          )}
        </div>

        <h3 className="text-sm font-semibold leading-snug text-foreground">
          {review.title}
        </h3>

        {review.description && (
          <p className="text-sm leading-snug text-muted">{review.description}</p>
        )}

        <div className="flex items-center gap-2 pt-0.5">
          <img
            src={review.author.avatar}
            alt=""
            loading="lazy"
            className="h-6 w-6 shrink-0 rounded-full object-cover"
          />
          <span className="flex min-w-0 items-center gap-1 text-[11px] text-muted">
            <span className="line-clamp-1 font-medium text-foreground">
              {review.author.name}
            </span>
            {review.isVerifiedPurchase && (
              <MdVerified size={12} className="shrink-0 text-primary" />
            )}
            <span className="shrink-0">
              · {review.author.city ? `${review.author.city} · ` : ''}
              {formatReviewDate(review.createdAt)}
            </span>
          </span>
        </div>

        <ItemTagLink item={item} className="mt-1" />
      </div>
    </article>
  );
}
