import { Link } from 'react-router-dom';
import { MOCK_CATEGORIES } from '@/features/catalog';
import { ROUTES } from '@/constants/routes';

/** Kategoriya bo'yicha filtrlangan katalog (param — `hooks/useCategoryFilter.ts`) */
function categoryPath(categoryId: string): string {
  return `${ROUTES.CATALOG}?cats=${categoryId}`;
}

/** Gorizontal doiralar qatori — kategoriyalar bo'yicha tez o'tish */
export default function CategoryCircles() {
  if (MOCK_CATEGORIES.length === 0) return null;

  return (
    <nav aria-label="Категории">
      <ul className="flex gap-3.5 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MOCK_CATEGORIES.map((cat) => (
          <li key={cat.id} className="w-[72px] shrink-0">
            <Link
              to={categoryPath(cat.id)}
              className="flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="grid h-[68px] w-[68px] place-items-center rounded-full border border-border-subtle bg-surface p-[3px] transition-colors hover:border-primary">
                {cat.image ? (
                  <span className="h-full w-full overflow-hidden rounded-full">
                    <img
                      src={cat.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </span>
                ) : (
                  /* Rasmsiz kategoriya — oltin romb joy egallaydi */
                  <span className="h-3 w-3 rotate-45 border border-primary" aria-hidden />
                )}
              </span>

              <span className="line-clamp-2 text-center text-[10.5px] leading-tight text-muted">
                {cat.shortName ?? cat.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
