import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { catalogFilterPath } from '@/constants/routes';

type Props = {
  categoryId?: string;
  categoryName?: string;
  subcategoryId?: string;
  subcategoryName?: string;
};

export default function Breadcrumb({
  categoryId,
  categoryName,
  subcategoryId,
  subcategoryName,
}: Props) {
  if (!categoryName) return null;

  return (
    <nav
      aria-label="Хлебные крошки"
      className="flex items-center gap-1 text-xs text-muted"
    >
      <Link
        to={catalogFilterPath({ categoryId })}
        className="transition-colors hover:text-foreground"
      >
        {categoryName}
      </Link>

      {subcategoryName && (
        <>
          <FiChevronRight size={12} className="shrink-0" />
          <Link
            to={catalogFilterPath({ subcategoryId })}
            className="text-foreground transition-colors hover:text-primary"
          >
            {subcategoryName}
          </Link>
        </>
      )}
    </nav>
  );
}
