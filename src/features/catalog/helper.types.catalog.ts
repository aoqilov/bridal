// ================================================================
// Enum-like union'lar + iteratsiya massivi (filter chip'lar uchun ham)
// ================================================================

/** Katalog elementi turi — ko'ylak yoki aksessuar */
export const ITEM_KINDS = ['dress', 'accessory'] as const;
export type ItemKind = (typeof ITEM_KINDS)[number];

/** Taklif turi: ijara / sotuv / o'lchov bo'yicha tikish */
export const OFFER_TYPES = ['rent', 'sale', 'tailoring'] as const;
export type OfferType = (typeof OFFER_TYPES)[number];

/** Ko'ylak silueti */
export const SILHOUETTES = [
  'a-line',
  'mermaid',
  'princess',
  'straight',
  'short',
] as const;
export type Silhouette = (typeof SILHOUETTES)[number];

/** Yoqa shakli */
export const NECKLINES = [
  'sweetheart',
  'v-neck',
  'square',
  'boat',
  'off-shoulder',
  'one-shoulder',
  'closed',
  'halter',
] as const;
export type Neckline = (typeof NECKLINES)[number];

/**
 * Etak uzunligi — silueti bilan aralashtirmang: `silhouette: 'short'` shakl haqida,
 * bu esa etak qayerda tugashi haqida. Примерка generatsiyasi shu maydonga qaraydi:
 * oyoq etak ostidan chiqmasa tufli umuman ko'rinmaydi.
 */
export const HEM_LENGTHS = ['floor', 'midi', 'short'] as const;
export type HemLength = (typeof HEM_LENGTHS)[number];

/** Yeng turi */
export const SLEEVES = ['none', 'strap', 'short', 'long', 'transparent'] as const;
export type Sleeve = (typeof SLEEVES)[number];

/** Mato */
export const FABRICS = [
  'satin',
  'lace',
  'tulle',
  'chiffon',
  'crepe',
  'organza',
  'velvet',
] as const;
export type Fabric = (typeof FABRICS)[number];

/** Rang ottenkasi (kelin ko'ylaklari uchun tor palitra) */
export const SHADES = ['ivory', 'white', 'champagne', 'blush', 'beige', 'pastel'] as const;
export type Shade = (typeof SHADES)[number];

/** Aksessuar turi */
export const ACCESSORY_TYPES = [
  'veil',
  'face-veil',
  'tiara',
  'hairpin',
  'jewelry',
  'bracelet',
  'gloves',
  'bolero',
  'shoes',
  'underskirt',
  'belt',
] as const;
export type AccessoryType = (typeof ACCESSORY_TYPES)[number];

export const CURRENCIES = ['UZS'] as const;
export type Currency = (typeof CURRENCIES)[number];

// ================================================================
// Kategoriya
// ================================================================

export type Subcategory = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  /** Katalog grid'idagi kvadrat kartochka rasmi */
  image?: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  /** Kategoriya qaysi turdagi elementlarni saqlaydi */
  kind: ItemKind;
  /** Chap ustundagi dumaloq avatar va "Все модели" kartochkasi uchun */
  image?: string;
  /** Chap ustun tor — uzun nom o'rniga qisqasi ko'rsatiladi */
  shortName?: string;
  subcategories?: Subcategory[];
};

// ================================================================
// O'lcham va variantlar
// ================================================================

/** Ko'ylak o'lchami — RU o'lchov tizimi (40-56) */
export type DressSize = {
  ru: number;
  label: string; // "44 (M)"
  /** Shu o'lcham hozir salonda bormi */
  available: boolean;
};

/**
 * Variant turi — bitta modelning uch xil taqdimoti. Rang emas: modelning rangi
 * bitta (`Dress.shade`), variantlar esa nima ko'rsatilishini ajratadi.
 *
 * - `brand`    — salon/brend fotolari, katalog kartochkasi va galereyaning asosiysi
 * - `komplekt` — to'liq komplekt (fata, kamar va h.k. bilan) fotolari
 * - `ai`       — примерка generatsiyasi uchun toza foto (`variantOfKind`)
 */
