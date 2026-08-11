import { Link } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';
import type { CatalogItem } from '@/features/catalog';
import ItemCard from '@/features/catalog/components/ItemCard';

type Props = {
  items: CatalogItem[];
  title: string;
  moreTo: string;
};

/** Home sahifasidagi gorizontal karusel — tanlangan modellar */
export default function FeaturedItems({ items, title, moreTo }: Props) {
  if (items.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="font-serif text-lg font-semibold text-foreground">{title}</h2>
        <Link
          to={moreTo}
          className="flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
        >
          Все
          <MdChevronRight size={16} />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <div key={item.id} className="w-44 shrink-0">
            <ItemCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
