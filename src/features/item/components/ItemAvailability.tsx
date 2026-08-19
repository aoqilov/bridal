import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { MdOutlineEventAvailable, MdOutlineEventBusy } from 'react-icons/md';
import { bookingPath } from '@/constants/routes';
import type { CatalogItem } from '@/features/catalog';
import { formatDayLabel } from '@/utils/dayGroups';
import { plural } from '@/utils/plural';

type Props = {
  item: CatalogItem;
};

/** Bugundan boshlab band kunlar — o'tgan sanalar ko'rsatilmaydi */
function upcomingBookedDates(dates: string[] | undefined): string[] {
  if (!dates?.length) return [];
  const today = new Date().toISOString().slice(0, 10);
  return dates.filter((d) => d >= today).sort();
}

export default function ItemAvailability({ item }: Props) {
  const booked = upcomingBookedDates(item.bookedDates);
  const shown = booked.slice(0, 2);
  const rest = booked.length - shown.length;

  const busy = booked.length > 0;
  const Icon = busy ? MdOutlineEventBusy : MdOutlineEventAvailable;

  return (
    <Link
      to={bookingPath(item.id)}
      className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface px-3.5 py-3 transition-colors hover:bg-surface-2"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
        <Icon size={18} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-foreground">
          {item.isAvailable ? 'Свободна для примерки' : 'Сейчас нет в салоне'}
        </span>
        <span className="block text-xs text-muted">
          {busy
            ? `Занято: ${shown.map(formatDayLabel).join(', ')}${
                rest > 0
                  ? ` и ещё ${rest} ${plural(rest, ['дата', 'даты', 'дат'])}`
                  : ''
              }`
            : 'Ближайшие даты открыты — выберите удобное время'}
        </span>
      </span>

      <FiChevronRight size={18} className="shrink-0 text-subtle" />
    </Link>
  );
}
