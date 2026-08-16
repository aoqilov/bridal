import { MdCalendarMonth } from 'react-icons/md';
import { cn } from '@/utils/cn';

type Props = {
  label: string;
  /** Berilsa — ajratgich bosiladigan bo'ladi (kalendar ochish uchun) */
  onClick?: () => void;
  className?: string;
};

/** Lentadagi kun ajratgichi — Telegram uslubidagi markazlashgan yorliq */
export default function CusDayDivider({ label, onClick, className }: Props) {
  const content = (
    <>
      <MdCalendarMonth size={13} />
      {label}
    </>
  );

  const base =
    'flex items-center gap-1.5 rounded-full bg-overlay-dark px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur';

  return (
    <div className={cn('sticky top-0 z-[5] flex justify-center py-2', className)}>
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          aria-label="Выбрать дату"
          className={cn(base, 'transition hover:bg-overlay-dark-strong')}
        >
          {content}
        </button>
      ) : (
        <span className={base}>{content}</span>
      )}
    </div>
  );
}
