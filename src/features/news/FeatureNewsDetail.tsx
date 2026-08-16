import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { ROUTES } from '@/constants/routes';
import { getNewsBySlug } from './mockdata.news';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function FeatureNewsDetail() {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const item = getNewsBySlug(slug);

  if (!item) {
    return (
      <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Новость не найдена</h1>
        <Link
          to={ROUTES.NEWS}
          className="mt-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg hover:bg-primary-hover"
        >
          Все новости
        </Link>
      </div>
    );
  }

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(ROUTES.NEWS);
  };

  return (
    <article className="mx-auto max-w-md bg-background">
      <div className="relative">
        <img
          src={item.cover}
          alt={item.title}
          className="aspect-[16/10] w-full object-cover"
        />
        <button
          type="button"
          onClick={handleBack}
          aria-label="Назад"
          className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-overlay-dark text-white backdrop-blur transition hover:bg-overlay-dark-strong"
        >
          <FiArrowLeft size={20} />
        </button>
      </div>

      <div className="space-y-3 px-4 py-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
          {formatDate(item.publishedAt)}
          {item.author && <span> · {item.author}</span>}
        </p>
        <h1 className="text-xl font-bold leading-tight text-foreground">{item.title}</h1>
        <p className="text-sm text-muted">{item.excerpt}</p>
        <div className="pt-2 text-sm leading-relaxed text-foreground">{item.body}</div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
