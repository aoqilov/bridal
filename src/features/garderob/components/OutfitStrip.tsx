import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MdAdd, MdClose, MdDoNotDisturbAlt } from 'react-icons/md';
import { cn } from '@/utils/cn';
import { profilePickPath } from '@/constants/routes';
import { MAX_PICKED, useWardrobeStore } from '@/store/zustand';
import { MOCK_CATALOG, getItemById, defaultVariant } from '@/features/catalog';
import {
  REQUIRED_CATEGORIES,
  type OutfitCategory,
} from '../helper.types.garderob';
import PhotoCircle, { CIRCLE_SIZE_CLASS } from './PhotoCircle';
import StripBadge from './StripBadge';

type StripText = {
  title: string;
  /** "tanlamayman" katagi yorlig'i */
  none: string;
  /** Bo'lim bo'sh bo'lgandagi izoh */
  hint: string;
};

const STRIP_TEXT: Record<OutfitCategory, StripText> = {
  dress: {
    title: 'Выберите одежду',
    none: 'Без платья',
    hint: 'Нажмите «+» — выберите вещи из избранного.',
  },
  veil: {
    title: 'Выберите фату',
    none: 'Без фаты',
    hint: 'Нажмите «+» — выберите фату из избранного.',
  },
  bag: {
    title: 'Выберите сумку',
    none: 'Без сумки',
    hint: 'Нажмите «+» — выберите сумку из избранного.',
  },
  shoes: {
    title: 'Выберите туфли',
    none: 'Без туфель',
    hint: 'Нажмите «+» — выберите туфли из избранного.',
  },
  jewelry: {
    title: 'Выберите украшения',
    none: 'Без украшений',
    hint: 'Нажмите «+» — выберите украшения из избранного.',
  },
};

type Props = {
  category: OutfitCategory;
  /** Majburiy bo'lim — "Без ..." katagi ko'rsatilmaydi (standart: `REQUIRED_CATEGORIES`) */
  required?: boolean;
};

/**
 * Bitta bo'lim qatori — garderobga olingan katalog tovarlari.
 * `+` profilning "Избранное" bo'limini tanlash rejimida ochadi;
 * doirani bosish — o'sha buyumni kiyib ko'rish (faol qilish).
 * Ixtiyoriy bo'limda "Без ..." katagi bor — o'sha qismsiz ham примерка ko'rinadi.
 */
export default function OutfitStrip({
  category,
  required = REQUIRED_CATEGORIES.includes(category),
}: Props) {
  const text = STRIP_TEXT[category];

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
    <section aria-label={text.title} className="pt-3">
      <div className="flex items-center justify-between px-4">
        <h2 className="flex items-baseline gap-1.5 text-sm font-semibold text-foreground">
          {text.title}
          <StripBadge required={required} />
        </h2>
        {/* Bo'limdan nechta buyum olinganini va chegarani ko'rsatadi */}
        <span className="shrink-0 text-[11px] text-subtle">
          {items.length} из {MAX_PICKED}
        </span>
      </div>

      {/* py-2 — faol halqa va ✓ nishoni scroll konteyneri tomonidan qirqilmasin */}
      <div className="mt-1 flex items-center gap-3 overflow-x-auto px-4 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link
          to={profilePickPath(category)}
          aria-label={`${text.title} — из избранного`}
          className={cn(
            'grid shrink-0 place-items-center rounded-[10px] border-2 border-dashed border-border text-muted transition-colors',
            'hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            CIRCLE_SIZE_CLASS.lg,
          )}
        >
          <MdAdd size={34} />
        </Link>

        {/* Ixtiyoriy bo'limni bo'sh qoldirish — примерка shu qismsiz ko'rinadi */}
        {!required && (
          <button
            type="button"
            onClick={() => select(null, category)}
            aria-pressed={activeId === null}
            className={cn(
              'grid shrink-0 place-items-center gap-1 rounded-[10px] border px-1 text-center transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              CIRCLE_SIZE_CLASS.lg,
              activeId === null
                ? 'border-primary bg-primary-soft text-primary'
                : 'border-border text-muted hover:border-primary hover:text-primary',
            )}
          >
            <MdDoNotDisturbAlt size={22} />
            <span className="text-[10px] font-medium leading-tight">{text.none}</span>
          </button>
        )}

        {items.length === 0 ? (
          <p className="text-xs leading-relaxed text-muted">{text.hint}</p>
        ) : (
          items.map((item) => {
            const active = activeId === item.id;
            return (
              <div key={item.id} className="relative shrink-0">
                <PhotoCircle
                  image={defaultVariant(item).mainImage}
                  label={item.name}
                  size="lg"
                  shape="rounded"
                  active={active}
                  onClick={() => select(active ? null : item.id, category)}
                />

                <button
                  type="button"
                  onClick={() => remove(item.id, category)}
                  aria-label={`Убрать ${item.name} из гардероба`}
                  className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-overlay-dark text-white backdrop-blur transition hover:bg-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <MdClose size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
