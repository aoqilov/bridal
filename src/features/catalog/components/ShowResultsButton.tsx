import { FiArrowRight, FiLink } from 'react-icons/fi';

type Props = {
  count: number;
  onClick: () => void;
  onClear: () => void;
  onCopy?: () => void;
  showCopy?: boolean;
};

export default function ShowResultsButton({
  count,
  onClick,
  onClear,
  onCopy,
  showCopy = false,
}: Props) {
  return (
    <div className="sticky bottom-0 z-10 border-t border-border-subtle bg-background/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center gap-2">
        {showCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-surface text-primary hover:bg-primary-soft"
            aria-label="Копировать ссылку"
            title="Копировать ссылку"
          >
            <FiLink size={18} />
          </button>
        )}
        <button
          type="button"
          onClick={onClear}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground hover:bg-surface-2"
        >
          Сбросить
        </button>
        <button
          type="button"
          onClick={onClick}
          disabled={count === 0}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {count > 0 ? (
            <>
              Показать {count} {declineTovar(count)}
              <FiArrowRight size={16} />
            </>
          ) : (
            'Нет товаров под фильтр'
          )}
        </button>
      </div>
    </div>
  );
}

function declineTovar(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'товар';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'товара';
  return 'товаров';
}
