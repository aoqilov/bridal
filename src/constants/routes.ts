export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  ITEM: '/catalog/:slug',
  NEW_ARRIVALS: '/new',
  BOOKING: '/booking',
  FAVORITES: '/favorites',
  GARDEROB: '/garderob',
  PROFILE: '/profile',
  PROFILE_SETTINGS: '/profile/settings',
  PROFILE_EDIT: '/profile/edit',
  PREVIEW: '/preview',
  PROMOTIONS: '/promotions',
  PROMOTION_DETAIL: '/promotions/:slug',
  NEWS: '/news',
  NEWS_DETAIL: '/news/:slug',
} as const;

export function itemPath(slug: string): string {
  return `/catalog/${slug}`;
}

/** Katalogni "Категории" ko'rinishida ochish (param — `features/catalog/hooks/useViewMode.ts`) */
export const CATALOG_CATEGORIES_PATH = `${ROUTES.CATALOG}?view=categories`;

export function newsPath(slug: string): string {
  return `/news/${slug}`;
}

export function promotionPath(slug: string): string {
  return `/promotions/${slug}`;
}

/**
 * Profilni "garderobga tanlash" rejimida ochish — "Избранное" tab'i, berilgan
 * bo'lim va ko'p tanlash (`features/profile/FeatureProfile.tsx`).
 */
export function profilePickPath(category: string): string {
  return `${ROUTES.PROFILE}?pick=${encodeURIComponent(category)}`;
}

/** Bron sahifasi — tanlangan tovar bilan ochish uchun */
export function bookingPath(itemId?: string): string {
  return itemId ? `/booking?item=${encodeURIComponent(itemId)}` : '/booking';
}

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
