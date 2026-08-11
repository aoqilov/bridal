import { FiChevronRight } from 'react-icons/fi';

type Props = {
  categoryName?: string;
  subcategoryName?: string;
};

export default function Breadcrumb({ categoryName, subcategoryName }: Props) {
  if (!categoryName) return null;

  return (
    <nav
      aria-label="Хлебные крошки"
      className="flex items-center gap-1 text-xs text-muted"
    >
      <span>{categoryName}</span>
      {subcategoryName && (
        <>
          <FiChevronRight size={12} className="shrink-0" />
          <span className="text-foreground">{subcategoryName}</span>
        </>
      )}
    </nav>
  );
}
