import { Link } from 'react-router-dom';
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

/** Sahifa boshi — dumaloq logotip, brend nomi, 3 ta hisob chipi va tavsif */
export default function BrandHero({
  categoryCount,
  subcategoryCount,
  itemCount,
}: Props) {
  const initial = BRAND_INFO.name.trim().charAt(0).toUpperCase() || 'A';
  const instagram = SOCIALS.find((s) => s.id === 'instagram');

  const stats: Stat[] = [
    {
      to: CATALOG_CATEGORIES_PATH,
      value: categoryCount,
      label: 'Категорий',
    },
    {
      to: CATALOG_CATEGORIES_PATH,
      value: subcategoryCount,
      label: 'Подкатегорий',
    },
    {
      to: ROUTES.CATALOG,
      value: itemCount,
      label: 'Товаров',
    },
  ];

  return (
    <section className="px-4 pt-5">
      <div className="flex items-center gap-4">
        <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-surface-2 ring-1 ring-border-subtle">
          {BRAND_INFO.logo ? (
            <img
              src={BRAND_INFO.logo}
              alt={BRAND_INFO.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-serif text-3xl font-semibold text-primary">
              {initial}
            </span>
          )}
        </span>

        <div className="min-w-0 flex-1">
          <h1 className="line-clamp-1 font-serif text-xl font-semibold text-foreground">
            {BRAND_INFO.name}
          </h1>

          {instagram && (
            <a
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 inline-flex max-w-full items-center gap-1 text-[11px] text-muted transition-colors hover:text-primary"
            >
              <instagram.icon size={13} className="shrink-0" />
              <span className="line-clamp-1">{instagram.handle}</span>
            </a>
          )}

          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {stats.map((s) => (
              <Link
                key={s.label}
                to={s.to}
                className="rounded-xl border border-border-subtle bg-surface px-1.5 py-1.5 text-center transition hover:border-border hover:bg-surface-2"
              >
                <p className="text-sm font-bold leading-none text-foreground">
                  {s.value}
                </p>
                <p className="mt-1 line-clamp-1 text-[10px] font-medium text-muted">
                  {s.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
