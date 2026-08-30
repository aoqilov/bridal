/** Garderobdagi kiyim turlari — tovar qaysi bo'limga tushishini belgilaydi */
export type OutfitCategory = 'dress' | 'bag' | 'shoes' | 'veil' | 'jewelry';

export const OUTFIT_CATEGORIES: OutfitCategory[] = [
  'dress',
  'bag',
  'shoes',
  'veil',
  'jewelry',
];

export const OUTFIT_CATEGORY_LABELS: Record<OutfitCategory, string> = {
  dress: 'Платье',
  bag: 'Сумка',
  shoes: 'Туфли',
  veil: 'Фата',
  jewelry: 'Украшения',
};

/**
 * Garderobga olish uchun ochiq bo'limlar — qolganlari qulflangan ("скоро").
 * Yangi bo'lim tayyor bo'lganda shu ro'yxatga qo'shiladi.
 */
export const UNLOCKED_CATEGORIES: OutfitCategory[] = ['dress', 'veil', 'jewelry'];

/**
 * Примерка uchun tanlanishi shart bo'lgan bo'limlar — qolganlari ixtiyoriy
 * ("Без фаты" kabi katakcha bilan o'tkazib yuborsa bo'ladi).
 */
export const REQUIRED_CATEGORIES: OutfitCategory[] = ['dress'];

/** URL parametridan kelgan qiymatni tekshiradi (`/profile?pick=dress`) */
export function isOutfitCategory(value: string | null): value is OutfitCategory {
  return value !== null && (OUTFIT_CATEGORIES as string[]).includes(value);
}
