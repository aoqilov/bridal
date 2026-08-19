export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  ITEM: '/catalog/:slug',
  NEW_ARRIVALS: '/new',
  BOOKING: '/booking',
  FAVORITES: '/favorites',
  REVIEW: '/review',
  REVIEW_DETAIL: '/review/:id',
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

/**
 * Katalogni tayyor filtr bilan ochish — "хлебные крошки" havolalari uchun.
 * Param nomlari `features/catalog/hooks/useCategoryFilter.ts` bilan bir xil.
 */
export function catalogFilterPath(filter: {
  categoryId?: string;
  subcategoryId?: string;
}): string {
  const params = new URLSearchParams();
  if (filter.subcategoryId) params.set('subs', filter.subcategoryId);
  else if (filter.categoryId) params.set('cats', filter.categoryId);
  const query = params.toString();
  return query ? `${ROUTES.CATALOG}?${query}` : ROUTES.CATALOG;
}

/** Sharh detali — rasmlar galereyasi va belgilangan tovar */
export function reviewPath(id: string): string {
  return `/review/${id}`;
}

export function newsPath(slug: string): string {
  return `/news/${slug}`;
}

export function promotionPath(slug: string): string {
  return `/promotions/${slug}`;
}

/** Bron sahifasi — tanlangan tovar bilan ochish uchun */
export function bookingPath(itemId?: string): string {
  return itemId ? `/booking?item=${encodeURIComponent(itemId)}` : '/booking';
}

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
