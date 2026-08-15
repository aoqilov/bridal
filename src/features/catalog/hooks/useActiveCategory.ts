import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Category } from '../helper.types.catalog';

const PARAM_CAT = 'cat';

/** Chap ustundagi birinchi element — barcha kategoriyalar birdaniga */
export const ALL_CATEGORY_ID = 'all';

/**
 * Chap ustunda tanlangan kategoriya — holat URL'da (`?cat=wedding`).
 * Default va noma'lum id — «Все»: o'ng panelda hamma kategoriya bo'limlari chiqadi.
 */
export function useActiveCategory(categories: Category[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get(PARAM_CAT);

  const activeCategoryId = useMemo(() => {
    if (!raw || raw === ALL_CATEGORY_ID) return ALL_CATEGORY_ID;
    return categories.some((c) => c.id === raw) ? raw : ALL_CATEGORY_ID;
  }, [raw, categories]);

  // O'ng panelda ko'rsatiladigan bo'limlar: bitta kategoriya yoki hammasi
  const visibleCategories = useMemo(
    () =>
      activeCategoryId === ALL_CATEGORY_ID
        ? categories
        : categories.filter((c) => c.id === activeCategoryId),
    [activeCategoryId, categories],
  );

  const setActiveCategoryId = useCallback(
    (id: string) => {
      setSearchParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          if (id === ALL_CATEGORY_ID) p.delete(PARAM_CAT);
          else p.set(PARAM_CAT, id);
          return p;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { activeCategoryId, visibleCategories, setActiveCategoryId };
}
