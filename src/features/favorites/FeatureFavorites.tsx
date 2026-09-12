import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LuHeart } from 'react-icons/lu';
import { ROUTES } from '@/constants/routes';
import { useFavoritesStore } from '@/store/zustand';
import { MOCK_CATALOG, getItemById, type CatalogItem } from '@/features/catalog';
import ItemCard from '@/features/catalog/components/ItemCard';

export default function FeatureFavorites() {
  const ids = useFavoritesStore((s) => s.ids);
  const clear = useFavoritesStore((s) => s.clear);

  const items = useMemo(
    () =>
      ids
        .map((id) => getItemById(id, MOCK_CATALOG))
        .filter((i): i is CatalogItem => i !== null),
    [ids],
  );

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col">
      <header className="flex items-center justify-between px-4 pb-3 pt-5">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <LuHeart size={20} className="text-danger" />
          Избранное
        </h1>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="text-xs font-medium text-muted transition hover:text-danger"
          >
            Очистить
          </button>
        )}
      </header>

      {items.length === 0 ? (
        <section className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-surface-2 text-subtle">
            <LuHeart size={28} />
          </span>
          <h2 className="text-base font-semibold text-foreground">Пока пусто</h2>
          <p className="text-sm text-muted">
            Отмечайте понравившиеся платья сердечком — они появятся здесь, и на примерке
            мы подготовим их заранее.
          </p>
          <Link
            to={ROUTES.CATALOG}
            className="mt-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg hover:bg-accent-hover"
          >
            В каталог
          </Link>
        </section>
      ) : (
        <section className="p-4">
          <p className="mb-3 text-xs text-muted">
            Сохранено: <span className="font-semibold text-foreground">{items.length}</span>
          </p>
          <div className="grid grid-cols-2 gap-3">
            {items.map((i) => (
              <ItemCard key={i.id} item={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
