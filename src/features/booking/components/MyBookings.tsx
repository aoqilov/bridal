import { Link } from 'react-router-dom';
import { LuCalendarCheck, LuX } from 'react-icons/lu';
import { APP_LOCALE } from '@/constants/app';
import { itemPath } from '@/constants/routes';
import { cn } from '@/utils/cn';
import { MOCK_CATALOG, getItemById } from '@/features/catalog';
import type { Booking, BookingStatus } from '../helper.types.booking';

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Ожидает подтверждения',
  confirmed: 'Подтверждено',
  cancelled: 'Отменено',
};

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: 'bg-warning-soft text-warning',
  confirmed: 'bg-success-soft text-success',
  cancelled: 'bg-danger-soft text-danger',
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(APP_LOCALE, {
    day: 'numeric',
    month: 'long',
    weekday: 'short',
  });
}

type Props = {
  bookings: Booking[];
  onCancel: (id: string) => void;
};

export default function MyBookings({ bookings, onCancel }: Props) {
  if (bookings.length === 0) return null;

  return (
    <section className="px-4 pt-6">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
        <LuCalendarCheck size={16} />
        Мои записи
      </h2>

      <ul className="space-y-2">
        {bookings.map((b) => {
          const item = b.itemId ? getItemById(b.itemId, MOCK_CATALOG) : null;
          return (
            <li
              key={b.id}
              className="rounded-2xl border border-border-subtle bg-surface p-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(b.date)} · {b.time}
                  </p>
                  {item ? (
                    <Link
                      to={itemPath(item.slug)}
                      className="line-clamp-1 text-xs text-primary hover:underline"
                    >
                      {item.name}
                      {b.size ? ` · ${b.size}` : ''}
                    </Link>
                  ) : (
                    <p className="text-xs text-muted">Общая примерка</p>
                  )}
                  <span
                    className={cn(
                      'mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium',
                      STATUS_STYLES[b.status],
                    )}
                  >
                    {STATUS_LABELS[b.status]}
                  </span>
                </div>

                {b.status !== 'cancelled' && (
                  <button
                    type="button"
                    onClick={() => onCancel(b.id)}
                    aria-label="Отменить запись"
                    title="Отменить запись"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-surface-2 hover:text-danger"
                  >
                    <LuX size={16} />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
