# Amira Bridal — kelin ko'ylaklari saloni

React 18 PWA — kelin ko'ylaklari va aksessuarlar katalogi + примерка bron tizimi.
Stack: Vite + TypeScript + Tailwind + Zustand + React Router v6.

Biznes modeli: **ijara (аренда) + sotuv (продажа) + o'lchov bo'yicha tikish (пошив)**.
Backend yo'q — barcha ma'lumot `mockdata.*` fayllarida, buyurtma Telegram/telefon orqali ketadi.

## Muloqot tili
O'zbek tilida javob ber. Kod izohlari va commit xabarlari ham o'zbekcha bo'lsin. UI matn — rus tilida (`ru-RU` lokal, `constants/app.ts`).

## Skriptlar
- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build`
- `npm run preview` — build'ni ko'rish
- `npm run lint` — ESLint (**hozircha ishlamaydi**: eslint paketi va config qo'shilmagan)

## Path alias
Import'lar **doim** `@/` orqali (`tsconfig.app.json` da `"@/*": ["src/*"]`).
```ts
import { CusButton } from '@/components/ui';       // to'g'ri
import { CusButton } from '../../components/ui';   // noto'g'ri
```
Faqat bir xil papka ichidagi qo'shni fayllar uchun `./file` mumkin.

## Papka strukturasi
Feature-based arxitektura:

```
src/
  components/ui/<name>/Cus<Name>.tsx   umumiy UI (barrel: components/ui/index.ts)
  constants/                            app.ts, routes.ts, contact.ts, social.ts
  features/<name>/
    hooks/ components/ utils/
    Feature<Name>.tsx                   default export (entry)
    helper.types.<name>.ts
    mockdata.<name>.ts
  hooks/                                global (useDebounce, useMediaQuery, useHideOnScroll)
  layout/                               AppLayout + header/ + footer/
  pages/<name>/index.tsx                faqat Feature<Name> ni chaqiradi
  routes/AppRoutes.tsx                  lazy() + Suspense
  store/zustand/                        barrel: index.ts
  utils/                                cn.ts, formatCurrency.ts
