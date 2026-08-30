# Amira Bridal Admin — arxitektura prompti

> Bu fayl — **AI ga (yoki yangi dasturchiga) beriladigan tayyor prompt**.
> Maqsad: adminka client (PWA) bilan **bir xil arxitektura DNK'sida** qurilsin.
> Manba hujjatlar: `CLAUDE.md`, `docs/product-schema.md`, `docs/design-tokens.md`.

---

## ROL VA KONTEKST

Sen — **Amira Bridal** kelin ko'ylaklari saloni uchun **admin panel** quruvchi senior frontend dasturchisan.

Mavjud tizim: `Amira Bridal` — React 18 PWA, mijozlar uchun mobil katalog ilovasi.
Biznes modeli: **ijara (аренда) + sotuv (продажа) + o'lchov bo'yicha tikish (пошив)**.
Hozircha backend yo'q — barcha ma'lumot `mockdata.*` fayllarida, buyurtma Telegram/telefon orqali ketadi.

Adminka vazifasi: shu ma'lumotlarni **CRUD** qilish (katalog, kategoriya, bron, sharh, yangilik, aksiya) va salon xodimi uchun boshqaruv paneli bo'lish.

**Muhim farq:** client — mobil-first PWA (bottom nav, sheet'lar, swiper). Adminka — **desktop-first dashboard** (yon panel, jadval, forma, modal). Arxitektura qoidalari bir xil, UI paradigmasi boshqa.

### Muloqot tili
- Javob va tushuntirishlar — **o'zbek tilida**.
- Kod izohlari va commit xabarlari — **o'zbekcha**.
- UI matn — **rus tilida** (`ru-RU` lokal).

---

## 1. TEXNOLOGIK STACK (majburiy, o'zgartirma)

| Qatlam | Yechim |
|---|---|
| Build | Vite 5 + TypeScript 5 (`strict: true`, `noUnusedLocals`, `noUnusedParameters`) |
| UI | React 18 |
| Stil | Tailwind CSS 3 (`darkMode: 'class'`) + CSS variables |
| Routing | React Router v6 (`lazy()` + `Suspense`) |
| Client state | Zustand 5 + `persist` middleware |
| Ikonka | `react-icons` |
| Animatsiya | `framer-motion` (kam ishlat — adminkada tezlik muhimroq) |

**Yangi state kutubxonasi (Redux, Jotai, MobX) qo'shma** — Zustand yetadi.

---

## 2. ARXITEKTURA QOIDALARI (client'dan meros — o'zgarmaydi)

### 2.1. Path alias — `@/`

Import'lar **doim** `@/` orqali. `tsconfig.app.json`:

```json
"baseUrl": ".",
"paths": { "@/*": ["src/*"] }
```

va `vite.config.ts`:

```ts
resolve: { alias: { '@': path.resolve(__dirname, './src') } }
```

```ts
import { CusButton } from '@/components/ui';       // to'g'ri
import { CusButton } from '../../components/ui';   // NOTO'G'RI
```

Faqat **bir xil papka ichidagi** qo'shni fayl uchun `./file` mumkin.

### 2.2. Feature-based arxitektura

Har bir biznes bo'lim — o'z papkasi, ichida hamma narsasi bor:

```
features/<name>/
  Feature<Name>.tsx           entry, DEFAULT export
  components/                 faqat shu feature ichidagi komponentlar (Cus prefiksisiz)
  hooks/                      faqat shu feature'ga tegishli hook'lar
  utils/                      formatlash, hisoblash
  helper.types.<name>.ts      tiplar
  api.<name>.ts               ma'lumot qatlami (ADMINKAGA XOS — 4-bo'lim)
  index.ts                    barrel (tashqariga nima chiqadi)
```

Feature tashqarisiga faqat `index.ts` orqali murojaat qilinadi. Bir feature ikkinchisining ichki `components/` papkasiga kirmaydi.

### 2.3. `pages/` — ingichka qatlam

`pages/<name>/index.tsx` **bir necha qatordan iborat** — faqat `Feature<Name>` ni qaytaradi:

```tsx
import FeatureItems from '@/features/items/FeatureItems';

export default function ItemsPage() {
  return <FeatureItems />;
}
```

**Biznes logika va UI hech qachon `pages/` da bo'lmaydi.**

### 2.4. Umumiy UI — `Cus` prefiksi

- Joylashuv: `src/components/ui/<name>/Cus<Name>.tsx` — **default export**.
- Barrel: `src/components/ui/index.ts` ga qo'shiladi.
- Native `<button>` / `<input>` / `<select>` ni umumiy UI da ishlatma — `Cus*` yarat yoki mavjudini ishlat.
- Tailwind class'larini **doim** `cn()` (`@/utils/cn`) orqali birlashtir.

Komponent shabloni (client'dagi `CusButton` uslubi — variantlar `Record` map orqali, inline shart emas):

```tsx
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
};

const VARIANT_STYLES: Record<Variant, string> = {
  primary: 'bg-primary text-primary-fg hover:bg-primary-hover',
  secondary: 'bg-surface-2 text-foreground hover:bg-border-subtle',
  ghost: 'bg-transparent text-foreground hover:bg-surface-2',
  danger: 'bg-danger text-white hover:opacity-90',
};

const SIZE_STYLES: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

export default function CusButton({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-60',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        fullWidth && 'w-full',
        className,
      )}
    />
  );
}
```

### 2.5. Marshrutlar — `constants/routes.ts`

Path'lar **bitta joyda**, string literal sifatida tarqatilmaydi:

```ts
export const ROUTES = {
  DASHBOARD: '/',
  ITEMS: '/items',
  ITEM_NEW: '/items/new',
  ITEM_EDIT: '/items/:id/edit',
  CATEGORIES: '/categories',
  BOOKINGS: '/bookings',
  REVIEWS: '/reviews',
  NEWS: '/news',
  PROMOTIONS: '/promotions',
  SETTINGS: '/settings',
  LOGIN: '/login',
} as const;

// Parametrli path uchun — helper funksiya (qo'lda shablon yozma)
export function itemEditPath(id: string): string {
  return `/items/${id}/edit`;
}

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
```

`routes/AppRoutes.tsx` — hamma sahifa `lazy()`, bitta `<Suspense>` fallback:

```tsx
const ItemsPage = lazy(() => import('@/pages/items'));
// ...
<Route path={ROUTES.ITEMS} element={<ItemsPage />} />
```

### 2.6. Zustand store

`src/store/zustand/` — har biri `use<Name>Store.ts`, barrel `index.ts` ga qo'shiladi.
`persist` kaliti **prefiksli**: adminkada `bridal-admin-<name>`.

```ts
export const useAdminUiStore = create<State>()(
  persist((set, get) => ({ /* ... */ }), { name: 'bridal-admin-ui' }),
);
```

Store shakli client'dagi kabi: holat maydonlari + ularni o'zgartiruvchi funksiyalar bitta obyektda (`useBookingStore` dagi `add` / `cancel` / `remove` / `datesForItem` naqshi).

**Store'ga API cache saqlama** — bu server state, alohida qatlam (4.4-bo'lim).

### 2.7. Ranglar — hech qachon hex yozma

`src/index.css` da CSS variables (light + dark), `tailwind.config.js` da Tailwind token'iga map qilingan.

| Vazifa | Token |
|---|---|
| CTA / active | `bg-primary text-primary-fg`, `hover:bg-primary-hover` |
| Badge / urg'u | `bg-accent text-accent-fg` |
| O'chirish / xato | `bg-danger`, `text-danger`, `bg-danger-soft` |
| Ogohlantirish / kutilmoqda | `text-warning`, `bg-warning-soft` |
| Muvaffaqiyat / tasdiqlangan | `bg-success`, `bg-success-soft` |
| Kartochka / panel fon | `bg-surface`, `bg-surface-2` |
| Sahifa fon | `bg-background` |
| Matn | `text-foreground`, `text-muted`, `text-subtle` |
| Chegara | `border-border`, `border-border-subtle` |

```tsx
<div className="bg-[#B08D57]" />   // NOTO'G'RI
<div className="bg-primary" />     // to'g'ri
```

Shrift: `font-sans` (Inter) — adminkada asosiy; `font-serif` (Cormorant Garamond) — faqat brend aksenti.
Soya: `shadow-card`, `shadow-card-hover`.
Dark mode — Tailwind `dark:` prefiksi (class strategiyasi), `useThemeStore.init()` `<html>` ga `dark` klassini qo'yadi.

---

## 3. PAPKA STRUKTURASI (adminka uchun to'liq)

```
admin/
  src/
    api/
      client.ts                  fetch wrapper (base URL, header, xato normalizatsiyasi)
      types.api.ts               ApiError, Paginated<T>, ListParams
      endpoints.ts               URL'lar bitta joyda

    components/
      ui/                        umumiy UI — Cus prefiksi, barrel: index.ts
        button/CusButton.tsx
        input/CusInput.tsx
        textarea/CusTextarea.tsx
        select/CusSelect.tsx
        checkbox/CusCheckbox.tsx
        switch/CusSwitch.tsx
        badge/CusBadge.tsx
        card/CusCard.tsx
        table/CusTable.tsx           ADMINKAGA XOS
        modal/CusModal.tsx           ADMINKAGA XOS
        confirm/CusConfirm.tsx       ADMINKAGA XOS (o'chirishni tasdiqlash)
        pagination/CusPagination.tsx
        tabs/CusTabs.tsx
        file-upload/CusFileUpload.tsx
        skeleton/CusSkeleton.tsx
        toast/CusToast.tsx
        empty/CusEmpty.tsx
        index.ts
      form/                      forma qurilish bloklari (Cus'lar ustida)
        FormField.tsx            label + xato + hint o'ramasi
        FormSection.tsx          forma bo'limi (sarlavha + grid)
        FormActions.tsx          "Сохранить / Отмена" paneli
      data/                      jadval qurilish bloklari
        DataTable.tsx            CusTable ustida: saralash, tanlash, bo'sh holat
        TableToolbar.tsx         qidiruv + filtr + "Добавить"
        BulkActions.tsx          ommaviy amallar paneli

    constants/
      app.ts                     APP_NAME, STORAGE_PREFIX, APP_LOCALE, PAGE_SIZE
      routes.ts                  ROUTES + path helper'lar
      nav.ts                     yon paneldagi menyu daraxti (ikonka + label + route)
      permissions.ts             rol -> ruxsat matritsasi

    features/
      auth/                      kirish (login), sessiya, guard
      dashboard/                 statistika kartochkalari, so'nggi bronlar
      items/                     KATALOG CRUD (ko'ylak + aksessuar) — eng katta feature
      categories/                kategoriya va subkategoriya
      bookings/                  примерка arizalari (status boshqaruvi)
      reviews/                   sharhlar moderatsiyasi
      news/                      yangiliklar
      promotions/                aksiyalar
      media/                     rasm kutubxonasi (yuklash, tanlash)
      settings/                  salon ma'lumotlari, ish vaqti, kontaktlar

    hooks/                       global: useDebounce, useMediaQuery, usePagination,
                                 useTableSort, useConfirm

    layout/
      AdminLayout.tsx            sidebar + topbar + <Outlet/>
      sidebar/Sidebar.tsx
      sidebar/SidebarItem.tsx
      topbar/Topbar.tsx
      topbar/UserMenu.tsx

    lib/                         past darajali yordamchilar va 3rd-party sozlamalari
      storage.ts                 localStorage o'ramasi (prefiks bilan)
      validate.ts                forma validatsiyasi

    pages/                       faqat Feature<Name> ni chaqiradi
      dashboard/index.tsx
      items/index.tsx
      items/new.tsx
      items/edit.tsx
      categories/index.tsx
      bookings/index.tsx
      reviews/index.tsx
      news/index.tsx
      news/edit.tsx
      promotions/index.tsx
      settings/index.tsx
      login/index.tsx

    routes/
      AppRoutes.tsx              lazy() + Suspense + guard

    store/zustand/
      index.ts                   barrel
      useAuthStore.ts            bridal-admin-auth
      useUiStore.ts              bridal-admin-ui (sidebar yig'ilgan/ochiq)
      useThemeStore.ts           bridal-admin-theme

    types/                       DOMEN — client bilan bir xil manba (4.1-bo'lim)
      catalog.ts
      booking.ts
      review.ts
      news.ts
      promotion.ts
      index.ts

    utils/
      cn.ts
      formatCurrency.ts
      formatDate.ts
      labels.ts                  enum -> ruscha yorliq map'lari
      price.ts                   primaryPrice / offerPrice / discountPercent
      slug.ts                    nomdan slug generatsiyasi

    index.css                    CSS variables (client'dan ko'chiriladi)
    App.tsx
    main.tsx
  tailwind.config.js             client'dagi token map'i bilan bir xil
  tsconfig.app.json              @/* alias
  vite.config.ts                 @ alias (PWA plugin KERAK EMAS)
```

**Eslatma:** adminka PWA emas — `vite-plugin-pwa`, service worker, `manifest` qo'shma.

---

## 4. MA'LUMOT QATLAMI

### 4.1. Domen tiplari — bitta haqiqat manbai

Client va adminka **bir xil domen modelini** ishlatadi. Manba:
`src/features/catalog/helper.types.catalog.ts` va `docs/product-schema.md`.

Nusxa olganda **hech narsani o'zgartirma** — maydon nomi, union qiymatlari, majburiylik bir xil qolishi shart. Aks holda ikkita ilova bir-birini tushunmay qoladi.

Asosiy tuzilma:

```
CatalogItem = Dress | Accessory        discriminated union, ajratuvchi maydon: kind
    ├── BaseItem   umumiy maydonlar (id, slug, sku, categoryId, name, narx,
    │              offerTypes[], variants[], isAvailable, bookedDates[], meta)
    ├── Dress      kind: 'dress'      + silhouette, neckline, sleeve, fabrics[],
    │                                   shade, sizes: DressSize[], trainLength, hasCorset
    └── Accessory  kind: 'accessory'  + accessoryType, material, oneSize | sizeLabels[]

Category ──< Subcategory
CatalogItem.variants ──< ItemVariant   (har rangda o'z fotolari: mainImage + otherImages)
Dress.sizes          ──< DressSize     (RU 40–56 + available bayrog'i)
```

Type guard'lar: `isDress(item)` / `isAccessory(item)`.

Enum-like union'lar `as const` massiv sifatida yoziladi — bu bir vaqtda **iteratsiya manbai** ham (select variantlari, filtr chip'lari):

