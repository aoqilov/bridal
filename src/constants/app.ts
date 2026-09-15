export const APP_NAME = 'Amira Bridal';
export const APP_VERSION = '1.0.0';

/** Header'da ko'rinadigan nom — brend nomidan farq qilishi mumkin */
export const HEADER_TITLE = 'iCatalog';
/**
 * Header logotipi — `public/` ichidagi fayl (Vite uni ildizdan uzatadi).
 * Fayl qo'yilmagan bo'lsa header faqat matnni ko'rsatadi.
 */
export const HEADER_LOGO_SRC = '/assets/icons/logo.svg';
/**
 * Tovar sahifasidagi «Бренд» qatori — tovarda `brand` yozilmagan bo'lsa shu chiqadi.
 * Salon o'z nomi ostida sotadi, shuning uchun header nomi bilan bitta manba.
 */
export const DEFAULT_BRAND = HEADER_TITLE;
/** Tovarda `origin` yo'q bo'lsa — «Производство» qatoridagi standart qiymat */
export const DEFAULT_ORIGIN = 'Узбекистан';

/** Barcha localStorage kalitlari shu prefiks bilan */
export const STORAGE_PREFIX = 'bridal-';
export const APP_LOCALE = 'ru-RU';
export const APP_CURRENCY = 'UZS' as const;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

/** Примерка uchun ish vaqti oralig'i */
export const FITTING_SLOTS = [
  '10:00',
  '11:30',
  '13:00',
  '14:30',
  '16:00',
  '17:30',
] as const;

/** Bir necha kun oldindan bron qilish mumkin */
export const BOOKING_MAX_DAYS_AHEAD = 90;

/** Ijara muddati (kun) — narx shu muddat uchun */
export const RENT_PERIOD_DAYS = 3;
