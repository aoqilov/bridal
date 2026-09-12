import { Link } from 'react-router-dom';
import { FiImage } from 'react-icons/fi';
import { CATALOG_CATEGORIES_PATH, ROUTES } from '@/constants/routes';
import { SOCIALS } from '@/constants/social';
import { BRAND_INFO } from '../mockdata.brand';

type Props = {
  categoryCount: number;
  subcategoryCount: number;
  itemCount: number;
};

type Stat = {
  to: string;
  value: number;
  label: string;
};

/**
 * Sahifa boshi — muqova rasm, uning ustida logotip va brend nomi,
 * pastida esa uch ustunli hisob paneli.
 */
export default function BrandHero({
  categoryCount,
  subcategoryCount,
  itemCount,
}: Props) {
  const initial = BRAND_INFO.name.trim().charAt(0).toUpperCase() || 'A';
  const instagram = SOCIALS.find((s) => s.id === 'instagram');

  const stats: Stat[] = [
    { to: CATALOG_CATEGORIES_PATH, value: categoryCount, label: 'Категорий' },
    { to: CATALOG_CATEGORIES_PATH, value: subcategoryCount, label: 'Подкатегорий' },
    { to: ROUTES.CATALOG, value: itemCount, label: 'Товаров' },
  ];

  return (
    <section>
      <div className="relative aspect-[1/0.78] overflow-hidden bg-surface-2">
        {BRAND_INFO.cover ? (
          <img
            src={BRAND_INFO.cover}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          /* Muqova qo'yilmagan — salon egasi BRAND_INFO.cover ga rasm beradi */
          <div className="grid h-full w-full place-items-center text-subtle">
            <FiImage size={28} />
          </div>
        )}

        {/* Pastki qoplama — oq ko'ylak fotosida ham matn o'qiladi */}
        <div className="pointer-events-none absolute inset-0 bg-overlay-gradient-hero" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-12 text-center">
          {/* Tashqi qatlam — rasm ustida ko'rinadigan yupqa halqa */}
          <span className="rounded-full bg-overlay-light p-px">
            <span className="grid h-[72px] w-[72px] shrink-0 place-items-center overflow-hidden rounded-full bg-overlay-dark backdrop-blur-sm">
              {BRAND_INFO.logo ? (
                <img
                  src={BRAND_INFO.logo}
                  alt={BRAND_INFO.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-serif text-3xl text-overlay-fg">{initial}</span>
              )}
            </span>
          </span>

          <h1 className="mt-3 line-clamp-1 font-serif text-[26px] leading-tight text-overlay-fg">
            {BRAND_INFO.name}
          </h1>

          {instagram && (
            <a
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex max-w-full items-center gap-1.5 text-[11px] text-overlay-fg opacity-80 transition-opacity hover:opacity-100"
            >
              <instagram.icon size={13} className="shrink-0" />
              <span className="line-clamp-1">{instagram.handle}</span>
            </a>
          )}

          <Ornament />
        </div>
      </div>

      {/* Rasm ustiga chiqadigan panel — chekkasi kartochka kabi */}
      <div className="relative z-10 mx-4 -mt-8 grid grid-cols-3 rounded border border-border bg-surface shadow-plate">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="border-l border-border-subtle px-2 py-3.5 text-center first:border-l-0 transition-colors hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
          >
            <p className="text-[21px] font-medium leading-none text-foreground tabular-nums">
              {s.value}
            </p>
            <p className="mt-1.5 line-clamp-1 text-[9.5px] uppercase tracking-[0.14em] text-subtle">
              {s.label}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Ikki chiziq orasidagi romb — bo'lim yakunini belgilaydi */
function Ornament() {
  return (
    <span className="mt-3 flex items-center gap-2" aria-hidden>
      <span className="h-px w-7 bg-overlay-fg opacity-40" />
      <span className="h-1.5 w-1.5 rotate-45 border border-overlay-fg opacity-70" />
      <span className="h-px w-7 bg-overlay-fg opacity-40" />
    </span>
  );
}
