import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { RENT_PERIOD_DAYS } from '@/constants/app';
import {
  isDress,
  primaryPrice,
  secondaryPrice,
  discountPercent,
  OFFER_LABELS,
  type CatalogItem,
  type ItemVariant,
} from '@/features/catalog';
import Breadcrumb from './Breadcrumb';
import RatingStars from './RatingStars';

type Props = {
  item: CatalogItem;
  variant: ItemVariant;
  categoryName?: string;
  subcategoryName?: string;
  onVariantChange: (id: string) => void;
  selectedSize: string | null;
  onSizeChange: (label: string) => void;
};

export default function ItemInfo({
  item,
  variant,
  categoryName,
  subcategoryName,
  onVariantChange,
  selectedSize,
  onSizeChange,
}: Props) {
  const price = primaryPrice(item);
  const second = secondaryPrice(item);
  const discount = discountPercent(item);

  // Ko'ylak — RU o'lchamlar (mavjudligi bilan), aksessuar — oddiy yorliqlar
  const sizeOptions = isDress(item)
    ? item.sizes.map((s) => ({ label: s.label, available: s.available }))
    : (item.sizeLabels ?? []).map((l) => ({ label: l, available: true }));

  return (
    <section className="space-y-5 px-4 pt-4">
      <Breadcrumb categoryName={categoryName} subcategoryName={subcategoryName} />

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
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
          {item.offerTypes.map((offer) => (
            <span
              key={offer}
              className="rounded-full border border-border-subtle bg-surface px-2 py-0.5 text-[11px] font-medium text-foreground"
            >
              {OFFER_LABELS[offer]}
            </span>
          ))}
          {isDress(item) && item.isMaternityFriendly && (
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
              Для беременных
            </span>
          )}
        </div>

        <h1 className="text-lg font-semibold text-foreground">{item.name}</h1>

        {item.rating !== undefined && (
          <RatingStars rating={item.rating} reviewCount={item.reviewCount} />
        )}

        {price && (
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-foreground">
                {formatCurrency(price.amount)}{' '}
                <span className="text-sm font-normal text-muted">сум</span>
              </span>
              {price.old && (
                <span className="text-sm text-muted line-through">
                  {formatCurrency(price.old)}
                </span>
              )}
            </div>
            <p className="text-xs text-muted">
              {price.offer === 'rent'
                ? `${OFFER_LABELS.rent} · ${RENT_PERIOD_DAYS} дня`
                : OFFER_LABELS.sale}
              {second && ` · ${second.label}: ${formatCurrency(second.amount)} сум`}
            </p>
            {item.deposit && (
              <p className="text-xs text-muted">
                Залог{' '}
                <span className="font-medium text-foreground">
                  {formatCurrency(item.deposit)} сум
                </span>{' '}
                — возвращается после возврата изделия.
              </p>
            )}
          </div>
        )}
      </header>

      {item.variants.length > 1 && (
        <div>
          <p className="mb-2 text-sm text-foreground">
            Цвет: <span className="font-semibold">{variant.colorName}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {item.variants.map((v) => {
              const selected = v.id === variant.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onVariantChange(v.id)}
                  aria-label={v.colorName}
                  title={v.colorName}
                  className={cn(
                    'relative h-20 w-20 overflow-hidden rounded-2xl border-2 bg-surface-2 transition',
                    selected
                      ? 'border-primary shadow-card ring-2 ring-primary-soft'
                      : 'border-border-subtle hover:border-primary/50',
                  )}
                >
                  <img
                    src={v.mainImage}
                    alt={v.colorName}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span
                    className="absolute right-1 top-1 h-4 w-4 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: v.colorHex }}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizeOptions.length > 0 ? (
        <div>
          <p className="mb-2 text-sm text-foreground">
            Размер: <span className="font-semibold">{selectedSize ?? '—'}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((size) => {
              const selected = selectedSize === size.label;
              return (
                <button
                  key={size.label}
                  type="button"
                  disabled={!size.available}
                  onClick={() => onSizeChange(size.label)}
                  title={size.available ? undefined : 'Нет в наличии'}
                  className={cn(
                    'rounded-xl border px-3 py-2 text-sm font-medium transition',
                    !size.available &&
                      'cursor-not-allowed border-border-subtle bg-surface-2 text-subtle line-through',
                    size.available && selected && 'border-primary bg-primary-soft text-primary',
                    size.available &&
                      !selected &&
                      'border-border bg-surface text-foreground hover:border-primary',
                  )}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
          {isDress(item) && (
            <p className="mt-2 text-xs text-muted">
              Не уверены в размере? На примерке подберём и подгоним по фигуре.
            </p>
          )}
        </div>
      ) : (
        !isDress(item) &&
        item.oneSize && <p className="text-sm text-muted">Один размер</p>
      )}

      {item.description && (
        <div>
          <h2 className="mb-1.5 text-sm font-medium text-foreground">Описание</h2>
          <p className="text-sm leading-relaxed text-foreground/80">{item.description}</p>
        </div>
      )}
    </section>
  );
}
