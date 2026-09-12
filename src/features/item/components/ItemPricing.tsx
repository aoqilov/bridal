import { CusSegment, type SegmentItem } from '@/components/ui';
import { RENT_PERIOD_DAYS } from '@/constants/app';
import {
  OFFER_SHORT_LABELS,
  discountPercent,
  offerPrice,
  type CatalogItem,
  type OfferType,
} from '@/features/catalog';
import { formatCurrency } from '@/utils/formatCurrency';
import { plural } from '@/utils/plural';

type Props = {
  item: CatalogItem;
  offer: OfferType;
  onOfferChange: (offer: OfferType) => void;
};

/** Har bir taklif turi uchun narx tagidagi izoh */
function offerNote(offer: OfferType): string {
  if (offer === 'rent') {
    const days = `${RENT_PERIOD_DAYS} ${plural(RENT_PERIOD_DAYS, ['день', 'дня', 'дней'])}`;
    return `Прокат на ${days} — этого хватает на свадьбу и фотосессию.`;
  }
  if (offer === 'sale') {
    return 'Модель остаётся у вас. Подгонка по фигуре — в подарок.';
  }
  return 'Шьём по вашим меркам. Срок и цена — после замеров в ателье.';
}

export default function ItemPricing({ item, offer, onOfferChange }: Props) {
  const price = offerPrice(item, offer);
  const discount = discountPercent(item);
  const showDiscount = discount > 0 && Boolean(price?.old);

  const segments: SegmentItem<OfferType>[] = item.offerTypes.map((type) => ({
    value: type,
    label: OFFER_SHORT_LABELS[type],
  }));

  return (
    <div className="space-y-3">
      {segments.length > 1 && (
        <CusSegment
          items={segments}
          value={offer}
          onChange={onOfferChange}
          size="sm"
          fullWidth
        />
      )}

      <div className="rounded border border-border bg-surface p-4">
        {price ? (
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[26px] font-bold leading-none text-foreground tabular-nums">
              {formatCurrency(price.amount)}
              <span className="ml-1 text-sm font-normal text-muted">сум</span>
            </span>
            {price.old && (
              <span className="text-sm text-muted line-through tabular-nums">
                {formatCurrency(price.old)}
              </span>
            )}
            {showDiscount && (
              <span className="rounded-full bg-danger-soft px-2 py-0.5 text-xs font-semibold text-danger">
                −{discount}%
              </span>
            )}
          </div>
        ) : (
          <p className="text-lg font-semibold text-foreground">Цена по замерам</p>
        )}

        <p className="mt-2 text-xs leading-relaxed text-muted">{offerNote(offer)}</p>

        {offer === 'rent' && item.deposit && (
          <p className="mt-3 border-t border-border-subtle pt-3 text-xs text-muted">
            Залог{' '}
            <span className="font-semibold text-foreground">
              {formatCurrency(item.deposit)} сум
            </span>{' '}
            — возвращаем после возврата изделия.
          </p>
        )}
      </div>
    </div>
  );
}
