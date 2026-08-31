import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MdAdd, MdDoNotDisturbAlt } from 'react-icons/md';
import { cn } from '@/utils/cn';
import { profilePickPath } from '@/constants/routes';
import { MAX_PICKED, useWardrobeStore } from '@/store/zustand';
import { MOCK_CATALOG, getItemById, defaultVariant } from '@/features/catalog';
import { REQUIRED_CATEGORIES, type OutfitCategory } from '../../helper.types.garderob';
import PickRowShell, { TILE_CLASS, TILE_FRAME_CLASS } from './PickRowShell';
import PickTile from './PickTile';

type RowText = {
  /** "tanlamayman" katagi yorlig'i */
  none: string;
  hint: string;
  add: string;
};

const ROW_TEXT: Record<OutfitCategory, RowText> = {
  dress: {
    none: 'Без платья',
    hint: 'Нажмите «+» — выберите вещи из избранного.',
    add: 'Выбрать одежду из избранного',
  },
  veil: {
    none: 'Без фаты',
    hint: 'Нажмите «+» — выберите фату из избранного.',
    add: 'Выбрать фату из избранного',
  },
  bag: {
    none: 'Без сумки',
    hint: 'Нажмите «+» — выберите сумку из избранного.',
    add: 'Выбрать сумку из избранного',
  },
  shoes: {
    none: 'Без туфель',
    hint: 'Нажмите «+» — выберите туфли из избранного.',
    add: 'Выбрать туфли из избранного',
  },
  jewelry: {
    none: 'Без украшений',
    hint: 'Нажмите «+» — выберите украшения из избранного.',
    add: 'Выбрать украшения из избранного',
  },
};

type Props = {
  category: OutfitCategory;
};

/**
 * Kiyim/aksessuar qatori — tovarlar sevimlilardan olinadi, store'da faqat `id`
 * saqlanadi. Shuning uchun chegara katta (`MAX_PICKED`).
 *
 * Ixtiyoriy bo'limda "Без …" katagi bor: образ o'sha qismsiz ham yig'iladi.
 */
export default function OutfitPickRow({ category }: Props) {
  const text = ROW_TEXT[category];
  const required = REQUIRED_CATEGORIES.includes(category);

  const picked = useWardrobeStore((s) => s.picked);
  const selected = useWardrobeStore((s) => s.selected);
  const select = useWardrobeStore((s) => s.select);
  const remove = useWardrobeStore((s) => s.remove);

  const activeId = selected[category] ?? null;

  // Garderobga olingan tartibda — foydalanuvchi qaysi ketma-ketlikda tanlagan bo'lsa
  const items = useMemo(
    () =>
      picked
        .filter((x) => x.category === category)
        .map((x) => getItemById(x.id, MOCK_CATALOG))
        .filter((x): x is NonNullable<typeof x> => x !== null),
    [picked, category],
  );

  return (
    <PickRowShell
      count={items.length}
      max={MAX_PICKED}
      hint={text.hint}
      empty={items.length === 0}
    >
      <Link
        to={profilePickPath(category)}
        aria-label={text.add}
        className={cn(
          TILE_FRAME_CLASS,
          TILE_CLASS,
          'border-2 border-dashed border-border text-muted hover:border-primary hover:text-primary',
        )}
      >
        <MdAdd size={28} />
      </Link>

      {!required && (
        <button
          type="button"
          onClick={() => select(null, category)}
          aria-pressed={activeId === null}
          className={cn(
            TILE_FRAME_CLASS,
            TILE_CLASS,
            'gap-1 border px-1 text-center',
            activeId === null
              ? 'border-primary bg-primary-soft text-primary'
              : 'border-border text-muted hover:border-primary hover:text-primary',
          )}
        >
          <MdDoNotDisturbAlt size={20} />
          <span className="text-[10px] font-medium leading-tight">{text.none}</span>
        </button>
      )}

      {items.map((item) => (
        <PickTile
          key={item.id}
          image={defaultVariant(item).mainImage}
          label={item.name}
          active={activeId === item.id}
          onClick={() => select(activeId === item.id ? null : item.id, category)}
          onRemove={() => remove(item.id, category)}
          removeLabel={`Убрать ${item.name} из гардероба`}
        />
      ))}
    </PickRowShell>
  );
}
