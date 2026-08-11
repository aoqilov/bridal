import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FavoritesState = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
  count: () => number;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((state) => {
          const exists = state.ids.includes(id);
          return {
            ids: exists ? state.ids.filter((x) => x !== id) : [...state.ids, id],
          };
        }),
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
      count: () => get().ids.length,
    }),
    { name: 'bridal-favorites' },
  ),
);