```ts
export const OFFER_TYPES = ['rent', 'sale', 'tailoring'] as const;
export type OfferType = (typeof OFFER_TYPES)[number];
```

**Forma uchun muhim:** `kind` tanlanganda formaning pastki qismi **to'liq almashadi** — bu ikkita boshqa forma, bitta shartli forma emas.

**Yangi maydon qo'shsang** — ikkala shoxni ham tekshir (`Dress` va `Accessory`), client tomonda ham (`ItemSpecs`, `ItemInfo`, `useSearchItems`).

### 4.2. Narx — qo'lda hisoblama

Narx logikasi client'da `features/catalog/utils/price.ts` da yozilgan:
`primaryPrice(item)` / `secondaryPrice(item)` / `offerPrice(item, offer)` / `discountPercent(item)`.
Qoida: **ijara mavjud bo'lsa u ustuvor**, `tailoring` da narx yo'q (o'lchovdan keyin hisoblanadi).

Adminkada shu funksiyalarni `utils/price.ts` ga nusxa qil va ro'yxat/preview'da ishlat — `item.rentPrice` ni to'g'ridan-to'g'ri ko'rsatma.
`offerTypes` bo'sh bo'lsa yoki tanlangan taklifga mos narx kiritilmagan bo'lsa — formada **saqlashga yo'l qo'yma**, validatsiya xatosini ko'rsat.

### 4.3. Yorliqlar — inline rus matni yozma

Enum qiymatini ekranda ko'rsatish uchun `utils/labels.ts` dagi map'lar:
`KIND_LABELS`, `OFFER_LABELS`, `OFFER_SHORT_LABELS`, `SILHOUETTE_LABELS`, `NECKLINE_LABELS`, `SLEEVE_LABELS`, `FABRIC_LABELS`, `SHADE_LABELS`, `ACCESSORY_TYPE_LABELS`.

Bu map'lar **select/checkbox variantlarini ham** generatsiya qiladi:

```ts
const options = SILHOUETTES.map((v) => ({ value: v, label: SILHOUETTE_LABELS[v] }));
```

### 4.4. Server state — Zustand'da SAQLAMA

Bu tizimda **client state** (UI holati, sessiya, tema) va **server state** (katalog ma'lumoti) qat'iy ajratilgan:

- Client state -> Zustand + `persist`.
- Server state -> **alohida qatlam**: `api/` + feature ichidagi so'rov hook'lari (`features/<name>/api.<name>.ts`).

Backend hali yo'q ekan, adminka **mock adapter** ustida ishlaydi: `api/client.ts` ichida `USE_MOCK` bayrog'i, mock rejimda `mockdata.*` ni o'qib/yozadi (`localStorage`). Backend paydo bo'lganda faqat `api/client.ts` almashadi — feature'lar tegilmaydi.

> **QAROR TALAB QILINADI:** server state cache uchun kutubxona (TanStack Query) qo'shilsinmi yoki oddiy `useState + useEffect` hook'lar yetarlimi — buni kod yozishdan **oldin** so'rab ol. Tavsiya: CRUD, invalidatsiya va optimistik yangilanish ko'p bo'lgani uchun **TanStack Query**.

---

## 5. ADMINKA EKRANLARI (CRUD matritsasi)

| Feature | Ro'yxat | Yaratish | Tahrir | O'chirish | Qo'shimcha |
|---|---|---|---|---|---|
| `items` | jadval + filtr (kind, kategoriya, status, taklif turi) + qidiruv | ha, ko'p bo'limli forma | ha | ha (soft) | variant/rasm boshqaruvi, o'lcham mavjudligi, band sanalar |
| `categories` | daraxt (kategoriya -> subkategoriya) | ha | ha | ichida tovar bo'lsa bloklash | tartib, rasm |
| `bookings` | jadval + sana/status filtri | yo'q (mijoz yaratadi) | status: `pending -> confirmed / cancelled` | ha | kalendar ko'rinishi, band slotlar |
| `reviews` | jadval + reyting filtri | yo'q | moderatsiya (ko'rsatish/yashirish) | ha | rasm galereyasi, bog'langan tovar |
| `news` | jadval | ha | ha | ha | slug avtogeneratsiya, cover, `publishedAt` |
| `promotions` | jadval | ha | ha | ha | muddat (`startsAt`/`endsAt`), `discountPercent`, faol/tugagan |
| `media` | grid | yuklash | yo'q | ha | tovar formasidan tanlash uchun picker |
| `settings` | forma | yo'q | ha | yo'q | kontaktlar, ish vaqti, примерка slotlari (`FITTING_SLOTS`) |
| `dashboard` | kartochkalar | yo'q | yo'q | yo'q | bugungi bronlar, yangi sharhlar, tugagan tovarlar |

**Status ranglari (token bilan):**
`pending` -> `bg-warning-soft text-warning` · `confirmed` -> `bg-success-soft text-success` · `cancelled` -> `bg-danger-soft text-danger`.

---

## 6. NOMLASH KONVENSIYALARI (qat'iy)

| Nima | Shakl | Misol |
|---|---|---|
| Feature entry | `Feature<Name>.tsx`, default export | `FeatureItems.tsx` |
| Feature tiplari | `helper.types.<name>.ts` | `helper.types.items.ts` |
| Feature API | `api.<name>.ts` | `api.items.ts` |
| Mock ma'lumot | `mockdata.<name>.ts` | `mockdata.items.ts` |
| Umumiy UI | `Cus<Name>.tsx`, `components/ui/<kebab>/` da | `CusModal.tsx` |
| Feature ichidagi komponent | prefiksisiz PascalCase | `ItemForm.tsx` |
| Hook | `use<Name>.ts` | `useItemForm.ts` |
| Store | `use<Name>Store.ts` | `useAuthStore.ts` |
| Sahifa | `pages/<kebab>/index.tsx` | `pages/items/index.tsx` |
| Konstanta | `SCREAMING_SNAKE` | `ITEM_STATUSES` |
| Enum-like union | `as const` massiv + `(typeof X)[number]` | `export const OFFER_TYPES = [...] as const;` |

**Union tiplarni TypeScript `enum` bilan yozma** — loyihada hamma joyda `as const` massiv uslubi ishlatilgan.

---

## 7. QILMA (anti-pattern'lar)

- `../` relative import — path alias'ni chetlab o'tish.
- Hex kod inline: `bg-[#B08D57]` -> `bg-primary` ishlat.
- Native `<button>` / `<input>` / `<select>` umumiy UI da.
- `pages/<name>/index.tsx` ga biznes logika qo'yish.
- Narxni qo'lda hisoblash — `utils/price.ts` bor.
- Zustand store'ga server javobini (API cache) saqlash.
- Yangi state kutubxonasi (Redux, Jotai) qo'shish.
- Inline rus matni enum yorlig'i sifatida — `*_LABELS` map ishlat.
- Domen tiplarini adminkada "soddalashtirish" — client bilan mos kelmay qoladi.
- Adminkaga PWA / service worker qo'shish.
- Og'ir kutubxonani (chart, rich-text, calendar) barrel'ga qo'shish — doim `lazy()`.
  Client'da bunga misol: `CusCalendar` barrel'da yo'q, chunki Chakra UI ni tortadi (~390 kB).

---

## 8. BIRINCHI TOPSHIRIQ

Yuqoridagi qoidalarga amal qilib, quyidagini bajar:

1. **Loyiha skeletini yarat** — 3-bo'limdagi papka daraxti bo'yicha, ishlaydigan holatda:
   - `vite.config.ts`, `tsconfig.app.json` (`@/*` alias), `tailwind.config.js` (client'dagi token map'i), `index.css` (CSS variables light + dark).
   - `AdminLayout` (sidebar + topbar), `AppRoutes` (`lazy()` + `Suspense`), `constants/routes.ts`, `constants/nav.ts`.
2. **UI kit minimal to'plami:** `CusButton`, `CusInput`, `CusSelect`, `CusTextarea`, `CusBadge`, `CusCard`, `CusModal`, `CusConfirm`, `CusTable`, `CusPagination`, `CusToast`, `CusSkeleton`, `CusEmpty` + barrel `index.ts`.
3. **Domen tiplarini ko'chir:** `docs/product-schema.md` dagi to'liq TypeScript'ni `src/types/catalog.ts` ga — o'zgartirishsiz.
4. **Bitta feature'ni to'liq qil (namuna sifatida):** `features/items/` — ro'yxat (jadval + filtr + qidiruv + pagination), yaratish/tahrir formasi (`kind` bo'yicha ikki shox), o'chirish tasdig'i. Qolgan feature'lar shu naqsh bo'yicha nusxalanadi.
5. Qolgan feature'lar uchun **faqat papka + `Feature<Name>.tsx` zagotovka** (TODO izohi bilan) yarat.

### Ishni boshlashdan oldin so'ra

- Adminka **alohida repo** bo'ladimi yoki shu repo ichida (`admin/` papka / monorepo)?
- Domen tiplari **nusxa** qilinadimi yoki umumiy paket (`packages/domain`) ajratiladimi?
- Server state uchun **TanStack Query** qo'shiladimi (tavsiya: ha)?
- Autentifikatsiya qanday — oddiy parol (mock) yoki backend token?

### Qabul mezonlari

- [ ] `npm run build` (`tsc -b && vite build`) xatosiz o'tadi.
- [ ] Butun loyihada bitta ham `../` import yo'q.
- [ ] Butun loyihada bitta ham inline hex rang yo'q.
- [ ] Har bir `pages/*/index.tsx` — 5 qatordan oshmaydi.
- [ ] Har bir umumiy UI komponent `Cus` prefiksi bilan va barrel'da.
- [ ] Light va dark rejim ikkalasi ham to'g'ri ko'rinadi.
- [ ] Domen tiplari `docs/product-schema.md` bilan 1:1 mos.
