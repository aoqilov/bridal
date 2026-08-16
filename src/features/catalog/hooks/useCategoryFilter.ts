import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CatalogItem } from '../helper.types.catalog';

const PARAM_CATS = 'cats';
const PARAM_SUBS = 'subs';

function toSet(param: string | null): Set<string> {
  if (!param) return new Set();
  return new Set(param.split(',').filter(Boolean));
}

function setToParam(set: Set<string>): string | null {
  return set.size > 0 ? [...set].join(',') : null;
}

export function useCategoryFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategoryIds = useMemo(
    () => toSet(searchParams.get(PARAM_CATS)),
    [searchParams],
  );
  const selectedSubcategoryIds = useMemo(
    () => toSet(searchParams.get(PARAM_SUBS)),
    [searchParams],
  );

  const commit = useCallback(
    (cats: Set<string>, subs: Set<string>) => {
      setSearchParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          const catValue = setToParam(cats);
          const subValue = setToParam(subs);
          if (catValue) p.set(PARAM_CATS, catValue);
          else p.delete(PARAM_CATS);
          if (subValue) p.set(PARAM_SUBS, subValue);
          else p.delete(PARAM_SUBS);
          return p;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // "Все" checkbox — kategoriya butunligicha
  const toggleCategory = useCallback(
    (categoryId: string, subIds: string[] = []) => {
      const cats = new Set(selectedCategoryIds);
      const subs = new Set(selectedSubcategoryIds);
      if (cats.has(categoryId)) {
        cats.delete(categoryId);
      } else {
        cats.add(categoryId);
        // "Все" tanlandi — bu kategoriyaning alohida sub'lari endi ortiqcha
        subIds.forEach((s) => subs.delete(s));
      }
      commit(cats, subs);
    },
    [selectedCategoryIds, selectedSubcategoryIds, commit],
  );

  // Alohida subkategoriya chip
  const toggleSubcategory = useCallback(
    (subcategoryId: string, categoryId: string) => {
      const cats = new Set(selectedCategoryIds);
      const subs = new Set(selectedSubcategoryIds);
      // Agar "Все" yoqilgan bo'lsa, alohida sub'lar ishlamaydi (UI blokladi ham)
      if (cats.has(categoryId)) return;
      if (subs.has(subcategoryId)) subs.delete(subcategoryId);
      else subs.add(subcategoryId);
      commit(cats, subs);
    },
    [selectedCategoryIds, selectedSubcategoryIds, commit],
  );

  /** Faqat shu kategoriya qolsin — subkategoriyasiz kategoriyani ochishda */
  const selectOnly = useCallback(
    (categoryId: string) => {
      commit(new Set([categoryId]), new Set());
    },
    [commit],
  );

  const clear = useCallback(() => {
    commit(new Set(), new Set());
  }, [commit]);

  const matches = useCallback(
    (item: CatalogItem): boolean => {
      if (selectedCategoryIds.size === 0 && selectedSubcategoryIds.size === 0) return true;
      if (selectedCategoryIds.has(item.categoryId)) return true;
      if (item.subcategoryId && selectedSubcategoryIds.has(item.subcategoryId)) return true;
      return false;
    },
    [selectedCategoryIds, selectedSubcategoryIds],
  );

  const count = selectedCategoryIds.size + selectedSubcategoryIds.size;

  return {
    selectedCategoryIds,
    selectedSubcategoryIds,
    toggleCategory,
    toggleSubcategory,
    selectOnly,
    clear,
    matches,
    count,
  };
}
