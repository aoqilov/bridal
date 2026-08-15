import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const VIEW_MODES = ['categories', 'grid-3', 'grid-2', 'post'] as const;
export type ViewMode = (typeof VIEW_MODES)[number];

const PARAM_VIEW = 'view';
const DEFAULT_VIEW: ViewMode = 'grid-2';

/** Katalog ko'rinish rejimi — holat URL'da (`?view=categories`), layout ham shuni o'qiydi */
export function useViewMode() {
  const [searchParams, setSearchParams] = useSearchParams();

  const view = useMemo<ViewMode>(() => {
    const raw = searchParams.get(PARAM_VIEW) as ViewMode | null;
    return raw && VIEW_MODES.includes(raw) ? raw : DEFAULT_VIEW;
  }, [searchParams]);

  const setView = useCallback(
    (next: ViewMode) => {
      setSearchParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          if (next === DEFAULT_VIEW) p.delete(PARAM_VIEW);
          else p.set(PARAM_VIEW, next);
          return p;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { view, setView };
}
