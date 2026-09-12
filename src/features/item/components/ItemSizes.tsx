import { useState } from 'react';
import { MdOutlineStraighten } from 'react-icons/md';
import { isAccessory, isDress, type CatalogItem } from '@/features/catalog';
import { cn } from '@/utils/cn';
import SizeChartSheet from './SizeChartSheet';

type Props = {
  item: CatalogItem;
};

/**
 * O'lchamlar — faqat ko'rsatish uchun (readonly).
 * Mijoz qaysi o'lchamlar borligini ko'radi, aniq o'lcham примерка paytida tanlanadi.
 */
export default function ItemSizes({ item }: Props) {
  const [chartOpen, setChartOpen] = useState(false);

  // Ko'ylak — RU o'lchamlar (mavjudligi bilan), aksessuar — oddiy yorliqlar
  const options = isDress(item)
    ? item.sizes.map((s) => ({ label: s.label, available: s.available }))
    : (item.sizeLabels ?? []).map((l) => ({ label: l, available: true }));

  if (options.length === 0) {
    return isAccessory(item) && item.oneSize ? (
      <p className="rounded border border-border bg-surface px-3 py-2.5 text-sm text-muted">
        Один размер — регулируется под любую причёску
      </p>
    ) : null;
  }

  const hasAvailable = options.some((o) => o.available);

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <p className="text-[9.5px] uppercase tracking-[0.14em] text-subtle">
          {hasAvailable ? 'Размеры в наличии' : 'Размеров сейчас нет в наличии'}
        </p>
        {isDress(item) && (
          <button
            type="button"
            onClick={() => setChartOpen(true)}
            className="flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
          >
            <MdOutlineStraighten size={13} className="text-primary" />
            Таблица размеров
          </button>
        )}
      </div>

      {/* Bitta umumiy ramka, ichida bo'linmalar — o'lcham ko'p bo'lsa gorizontal scroll */}
      <ul className="subtle-scrollbar flex overflow-x-auto rounded border border-border bg-surface">
        {options.map((size, index) => (
          <li
            key={size.label}
            title={size.available ? undefined : 'Нет в наличии'}
            className={cn(
              'min-w-[4.25rem] flex-1 whitespace-nowrap px-2.5 py-2.5 text-center text-sm font-medium',
              index > 0 && 'border-l border-border-subtle',
              size.available
                ? 'text-foreground'
                : 'bg-surface-2 text-subtle line-through',
            )}
          >
            {size.label}
          </li>
        ))}
      </ul>

      {isDress(item) && (
        <p className="mt-2.5 text-xs leading-relaxed text-muted">
          Не уверены в размере? На примерке подберём и подгоним по фигуре.
        </p>
      )}

      {isDress(item) && (
        <SizeChartSheet
          open={chartOpen}
          onClose={() => setChartOpen(false)}
          availableRu={item.sizes.filter((s) => s.available).map((s) => s.ru)}
        />
      )}
    </div>
  );
}
