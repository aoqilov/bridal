import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CatalogItem } from '../helper.types.catalog';
import { itemAttributeValues, type AttributeKey } from '../utils/filterOptions';

/** URL parametri nomi = xususiyat kaliti (`?brands=Amira,Rosa`) */
const KEYS: AttributeKey[] = ['brands', 'colors', 'materials', 'stones'];

function toSet(param: string | null): Set<string> {
  if (!param) return new Set();
  return new Set(param.split(',').filter(Boolean));
}

/**
 * Brend / rang / material / tosh filtri — kategoriya filtridan alohida
 * (`useCategoryFilter`), chunki bular tovarning xususiyati, joylashuvi emas.
 * Holat URL'da: havolani ulashganda tanlov ham ketadi.
 */
export function useAttributeFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selected = useMemo<Record<AttributeKey, Set<string>>>(
    () => ({
      brands: toSet(searchParams.get('brands')),
      colors: toSet(searchParams.get('colors')),
      materials: toSet(searchParams.get('materials')),
      stones: toSet(searchParams.get('stones')),
    }),
    [searchParams],
  );

  const toggle = useCallback(
    (key: AttributeKey, value: string) => {
      setSearchParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          const next = toSet(p.get(key));
          if (next.has(value)) next.delete(value);
          else next.add(value);
          if (next.size > 0) p.set(key, [...next].join(','));
          else p.delete(key);
          return p;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const clear = useCallback(() => {
    setSearchParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        KEYS.forEach((key) => p.delete(key));
        return p;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  /** Har bo'lim ichida — "yoki", bo'limlar orasida — "va" */
  const matches = useCallback(
    (item: CatalogItem): boolean =>
      KEYS.every((key) => {
        const wanted = selected[key];
        if (wanted.size === 0) return true;
        return itemAttributeValues(item, key).some((value) => wanted.has(value));
      }),
    [selected],
  );

  const count = KEYS.reduce((sum, key) => sum + selected[key].size, 0);

  return { selected, toggle, clear, matches, count };
}
