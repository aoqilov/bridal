import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { CATALOG_CATEGORIES_PATH } from '@/constants/routes';
import type { CatalogItem } from '@/features/catalog';
import ItemCard from '@/features/catalog/components/ItemCard';
import SectionTitle from './SectionTitle';

type Props = {
  items: CatalogItem[];
};

export default function RelatedItems({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="pt-8">
      <div className="px-4">
        <SectionTitle
          action={
            <Link
              to={CATALOG_CATEGORIES_PATH}
              className="flex shrink-0 items-center gap-1 text-[9.5px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
            >
              В каталог
              <FiChevronRight size={13} />
            </Link>
          }
        >
          Похожие модели
        </SectionTitle>
      </div>

      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((p) => (
          <div key={p.id} className="w-44 shrink-0 snap-start">
            <ItemCard item={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
