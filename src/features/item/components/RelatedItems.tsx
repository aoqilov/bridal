import type { CatalogItem } from '@/features/catalog';
import ItemCard from '@/features/catalog/components/ItemCard';

type Props = {
  items: CatalogItem[];
};

export default function RelatedItems({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="pt-6">
      <h2 className="mb-3 px-4 text-sm font-medium text-foreground">Похожие модели</h2>
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((p) => (
          <div key={p.id} className="w-44 shrink-0">
            <ItemCard item={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
