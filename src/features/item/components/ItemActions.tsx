import { Link } from 'react-router-dom';
import { FaTelegram } from 'react-icons/fa';
import { LuCalendarHeart } from 'react-icons/lu';
import { bookingPath } from '@/constants/routes';
import {
  OFFER_SHORT_LABELS,
  offerPrice,
  type CatalogItem,
  type OfferType,
} from '@/features/catalog';
import { formatCurrency } from '@/utils/formatCurrency';

type Props = {
  item: CatalogItem;
  offer: OfferType;
  onTelegram: () => void;
};

export default function ItemActions({ item, offer, onTelegram }: Props) {
  const price = offerPrice(item, offer);

  // Pastki navigatsiya bu sahifada yashirin — gesture bar uchun joyni panel o'zi oladi
  return (
    <div className="pb-safe sticky bottom-0 z-20 border-t border-border-subtle bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
        <div className="min-w-0 shrink-0">
          <p className="text-[11px] uppercase tracking-wide text-muted">
            {OFFER_SHORT_LABELS[offer]}
          </p>
          <p className="truncate text-base font-bold leading-tight text-foreground">
            {price ? (
              <>
                {formatCurrency(price.amount)}
                <span className="ml-1 text-xs font-normal text-muted">сум</span>
              </>
            ) : (
              <span className="text-sm font-semibold">По замерам</span>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={onTelegram}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:bg-surface-2"
          aria-label="Написать в Telegram"
          title="Написать в Telegram"
        >
          <FaTelegram size={20} />
        </button>

        <Link
          to={bookingPath(item.id)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3 py-3.5 text-sm font-semibold text-primary-fg transition-colors hover:bg-primary-hover"
        >
          <LuCalendarHeart size={18} />
          На примерку
        </Link>
      </div>
    </div>
  );
}
