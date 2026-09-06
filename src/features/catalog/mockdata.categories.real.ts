// ================================================================
// REAL KATEGORIYALAR — public/assets/ dagi rasm to'plamlariga mos
// ================================================================
//
// Fayl nomlash sxemasi:
//   ko'ylak / tufli : <prefiks>-<model№>-<foto№>.<ext>   → w-sweetheart-2-1.jpg
//   aksessuar       : <prefiks>-<№>.<ext>                → toj-3.jpg
//
// Har bir prefiks aynan bitta subkategoriya (yoki kategoriya) ga tegishli —
// moslik `PREFIX_MAP` da qat'iy yozilgan, mockdata.real.ts shu yerdan foydalanadi.
// ================================================================

import type {
  AccessoryType,
  Category,
  ItemKind,
  Neckline,
} from './helper.types.catalog';
import { photo } from './mockdata.helpers';

export const REAL_CATEGORIES: Category[] = [
  // ================================================================
  // 0. KIYIM
  // ================================================================
  {
    id: 'wedding',
    slug: 'wedding',
    name: 'Свадебные платья',
    shortName: 'Платья',
    kind: 'dress',
    image: photo('w-sweetheart-1-1.jpg'),
    // Salon ko'ylaklarni yoqa shakli bo'yicha ajratgan (siluet bo'yicha emas)
    subcategories: [
      {
        id: 'wedding-sweetheart',
        slug: 'sweetheart',
        name: 'Сердечко',
        categoryId: 'wedding',
        image: photo('w-sweetheart-1-1.jpg'),
      },
      {
        id: 'wedding-v-neck',
        slug: 'v-neck',
        name: 'V-образный вырез',
        categoryId: 'wedding',
        image: photo('w-vneek-1-1.jpg'),
      },
      {
        id: 'wedding-square',
        slug: 'square',
        name: 'Квадратный вырез',
        categoryId: 'wedding',
        image: photo('w-square-2-1.jpg'),
      },
      {
        id: 'wedding-high-neck',
        slug: 'high-neck',
        name: 'Закрытый ворот',
        categoryId: 'wedding',
        image: photo('w-highneck-1-1.jpg'),
      },
      {
        id: 'wedding-one-shoulder',
        slug: 'one-shoulder',
        name: 'На одно плечо',
        categoryId: 'wedding',
        image: photo('w-onesh-1-1.jpg'),
      },
    ],
  },
  {
    id: 'hijab',
    slug: 'hijab',
    name: 'Платья с хиджабом',
    shortName: 'Хиджаб',
    kind: 'dress',
    image: photo('w-hj-barg-1-1.jpg'),
    subcategories: [
      {
        id: 'hijab-cape',
        slug: 'cape',
        name: 'С накидкой',
        categoryId: 'hijab',
        image: photo('w-hj-barg-1-1.jpg'),
      },
      {
        id: 'hijab-coat',
        slug: 'coat',
        name: 'Пальто-накидка',
        categoryId: 'hijab',
        image: photo('w-hj-palto-1-1.jpg'),
      },
      {
        id: 'hijab-stand-collar',
        slug: 'stand-collar',
        name: 'Воротник-стойка',
        categoryId: 'hijab',
        image: photo('w-hj-china-1-1.jpg'),
      },
    ],
  },

  // ================================================================
  // 0.1. OYOQ KIYIM
  // ================================================================
  {
    id: 'shoes',
    slug: 'shoes',
    name: 'Обувь',
    shortName: 'Обувь',
    kind: 'accessory',
    image: photo('shoes-classic-1-1.jpg'),
    subcategories: [
      {
        id: 'shoes-classic',
        slug: 'classic',
        name: 'Классические лодочки',
        categoryId: 'shoes',
        image: photo('shoes-classic-1-1.jpg'),
      },
      {
        id: 'shoes-flower',
        slug: 'flower',
        name: 'С цветами',
        categoryId: 'shoes',
        image: photo('shoes-classic-gul-1-1.jpg'),
      },
      {
        id: 'shoes-crystal',
        slug: 'crystal',
        name: 'С кристаллами',
        categoryId: 'shoes',
        image: photo('shoes-crystall-1-1.jpg'),
      },
      {
        id: 'shoes-block-heel',
        slug: 'block-heel',
        name: 'Устойчивый каблук',
        categoryId: 'shoes',
        image: photo('shoes-block-hell-1-1.jpg'),
      },
      {
        id: 'shoes-kitten-heel',
        slug: 'kitten-heel',
        name: 'Низкий каблук',
        categoryId: 'shoes',
        image: photo('shoes-kitten-hell-1-1.jpg'),
      },
      {
        id: 'shoes-strappy',
        slug: 'strappy',
        name: 'Босоножки',
        categoryId: 'shoes',
        image: photo('shoes-strapy-1-1.jpg'),
      },
    ],
  },

  // ================================================================
  // 1-6. AKSESSUARLAR — har biri bitta rasm to'plami, subkategoriyasiz
  // ================================================================
  {
    id: 'veils',
    slug: 'veils',
    name: 'Фата',
    shortName: 'Фата',
    kind: 'accessory',
    image: photo('fata-1.jpg'),
  },
  {
    id: 'hairpins',
    slug: 'hairpins',
    name: 'Заколки и гребни',
    shortName: 'Заколки',
    kind: 'accessory',
    image: photo('tish-1.jpg'),
  },
  {
    id: 'tiaras',
    slug: 'tiaras',
    name: 'Короны и ободки',
    shortName: 'Короны',
    kind: 'accessory',
    image: photo('toj-1.jpg'),
  },
  {
    id: 'jewelry',
    slug: 'jewelry',
    name: 'Наборы украшений',
    shortName: 'Украшения',
    kind: 'accessory',
    image: photo('nabor-1.jpg'),
  },
  {
    id: 'face-veils',
    slug: 'face-veils',
    name: 'Вуалетки',
    shortName: 'Вуалетки',
    kind: 'accessory',
    image: photo('setka-1.jpg'),
  },
  {
    id: 'gloves',
    slug: 'gloves',
    name: 'Перчатки',
    shortName: 'Перчатки',
    kind: 'accessory',
    image: photo('per-1.jpg'),
  },
  {
    id: 'bracelets',
    slug: 'bracelets',
    name: 'Браслеты на руку',
    shortName: 'Браслеты',
    kind: 'accessory',
    image: photo('hand-1.jpg'),
  },
];

