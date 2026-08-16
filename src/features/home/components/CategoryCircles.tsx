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
      <ul className="flex gap-3 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MOCK_CATEGORIES.map((cat) => (
          <li key={cat.id} className="w-[68px] shrink-0">
            <Link
              to={categoryPath(cat.id)}
              className="flex flex-col items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-gradient p-[2px]">
                <span className="h-full w-full overflow-hidden rounded-full bg-surface ring-2 ring-background">
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  )}
                </span>
              </span>
              <span className="line-clamp-2 text-center text-[11px] leading-tight text-muted">
                {cat.shortName ?? cat.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
