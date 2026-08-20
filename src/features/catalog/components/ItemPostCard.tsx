import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { itemPath } from '@/constants/routes';
import type { CatalogItem } from '../helper.types.catalog';
import { isDress } from '../helper.types.catalog';
import { ACCESSORY_TYPE_LABELS, SILHOUETTE_LABELS } from '../utils/labels';
import { defaultVariant } from '../utils/item';
import { primaryPrice } from '../utils/price';
import ItemBadges from './ItemBadges';
import ItemColorDots from './ItemColorDots';

type Props = {
  item: CatalogItem;
  className?: string;
};

export default function ItemPostCard({ item, className }: Props) {
  const variant = defaultVariant(item);
  const price = primaryPrice(item);

  const typeLabel = isDress(item)
    ? SILHOUETTE_LABELS[item.silhouette]
    : ACCESSORY_TYPE_LABELS[item.accessoryType];

  return (
    <article className={cn('border-b border-border-subtle pb-4', className)}>
      <header className="flex items-center gap-2.5 px-4 py-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient p-[2px]">
          <span className="grid h-full w-full place-items-center rounded-full border-2 border-background bg-surface-2 text-xs font-bold text-foreground">
            {item.name[0]?.toUpperCase() ?? 'A'}
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-sm font-semibold text-foreground">
            {typeLabel}
            {item.offerTypes.includes('tailoring') && (
              <span className="ml-1.5 rounded-full bg-accent-soft px-1.5 py-0.5 text-[10px] font-medium text-accent">
                Пошив на заказ
              </span>
            )}
          </p>
        </div>
      </header>

      <Link
        to={itemPath(item.slug)}
        className="relative block aspect-square overflow-hidden bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <img
          src={variant.mainImage}
          alt={item.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />

        <ItemBadges item={item} className="absolute left-3 top-3" />

        <ItemColorDots
          variants={item.variants}
          size="md"
          className="absolute bottom-3 left-3"
        />
      </Link>

      <div className="space-y-1.5 px-4 pt-3">
        {/* Chapda taklif turi, o'ng chekkada narx */}
        {price && (
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[11px] uppercase tracking-wide text-muted">
              {price.label}
            </span>
            <span className="flex items-baseline gap-2">
              <span className="text-base font-semibold text-foreground">
                {formatCurrency(price.amount)}{' '}
                <span className="text-xs font-normal text-muted">сум</span>
              </span>
              {price.old && (
                <span className="text-xs text-muted line-through">
                  {formatCurrency(price.old)}
                </span>
              )}
            </span>
          </div>
        )}

        <p className="font-serif text-[19px] font-semibold leading-snug text-foreground">
          {item.name}
        </p>

        {item.description && (
          <p className="text-[13px] leading-relaxed text-muted">{item.description}</p>
        )}
      </div>
    </article>
  );
}