// ================================================================
// Fayl prefiksi → kategoriya moslamasi
// ================================================================
// mockdata.real.ts ni to'ldirishda shu jadvalga tayaning: prefiksdan
// categoryId / subcategoryId / accessoryType avtomatik kelib chiqadi.

export type PrefixInfo = {
  categoryId: string;
  subcategoryId?: string;
  kind: ItemKind;
  /** Aksessuar bo'lsa — turi */
  accessoryType?: AccessoryType;
  /** Ko'ylak bo'lsa — yoqa shakli (prefiks aynan shuni bildiradi) */
  neckline?: Neckline;
  /**
   * `model` — <prefiks>-<model№>-<foto№>: har model alohida tovar, bir nechta foto.
   * `flat`  — <prefiks>-<№>: har fayl alohida tovar, bitta foto.
   */
  numbering: 'model' | 'flat';
  /** Nechta tovar: `model` uchun — model soni, `flat` uchun — fayl soni */
  count: number;
};

export const PREFIX_MAP: Record<string, PrefixInfo> = {
  // ---- Ko'ylaklar ----
  'w-sweetheart': {
    categoryId: 'wedding',
    subcategoryId: 'wedding-sweetheart',
    kind: 'dress',
    neckline: 'sweetheart',
    numbering: 'model',
    count: 4,
  },
  'w-vneek': {
    categoryId: 'wedding',
    subcategoryId: 'wedding-v-neck',
    kind: 'dress',
    neckline: 'v-neck',
    numbering: 'model',
    count: 2,
  },
  'w-square': {
    categoryId: 'wedding',
    subcategoryId: 'wedding-square',
    kind: 'dress',
    neckline: 'square',
    numbering: 'model',
    count: 3,
  },
  'w-highneck': {
    categoryId: 'wedding',
    subcategoryId: 'wedding-high-neck',
    kind: 'dress',
    neckline: 'closed',
    numbering: 'model',
    count: 7,
  },
  'w-onesh': {
    categoryId: 'wedding',
    subcategoryId: 'wedding-one-shoulder',
    kind: 'dress',
    neckline: 'one-shoulder',
    numbering: 'model',
    count: 5,
  },

  // ---- Hijobli ko'ylaklar ----
  'w-hj-barg': {
    categoryId: 'hijab',
    subcategoryId: 'hijab-cape',
    kind: 'dress',
    neckline: 'closed',
    numbering: 'model',
    count: 2,
  },
  'w-hj-palto': {
    categoryId: 'hijab',
    subcategoryId: 'hijab-coat',
    kind: 'dress',
    neckline: 'closed',
    numbering: 'model',
    count: 3,
  },
  'w-hj-china': {
    categoryId: 'hijab',
    subcategoryId: 'hijab-stand-collar',
    kind: 'dress',
    neckline: 'closed',
    numbering: 'model',
    count: 1,
  },
  // Yangi to'plam: bitta prefiks ostida ham накидкали, ham tik yoqali modellar
  // bor, shuning uchun subkategoriya `mockdata.real.ts` da har model uchun
  // alohida qo'yilgan — bu yerdagi `subcategoryId` faqat sukut qiymat.
  'w-hidjab': {
    categoryId: 'hijab',
    subcategoryId: 'hijab-cape',
    kind: 'dress',
    neckline: 'closed',
    numbering: 'model',
    count: 7,
  },

  // ---- Oyoq kiyim ----
  'shoes-classic': {
    categoryId: 'shoes',
    subcategoryId: 'shoes-classic',
    kind: 'accessory',
    accessoryType: 'shoes',
    numbering: 'model',
    count: 2,
  },
  'shoes-classic-gul': {
    categoryId: 'shoes',
    subcategoryId: 'shoes-flower',
    kind: 'accessory',
    accessoryType: 'shoes',
    numbering: 'model',
    count: 4,
  },
  'shoes-crystall': {
    categoryId: 'shoes',
    subcategoryId: 'shoes-crystal',
    kind: 'accessory',
    accessoryType: 'shoes',
    numbering: 'model',
    count: 4,
  },
  'shoes-block-hell': {
    categoryId: 'shoes',
    subcategoryId: 'shoes-block-heel',
    kind: 'accessory',
    accessoryType: 'shoes',
    numbering: 'model',
    count: 4,
  },
  'shoes-kitten-hell': {
    categoryId: 'shoes',
    subcategoryId: 'shoes-kitten-heel',
    kind: 'accessory',
    accessoryType: 'shoes',
    numbering: 'model',
    count: 3, // 3-model fayli hozircha "shoes-kittent-hell-3-1.jpg" deb xato nomlangan
  },
  'shoes-strapy': {
    categoryId: 'shoes',
    subcategoryId: 'shoes-strappy',
    kind: 'accessory',
    accessoryType: 'shoes',
    numbering: 'model',
    count: 4,
  },

  // ---- Aksessuarlar ----
  fata: {
    categoryId: 'veils',
    kind: 'accessory',
    accessoryType: 'veil',
    numbering: 'flat',
    count: 6,
  },
  tish: {
    categoryId: 'hairpins',
    kind: 'accessory',
    accessoryType: 'hairpin',
    numbering: 'flat',
    count: 7,
  },
  toj: {
    categoryId: 'tiaras',
    kind: 'accessory',
    accessoryType: 'tiara',
    numbering: 'flat',
    count: 7, // raqamlar: 1-4, 6-8 (toj-5 yo'q)
  },
  nabor: {
    categoryId: 'jewelry',
    kind: 'accessory',
    accessoryType: 'jewelry',
    numbering: 'flat',
    count: 5,
  },
  setka: {
    categoryId: 'face-veils',
    kind: 'accessory',
    accessoryType: 'face-veil',
    numbering: 'flat',
    count: 6,
  },
  per: {
    categoryId: 'gloves',
    kind: 'accessory',
    accessoryType: 'gloves',
    numbering: 'flat',
    count: 5,
  },
  hand: {
    categoryId: 'bracelets',
    kind: 'accessory',
    accessoryType: 'bracelet',
    numbering: 'flat',
    count: 7, // hand-6.jpg va hand-6.jpeg — turli rasmlar, raqam takrorlangan
  },
};
