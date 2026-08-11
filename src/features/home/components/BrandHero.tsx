import { Link } from 'react-router-dom';
import { MdCategory, MdCheckroom, MdDiamond } from 'react-icons/md';
import { ROUTES } from '@/constants/routes';
import { BRAND_INFO } from '../mockdata.brand';

type Props = {
  categoryCount: number;
  dressCount: number;
  accessoryCount: number;
};

type Stat = {
  to: string;
  value: number;
  label: string;
  icon: React.ReactNode;
};

export default function BrandHero({
  categoryCount,
  dressCount,
  accessoryCount,
}: Props) {
  const initial = BRAND_INFO.name.trim().charAt(0).toUpperCase() || 'A';

  const stats: Stat[] = [
    {
      to: `${ROUTES.CATALOG}?kind=dress`,
      value: dressCount,
      label: 'Платьев',
      icon: <MdCheckroom size={18} />,
    },
    {
      to: `${ROUTES.CATALOG}?kind=accessory`,
      value: accessoryCount,
      label: 'Аксессуаров',
      icon: <MdDiamond size={18} />,
    },
    {
      to: ROUTES.CATALOG,
      value: categoryCount,
      label: 'Категорий',
      icon: <MdCategory size={18} />,
    },
  ];

  return (
    <section className="border-b border-border-subtle bg-surface px-4 pb-5 pt-6">
      <div className="flex items-center gap-3">
        <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-border-subtle bg-surface-2">
          {BRAND_INFO.logo ? (
            <img
              src={BRAND_INFO.logo}
              alt={BRAND_INFO.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-serif text-2xl font-semibold text-primary">{initial}</span>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="line-clamp-1 font-serif text-xl font-semibold text-foreground">
            {BRAND_INFO.name}
          </h1>
          <p className="line-clamp-2 text-xs text-muted">{BRAND_INFO.tagline}</p>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">{BRAND_INFO.description}</p>

      <Link
        to={ROUTES.BOOKING}
        className="mt-4 flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover"
      >
        Записаться на примерку
      </Link>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="flex flex-col items-start gap-1.5 rounded-xl border border-border-subtle bg-surface-2 px-3 py-2.5 transition hover:border-border hover:bg-surface"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
              {s.icon}
            </span>
            <div>
              <p className="text-base font-bold leading-none text-foreground">
                {s.value}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-muted">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
