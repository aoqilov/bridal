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

type Row = {
  icon: ReactNode;
  label: string;
  value: string;
};

type Props = {
  item: CatalogItem;
};

function buildRows(item: CatalogItem): Row[] {
  const rows: Row[] = [];

  if (isDress(item)) {
    rows.push({
      icon: <MdOutlineStyle size={18} />,
      label: 'Силуэт',
      value: SILHOUETTE_LABELS[item.silhouette],
    });
    rows.push({
      icon: <MdOutlineCheckroom size={18} />,
      label: 'Вырез',
      value: NECKLINE_LABELS[item.neckline],
    });
    rows.push({
      icon: <MdOutlineCheckroom size={18} />,
      label: 'Рукав',
      value: SLEEVE_LABELS[item.sleeve],
    });
    rows.push({
      icon: <MdOutlineLayers size={18} />,
      label: 'Ткань',
      value: item.fabrics.map((f) => FABRIC_LABELS[f]).join(', '),
    });
    rows.push({
      icon: <MdOutlinePalette size={18} />,
      label: 'Оттенок',
      value: SHADE_LABELS[item.shade],
    });
    if (item.trainLength) {
      rows.push({
        icon: <MdOutlineStraighten size={18} />,
        label: 'Шлейф',
        value: `${item.trainLength} см`,
      });
    }
    if (item.hasCorset !== undefined) {
      rows.push({
        icon: <MdOutlineCheckroom size={18} />,
        label: 'Корсет',
        value: item.hasCorset ? 'Есть' : 'Нет',
      });
    }
    if (item.collectionYear) {
      rows.push({
        icon: <MdOutlineCalendarMonth size={18} />,
        label: 'Коллекция',
        value: String(item.collectionYear),
      });
    }
    return rows;
  }

  rows.push({
    icon: <MdOutlineCategory size={18} />,
    label: 'Тип',
    value: ACCESSORY_TYPE_LABELS[item.accessoryType],
  });
  if (item.material) {
    rows.push({
      icon: <MdOutlineLayers size={18} />,
      label: 'Материал',
      value: item.material,
    });
  }
  rows.push({
    icon: <MdOutlineStraighten size={18} />,
    label: 'Размер',
    value: item.oneSize ? 'Один размер' : (item.sizeLabels?.join(', ') ?? '—'),
  });
  return rows;
}

export default function ItemSpecs({ item }: Props) {
  const rows = buildRows(item);

  return (
    <section className="px-4 pt-6">
      <h2 className="mb-3 text-sm font-medium text-foreground">Характеристики</h2>
      <dl className="divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-surface">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between px-4 py-3">
            <dt className="flex items-center gap-2.5 text-sm text-muted">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
                {row.icon}
              </span>
              {row.label}
            </dt>
            <dd className="max-w-[55%] text-right text-sm font-medium text-foreground">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {item.careInstructions && (
        <div className="mt-4 rounded-2xl border border-border-subtle bg-surface p-4">
          <h3 className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
              <MdOutlineWaterDrop size={18} />
            </span>
            Уход
          </h3>
          <p className="mt-2 text-sm text-foreground/80">{item.careInstructions}</p>
        </div>
      )}
    </section>
  );
}
