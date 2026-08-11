import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { itemPath } from '@/constants/routes';
import type { CatalogItem } from '../helper.types.catalog';
import { isDress } from '../helper.types.catalog';
import { ACCESSORY_TYPE_LABELS, SILHOUETTE_LABELS } from '../utils/labels';
import { discountPercent, primaryPrice } from '../utils/price';

type Props = {
  item: CatalogItem;
  className?: string;
};

export default function ItemPostCard({ item, className }: Props) {
  const variant =
    item.variants.find((v) => v.id === item.defaultVariantId) ?? item.variants[0];

  const price = primaryPrice(item);
  const discount = discountPercent(item);

  const typeLabel = isDress(item)
    ? SILHOUETTE_LABELS[item.silhouette]
    : ACCESSORY_TYPE_LABELS[item.accessoryType];

  const sizeText = isDress(item)
    ? item.sizes
        .filter((s) => s.available)
        .map((s) => s.label)
        .join(' · ')
    : (item.sizeLabels?.join(' · ') ?? (item.oneSize ? 'Один размер' : ''));

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
          {sizeText && <p className="line-clamp-1 text-[11px] text-muted">{sizeText}</p>}
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
          className="h-full w-full object-cover"
        />

        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {item.isNew && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold uppercase text-accent-fg">
              Новинка
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-danger px-2 py-0.5 text-[11px] font-semibold text-white">
              −{discount}%
            </span>
          )}
          {item.isPopular && !item.isNew && (
            <span className="rounded-full bg-overlay-dark px-2 py-0.5 text-[11px] font-semibold text-white">
              Хит
            </span>
          )}
        </div>
      </Link>

      <div className="space-y-1.5 px-4 pt-3">
        {price && (
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] uppercase tracking-wide text-muted">
              {price.label}
            </span>
            <span className="text-base font-semibold text-foreground">
              {formatCurrency(price.amount)}{' '}
              <span className="text-xs font-normal text-muted">сум</span>
            </span>
            {price.old && (
              <span className="text-xs text-muted line-through">
                {formatCurrency(price.old)}
              </span>
            )}
          </div>
        )}

        <p className="text-sm text-foreground">
          <span className="font-semibold">{item.name}</span>
          {item.description && (
            <span className="text-foreground/80"> — {item.description}</span>
          )}
        </p>

        {item.variants.length > 1 && (
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[11px] text-muted">Цвета:</span>
            {item.variants.map((v) => (
              <span
                key={v.id}
                className="h-4 w-4 rounded-full border border-border"
                style={{ backgroundColor: v.colorHex }}
                title={v.colorName}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
