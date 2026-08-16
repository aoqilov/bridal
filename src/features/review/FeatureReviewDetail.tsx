import { Link, useNavigate, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { FiArrowLeft } from 'react-icons/fi';
import { MdFavoriteBorder, MdStar, MdVerified } from 'react-icons/md';
import 'swiper/css';
import 'swiper/css/pagination';
import { ROUTES } from '@/constants/routes';
import { MOCK_CATALOG, getItemById } from '@/features/catalog';
import { getReviewById } from './mockdata.reviews';
import { formatReviewDate } from './utils/formatReviewDate';
import ItemTagLink from './components/ItemTagLink';

export default function FeatureReviewDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const review = getReviewById(id);
  const item = review ? getItemById(review.itemId, MOCK_CATALOG) : null;

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(ROUTES.REVIEW);
  };

  if (!review) {
    return (
      <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Отзыв не найден</h1>
        <Link
          to={ROUTES.REVIEW}
          className="mt-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg hover:bg-primary-hover"
        >
          Все отзывы
        </Link>
      </div>
    );
  }

  const multiple = review.images.length > 1;

  return (
    <article className="mx-auto max-w-md bg-background pb-6">
      <div className="relative">
        {multiple ? (
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            slidesPerView={1}
            className="[--swiper-pagination-color:theme(colors.primary.fg)]"
          >
            {review.images.map((src) => (
              <SwiperSlide key={src}>
                <img
                  src={src}
                  alt=""
                  className="aspect-[3/4] w-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <img
            src={review.images[0]}
            alt=""
            className="aspect-[3/4] w-full object-cover"
          />
        )}

        <button
          type="button"
          onClick={handleBack}
          aria-label="Назад"
          className="absolute left-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-overlay-dark text-white backdrop-blur transition hover:bg-overlay-dark-strong"
        >
          <FiArrowLeft size={20} />
        </button>

        {multiple && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-overlay-dark px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
            {review.images.length} фото
          </span>
        )}
      </div>

      <div className="space-y-3 px-4 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <MdStar
                key={i}
                size={18}
                className={i < review.rating ? 'text-warning' : 'text-subtle'}
              />
            ))}
          </div>

          {review.likeCount !== undefined && (
            <span className="flex items-center gap-1 text-xs text-muted">
              <MdFavoriteBorder size={16} />
              {review.likeCount}
            </span>
          )}
        </div>

        <h1 className="text-lg font-bold leading-snug text-foreground">
          {review.title}
        </h1>

        {review.description && (
          <p className="text-sm leading-relaxed text-foreground">
            {review.description}
          </p>
        )}

        <div className="flex items-center gap-2 border-t border-border-subtle pt-3">
          <img
            src={review.author.avatar}
            alt=""
            loading="lazy"
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-sm font-medium text-foreground">
              <span className="line-clamp-1">{review.author.name}</span>
              {review.isVerifiedPurchase && (
                <MdVerified size={14} className="shrink-0 text-primary" />
              )}
            </p>
            <p className="text-[11px] text-muted">
              {review.author.city ? `${review.author.city} · ` : ''}
              {formatReviewDate(review.createdAt)}
            </p>
          </div>
        </div>

        {item && (
          <div className="pt-1">
            <ItemTagLink item={item} />
          </div>
        )}
      </div>
    </article>
  );
}
