import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { itemPath } from '@/constants/routes';
import type { CatalogItem } from '../helper.types.catalog';
import { discountPercent } from '../utils/price';

type Props = {
  item: CatalogItem;
  className?: string;
};

export default function ItemThumb({ item, className }: Props) {
  const variant =
    item.variants.find((v) => v.id === item.defaultVariantId) ?? item.variants[0];

  const discount = discountPercent(item);

  return (
    <Link
      to={itemPath(item.slug)}
      className={cn(
        'group relative block aspect-[3/4] overflow-hidden bg-surface-2',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
      aria-label={item.name}
    >
      <img
        src={variant.mainImage}
        alt={item.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {(item.isNew || discount > 0) && (
        <div className="absolute left-1 top-1 flex flex-col gap-1">
          {item.isNew && (
            <span className="rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-semibold uppercase text-accent-fg">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-danger px-1.5 py-0.5 text-[9px] font-semibold text-white">
              −{discount}%
            </span>
          )}
        </div>
      )}

      {item.variants.length > 1 && (
        <span className="absolute right-1 top-1 rounded-full bg-overlay-dark px-1.5 py-0.5 text-[9px] font-semibold text-white">
          +{item.variants.length}
        </span>
      )}
    </Link>
  );
}
