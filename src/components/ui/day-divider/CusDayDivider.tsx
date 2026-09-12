import { MdCalendarMonth } from 'react-icons/md';
import { cn } from '@/utils/cn';

type Props = {
  label: string;
  /** Berilsa — ajratgich bosiladigan bo'ladi (kalendar ochish uchun) */
  onClick?: () => void;
  className?: string;
};

/** Lentadagi kun ajratgichi — ikki yon chiziq orasidagi yorliq */
export default function CusDayDivider({ label, onClick, className }: Props) {
  const content = (
    <>
      <MdCalendarMonth size={12} className="shrink-0 text-primary" />
      {label}
    </>
  );

  const base =
    'inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-[9.5px] uppercase tracking-[0.14em] text-muted';

  return (
    <div
      className={cn(
        'sticky top-0 z-[5] flex items-center gap-3 bg-background px-4 py-2.5',
        className,
      )}
    >
      <span className="h-px flex-1 bg-border-subtle" aria-hidden />

      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          aria-label="Выбрать дату"
          className={cn(
            base,
            'transition-colors hover:border-primary hover:bg-surface-2',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          )}
        >
          {content}
        </button>
      ) : (
        <span className={base}>{content}</span>
      )}

      <span className="h-px flex-1 bg-border-subtle" aria-hidden />
    </div>
  );
}
