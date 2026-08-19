import { discountPercent, type CatalogItem } from '@/features/catalog';
import { cn } from '@/utils/cn';

type Props = {
  item: CatalogItem;
  className?: string;
};

/** Kartochka rasm ustidan aynan shu qatordan boshlanadi */
export default function ItemBadges({ item, className }: Props) {
  const discount = discountPercent(item);
  const showHit = Boolean(item.isPopular) && !item.isNew;

  if (!item.isNew && discount === 0 && !showHit) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {item.isNew && (
        <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent-fg">
          Новинка
        </span>
      )}
      {discount > 0 && (
        <span className="rounded-full bg-danger px-2.5 py-1 text-[10px] font-semibold text-white">
          −{discount}%
        </span>
      )}
      {showHit && (
        <span className="rounded-full bg-primary-soft px-2.5 py-1 text-[10px] font-semibold text-primary">
          Хит салона
        </span>
      )}
    </div>
  );
}
