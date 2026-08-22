import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { itemPath } from '@/constants/routes';
import type { CatalogItem } from '../helper.types.catalog';
import { defaultVariant } from '../utils/item';

/** Shundan kam rasmda kollaj yig'ilmaydi — faqat asosiy rasm chiqadi */
export const COLLAGE_MIN_PHOTOS = 3;

/** Albomda ko'rinadigan maksimal plitka; ortiqchasi oxirgisiga "+N" bo'lib yig'iladi */
const MAX_TILES = 4;

/**
 * Telegram albomi kabi joylashuv: birinchi rasm katta, qolganlari o'ng ustunda.
 * Tailwind class'lari statik bo'lishi shart — shuning uchun jadval orqali.
 */
const GRID_BY_COUNT: Record<number, string> = {
  1: 'grid-cols-1 grid-rows-1',
  2: 'grid-cols-2 grid-rows-1',
  3: 'grid-cols-3 grid-rows-2',
  4: 'grid-cols-3 grid-rows-3',
};

/** Birinchi plitka qolganlaridan kattaroq — 3 va 4 rasmli albomda */
const FIRST_TILE_BY_COUNT: Record<number, string> = {
  1: '',
  2: '',
  3: 'col-span-2 row-span-2',
  4: 'col-span-2 row-span-3',
};

/** `fill` — o'rab turgan blok nisbatni o'zi belgilagan holat */
const ASPECT = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  fill: 'h-full w-full',
} as const;

const GAP = { sm: 'gap-[1px]', md: 'gap-[2px]' } as const;

type Props = {
  item: CatalogItem;
  /** `sm` — 3 ustunli plitka (ingichka oraliq), `md` — karta va post lentasi */
  size?: 'sm' | 'md';
  /** Blok nisbati — o'sha joydagi bitta rasmli variant bilan bir xil bo'lsin */
  aspect?: keyof typeof ASPECT;
  /**
   * Har bir plitka alohida havola bo'ladimi.
   * Kartochkaning o'zi `<Link>` ichida bo'lsa `false` — ichma-ich havola noto'g'ri HTML.
   */
  linked?: boolean;
  /** Rasmga qo'shimcha class — hover zoom kabi effektlar uchun */
  imgClassName?: string;
  className?: string;
};

/**
 * Tovar rasmlarining kollaji. Rasm `COLLAGE_MIN_PHOTOS` dan kam bo'lsa
 * oddiy bitta rasm bo'lib chiqadi, shuning uchun chaqiruvchi tomonda shart kerak emas.
 */
export default function ItemCollage({
  item,
  size = 'md',
  aspect = 'square',
  linked = false,
  imgClassName,
  className,
}: Props) {
  const variant = defaultVariant(item);
  const all = [variant.mainImage, ...variant.otherImages].filter(Boolean);

  const tiles =
    all.length >= COLLAGE_MIN_PHOTOS ? all.slice(0, MAX_TILES) : all.slice(0, 1);
  const count = tiles.length;

  return (
    <div
      className={cn(
        'grid overflow-hidden bg-surface-2',
        ASPECT[aspect],
        GAP[size],
        GRID_BY_COUNT[count] ?? GRID_BY_COUNT[1],
        className,
      )}
    >
      {tiles.map((src, i) => {
        const tileClass = cn(
          'relative block overflow-hidden bg-surface-2',
          i === 0 && FIRST_TILE_BY_COUNT[count],
          linked &&
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
        );

        const inner = (
          <img
            src={src}
            alt={count > 1 ? `${item.name} — фото ${i + 1}` : item.name}
            loading="lazy"
            decoding="async"
            className={cn('h-full w-full object-cover', imgClassName)}
          />
        );

        return linked ? (
          <Link key={src} to={itemPath(item.slug)} aria-label={item.name} className={tileClass}>
            {inner}
          </Link>
        ) : (
          <div key={src} className={tileClass}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
