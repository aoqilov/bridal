import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CatalogItem, ItemKind } from '../helper.types.catalog';

const PARAM_KIND = 'kind';

export type KindValue = ItemKind | 'all';

/** Ko'ylak / aksessuar tabi — holat URL'da saqlanadi */
export function useKindFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const kind = useMemo<KindValue>(() => {
    const raw = searchParams.get(PARAM_KIND);
    return raw === 'dress' || raw === 'accessory' ? raw : 'all';
  }, [searchParams]);

  const setKind = useCallback(
    (next: KindValue) => {
      setSearchParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          if (next === 'all') p.delete(PARAM_KIND);
          else p.set(PARAM_KIND, next);
          return p;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const matches = useCallback(
    (item: CatalogItem): boolean => kind === 'all' || item.kind === kind,
    [kind],
  );

  return { kind, setKind, matches };
}
