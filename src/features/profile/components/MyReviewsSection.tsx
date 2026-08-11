import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MdStar, MdRateReview, MdImage } from 'react-icons/md';
import { itemPath, ROUTES } from '@/constants/routes';
import { buildContactTelegramLink } from '@/constants/contact';
import { MOCK_CATALOG, getItemById, type CatalogItem } from '@/features/catalog';
import {
  MOCK_REVIEWS,
  CURRENT_USER_ID,
  formatReviewDate,
  type Review,
} from '@/features/review';

type MyReviewItem = { review: Review; item: CatalogItem };

export default function MyReviewsSection() {
  const items = useMemo<MyReviewItem[]>(
    () =>
      MOCK_REVIEWS.filter((r) => r.author.id === CURRENT_USER_ID)
        .map((review) => ({
          review,
          item: getItemById(review.itemId, MOCK_CATALOG),
        }))
        .filter((x): x is MyReviewItem => x.item !== null)
        .sort(
          (a, b) =>
            new Date(b.review.createdAt).getTime() -
            new Date(a.review.createdAt).getTime(),
        ),
    [],
  );

  return (
    <section id="profile-reviews" className="scroll-mt-4">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="text-base font-bold text-foreground">
          Мои отзывы
          {items.length > 0 && (
            <span className="ml-1.5 text-sm font-normal text-muted">
              {items.length}
            </span>
          )}
        </h2>
        <Link
          to={ROUTES.REVIEW}
          className="text-xs font-semibold text-primary hover:text-primary-hover"
        >
          Все отзывы
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mx-4 flex flex-col items-center gap-2 rounded-2xl bg-surface px-4 py-8 text-center shadow-card">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-2 text-muted">
            <MdRateReview size={24} />
          </span>
          <p className="text-sm font-semibold text-foreground">Отзывов пока нет</p>
          <p className="max-w-[15rem] text-xs text-muted">
            Поделитесь фото покупки — это помогает другим выбрать.
          </p>
          <a
            href={buildContactTelegramLink('Здравствуйте! Хочу оставить отзыв о покупке.')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-fg transition hover:bg-primary-hover"
          >
            Оставить отзыв
          </a>
        </div>
      ) : (
        <div className="space-y-2 px-4">
          {items.map(({ review, item }) => (
            <Link
              key={review.id}
              to={itemPath(item.slug)}
              className="flex gap-3 rounded-2xl bg-surface p-2.5 shadow-card transition hover:bg-surface-2"
            >
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                <img
                  src={review.images[0]}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {review.images.length > 1 && (
                  <span className="absolute bottom-0.5 right-0.5 flex items-center gap-0.5 rounded-full bg-overlay-dark px-1 text-[9px] font-semibold text-white">
                    <MdImage size={9} />
                    {review.images.length}
                  </span>
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <MdStar
                      key={i}
                      size={12}
                      className={i < review.rating ? 'text-warning' : 'text-subtle'}
                    />
                  ))}
                  <span className="ml-1 text-[10px] text-subtle">
                    {formatReviewDate(review.createdAt)}
                  </span>
                </span>

                <span className="mt-0.5 line-clamp-1 block text-xs font-semibold text-foreground">
                  {review.title}
                </span>
                <span className="mt-0.5 line-clamp-2 block text-[11px] leading-snug text-muted">
                  {review.description}
                </span>
                <span className="mt-1 line-clamp-1 block text-[10px] text-subtle">
                  {item.name}
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
