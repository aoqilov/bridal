import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Category } from '../helper.types.catalog';

const PARAM_CAT = 'cat';

/**
 * Chap ustunda tanlangan kategoriya — holat URL'da (`?cat=wedding`).
 * Ro'yxatda yo'q id kelsa (masalan kind tabi almashsa) birinchi kategoriyaga tushadi.
 */
export function useActiveCategory(categories: Category[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get(PARAM_CAT);

  const activeCategory = useMemo(() => {
    const found = raw ? categories.find((c) => c.id === raw) : undefined;
    return found ?? categories[0] ?? null;
  }, [raw, categories]);

  const setActiveCategoryId = useCallback(
    (id: string) => {
      setSearchParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          p.set(PARAM_CAT, id);
          return p;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { activeCategory, activeCategoryId: activeCategory?.id ?? null, setActiveCategoryId };
}
