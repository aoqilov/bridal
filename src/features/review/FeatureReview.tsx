import { useMemo, useRef, useState } from 'react';
import { MdApps, MdGridView, MdViewAgenda, MdStar } from 'react-icons/md';
import CusSegment, { type SegmentItem } from '@/components/ui/segment/CusSegment';
import { useHideOnScroll } from '@/hooks/useHideOnScroll';
import { cn } from '@/utils/cn';
import { MOCK_CATALOG, getItemById, type CatalogItem } from '@/features/catalog';
import EmptyState from '@/features/catalog/components/EmptyState';
import type { Review } from './helper.types.review';
import { MOCK_REVIEWS } from './mockdata.reviews';
import ReviewThumb from './components/ReviewThumb';
import ReviewCard from './components/ReviewCard';
import ReviewPostCard from './components/ReviewPostCard';

type ViewMode = 'grid-3' | 'grid-2' | 'post';

const VIEW_ITEMS: SegmentItem<ViewMode>[] = [
  { value: 'grid-3', icon: <MdApps size={16} />, ariaLabel: 'Плитка 3 в ряд' },
  {
    value: 'grid-2',
    icon: <MdGridView size={16} />,
    ariaLabel: 'Карточки 2 в ряд',
  },
  {
    value: 'post',
    label: 'Пост',
    icon: <MdViewAgenda size={16} />,
    ariaLabel: 'Лента постов',
  },
];

/** Sharh + unda belgilangan tovar */
type ReviewItem = { review: Review; item: CatalogItem };

function ReviewList({ items, view }: { items: ReviewItem[]; view: ViewMode }) {
  if (view === 'grid-3') {
    return (
      <div className="grid grid-cols-3 gap-0.5">
        {items.map(({ review, item }) => (
          <ReviewThumb key={review.id} review={review} item={item} />
        ))}
      </div>
    );
  }
  if (view === 'grid-2') {
    return (
      <div className="grid grid-cols-2 gap-3 px-4 py-4">
        {items.map(({ review, item }) => (
          <ReviewCard key={review.id} review={review} item={item} />
        ))}
      </div>
    );
  }
  return (
    <div>
      {items.map(({ review, item }) => (
        <ReviewPostCard key={review.id} review={review} item={item} />
      ))}
    </div>
  );
}

export default function FeatureReview() {
  const [view, setView] = useState<ViewMode>('grid-3');
  const headerRef = useRef<HTMLDivElement>(null);
  const { hidden: headerHidden } = useHideOnScroll(headerRef, {
    threshold: 200,
  });

  const { items, avgRating } = useMemo(() => {
    // Sharhga tovar biriktiriladi; tovari topilmagan sharh ko'rsatilmaydi
    const pairs = MOCK_REVIEWS.map((review) => ({
      review,
      item: getItemById(review.itemId, MOCK_CATALOG),
    }))
      .filter((x): x is ReviewItem => x.item !== null && x.item.isAvailable)
      .sort(
        (a, b) =>
          new Date(b.review.createdAt).getTime() -
          new Date(a.review.createdAt).getTime(),
      );

    const avg = pairs.length
      ? pairs.reduce((sum, x) => sum + x.review.rating, 0) / pairs.length
      : 0;

    return { items: pairs, avgRating: avg };
  }, []);

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col">
      <div
        ref={headerRef}
        className={cn(
          'sticky top-0 z-10 space-y-3 border-b border-border-subtle bg-background/95 px-4 pb-3 pt-3 backdrop-blur transition-transform duration-300 ease-out',
          headerHidden && '-translate-y-full',
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="flex items-center gap-1.5 text-lg font-bold text-foreground">
              <MdStar size={22} className="text-warning" />
              Отзывы
            </h1>
            <p className="text-[11px] text-muted">
              Фото покупателей · {items.length}
              {items.length > 0 && ` · ${avgRating.toFixed(1)} из 5`}
            </p>
          </div>
        </div>
        <CusSegment
          items={VIEW_ITEMS}
          value={view}
          onChange={setView}
          size="sm"
          fullWidth
        />
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Пока нет отзывов"
          description="Первые отзывы с фото появятся здесь после покупок."
          icon={<MdStar size={28} />}
        />
      ) : (
        <div className="flex-1">
          <ReviewList items={items} view={view} />
        </div>
      )}
    </div>
  );
}
