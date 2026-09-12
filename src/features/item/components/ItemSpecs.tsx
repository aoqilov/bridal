import type { ReactNode } from 'react';
import {
  MdOutlineStyle,
  MdOutlineCheckroom,
  MdOutlineLayers,
  MdOutlinePalette,
  MdOutlineStraighten,
  MdOutlineWaterDrop,
  MdOutlineCalendarMonth,
  MdOutlineCategory,
} from 'react-icons/md';
import {
  isDress,
  ACCESSORY_TYPE_LABELS,
  FABRIC_LABELS,
  NECKLINE_LABELS,
  SHADE_LABELS,
  SILHOUETTE_LABELS,
  SLEEVE_LABELS,
  type CatalogItem,
} from '@/features/catalog';
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

function buildRows(item: CatalogItem): Row[] {
  const rows: Row[] = [];

  if (isDress(item)) {
    rows.push({
      icon: <MdOutlineStyle size={ICON_SIZE} />,
      label: 'Силуэт',
      value: SILHOUETTE_LABELS[item.silhouette],
    });
    rows.push({
      icon: <MdOutlineCheckroom size={ICON_SIZE} />,
      label: 'Вырез',
      value: NECKLINE_LABELS[item.neckline],
    });
    rows.push({
      icon: <MdOutlineCheckroom size={ICON_SIZE} />,
      label: 'Рукав',
      value: SLEEVE_LABELS[item.sleeve],
    });
    rows.push({
      icon: <MdOutlinePalette size={ICON_SIZE} />,
      label: 'Оттенок',
      value: SHADE_LABELS[item.shade],
    });
    if (item.trainLength) {
      rows.push({
        icon: <MdOutlineStraighten size={ICON_SIZE} />,
        label: 'Шлейф',
        value: `${item.trainLength} см`,
      });
    }
    if (item.hasCorset !== undefined) {
      rows.push({
        icon: <MdOutlineCheckroom size={ICON_SIZE} />,
        label: 'Корсет',
        value: item.hasCorset ? 'Есть' : 'Нет',
      });
    }
    if (item.collectionYear) {
      rows.push({
        icon: <MdOutlineCalendarMonth size={ICON_SIZE} />,
        label: 'Коллекция',
        value: String(item.collectionYear),
      });
    }
    rows.push({
      icon: <MdOutlineLayers size={ICON_SIZE} />,
      label: 'Ткань',
      value: item.fabrics.map((f) => FABRIC_LABELS[f]).join(', '),
      wide: true,
    });
    return rows;
  }

  rows.push({
    icon: <MdOutlineCategory size={ICON_SIZE} />,
    label: 'Тип',
    value: ACCESSORY_TYPE_LABELS[item.accessoryType],
  });
  rows.push({
    icon: <MdOutlineStraighten size={ICON_SIZE} />,
    label: 'Размер',
    value: item.oneSize ? 'Один размер' : (item.sizeLabels?.join(', ') ?? '—'),
  });
  if (item.material) {
    rows.push({
      icon: <MdOutlineLayers size={ICON_SIZE} />,
      label: 'Материал',
      value: item.material,
      wide: true,
    });
  }
  return rows;
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
