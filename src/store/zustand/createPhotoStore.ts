import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Bo'limsiz to'plam kaliti (yuzlar) — kiyimlarda o'rniga tur kaliti keladi */
export const NO_CATEGORY = 'all';

/** Foydalanuvchi yuklagan surat — примерка uchun (yuz yoki kiyim) */
export type PhotoItem = {
  id: string;
  name: string;
  /** Bo'lim kaliti: 'dress' | 'bag' | ... ; yuzlarda — NO_CATEGORY */
  category: string;
  /** 320×320 jpeg data URL — `features/garderob/utils/fileToSquarePhoto.ts` */
  image: string;
  createdAt: string;
};

/** localStorage kvotasi cheklangan — har bir to'plamda shuncha surat saqlanadi */
export const MAX_PHOTOS = 5;

export type PhotoState = {
  items: PhotoItem[];
  /** Har bo'lim uchun alohida tanlov — образ qismlari bir-birini o'chirmaydi */
  selected: Record<string, string | null>;
  add: (image: string, category?: string) => void;
  remove: (id: string) => void;
  select: (id: string | null, category?: string) => void;
};

/** Eski (v0/v1) saqlangan ma'lumot shakli — migratsiya uchun */
type LegacyState = {
  faces?: PhotoItem[];
  items?: PhotoItem[];
  selectedId?: string | null;
};

/**
 * Surat to'plami uchun store yaratadi (yuzlar, kiyimlar — bir xil mantiq).
 * `storageKey` — localStorage kaliti, `namePrefix` — avtomatik nom ("Фото 1").
 */
export function createPhotoStore(storageKey: string, namePrefix: string) {
  return create<PhotoState>()(
    persist(
      (set) => ({
        items: [],
        selected: {},
        add: (image, category = NO_CATEGORY) =>
          set((state) => {
            if (state.items.length >= MAX_PHOTOS) return state;
            const inCategory = state.items.filter((x) => x.category === category);
            const item: PhotoItem = {
              id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
              name: `${namePrefix} ${inCategory.length + 1}`,
              category,
              image,
              createdAt: new Date().toISOString(),
            };
            // Yangi surat darrov tanlanadi — foydalanuvchi qo'shdi, demak ishlatmoqchi
            return {
              items: [...state.items, item],
              selected: { ...state.selected, [category]: item.id },
            };
          }),
        remove: (id) =>
          set((state) => {
            const gone = state.items.find((x) => x.id === id);
            const items = state.items.filter((x) => x.id !== id);
            if (!gone) return { items };
            // O'chirilgani tanlangan bo'lsa — shu bo'limdagi birinchisiga o'tadi
            const next = items.find((x) => x.category === gone.category) ?? null;
            return {
              items,
              selected:
                state.selected[gone.category] === id
                  ? { ...state.selected, [gone.category]: next?.id ?? null }
                  : state.selected,
            };
          }),
        select: (id, category = NO_CATEGORY) =>
          set((state) => ({ selected: { ...state.selected, [category]: id } })),
      }),
      {
        name: storageKey,
        version: 2,
        // v0 — `faces`, v1 — `items` + bitta `selectedId`; saqlangan suratlar yo'qolmasin
        migrate: (persisted, version) => {
          if (version >= 2) return persisted as PhotoState;
          const old = (persisted ?? {}) as LegacyState;
          const list = old.items ?? old.faces ?? [];
          // Amallar boshlang'ich state'dan qo'shiladi (persist shallow merge qiladi)
          return {
            items: list.map((x) => ({ ...x, category: x.category ?? NO_CATEGORY })),
            selected: { [NO_CATEGORY]: old.selectedId ?? null },
          } as unknown as PhotoState;
        },
      },
    ),
  );
}

export type PhotoStore = ReturnType<typeof createPhotoStore>;
