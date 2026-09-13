import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { itemPath } from '@/constants/routes';
import type { CatalogItem } from '../helper.types.catalog';
import { defaultVariant } from '../utils/item';
import { primaryPrice } from '../utils/price';
import ItemBadges from './ItemBadges';
import ItemCollage from './ItemCollage';

type Props = {
  item: CatalogItem;
  /** Rasm 3 tadan ko'p bo'lsa Telegram uslubidagi kollaj chiqadi (/new lentasi) */
  gallery?: boolean;
  className?: string;
};

export default function ItemCard({ item, gallery = false, className }: Props) {
  const variant = defaultVariant(item);
  const price = primaryPrice(item);

  return (
    <Link
      to={itemPath(item.slug)}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded border border-border bg-surface shadow-card',
        'transition-[box-shadow,transform] duration-200 hover:shadow-card-hover active:scale-[0.98]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-2">
        {gallery ? (
          <ItemCollage
            item={item}
            aspect="fill"
            imgClassName="transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <img
            src={variant.mainImage}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        <ItemBadges item={item} className="absolute left-2 top-2" />
      </div>

      {/* Narx pastga yopishadi — qatordagi qo'shni kartada ham bir tekisda turadi */}
      <div className="flex flex-1 flex-col border-t border-border-subtle px-3 py-2.5">
        <h3 className="line-clamp-2 font-serif text-[15px] leading-snug text-foreground">
          {item.name}
        </h3>

        {price && (
          <div className="mt-auto pt-2">
            <p className="text-[9.5px] uppercase tracking-[0.14em] text-subtle">
              {price.label}
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-[15px] font-semibold leading-none text-foreground tabular-nums">
                {formatCurrency(price.amount)}{' '}
                <span className="text-[11px] font-normal text-muted">сум</span>
              </span>
              {price.old && (
                <span className="text-[11px] text-muted line-through tabular-nums">
                  {formatCurrency(price.old)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
