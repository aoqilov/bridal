import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { itemPath } from '@/constants/routes';
import type { CatalogItem } from '../helper.types.catalog';
import { defaultVariant } from '../utils/item';
import { primaryPrice } from '../utils/price';
import ItemBadges from './ItemBadges';
import ItemColorDots from './ItemColorDots';

type Props = {
  item: CatalogItem;
  className?: string;
};

export default function ItemCard({ item, className }: Props) {
  const variant = defaultVariant(item);
  const price = primaryPrice(item);

  return (
    <Link
      to={itemPath(item.slug)}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-card',
        'transition-[box-shadow,transform] duration-200 hover:shadow-card-hover active:scale-[0.98]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-2">
        <img
          src={variant.mainImage}
          alt={item.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <ItemBadges item={item} className="absolute left-2 top-2" />

        <ItemColorDots variants={item.variants} className="absolute bottom-2 left-2" />
      </div>

      {/* Narx pastga yopishadi — qatordagi qo'shni kartada ham bir tekisda turadi */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 font-serif text-[15px] font-semibold leading-snug text-foreground">
          {item.name}
        </h3>

        {price && (
          <div className="mt-auto pt-1.5">
            <p className="text-[10px] uppercase tracking-wide text-muted">{price.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(price.amount)}{' '}
                <span className="text-xs font-normal text-muted">сум</span>
              </span>
              {price.old && (
                <span className="text-xs text-muted line-through">
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
