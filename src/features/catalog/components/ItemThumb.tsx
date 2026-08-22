import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { itemPath } from '@/constants/routes';
import type { CatalogItem } from '../helper.types.catalog';
import { defaultVariant } from '../utils/item';
import ItemBadges from './ItemBadges';
import ItemCollage from './ItemCollage';

type Props = {
  item: CatalogItem;
  /** Rasm 3 tadan ko'p bo'lsa Telegram uslubidagi kollaj chiqadi (/new lentasi) */
  gallery?: boolean;
  className?: string;
};

export default function ItemThumb({ item, gallery = false, className }: Props) {
  const variant = defaultVariant(item);

  return (
    <Link
      to={itemPath(item.slug)}
      className={cn(
        'group relative block aspect-[3/4] overflow-hidden bg-surface-2',
        'transition-transform duration-200 active:scale-[0.98]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
      aria-label={item.name}
    >
      {gallery ? (
        <ItemCollage
          item={item}
          size="sm"
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

      <ItemBadges item={item} size="sm" className="absolute left-1 top-1" />

      {item.variants.length > 1 && (
        <span className="absolute right-1 top-1 rounded-full bg-overlay-dark px-1.5 py-0.5 text-[9px] font-semibold text-overlay-fg">
          +{item.variants.length}
        </span>
      )}
    </Link>
  );
}
