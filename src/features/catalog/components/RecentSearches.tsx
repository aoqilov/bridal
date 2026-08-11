import { FiClock, FiX } from 'react-icons/fi';

type Props = {
  items: string[];
  onSelect: (query: string) => void;
  onRemove: (query: string) => void;
  onClearAll: () => void;
};

export default function RecentSearches({ items, onSelect, onRemove, onClearAll }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="px-4 py-4">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FiClock size={16} className="text-muted" />
          Недавние
        </h2>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-primary hover:text-primary-hover"
        >
          Очистить всё
        </button>
      </header>

      <ul className="flex flex-wrap gap-2">
        {items.map((query) => (
          <li key={query}>
            <div className="flex items-center gap-1 rounded-full border border-border bg-surface pl-3 pr-1 text-sm">
              <button
                type="button"
                onClick={() => onSelect(query)}
                className="py-1.5 text-foreground hover:text-primary"
              >
                {query}
              </button>
              <button
                type="button"
                onClick={() => onRemove(query)}
                aria-label={`Удалить «${query}»`}
                className="grid h-6 w-6 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-foreground"
              >
                <FiX size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
