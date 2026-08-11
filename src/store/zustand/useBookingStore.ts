import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Booking, BookingDraft } from '@/features/booking/helper.types.booking';

type BookingState = {
  bookings: Booking[];
  add: (draft: BookingDraft) => Booking;
  cancel: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  /** Shu tovar uchun band qilingan sanalar */
  datesForItem: (itemId: string) => string[];
};

function makeId(): string {
  return `bk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],

      add: (draft) => {
        const booking: Booking = {
          ...draft,
          id: makeId(),
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ bookings: [booking, ...state.bookings] }));
        return booking;
      },

      cancel: (id) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, status: 'cancelled' } : b,
          ),
        })),

      remove: (id) =>
        set((state) => ({ bookings: state.bookings.filter((b) => b.id !== id) })),

      clear: () => set({ bookings: [] }),

      datesForItem: (itemId) =>
        get()
          .bookings.filter((b) => b.itemId === itemId && b.status !== 'cancelled')
          .map((b) => b.date),
    }),
    { name: 'bridal-bookings' },
  ),
);
