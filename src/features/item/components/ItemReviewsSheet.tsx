import { useState } from 'react';
import { CusSheet } from '@/components/ui';
import type { CatalogItem } from '@/features/catalog';
import { ReviewComment, type Review } from '@/features/review';
import { plural } from '@/utils/plural';
import ItemLightbox from './ItemLightbox';
import RatingStars from './RatingStars';

type Props = {
  item: CatalogItem;
  reviews: Review[];
  open: boolean;
  onClose: () => void;
};

type Zoom = {
  images: string[];
  index: number;
};

export default function ItemReviewsSheet({ item, reviews, open, onClose }: Props) {
  const [zoom, setZoom] = useState<Zoom | null>(null);

  const total = item.reviewCount ?? reviews.length;

  return (
    <>
      <CusSheet
        open={open}
        // Rasm ochiq bo'lsa Escape faqat uni yopadi, list joyida qoladi
        onClose={() => {
          if (!zoom) onClose();
        }}
        title="Отзывы"
        contentClassName="px-4"
      >
        {item.rating !== undefined && (
          <div className="flex items-center gap-3 border-b border-border-subtle py-4">
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

        <div className="divide-y divide-border-subtle pb-2">
          {reviews.map((review) => (
            <ReviewComment
              key={review.id}
              review={review}
              onImageClick={(images, index) => setZoom({ images, index })}
            />
          ))}
        </div>
      </CusSheet>

      {zoom && (
        <ItemLightbox
          images={zoom.images}
          initialIndex={zoom.index}
          itemName={item.name}
          onClose={() => setZoom(null)}
        />
      )}
    </>
  );
}
