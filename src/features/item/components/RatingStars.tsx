import { FiStar } from 'react-icons/fi';
import { cn } from '@/utils/cn';

type Props = {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  /** Yulduzlar yonidagi raqam — katta baho alohida ko'rsatilganda o'chiriladi */
  showValue?: boolean;
  className?: string;
};

export default function RatingStars({
  rating,
  reviewCount,
  size = 'sm',
  showValue = true,
  className,
}: Props) {
  const filled = Math.round(rating);
  const starSize = size === 'sm' ? 14 : 18;

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const isFilled = i < filled;
          return (
            <FiStar
              key={i}
              size={starSize}
              className={isFilled ? 'text-warning' : 'text-subtle'}
              fill={isFilled ? 'currentColor' : 'none'}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-muted">
          · {reviewCount} {declineReview(reviewCount)}
        </span>
      )}
    </div>
  );
}

function declineReview(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'отзыв';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'отзыва';
  return 'отзывов';
}