export const VARIANT_KINDS = ['brand', 'komplekt', 'ai'] as const;
export type VariantKind = (typeof VARIANT_KINDS)[number];

export type ItemVariant = {
  id: string;
  kind: VariantKind;
  mainImage: string;
  otherImages: string[];
};

// ================================================================
// Umumiy maydonlar
// ================================================================

type BaseItem = {
  // Identifikatsiya
  id: string;
  slug: string; // URL: /catalog/<slug>
  sku?: string; // Ichki artikul

  /** Brend / kolleksiya nomi — filtrda alohida bo'lim */
  brand?: string;
  /**
   * Qayerda tikilgan / qayerdan kelgan («Узбекистан», «Турция», salon nomi).
   * Yozilmagan bo'lsa tovar sahifasi `DEFAULT_ORIGIN` ni ko'rsatadi.
   */
  origin?: string;
  /**
   * Bezakdagi toshlar ("Кристаллы", "Жемчуг", ...) — erkin matn, chunki
   * ro'yxat salon assortimentiga qarab o'zgaradi. Filtr variantlari
   * katalogdagi qiymatlardan yig'iladi (`buildFilterOptions`).
   */
  stones?: string[];

  // Kategoriya / teg
  categoryId: string;
  subcategoryId?: string;
  tags?: string[];

  // Matn kontent
  name: string;
  description?: string;
  careInstructions?: string;

  // Narx — taklif turiga qarab to'ldiriladi
  offerTypes: OfferType[];
  /** Ijara narxi (1 to'y = 3 kun) */
  rentPrice?: number;
  /** Sotib olish narxi */
  salePrice?: number;
  /** Zaklad (ijara uchun, qaytariladi) */
  deposit?: number;
  /** Chegirmadan oldingi narx (chizilgan) */
  oldPrice?: number;
  currency: Currency;

  // Rasm variantlari
  variants: ItemVariant[];
  defaultVariantId: string;

  // Discovery / status
  isNew?: boolean;
  isFeatured?: boolean; // Home karusel
  isPopular?: boolean;
  isAvailable: boolean;
  /** Ijaraga band qilingan sanalar (ISO "YYYY-MM-DD") */
  bookedDates?: string[];

  // Meta
  createdAt: string;
  updatedAt: string;
  rating?: number; // 0-5
  reviewCount?: number;
};

// ================================================================
// Ko'ylak
// ================================================================

export type Dress = BaseItem & {
  kind: 'dress';
  silhouette: Silhouette;
  neckline: Neckline;
  sleeve: Sleeve;
  fabrics: Fabric[];
  shade: Shade;
  sizes: DressSize[];
  /**
   * Etak qayerda tugaydi. Ko'rsatilmasa `hemLengthOf()` siluetdan taxmin qiladi
   * (`utils/item.ts`) — shuning uchun eski mockdata yozuvlari ham ishlayveradi.
   */
  hemLength?: HemLength;
  /** Shleyf uzunligi, sm */
  trainLength?: number;
  hasCorset?: boolean;
  /** Homilador kelinlar uchun mos */
  isMaternityFriendly?: boolean;
  collectionYear?: number;
};

// ================================================================
// Aksessuar
// ================================================================

export type Accessory = BaseItem & {
  kind: 'accessory';
  accessoryType: AccessoryType;
  material?: string;
  /** Yagona o'lcham (fata, diadema va h.k.) */
  oneSize?: boolean;
  /** Oyoq kiyim / qo'lqop uchun o'lchamlar ro'yxati */
  sizeLabels?: string[];
};

// ================================================================
// Discriminated union — katalogdagi har qanday element
// ================================================================

export type CatalogItem = Dress | Accessory;

export function isDress(item: CatalogItem): item is Dress {
  return item.kind === 'dress';
}

export function isAccessory(item: CatalogItem): item is Accessory {
  return item.kind === 'accessory';
}
