import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import { cn } from '@/utils/cn';
import { getPromotionBySlug } from './mockdata.promotions';
import type { Promotion } from './helper.types.promotions';

const accentBadge: Record<NonNullable<Promotion['accentColor']>, string> = {
  primary: 'bg-primary text-primary-fg',
  accent: 'bg-accent text-accent-fg',
  danger: 'bg-danger text-white',
};

function formatDateRange(startsAt: string, endsAt: string): string {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  return `${fmt(startsAt)} — ${fmt(endsAt)}`;
}

export default function FeaturePromotionDetail() {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const promo = getPromotionBySlug(slug);

  if (!promo) {
    return (
      <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Акция не найдена</h1>
        <Link
          to="/promotions"
          className="mt-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg hover:bg-primary-hover"
        >
          Все акции
        </Link>
      </div>
    );
  }

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/promotions');
  };

  const accent = accentBadge[promo.accentColor ?? 'primary'];

  return (
    <article className="mx-auto max-w-md bg-background">
      <div className="relative">
        <img
          src={promo.cover}
          alt={promo.title}
          className="aspect-[4/3] w-full object-cover"
        />
        <button
          type="button"
          onClick={handleBack}
          aria-label="Назад"
          className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-overlay-dark text-white backdrop-blur transition hover:bg-overlay-dark-strong"
        >
          <FiArrowLeft size={20} />
        </button>
        {promo.discountPercent && (
          <span
            className={cn(
              'absolute right-3 top-3 rounded-full px-3 py-1.5 text-sm font-bold shadow-card',
              accent,
            )}
          >
            −{promo.discountPercent}%
          </span>
        )}
      </div>

      <div className="space-y-3 px-4 py-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
          {formatDateRange(promo.startsAt, promo.endsAt)}
        </p>
        <h1 className="text-xl font-bold leading-tight text-foreground">{promo.title}</h1>
        {promo.subtitle && <p className="text-sm text-muted">{promo.subtitle}</p>}
        <p className="pt-1 text-sm leading-relaxed text-foreground">{promo.description}</p>

        {promo.conditions && promo.conditions.length > 0 && (
          <div className="rounded-2xl bg-surface-2 p-3">
            <p className="mb-2 text-xs font-semibold text-foreground">Условия акции</p>
            <ul className="space-y-1.5">
              {promo.conditions.map((c) => (
                <li key={c} className="flex items-start gap-2 text-xs text-foreground">
                  <FiCheck className="mt-0.5 shrink-0 text-success" size={14} />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {promo.ctaUrl && (
          <Link
            to={promo.ctaUrl}
            className="mt-2 block rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-fg transition hover:bg-primary-hover"
          >
            {promo.ctaLabel ?? 'Подробнее'}
          </Link>
        )}
      </div>
    </article>
  );
}
