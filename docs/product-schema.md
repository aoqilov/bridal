# Amira Bridal — Product schema / DTO

Manba: `src/features/catalog/helper.types.catalog.ts`.
Bu hujjat ekran chizish uchun — har bir maydon uchun **tur**, **majburiymi**, **qanday kontrol**, **qayerda ko'rinadi**.

Biznes: **ijara (аренда) + sotuv (продажа) + o'lchov bo'yicha tikish (пошив)**. Backend yo'q, valyuta faqat `UZS`.

---

## 1. Tur ierarxiyasi

```
CatalogItem = Dress | Accessory        ← discriminated union, ajratuvchi maydon: kind
    ├── BaseItem  (umumiy 24 maydon)
    ├── Dress     kind: 'dress'      + 9 maydon
    └── Accessory kind: 'accessory'  + 4 maydon

Category ──< Subcategory
CatalogItem.variants ──< ItemVariant   (har rangda o'z fotolari)
Dress.sizes          ──< DressSize     (RU 40–56)
```

Type guard'lar: `isDress(item)` / `isAccessory(item)`.
**Muhim:** formada `kind` tanlanganda pastki qism to'liq almashadi — ikkita boshqa forma.

---

## 2. To'liq TypeScript (copy-paste)

```ts
// ============ Enum-like union'lar ============
export const ITEM_KINDS = ['dress', 'accessory'] as const;
export type ItemKind = (typeof ITEM_KINDS)[number];

export const OFFER_TYPES = ['rent', 'sale', 'tailoring'] as const;
export type OfferType = (typeof OFFER_TYPES)[number];

export const SILHOUETTES = ['a-line', 'mermaid', 'princess', 'straight', 'short'] as const;
export type Silhouette = (typeof SILHOUETTES)[number];

export const NECKLINES = ['sweetheart', 'v-neck', 'square', 'boat',
  'off-shoulder', 'one-shoulder', 'closed', 'halter'] as const;
export type Neckline = (typeof NECKLINES)[number];

export const SLEEVES = ['none', 'strap', 'short', 'long', 'transparent'] as const;
export type Sleeve = (typeof SLEEVES)[number];

export const FABRICS = ['satin', 'lace', 'tulle', 'chiffon',
  'crepe', 'organza', 'velvet'] as const;
export type Fabric = (typeof FABRICS)[number];

export const SHADES = ['ivory', 'white', 'champagne', 'blush', 'beige', 'pastel'] as const;
export type Shade = (typeof SHADES)[number];

export const ACCESSORY_TYPES = ['veil', 'face-veil', 'tiara', 'hairpin', 'jewelry',
  'bracelet', 'gloves', 'bolero', 'shoes', 'underskirt', 'belt'] as const;
export type AccessoryType = (typeof ACCESSORY_TYPES)[number];

export const CURRENCIES = ['UZS'] as const;
export type Currency = (typeof CURRENCIES)[number];

// ============ Ichki DTO'lar ============
export type DressSize = {
  ru: number;          // 40..56
  label: string;       // "44 (M)"
  available: boolean;  // hozir salonda bormi
};

export type ItemVariant = {
  id: string;
  colorName: string;   // "Айвори"
  colorHex: string;    // "#F5EFE6"
  mainImage: string;   // "/assets/w-sweetheart-1-1.jpg"
  otherImages: string[];
};

export type Subcategory = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  image?: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  kind: ItemKind;
  image?: string;
  shortName?: string;
  subcategories?: Subcategory[];
};

// ============ Umumiy maydonlar ============
type BaseItem = {
  id: string;
  slug: string;                 // URL: /catalog/<slug>
  sku?: string;

  categoryId: string;
  subcategoryId?: string;
  tags?: string[];

  name: string;
  description?: string;
  careInstructions?: string;

  offerTypes: OfferType[];
  rentPrice?: number;           // 1 to'y = 3 kun
  salePrice?: number;
  deposit?: number;             // zaklad, qaytariladi
  oldPrice?: number;            // chizilgan
  currency: Currency;

  variants: ItemVariant[];
  defaultVariantId: string;

  isNew?: boolean;
  isFeatured?: boolean;         // Home karusel
  isPopular?: boolean;
  isAvailable: boolean;
  bookedDates?: string[];       // "YYYY-MM-DD"

  createdAt: string;            // ISO
  updatedAt: string;            // ISO
  rating?: number;              // 0..5
  reviewCount?: number;
};

// ============ Ko'ylak ============
export type Dress = BaseItem & {
  kind: 'dress';
  silhouette: Silhouette;
  neckline: Neckline;
  sleeve: Sleeve;
  fabrics: Fabric[];
  shade: Shade;
  sizes: DressSize[];
  trainLength?: number;         // shleyf, sm
  hasCorset?: boolean;
  isMaternityFriendly?: boolean;
  collectionYear?: number;
};

// ============ Aksessuar ============
export type Accessory = BaseItem & {
  kind: 'accessory';
  accessoryType: AccessoryType;
  material?: string;            // erkin matn: "Экокожа, атлас"
  oneSize?: boolean;
  sizeLabels?: string[];        // ["36","37","38","39","40"]
};

export type CatalogItem = Dress | Accessory;
```

