import { useMemo } from 'react';
import { BOOKING_MAX_DAYS_AHEAD } from '@/constants/app';
import { useBookingStore } from '@/store/zustand';
import { MOCK_CATALOG, getItemById } from '@/features/catalog';

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

/**
 * Примерка uchun ochiq sanalar: bugundan BOOKING_MAX_DAYS_AHEAD kungacha,
 * tovarning band kunlari va foydalanuvchining mavjud bronlari chiqarib tashlanadi.
 */
export function useAvailableDates(itemId?: string) {
  const bookings = useBookingStore((s) => s.bookings);

  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const min = toISODate(today);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + BOOKING_MAX_DAYS_AHEAD);
    const max = toISODate(maxDate);

    const item = itemId ? getItemById(itemId, MOCK_CATALOG) : null;
    const blocked = new Set<string>(item?.bookedDates ?? []);
    for (const b of bookings) {
      if (b.status !== 'cancelled' && b.itemId === itemId) blocked.add(b.date);
    }

    const availableDates: string[] = [];
    for (let i = 0; i <= BOOKING_MAX_DAYS_AHEAD; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const iso = toISODate(d);
      if (!blocked.has(iso)) availableDates.push(iso);
    }

    return { availableDates, blockedDates: [...blocked], min, max };
  }, [itemId, bookings]);
}
