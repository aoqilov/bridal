import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Bitta bo'limdan garderobga olinadigan buyumlar soni.
 * Faqat `id` saqlanadi, shuning uchun chegarani oshirish localStorage'ga
 * deyarli bosim bermaydi (yuz suratlari — `MAX_PHOTOS` — bundan farqli).
 */
export const MAX_PICKED = 10;

/** Garderobga olingan tovar — `CatalogItem.id` va u tushgan bo'lim */
export type PickedItem = {
  id: string;
  category: string;
};

/** Tayyor bo'lgan примерка rasmi — "Изображения" bo'limida ko'rinadi */
export type GeneratedImage = {
  id: string;
  image: string;
  createdAt: string;
};

/**
 * Tayyor примерка videosi.
 *
 * `url` — OpenRouter tomonidagi manzil, ya'ni u vaqt o'tib ishlamay qolishi mumkin.
 * Shuning uchun `poster` (video yasalgan rasm) ham saqlanadi: havola o'lsa ham
 * galereyada nima borligi ko'rinib turadi. Doimiy saqlash uchun video o'z
 * saqlagichimizga ko'chirilishi kerak — bu server paydo bo'lgandan keyin.
 */
export type GeneratedVideo = {
  id: string;
  url: string;
  /** Birinchi kadr — video yasalgan примерка rasmi */
  poster: string;
  createdAt: string;
};

export type WardrobeState = {
  picked: PickedItem[];
  /** Har bo'lim uchun alohida faol buyum — образ qismlari bir-birini o'chirmaydi */
  selected: Record<string, string | null>;
  /** "Настройка модели" tanlovlari: guruh kaliti → variant qiymati */
  model: Record<string, string>;
  /** Model parametrini tanlash; `null` — tanlovni bekor qiladi */
  setModelOption: (key: string, value: string | null) => void;
  /** Olish / qaytarish. Bo'lim chegarasi to'lgan bo'lsa `false` qaytadi */
  toggle: (id: string, category: string) => boolean;
  /** Garderobdan chiqarish */
  remove: (id: string, category: string) => void;
  select: (id: string | null, category: string) => void;
  /** Bo'limdan nechta buyum olinganini qaytaradi */
  countIn: (category: string) => number;
  /** Tayyor bo'lgan примерка rasmlari — yangisi birinchi */
  generated: GeneratedImage[];
  /** `addGenerated` yangi yozuvning `id` sini qaytaradi — tasdiqlash oqimi shunga tayanadi */
  addGenerated: (image: string) => string;
  removeGenerated: (id: string) => void;
  /** Tayyor videolar — yangisi birinchi */
  videos: GeneratedVideo[];
  addVideo: (url: string, poster: string) => string;
  removeVideo: (id: string) => void;
};

/** Yozuv identifikatori — rasm va video uchun umumiy */
function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Eski (v1) shakl — `picked` faqat id'lar ro'yxati bo'lgan */
type LegacyState = {
  picked?: string[];
  selected?: Record<string, string | null>;
};

/** Sevimlilardan garderobga olingan tovarlar — примерка qatorlari shulardan tuziladi */
export const useWardrobeStore = create<WardrobeState>()(
  persist(
    (set, get) => ({
      picked: [],
      selected: {},
      model: {},
      generated: [],
      videos: [],
      addGenerated: (image) => {
        const id = newId();
        set((state) => ({
          generated: [
            { id, image, createdAt: new Date().toISOString() },
            ...state.generated,
          ],
        }));
        return id;
      },
      removeGenerated: (id) =>
        set((state) => ({ generated: state.generated.filter((x) => x.id !== id) })),
      addVideo: (url, poster) => {
        const id = newId();
        set((state) => ({
          videos: [
            { id, url, poster, createdAt: new Date().toISOString() },
            ...state.videos,
          ],
        }));
        return id;
      },
      removeVideo: (id) =>
        set((state) => ({ videos: state.videos.filter((x) => x.id !== id) })),
      setModelOption: (key, value) =>
        set((state) => {
          const model = { ...state.model };
          if (value === null) delete model[key];
          else model[key] = value;
          return { model };
        }),
      countIn: (category) => get().picked.filter((x) => x.category === category).length,
      toggle: (id, category) => {
        const state = get();
        if (state.picked.some((x) => x.id === id)) {
          state.remove(id, category);
          return true;
        }
        if (state.countIn(category) >= MAX_PICKED) return false;
        // Yangi olingan buyum darrov faol bo'ladi — foydalanuvchi shuni kiymoqchi
        set({
          picked: [...state.picked, { id, category }],
          selected: { ...state.selected, [category]: id },
        });
        return true;
      },
      remove: (id, category) =>
        set((state) => ({
          picked: state.picked.filter((x) => x.id !== id),
          selected:
            state.selected[category] === id
              ? { ...state.selected, [category]: null }
              : state.selected,
        })),
      select: (id, category) =>
        set((state) => ({ selected: { ...state.selected, [category]: id } })),
    }),
    {
      name: 'bridal-wardrobe',
      version: 2,
      // v1 da faqat "Платье" bo'limi ochiq edi — saqlangan id'lar o'shanga tegishli
      migrate: (persisted, version) => {
        if (version >= 2) return persisted as WardrobeState;
        const old = (persisted ?? {}) as LegacyState;
        return {
          picked: (old.picked ?? []).map((id) => ({ id, category: 'dress' })),
          selected: old.selected ?? {},
          model: {},
          generated: [],
        } as unknown as WardrobeState;
      },
    },
  ),
);
