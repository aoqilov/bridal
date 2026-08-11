import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_ITEMS = 20;

type RecentlyViewedState = {
  /** Oxirgi ko'rilganlar — birinchi element eng yangisi */
  ids: string[];
  push: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      ids: [],
      push: (id) =>
        set((state) => ({
          ids: [id, ...state.ids.filter((x) => x !== id)].slice(0, MAX_ITEMS),
        })),
      remove: (id) => set((state) => ({ ids: state.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    { name: 'bridal-recent' },
  ),
);
