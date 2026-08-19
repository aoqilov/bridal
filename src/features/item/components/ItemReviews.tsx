import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { ROUTES } from '@/constants/routes';
import type { CatalogItem } from '@/features/catalog';
import { MOCK_REVIEWS, ReviewCard } from '@/features/review';
import { plural } from '@/utils/plural';
import RatingStars from './RatingStars';
import SectionTitle from './SectionTitle';

type Props = {
  item: CatalogItem;
};

/** Shu model haqidagi sharhlar — yangi birinchi */
export default function ItemReviews({ item }: Props) {
  const reviews = useMemo(
    () =>
      MOCK_REVIEWS.filter((r) => r.itemId === item.id).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [item.id],
  );

  if (reviews.length === 0) return null;

  // Umumiy sanoq katalog ma'lumotidan, lentada esa mavjud sharhlar ko'rsatiladi
  const total = item.reviewCount ?? reviews.length;

  return (
    <section className="pt-8">
      <div className="px-4">
        <SectionTitle
          action={
            <Link
              to={ROUTES.REVIEW}
              className="flex shrink-0 items-center gap-0.5 text-xs font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Все
              <FiChevronRight size={14} />
            </Link>
          }
        >
          Отзывы
        </SectionTitle>

        {item.rating !== undefined && (
          <div className="mb-3 flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface px-4 py-3">
            <span className="font-serif text-3xl font-semibold leading-none text-foreground">
              {item.rating.toFixed(1)}
            </span>
            <span className="min-w-0">
              <RatingStars rating={item.rating} showValue={false} />
              <span className="mt-0.5 block text-xs text-muted">
                {total} {plural(total, ['отзыв', 'отзыва', 'отзывов'])} об этой модели
              </span>
            </span>
          </div>
        )}
      </div>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {reviews.map((review) => (
          <div key={review.id} className="w-44 shrink-0 snap-start">
            <ReviewCard review={review} item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
