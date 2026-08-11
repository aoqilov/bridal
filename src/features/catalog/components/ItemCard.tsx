import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { itemPath } from '@/constants/routes';
import type { CatalogItem } from '../helper.types.catalog';
import { isDress } from '../helper.types.catalog';
import { discountPercent, primaryPrice } from '../utils/price';

type Props = {
  item: CatalogItem;
  className?: string;
};

export default function ItemCard({ item, className }: Props) {
  const variant =
    item.variants.find((v) => v.id === item.defaultVariantId) ?? item.variants[0];

  const price = primaryPrice(item);
  const discount = discountPercent(item);

  // Ko'ylak uchun — mavjud o'lchamlar, aksessuar uchun — o'lcham yorliqlari
  const sizeText = isDress(item)
    ? item.sizes
        .filter((s) => s.available)
        .map((s) => s.ru)
        .join(' · ')
    : (item.sizeLabels?.join(' · ') ?? (item.oneSize ? 'Один размер' : ''));

  return (
    <Link
      to={itemPath(item.slug)}
      className={cn(
        'group block overflow-hidden rounded-2xl bg-surface shadow-card transition-shadow',
        'hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-2">
        <img
          src={variant.mainImage}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {item.isNew && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-fg">
              Новинка
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-danger px-2 py-0.5 text-[10px] font-semibold text-white">
              −{discount}%
            </span>
          )}
          {item.isPopular && !item.isNew && (
            <span className="rounded-full bg-overlay-dark px-2 py-0.5 text-[10px] font-semibold text-white">
              Хит
            </span>
          )}
        </div>

        {item.variants.length > 1 && (
          <div className="absolute bottom-2 left-2 flex gap-1 rounded-full bg-overlay-light px-1.5 py-1 backdrop-blur">
            {item.variants.slice(0, 4).map((v) => (
              <span
                key={v.id}
                className="h-2.5 w-2.5 rounded-full border border-white/60"
                style={{ backgroundColor: v.colorHex }}
                title={v.colorName}
              />
            ))}
            {item.variants.length > 4 && (
              <span className="ml-0.5 text-[10px] font-medium text-foreground">
                +{item.variants.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-foreground">
          {item.name}
        </h3>

        {price && (
          <div className="mt-1.5">
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

        {sizeText && <p className="mt-1 line-clamp-1 text-xs text-muted">Размеры: {sizeText}</p>}
      </div>
    </Link>
  );
}
