import type { Transition } from 'framer-motion';

/**
 * Обзор gridi va chap rail bir xil `layoutId` ishlatadi —
 * shu sabab plitka bosilganda rail'dagi o'z o'rniga "uchib" boradi.
 */
export function categoryLayoutId(categoryId: string): string {
  return `category-tile-${categoryId}`;
}

export const CATEGORY_SPRING: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 38,
  mass: 0.9,
};

/** `prefers-reduced-motion` yoqilganda — o'tish darhol */
export const INSTANT: Transition = { duration: 0 };
