import type { ReactNode } from 'react';
import {
  MdOutlinePlace,
  MdOutlineStorefront,
  MdOutlineLayers,
  MdOutlineDiamond,
  MdOutlineWaterDrop,
} from 'react-icons/md';
import { isDress, FABRIC_LABELS, type CatalogItem } from '@/features/catalog';
import { DEFAULT_BRAND, DEFAULT_ORIGIN } from '@/constants/app';
import { cn } from '@/utils/cn';
import SectionTitle from './SectionTitle';

type Row = {
  icon: ReactNode;
  label: string;
  value: string;
  /** Uzun qiymat — kartochka ikki ustunni egallaydi */
  wide?: boolean;
};

type Props = {
  item: CatalogItem;
};

const ICON_SIZE = 16;

/** Ko'ylakda — matolar ro'yxati, aksessuarda — erkin matnli material */
function materialOf(item: CatalogItem): string {
  if (isDress(item)) {
    return item.fabrics.map((f) => FABRIC_LABELS[f]).join(', ') || '—';
  }
  return item.material ?? '—';
}

/**
 * Uch qator: yuqorida ishlab chiqarilgan joy va brend yonma-yon, pastda
 * material va toshlar — ikkalasi ham vergul bilan sanaladi, shuning uchun
 * butun enni egallaydi.
 */
function buildRows(item: CatalogItem): Row[] {
  return [
    {
      icon: <MdOutlinePlace size={ICON_SIZE} />,
      label: 'Производство',
      value: item.origin ?? DEFAULT_ORIGIN,
    },
    {
      icon: <MdOutlineStorefront size={ICON_SIZE} />,
      label: 'Бренд',
      value: item.brand ?? DEFAULT_BRAND,
    },
    {
      icon: <MdOutlineLayers size={ICON_SIZE} />,
      label: 'Материал',
      value: materialOf(item),
      wide: true,
    },
    {
      icon: <MdOutlineDiamond size={ICON_SIZE} />,
      label: 'Камни',
      value: item.stones?.length ? item.stones.join(', ') : 'Нет',
      wide: true,
    },
  ];
}

export default function ItemSpecs({ item }: Props) {
  const rows = buildRows(item);

  return (
    <section className="px-4 pt-8">
      <SectionTitle>Характеристики</SectionTitle>

      <dl className="grid grid-cols-2 gap-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className={cn(
              'rounded border border-border bg-surface p-3',
              row.wide && 'col-span-2',
            )}
          >
            <dt className="flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.14em] text-subtle">
              <span className="text-primary">{row.icon}</span>
              {row.label}
            </dt>
            <dd className="mt-1.5 text-sm leading-snug text-foreground">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {item.careInstructions && (
        <div className="mt-3 flex gap-3 rounded border border-border bg-surface p-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-surface-2 text-primary">
            <MdOutlineWaterDrop size={18} />
          </span>
          <div>
            <h3 className="font-serif text-base text-foreground">Уход</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {item.careInstructions}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
