import { MdStar, MdVerified } from 'react-icons/md';
import { cn } from '@/utils/cn';
import type { Review } from '../helper.types.review';
import { formatReviewDate } from '../utils/formatReviewDate';

type Props = {
  review: Review;
  /** Rasm bosilganda — to'liq ekran ko'rinishini ochish uchun */
  onImageClick?: (images: string[], index: number) => void;
  className?: string;
};

/** Instagram kommentariysi uslubidagi sharh: avatar chapda, rasmlar matn ostida */
export default function ReviewComment({ review, onImageClick, className }: Props) {
  return (
    <article className={cn('flex gap-3 py-4', className)}>
      <img
        src={review.author.avatar}
        alt=""
        loading="lazy"
        className="h-9 w-9 shrink-0 rounded-full object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <span className="text-sm font-semibold text-foreground">
            {review.author.name}
          </span>
          {review.isVerifiedPurchase && (
            <MdVerified size={13} className="shrink-0 text-primary" />
          )}
          <span className="text-xs text-subtle">
            {formatReviewDate(review.createdAt)}
          </span>
        </div>

        <div className="mt-0.5 flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <MdStar
              key={i}
              size={13}
              className={i < review.rating ? 'text-warning' : 'text-subtle'}
            />
          ))}
        </div>

        <p className="mt-1.5 text-sm font-semibold leading-snug text-foreground">
          {review.title}
        </p>

        {review.description && (
          <p className="mt-0.5 text-sm leading-relaxed text-foreground/80">
            {review.description}
          </p>
        )}

        {review.images.length > 0 && (
          <div className="mt-2.5 flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {review.images.map((src, idx) => (
              <button
                key={src}
                type="button"
                onClick={() => onImageClick?.(review.images, idx)}
                aria-label={`Фото ${idx + 1} из отзыва`}
                className={cn(
                  'h-28 w-[5.25rem] shrink-0 overflow-hidden rounded-xl bg-surface-2 transition-opacity',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  onImageClick ? 'hover:opacity-90' : 'cursor-default',
                )}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
