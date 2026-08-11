import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdFavoriteBorder } from 'react-icons/md';
import { ROUTES } from '@/constants/routes';
import { MOCK_CATALOG, getItemById } from '@/features/catalog';
import ItemCard from '@/features/catalog/components/ItemCard';
import { useFavoritesStore } from '@/store/zustand';

const PREVIEW_COUNT = 6;

export default function FavoritesSection() {
  const ids = useFavoritesStore((s) => s.ids);
  const clear = useFavoritesStore((s) => s.clear);

  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Tasdiqlash holati 3 soniyadan keyin o'zi bekor bo'ladi
  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(timer);
  }, [confirming]);

  const items = useMemo(
    () =>
      ids
        .map((id) => getItemById(id, MOCK_CATALOG))
        .filter((p): p is NonNullable<typeof p> => p !== null),
    [ids],
  );

  const visible = expanded ? items : items.slice(0, PREVIEW_COUNT);

  return (
    <section id="profile-favorites" className="scroll-mt-4">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="text-base font-bold text-foreground">
          Избранное
          {items.length > 0 && (
            <span className="ml-1.5 text-sm font-normal text-muted">
              {items.length}
            </span>
          )}
        </h2>

        {items.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (confirming) {
                clear();
                setConfirming(false);
              } else {
                setConfirming(true);
              }
            }}
            className={
              confirming
                ? 'text-xs font-semibold text-danger'
                : 'text-xs font-semibold text-muted hover:text-danger'
            }
          >
            {confirming ? 'Точно очистить?' : 'Очистить'}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mx-4 flex flex-col items-center gap-2 rounded-2xl bg-surface px-4 py-8 text-center shadow-card">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-2 text-muted">
            <MdFavoriteBorder size={24} />
          </span>
          <p className="text-sm font-semibold text-foreground">Здесь пока пусто</p>
          <p className="max-w-[15rem] text-xs text-muted">
            Нажмите на сердечко у товара — он появится в этом списке.
          </p>
          <Link
            to={ROUTES.CATALOG}
            className="mt-1 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-fg transition hover:bg-primary-hover"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 px-4">
            {visible.map((p) => (
              <ItemCard key={p.id} item={p} />
            ))}
          </div>

          {items.length > PREVIEW_COUNT && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mx-4 mt-3 w-[calc(100%-2rem)] rounded-xl border border-border-subtle bg-surface py-2.5 text-xs font-semibold text-foreground transition hover:bg-surface-2"
            >
              {expanded ? 'Свернуть' : `Показать все (${items.length})`}
            </button>
          )}
        </>
      )}
    </section>
  );
}
