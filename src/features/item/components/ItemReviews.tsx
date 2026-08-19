import { useMemo, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import type { CatalogItem } from '@/features/catalog';
import { MOCK_REVIEWS } from '@/features/review';
import { plural } from '@/utils/plural';
import RatingStars from './RatingStars';
import ItemReviewsSheet from './ItemReviewsSheet';

type Props = {
  item: CatalogItem;
};

/**
 * Model nomi ostidagi reyting kartochkasi — bosilganda sharhlar listi
 * (Instagram uslubidagi pastki dialog) ochiladi.
 */
export default function ItemReviews({ item }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);

  // Shu model haqidagi sharhlar — yangi birinchi
  const reviews = useMemo(
    () =>
      MOCK_REVIEWS.filter((r) => r.itemId === item.id).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [item.id],
  );

  if (reviews.length === 0 || item.rating === undefined) return null;

  // Umumiy sanoq katalog ma'lumotidan, listda esa mavjud sharhlar ko'rsatiladi
  const total = item.reviewCount ?? reviews.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border border-border-subtle bg-surface px-3.5 py-2.5 text-left transition-colors hover:bg-surface-2"
      >
        <span className="font-serif text-2xl font-semibold leading-none text-foreground">
          {item.rating.toFixed(1)}
        </span>
        <span className="min-w-0 flex-1">
          <RatingStars rating={item.rating} showValue={false} />
          <span className="mt-0.5 block text-xs text-muted">
            {total} {plural(total, ['отзыв', 'отзыва', 'отзывов'])} об этой модели
          </span>
        </span>
        <FiChevronRight size={18} className="shrink-0 text-subtle" />
      </button>

      <ItemReviewsSheet
        item={item}
        reviews={reviews}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
