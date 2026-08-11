import { Link } from 'react-router-dom';
import { FaTelegram } from 'react-icons/fa';
import { FiCopy } from 'react-icons/fi';
import { LuCalendarHeart } from 'react-icons/lu';
import { bookingPath } from '@/constants/routes';

type Props = {
  itemId: string;
  onTelegram: () => void;
  onCopy: () => void;
};

export default function ItemActions({ itemId, onTelegram, onCopy }: Props) {
  return (
    <div className="sticky bottom-0 z-10 border-t border-border-subtle bg-background/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center gap-2">
        <button
          type="button"
          onClick={onCopy}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-border bg-surface text-foreground hover:bg-surface-2"
          aria-label="Скопировать ссылку"
          title="Скопировать ссылку"
        >
          <FiCopy size={18} />
        </button>
        <button
          type="button"
          onClick={onTelegram}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-border bg-surface text-foreground hover:bg-surface-2"
          aria-label="Написать в Telegram"
          title="Написать в Telegram"
        >
          <FaTelegram size={18} />
        </button>
        <Link
          to={bookingPath(itemId)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover"
        >
          <LuCalendarHeart size={18} />
          Записаться на примерку
        </Link>
      </div>
    </div>
  );
}