```

**Qoida:** `pages/<name>/index.tsx` bir necha qatordan iborat — faqat `Feature<Name>` ni qaytaradi. Biznes logika va UI — `features/<name>/` da.

## Feature'lar
| Feature | Vazifa |
|---|---|
| `catalog/` | Domen ma'lumoti (tiplar, mockdata) + katalog ekrani (qidiruv, filtr, kind tab) |
| `item/` | Bitta model sahifasi (galereya, o'lcham, xarakteristika) |
| `booking/` | Примерка bron: kalendar + vaqt sloti + forma |
| `favorites/` | Saqlangan modellar |
| `new-arrivals/` | Yangi kelganlar lentasi (sana bo'yicha guruhlangan) |
| `news/` | Salon maqolalari (ro'yxat + detal) |
| `promotions/` | Aksiyalar (ro'yxat + detal) |
| `review/` | Mijozlar sharhlari |
| `home/`, `profile/`, `preview/` | Bosh sahifa, profil, UI kit demo |

## Domen modeli (`features/catalog/helper.types.catalog.ts`)
`CatalogItem` — discriminated union: `Dress | Accessory`, ajratuvchi maydon `kind`.

- **Umumiy:** `offerTypes: ('rent'|'sale'|'tailoring')[]`, `rentPrice`, `salePrice`, `deposit`, `oldPrice`, `variants[]`, `bookedDates[]`.
- **Dress:** `silhouette`, `neckline`, `sleeve`, `fabrics[]`, `shade`, `sizes: DressSize[]` (RU 40–56 + `available`), `trainLength`, `hasCorset`.
- **Accessory:** `accessoryType`, `material`, `oneSize` yoki `sizeLabels[]`.

`isDress(item)` / `isAccessory(item)` — type guard'lar. Yangi maydon qo'shganda ikkala shoxni ham tekshir (`ItemSpecs`, `ItemInfo`, `useSearchItems`).

**Narx:** hech qachon `item.rentPrice` ni to'g'ridan-to'g'ri ko'rsatma — `primaryPrice(item)` / `secondaryPrice(item)` / `offerPrice(item, offer)` / `discountPercent(item)` (`utils/price.ts`) ishlat. Ijara mavjud bo'lsa u ustuvor; `offerPrice` — foydalanuvchi tanlagan taklif turi bo'yicha (tovar sahifasidagi "Аренда / Покупка / Пошив" pereklyuchateli).

**Yorliqlar:** enum qiymatini ekranda ko'rsatish uchun `utils/labels.ts` dagi `*_LABELS` map'lari (`SILHOUETTE_LABELS`, `FABRIC_LABELS`, ...; tor joylar uchun `OFFER_SHORT_LABELS`). Rus matnini inline yozma.

## Yangi sahifa qo'shish
1. `constants/routes.ts` → `ROUTES` obyektiga path qo'shish.
2. `routes/AppRoutes.tsx` → `lazy()` + `<Route>` qo'shish.
3. `pages/<name>/index.tsx` va `features/<name>/Feature<Name>.tsx` yaratish.

## UI konvensiyalar
- **Umumiy UI komponentlar** `Cus` prefiksi bilan: `CusButton`, `CusInput`, `CusCard`, `CusBadge`, `CusSkeleton`, `CusSheet`, `CusToast`, `CusSegment`, `CusAccordion`, `CusListItem`, `CusCalendar`.
- Har biri `src/components/ui/<name>/Cus<Name>.tsx` (default export), `components/ui/index.ts` ga barrel qo'shiladi.
- **`CusCalendar` barrel'da yo'q** — u Chakra UI ni tortadi (~390 kB). Faqat `lazy(() => import('@/components/ui/calendar/CusCalendar'))` orqali.
- Feature ichidagi lokal komponent — `features/<name>/components/` (Cus prefiksisiz).
- Tailwind class'larini `cn()` (dan `@/utils/cn`) orqali birlashtir.

## State (Zustand)
`src/store/zustand/` — barcha store persist bilan, `bridal-` prefiksli localStorage kalit:
- `useBookingStore` (`bridal-bookings`) — примерка arizalari
- `useFavoritesStore` (`bridal-favorites`)
- `useRecentlyViewedStore` (`bridal-recent`)
- `useUserStore` (`bridal-user`), `useThemeStore` (`bridal-theme`)

Yangi global state kerak bo'lsa: `use<Name>Store.ts` yarat, `persist({ name: 'bridal-<name>' })` ishlat, barrel'ga qo'sh.

Server state (API cache) uchun Zustand ishlatma — kerak bo'lsa alohida yechim tanlash uchun so'rab ol.

## Ranglar tizimi
`src/index.css` da CSS variables (light + dark), `tailwind.config.js` da Tailwind token'lariga map qilingan. **Hech qachon hex kod yozma**, doim token ishlat:

| Vazifa | Token |
|---|---|
| CTA / active | `bg-primary text-primary-fg`, `hover:bg-primary-hover` (champagne gold) |
| "Novinka" / trend badge | `bg-accent text-accent-fg` (blush) |
| Sale / chegirma / like | `bg-danger` |
| Rating star | `text-warning` |
| Mavjud / muvaffaqiyat | `bg-success` |
| Card fon | `bg-surface`, `bg-surface-2` |
| Matn | `text-foreground`, `text-muted`, `text-subtle` |
| Chegara | `border-border`, `border-border-subtle` |

**Shrift:** `font-sans` (Inter) — asosiy matn; `font-serif` (Cormorant Garamond) — brend nomi va bo'lim sarlavhalari.

**Utilities (index.css):**
- `shadow-card`, `shadow-card-hover` — yumshoq soya.
- `bg-brand-gradient` — story ring / accent CTA (oltin → pudra).
- `bg-overlay-dark`, `bg-overlay-dark-strong`, `bg-overlay-light`, `bg-overlay-gradient-b` — rasm ustidagi matn/badge uchun.

Dark mode Tailwind `dark:` prefiksi orqali (class strategy). `useThemeStore.init()` `<html>` ga `dark` klassini qo'shadi.

## Qilma
- `../` relative import (path alias'ni chetlab o'tish).
- Native `<button>` / `<input>` umumiy UI da (Cus komponent yarat yoki mavjudini ishlat).
- Hex kod inline: `bg-[#B08D57]` — token ishlat (`bg-primary`).
- `CusCalendar` ni barrel'dan import qilish — bundle'ni shishiradi.
- Narxni qo'lda hisoblash — `utils/price.ts` bor.
- Store'ga API cache saqlash — bu server state.
- Yangi state kutubxonasi (Redux, Jotai va h.k.) qo'shish — Zustand yetadi.
- `pages/<name>/index.tsx` ga biznes logika qo'yish — `features/` ga joyla.
