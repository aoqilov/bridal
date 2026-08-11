import { Link } from 'react-router-dom';
import { MdCollections, MdLocalOffer, MdStar } from 'react-icons/md';
import { cn } from '@/utils/cn';
import { itemPath } from '@/constants/routes';
import type { CatalogItem } from '@/features/catalog';
import type { Review } from '../helper.types.review';

type Props = {
  review: Review;
  item: CatalogItem;
  className?: string;
};

/** grid-3 ko'rinishi — kvadrat rasm, butun maydon tovarga olib boradi */
export default function ReviewThumb({ review, item, className }: Props) {
  return (
    <Link
      to={itemPath(item.slug)}
      aria-label={`Отзыв о товаре: ${item.name}`}
      className={cn(
        'group relative block aspect-square overflow-hidden bg-surface-2',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
    >
      <img
        src={review.images[0]}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {review.images.length > 1 && (
        <span className="absolute right-1 top-1 text-white drop-shadow">
          <MdCollections size={14} />
        </span>
      )}

      <span className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded-full bg-overlay-dark px-1.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur">
        <MdStar size={10} className="text-warning" />
        {review.rating}
      </span>

      {/* Tovar belgilangani — grid-3 da chip sig'maydi, shu sabab ikonka */}
      <span className="absolute bottom-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-overlay-dark text-white backdrop-blur">
        <MdLocalOffer size={11} />
      </span>
    </Link>
  );
}