---

## 3. BaseItem — maydonlar jadvali

| Maydon | Tur | Majburiy | Kontrol | Qayerda ko'rinadi |
|---|---|:---:|---|---|
| `id` | `string` | ✅ | — (avtomatik) | ko'rinmaydi |
| `slug` | `string` | ✅ | text + prefiks `/catalog/` | tovar sahifasi URL'i |
| `sku` | `string` | — | text (mono) | jadval, tovar sahifasi «Артикул» |
| `categoryId` | `string` | ✅ | select | breadcrumb, filtr |
| `subcategoryId` | `string` | — | select (kategoriyaga bog'liq) | breadcrumb, filtr |
| `tags` | `string[]` | — | chip input | qidiruv (`useSearchItems`) |
| `name` | `string` | ✅ | text | **hamma joyda**, `font-serif` |
| `description` | `string` | — | textarea (3–4 qator) | tovar sahifasi «Описание» |
| `careInstructions` | `string` | — | textarea | tovar sahifasi akkordeoni |
| `offerTypes` | `OfferType[]` | ✅ | 3 ta checkbox | kartochka badge, tovar sahifasi segment |
| `rentPrice` | `number` | — | number + `UZS` | asosiy narx (agar `rent` bo'lsa) |
| `salePrice` | `number` | — | number + `UZS` | ikkinchi narx |
| `deposit` | `number` | — | number + `UZS` | tovar sahifasi «Залог» |
| `oldPrice` | `number` | — | number + `UZS` | chizilgan narx + `−N%` badge |
| `currency` | `'UZS'` | ✅ | qat'iy, ko'rsatilmaydi | narx yonida «сум» |
| `variants` | `ItemVariant[]` | ✅ | takrorlanuvchi blok | galereya, rang nuqtalari |
| `defaultVariantId` | `string` | ✅ | radio «по умолчанию» | kartochkadagi rasm |
| `isNew` | `boolean` | — | switch | badge «Новинка», `/new` lentasi |
| `isFeatured` | `boolean` | — | switch | Home karuseli |
| `isPopular` | `boolean` | — | switch | badge «Хит» |
| `isAvailable` | `boolean` | ✅ | switch | katalogda ko'rinishi (`false` → yashirin) |
| `bookedDates` | `string[]` | — | kalendardan davr tanlash | bron kalendarida kulrang kunlar |
| `createdAt` | ISO `string` | ✅ | — (avtomatik) | saralash |
| `updatedAt` | ISO `string` | ✅ | — (avtomatik) | «изменено N назад» |
| `rating` | `number` 0–5 | — | read-only | yulduzlar |
| `reviewCount` | `number` | — | read-only | «N отзывов» |

### Muhim nuanslar

- **`isAvailable: false`** — tovar katalogdan chiqib ketadi (`MOCK_CATALOG.filter(i => i.isAvailable)`),
  lekin `getItemBySlug` uni topadi. Adminkada «Скрыт» statusi.
- **`tailoring` uchun narx yo'q** — o'lchov olingandan keyin hisoblanadi.
  Formada `tailoring` belgilansa ham narx maydoni chiqmaydi.
- **`oldPrice` faqat asosiy taklifga tegishli** — `secondaryPrice()` uni ko'rsatmaydi.
- **`bookedDates`** ISO `"YYYY-MM-DD"`, alohida kunlar (davr emas). UI'da davr tanlanadi, massivga kunlar yoziladi.

---

## 4. Dress qo'shimcha maydonlari

| Maydon | Tur | Majburiy | Kontrol | Yorliq (ru) |
|---|---|:---:|---|---|
| `kind` | `'dress'` | ✅ | — | — |
| `silhouette` | `Silhouette` | ✅ | select (5) | Силуэт |
| `neckline` | `Neckline` | ✅ | select (8) | Вырез |
| `sleeve` | `Sleeve` | ✅ | select (5) | Рукав |
| `fabrics` | `Fabric[]` | ✅ | multi-chip (7) | Ткани |
| `shade` | `Shade` | ✅ | select + rang nuqtasi (6) | Оттенок |
| `sizes` | `DressSize[]` | ✅ | 9 ta pill toggle | Размеры |
| `trainLength` | `number` | — | number + `см` | Длина шлейфа |
| `hasCorset` | `boolean` | — | switch | Корсет |
| `isMaternityFriendly` | `boolean` | — | switch | Подходит беременным |
| `collectionYear` | `number` | — | number | Год коллекции |

### DressSize — RU o'lcham to'ri

`sizes()` helper'i qatorni tuzadi: `sizes([42,44,46,48], [50])` → 5 ta yozuv, oxirgisi `available: false`.

| ru | alias | label | bust | waist | hips |
|---|---|---|---|---|---|
| 40 | XS | `40 (XS)` | 80 | 62 | 86 |
| 42 | S | `42 (S)` | 84 | 66 | 90 |
| 44 | M | `44 (M)` | 88 | 70 | 94 |
| 46 | L | `46 (L)` | 92 | 74 | 98 |
| 48 | XL | `48 (XL)` | 96 | 78 | 102 |
| 50 | XXL | `50 (XXL)` | 100 | 82 | 106 |
| 52 | — | `52` | 104 | 86 | 110 |
| 54 | — | `54` | 108 | 90 | 114 |
| 56 | — | `56` | 112 | 94 | 118 |

> 52–56 da alias yo'q — `label` faqat raqam. (`SIZE_ALIAS` map'i 40–50 ni qamraydi.)
> O'lchov jadvali `src/features/item/utils/sizeChart.ts` da, tovar sahifasida sheet bo'lib ochiladi.

---

## 5. Accessory qo'shimcha maydonlari

| Maydon | Tur | Majburiy | Kontrol | Yorliq (ru) |
|---|---|:---:|---|---|
| `kind` | `'accessory'` | ✅ | — | — |
| `accessoryType` | `AccessoryType` | ✅ | select (11) | Тип аксессуара |
| `material` | `string` | — | text (erkin) | Материал |
| `oneSize` | `boolean` | — | switch | Один размер |
| `sizeLabels` | `string[]` | — | chip input | Размеры |

**Qoida:** `oneSize: true` bo'lsa `sizeLabels` chiqmaydi (fata, diadema, kamar).
`oneSize` yo'q bo'lsa `sizeLabels` kerak (tufli 36–40, qo'lqop S/M/L).

---

## 6. ItemVariant — rang + fotolar

```ts
{ id, colorName, colorHex, mainImage, otherImages[] }
```

| Maydon | Kontrol | Izoh |
|---|---|---|
| `colorName` | text | «Айвори», «Белый», «Шампань» |
| `colorHex` | color picker + hex text | rang nuqtasi va chip uchun |
| `mainImage` | fayl nomi | **kartochkada shu rasm** ko'rinadi |
| `otherImages` | fayl nomlari ro'yxati | galereya, drag bilan tartiblash |

- Rasmlar `public/assets/` da, yo'l `/assets/<fayl>`. Backend yo'q — adminka fayl yuklamaydi, faqat nom yozadi.
- Nomlash: `<prefiks>-<model№>-<foto№>.<ext>` → `w-sweetheart-1-3.jpg`.
- `defaultVariantId` variantlar orasidan topilmasa — `variants[0]` olinadi (`defaultVariant()`).
- Kamida **1 variant** bo'lishi shart, aks holda galereya buziladi.

---

## 7. Hisoblanadigan qiymatlar (formada emas — chiqishda)

`src/features/catalog/utils/price.ts` — **narxni hech qachon qo'lda hisoblamang**.

```ts
type PriceView = { amount: number; old?: number; label: string; offer: OfferType };

primaryPrice(item): PriceView | null
  // rent bor va rentPrice bor → ijara (ustuvor)
  // aks holda sale bor va salePrice bor → sotuv
  // aks holda null  ← kartochkada narx chiqmaydi, dizayn buni hisobga olsin

secondaryPrice(item): PriceView | null
  // faqat primary === 'rent' va salePrice bor bo'lsa → sotuv narxi
  // faqat tovar sahifasida, kartochkada emas

offerPrice(item, offer): PriceView | null
  // segment («Аренда / Покупка / Пошив») tanloviga qarab
  // tailoring uchun doim null

discountPercent(item): number
  // 0 agar oldPrice yo'q yoki <= joriy narx
  // aks holda round((old - amount) / old * 100)  → «−15%» badge
```

Boshqalar:

```ts
defaultVariant(item): ItemVariant                    // utils/item.ts
getItemBySlug(slug, items): CatalogItem | null       // utils/getItem.ts
getItemById(id, items): CatalogItem | null           // WeakMap indeksli
getRelatedItems(item, items, limit = 6)              // avval subkategoriya, keyin kategoriya
getMatchingAccessories(items, limit = 6)             // reyting bo'yicha, «С этим платьем берут»
formatCurrency(amount)                               // Intl ru-RU, kasrsiz: 1 800 000
```

---

## 8. Real misollar

### Dress

```jsonc
{
  "id": "d-w-sweetheart-1",
  "slug": "w-sweetheart-1",
  "kind": "dress",
  "categoryId": "wedding",
  "subcategoryId": "wedding-sweetheart",
  "name": "Аврора",
  "description": "Свадебное платье, вырез «сердечко». Точное описание уточните в салоне.",
  "offerTypes": ["rent", "sale", "tailoring"],
  "rentPrice": 1800000,
  "salePrice": 5900000,
  "deposit": 1000000,
  "currency": "UZS",
  "silhouette": "a-line",
  "neckline": "sweetheart",
  "sleeve": "none",
  "fabrics": ["satin", "lace"],
  "shade": "ivory",
  "sizes": [
    { "ru": 42, "label": "42 (S)",  "available": true  },
    { "ru": 44, "label": "44 (M)",  "available": true  },
    { "ru": 46, "label": "46 (L)",  "available": true  },
    { "ru": 48, "label": "48 (XL)", "available": true  },
    { "ru": 50, "label": "50 (XXL)","available": false }
  ],
  "variants": [{
    "id": "d-w-sweetheart-1-ivory",
    "colorName": "Айвори",
    "colorHex": "#F5EFE6",
    "mainImage": "/assets/w-sweetheart-1-1.jpg",
    "otherImages": ["/assets/w-sweetheart-1-2.jpg", "/assets/w-sweetheart-1-3.jpg"]
  }],
  "defaultVariantId": "d-w-sweetheart-1-ivory",
  "isNew": true,
  "isFeatured": true,
  "isAvailable": true,
  "bookedDates": [],
  "createdAt": "2026-08-23T10:00:00.000Z",
  "updatedAt": "2026-08-23T10:00:00.000Z"
}
```

### Accessory

```jsonc
{
  "id": "a-shoes-classic-1",
  "slug": "shoes-classic-1",
  "kind": "accessory",
  "categoryId": "shoes",
  "subcategoryId": "shoes-classic",
  "accessoryType": "shoes",
  "name": "Туфли-лодочки 01",
  "description": "Свадебная обувь, классические свадебные лодочки.",
  "offerTypes": ["rent", "sale"],
  "rentPrice": 250000,
  "salePrice": 900000,
  "deposit": 200000,
  "currency": "UZS",
  "material": "Экокожа, атлас",
  "sizeLabels": ["36", "37", "38", "39", "40"],
  "variants": [{
    "id": "a-shoes-classic-1-white",
    "colorName": "Белый",
    "colorHex": "#FFFFFF",
    "mainImage": "/assets/shoes-classic-1-1.jpg",
    "otherImages": ["/assets/shoes-classic-1-2.jpg"]
  }],
  "defaultVariantId": "a-shoes-classic-1-white",
  "isNew": true,
  "isAvailable": true,
  "bookedDates": [],
  "createdAt": "2026-08-23T10:00:00.000Z",
  "updatedAt": "2026-08-23T10:00:00.000Z"
}
```

---

## 9. Adminka DTO'lari (forma payload'i)

```ts
/** Yangi tovar — id/sana serverda (yoki store'da) qo'yiladi */
export type CreateItemDto = Omit<CatalogItem, 'id' | 'createdAt' | 'updatedAt'
  | 'rating' | 'reviewCount'>;

/** Tahrirlash — faqat o'zgargan maydonlar */
export type UpdateItemDto = Partial<CreateItemDto> & { id: string };

/** Jadval qatori uchun yengil ko'rinish (91 ta yozuv, to'liq obyekt kerak emas) */
export type ItemListRowDto = {
  id: string;
  slug: string;
  kind: ItemKind;
  name: string;
  sku?: string;
  thumb: string;                 // defaultVariant(item).mainImage
  categoryName: string;          // Category.name bo'yicha resolve
  subcategoryName?: string;
  offerTypes: OfferType[];
  price: PriceView | null;       // primaryPrice(item)
  discountPercent: number;
  deposit?: number;
  sizeSummary: string;           // "42 – 48" | "Один размер" | "S · M · L"
  availableSizeCount?: number;   // "4 из 5"
  status: 'available' | 'booked' | 'hidden';
  isNew?: boolean;
  updatedAt: string;
};

/** Kategoriya formasi */
export type CreateCategoryDto = Omit<Category, 'id' | 'subcategories'>;
export type CreateSubcategoryDto = Omit<Subcategory, 'id'>;
```

**`status` qanday hisoblanadi (jadval uchun):**

```
!isAvailable                      → 'hidden'   «Скрыт»        bg-surface-2 / text-muted
bookedDates bugundan keyin bor    → 'booked'   «Забронирован» bg-warning-soft / text-warning
aks holda                         → 'available'«В наличии»    bg-success-soft / text-success
```

**`sizeSummary`:**

```
Dress      → `${min(ru)} – ${max(ru)}` faqat available'lar bo'yicha  → "42 – 48"
Accessory  → oneSize ? "Один размер" : sizeLabels.join(" · ")        → "S · M · L"
```

---

## 10. Validatsiya (dizayn xato holatlarini ko'rsatsin)

| Qoida | Xato matni (ru) |
|---|---|
| `name` bo'sh emas | Укажите название |
| `slug` bo'sh emas, unikal, `[a-z0-9-]` | Такой адрес уже занят |
| `offerTypes` kamida 1 ta | Выберите хотя бы одно предложение |
| `rent` tanlangan → `rentPrice > 0` | Укажите цену аренды |
| `sale` tanlangan → `salePrice > 0` | Укажите цену продажи |
| `oldPrice` bo'lsa → `oldPrice > joriy narx` | Старая цена должна быть выше текущей |
| `variants.length >= 1` | Добавьте хотя бы один цвет |
| har variantda `mainImage` bor | Добавьте главное фото |
| `defaultVariantId` variantlar ichida | — (avtomatik tuzatiladi) |
| Dress: `sizes` da kamida 1 `available` | Отметьте доступные размеры |
| Dress: `fabrics.length >= 1` | Выберите ткань |
| Accessory: `oneSize` yoki `sizeLabels` | Укажите размеры или отметьте «один размер» |

---

## 11. Bog'liq DTO'lar

### Booking (`features/booking/helper.types.booking.ts`)

```ts
type BookingType = 'fitting' | 'rent';
type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

type Booking = {
  id: string;
  itemId?: string;      // bo'sh — umumiy примерка
  itemName?: string;
  variantId?: string;
  size?: string;
  type: BookingType;
  date: string;         // "YYYY-MM-DD"
  time: string;         // "14:30"
  name: string;
  phone: string;
  comment?: string;
  status: BookingStatus;
  createdAt: string;
};

type BookingDraft = Omit<Booking, 'id' | 'status' | 'createdAt'>;
```

Status yorliqlari: `pending` Ожидает подтверждения (warning) · `confirmed` Подтверждено (success) · `cancelled` Отменено (danger).
Vaqt slotlari: `10:00 · 11:30 · 13:00 · 14:30 · 16:00 · 17:30`. Oldindan max 90 kun.

### Review (`features/review/helper.types.review.ts`)

```ts
type ReviewAuthor = { id: string; name: string; avatar?: string; city?: string };

type Review = {
  id: string;
  itemId: string;              // CatalogItem.id ga bog'lanadi
  author: ReviewAuthor;
  rating: number;              // 1..5
  title: string;
  description?: string;
  images: string[];            // kamida bitta
  createdAt: string;
  likeCount?: number;
  isVerifiedPurchase?: boolean;
};
```

> Moderatsiya uchun `status: 'pending' | 'published' | 'hidden'` **hozir yo'q** — qo'shish kerak.

### NewsItem / Promotion

```ts
type NewsItem = {
  id; slug; title; cover; excerpt; body;
  publishedAt: string;         // ISO
  author?: string;
  tags?: string[];
};

type Promotion = {
  id; slug; title; subtitle?; cover;
  discountPercent?: number;
  startsAt: string; endsAt: string;   // ISO
  description: string;
  conditions?: string[];              // ["Только аренда", ...]
  ctaLabel?: string;
  ctaUrl?: string;                    // "/catalog?kind=dress"
  accentColor?: 'primary' | 'accent' | 'danger';
};
```

---

## 12. Dizayn uchun eslatma

Ekran chizganda quyidagi **bo'sh/chegara holatlarini** ham ko'rsating:

- `primaryPrice() === null` — narx yo'q (faqat `tailoring`) → «Цена по меркам»
- `variants.length === 1` — rang nuqtalari qatori chiqmaydi
- `otherImages.length === 0` — galereyada bitta rasm, thumbnail qatori yo'q
- `sizes` da hammasi `available: false` — «Нет в наличии»
- `rating`/`reviewCount` yo'q — yulduzlar bloki umuman chiqmaydi
- `bookedDates` uzun — kalendarda ketma-ket kulrang kunlar
- `description` yo'q — akkordeon bo'limi yashiriladi
- Aksessuarda `Характеристики` bloki juda kalta (2–3 qator) — ko'ylaknikiga qaraganda

Yorliqlar (`SILHOUETTE_LABELS` va h.k.) va rang tokenlari uchun → [design-tokens.md](design-tokens.md), 3 va 8-bo'limlar.
