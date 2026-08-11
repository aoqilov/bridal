import { Link } from 'react-router-dom';
import { MdLocalOffer, MdChevronRight } from 'react-icons/md';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { itemPath } from '@/constants/routes';
import { primaryPrice, type CatalogItem } from '@/features/catalog';

type Props = {
  item: CatalogItem;
  /** `compact` — tor kartalar uchun: narx va strelka yashiriladi */
  variant?: 'full' | 'compact';
  className?: string;
};

/**
 * Sharh rasmi ostidagi "belgilangan tovar" chipi.
 * Bosilganda mahsulot sahifasiga o'tadi.
 */
export default function ItemTagLink({
  item,
  variant: display = 'full',
  className,
}: Props) {
  const compact = display === 'compact';
  const variant =
    item.variants.find((v) => v.id === item.defaultVariantId) ??
    item.variants[0];
  const price = primaryPrice(item);

  return (
    <Link
      to={itemPath(item.slug)}
      className={cn(
        'flex items-center rounded-xl border border-border-subtle bg-surface-2 transition',
        'hover:border-primary/40 hover:bg-primary-soft',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        compact ? 'gap-2 p-1.5' : 'gap-2.5 p-2',
        className,
      )}
    >
      <span
        className={cn(
          'relative shrink-0 overflow-hidden rounded-lg bg-surface',
          compact ? 'h-8 w-8' : 'h-9 w-9',
        )}
      >
        <img
          src={variant.mainImage}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-muted">
          <MdLocalOffer size={11} />
          Товар на фото
        </span>
        <span className="line-clamp-1 text-xs font-semibold text-foreground">
          {item.name}
        </span>
      </span>

      {!compact && (
        <>
          {price && (
            <span className="shrink-0 text-right">
              <span className="block text-xs font-semibold text-foreground">
                {formatCurrency(price.amount)}
              </span>
              <span className="block text-[10px] text-muted">
                сум · {price.label.toLowerCase()}
              </span>
            </span>
          )}

          <MdChevronRight size={18} className="shrink-0 text-muted" />
        </>
      )}
    </Link>
  );
}
