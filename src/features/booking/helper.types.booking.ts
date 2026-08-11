export const BOOKING_TYPES = ['fitting', 'rent'] as const;
export type BookingType = (typeof BOOKING_TYPES)[number];

export const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled'] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type Booking = {
  id: string;
  /** Tanlangan tovar (bo'sh bo'lishi mumkin — umumiy примерка) */
  itemId?: string;
  itemName?: string;
  variantId?: string;
  size?: string;
  type: BookingType;
  /** "YYYY-MM-DD" */
  date: string;
  /** "14:30" */
  time: string;
  name: string;
  phone: string;
  comment?: string;
  status: BookingStatus;
  createdAt: string;
};

/** Formadan keladigan qiymatlar */
export type BookingDraft = Omit<Booking, 'id' | 'status' | 'createdAt'>;
