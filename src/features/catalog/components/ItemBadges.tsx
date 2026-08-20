import { CusBadge } from '@/components/ui';
import { cn } from '@/utils/cn';
import type { CatalogItem } from '../helper.types.catalog';
import { discountPercent } from '../utils/price';

type Props = {
  item: CatalogItem;
  /** `sm` — 3 ustunli plitka, `md` — 2 ustunli karta va lenta */
  size?: 'sm' | 'md';
  /** Joylashuv rasmni o'rab turgan blokdan beriladi (`absolute left-2 top-2` kabi) */
  className?: string;
};

/** Rasm ustidagi status yorliqlari — uchala kartochka uchun bitta manba */
export default function ItemBadges({ item, size = 'md', className }: Props) {
  const discount = discountPercent(item);
  // "Хит" — faqat yangi bo'lmagan modelda, aks holda ikkita bir xil ma'noli yorliq chiqadi
  const showPopular = Boolean(item.isPopular) && !item.isNew;

  if (!item.isNew && discount === 0 && !showPopular) return null;

  const badgeSize = size === 'sm' ? 'xs' : 'sm';

  return (
    <div className={cn('flex flex-col items-start gap-1', className)}>
      {item.isNew && (
        <CusBadge variant="accent-solid" size={badgeSize} className="uppercase">
          Новинка
        </CusBadge>
      )}
      {discount > 0 && (
        <CusBadge variant="danger-solid" size={badgeSize}>
          −{discount}%
        </CusBadge>
      )}
      {showPopular && (
        <CusBadge variant="overlay" size={badgeSize}>
          Хит
        </CusBadge>
      )}
    </div>
  );
}
