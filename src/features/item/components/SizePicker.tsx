import { useState } from 'react';
import { MdOutlineStraighten } from 'react-icons/md';
import { isAccessory, isDress, type CatalogItem } from '@/features/catalog';
import { cn } from '@/utils/cn';
import SizeChartSheet from './SizeChartSheet';

type Props = {
  item: CatalogItem;
  selected: string | null;
  onChange: (label: string) => void;
};

export default function SizePicker({ item, selected, onChange }: Props) {
  const [chartOpen, setChartOpen] = useState(false);

  // Ko'ylak — RU o'lchamlar (mavjudligi bilan), aksessuar — oddiy yorliqlar
  const options = isDress(item)
    ? item.sizes.map((s) => ({ label: s.label, available: s.available }))
    : (item.sizeLabels ?? []).map((l) => ({ label: l, available: true }));

  if (options.length === 0) {
    return isAccessory(item) && item.oneSize ? (
      <p className="rounded-xl bg-surface px-3 py-2.5 text-sm text-muted">
        Один размер — регулируется под любую причёску
      </p>
    ) : null;
  }

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Размер: <span className="font-semibold text-foreground">{selected ?? '—'}</span>
        </p>
        {isDress(item) && (
          <button
            type="button"
            onClick={() => setChartOpen(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary-hover"
          >
            <MdOutlineStraighten size={14} />
            Таблица размеров
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((size) => {
          const active = selected === size.label;
          return (
            <button
              key={size.label}
              type="button"
              disabled={!size.available}
              onClick={() => onChange(size.label)}
              title={size.available ? undefined : 'Нет в наличии'}
              className={cn(
                'min-w-[3.5rem] rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                !size.available &&
                  'cursor-not-allowed border-border-subtle bg-surface-2 text-subtle line-through',
                size.available &&
                  active &&
                  'border-primary bg-primary text-primary-fg shadow-card',
                size.available &&
                  !active &&
                  'border-border bg-surface text-foreground hover:border-primary',
              )}
            >
              {size.label}
            </button>
          );
        })}
      </div>

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
