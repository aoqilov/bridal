# Amira Bridal — Design Tokens

Bu hujjat `src/index.css`, `tailwind.config.js` va `src/components/ui/**` dan olingan **aniq** qiymatlar.
Yangi ekran chizishda shu qiymatlardan chiqmang — hech qachon yangi hex o'ylab topmang.

Loyiha: React 18 + Vite + TypeScript + Tailwind 3 (`darkMode: 'class'`) + Zustand.
UI matni — **rus tilida** (`ru-RU`). Brend: kelin ko'ylaklari saloni — ivory / champagne gold / blush.

---

## 1. Ranglar

CSS o'zgaruvchilar `:root` (light) va `.dark` (dark) da e'lon qilingan,
`tailwind.config.js` da Tailwind token'lariga map qilingan.

### Light (`:root`)

| Token | Tailwind | Hex |
|---|---|---|
| `--color-background` | `bg-background` | `#FFFDFB` |
| `--color-surface` | `bg-surface` | `#FAF6F2` |
| `--color-surface-2` | `bg-surface-2` | `#F1E9E2` |
| `--color-border` | `border-border` | `#E3D8CE` |
| `--color-border-subtle` | `border-border-subtle` | `#F1E9E2` |
| `--color-foreground` | `text-foreground` | `#2B2320` |
| `--color-muted` | `text-muted` | `#8C7E75` |
| `--color-subtle` | `text-subtle` | `#C2B4A9` |
| `--color-primary` | `bg-primary` | `#B08D57` |
| `--color-primary-hover` | `hover:bg-primary-hover` | `#9A7A46` |
| `--color-primary-fg` | `text-primary-fg` | `#FFFFFF` |
| `--color-primary-soft` | `bg-primary-soft` | `#F5EBDD` |
| `--color-accent` | `bg-accent` | `#D8A7B1` |
| `--color-accent-hover` | `hover:bg-accent-hover` | `#C88F9B` |
| `--color-accent-fg` | `text-accent-fg` | `#3A2A2E` |
| `--color-accent-soft` | `bg-accent-soft` | `#F9EDEF` |
| `--color-danger` | `bg-danger` | `#C4485B` |
| `--color-danger-soft` | `bg-danger-soft` | `#FBE9EC` |
| `--color-danger-fg` | `text-danger-fg` | `#FFFFFF` |
| `--color-success` | `bg-success` | `#5B8C6E` |
| `--color-success-soft` | `bg-success-soft` | `#E7F1EA` |
| `--color-warning` | `bg-warning` | `#C9A227` |
| `--color-warning-soft` | `bg-warning-soft` | `#FAF0D6` |

### Dark (`.dark`)

| Token | Hex |
|---|---|
| `--color-background` | `#14100E` |
| `--color-surface` | `#1E1917` |
| `--color-surface-2` | `#2A2320` |
| `--color-border` | `#3A312C` |
| `--color-border-subtle` | `#241E1B` |
| `--color-foreground` | `#EFE7E0` |
| `--color-muted` | `#A2938A` |
| `--color-subtle` | `#6E6058` |
| `--color-primary` | `#C9A063` |
| `--color-primary-hover` | `#DBB77E` |
| `--color-primary-fg` | `#241B10` |
| `--color-primary-soft` | `#3A2E1C` |
| `--color-accent` | `#D8A7B1` |
| `--color-accent-hover` | `#E6BDC5` |
| `--color-accent-fg` | `#2B1B20` |
| `--color-accent-soft` | `#3A272C` |
| `--color-danger` | `#E06A7B` |
| `--color-danger-soft` | `#3D2027` |
| `--color-danger-fg` | `#2B1216` |
| `--color-success` | `#7BB394` |
| `--color-success-soft` | `#1E3328` |
| `--color-warning` | `#D9B24C` |
| `--color-warning-soft` | `#3A2F14` |

### Mavzudan qat'i nazar (dark'da qayta e'lon qilinmaydi)

Rasm ustidagi qoplama qat'iy rangda, shuning uchun uning matni ham qat'iy:

| Token | Hex |
|---|---|
| `--color-overlay-fg` | `#FFFFFF` |
| `--color-overlay-fg-dark` | `#2B2320` |

Scroll polosasi: light `rgba(43,35,32,0.10)` / hover `rgba(43,35,32,0.22)`;
dark `rgba(239,231,224,0.10)` / hover `rgba(239,231,224,0.24)`.

### Qaysi rang qayerda

| Vazifa | Token |
|---|---|
| CTA / active holat | `bg-primary text-primary-fg`, `hover:bg-primary-hover` |
| «Новинка» / trend badge | `bg-accent text-accent-fg` |
| Chegirma / sale / like | `bg-danger` |
| Reyting yulduzi | `text-warning` |
| Mavjud / muvaffaqiyat | `bg-success` |
| Kartochka foni | `bg-surface`, `bg-surface-2` |
| Matn | `text-foreground` → `text-muted` → `text-subtle` |
| Chegara | `border-border`, `border-border-subtle` |

---

## 2. Tipografika

```js
fontFamily: {
  sans:  ['Inter', 'system-ui', 'sans-serif'],
  serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
  logo:  ['"Comic Relief"', 'system-ui', 'sans-serif'],
}
```

- `font-sans` (Inter) — asosiy matn, tugmalar, formalar, jadvallar.
- `font-serif` (Cormorant Garamond) — **model nomi** va **bo'lim sarlavhalari**.
- `font-logo` (Comic Relief) — **faqat** header'dagi brend so'zi. Boshqa joyda ishlatilmaydi.

`body`: `-webkit-font-smoothing: antialiased`, `transition: background-color .2s ease, color .2s ease`.

### O'lchamlar (Tailwind standart shkalasi — o'zgartirilmagan)

| Klass | px / line-height |
|---|---|
| `text-[9px]` | 9 |
| `text-[10px]` | 10 |
| `text-xs` | 12 / 16 |
| `text-sm` | 14 / 20 |
| `text-base` | 16 / 24 |
| `text-lg` | 18 / 28 |
| `text-xl` | 20 / 28 |
| `text-2xl` | 24 / 32 |

Qalinlik: `font-medium` 500, `font-semibold` 600, `font-bold` 700.

---

## 3. Radius, soya, animatsiya

### Radius (Tailwind standart)

| Klass | px | Qayerda |
|---|---|---|
| `rounded-lg` | 8 | segment ichidagi element, skeleton |
| `rounded-xl` | 12 | **asosiy**: tugma, input, kartochka, ikonka quti |
| `rounded-2xl` | 16 | sheet tepasi, yirik bloklar |
| `rounded-full` | 9999 | badge, avatar, switch, rang nuqtasi |

### Soyalar (`tailwind.config.js`)

```css
shadow-card:       0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03);
shadow-card-hover: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
shadow-sheet:      0 -8px 24px rgba(0,0,0,0.10);   /* rasm ustidan ko'tariladigan panel */
```

### Utilities (`src/index.css`)

```css
.bg-brand-gradient {
  background: linear-gradient(45deg, #B08D57 0%, #D8A7B1 45%, #E8D9C0 75%, #B08D57 100%);
}
.bg-overlay-dark        { background-color: rgba(0,0,0,0.4); }
.bg-overlay-dark-strong { background-color: rgba(0,0,0,0.6); }
.bg-overlay-light       { background-color: rgba(255,255,255,0.7); }
.bg-overlay-gradient-b  { background: linear-gradient(to top,
                            rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%); }
.bg-overlay-gradient-t  { background: linear-gradient(to bottom,
                            rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0) 100%); }

.h-screen-safe { height: 100vh; height: 100dvh; }
.pb-safe       { padding-bottom: min(env(safe-area-inset-bottom, 0px), var(--safe-bottom-max)); }
                 /* --safe-bottom-max: 1rem */
.subtle-scrollbar { scrollbar-width: thin; /* 4px, rangi --color-scrollbar */ }
```

### Animatsiyalar

```css
.animate-sheet-up    { animation: sheet-up    .28s cubic-bezier(.32,.72,0,1); } /* translateY(100%)→0 */
.animate-sheet-right { animation: sheet-right .28s cubic-bezier(.32,.72,0,1); } /* translateX(100%)→0 */
.animate-overlay-in  { animation: overlay-in  .2s  ease-out; }                  /* opacity 0→1 */
```

`@media (prefers-reduced-motion: reduce)` da uchalasi ham `animation: none`.

---

## 4. Komponentlar (aniq qiymatlar)

Barcha umumiy komponentlar `Cus` prefiksli, `src/components/ui/<name>/Cus<Name>.tsx`.

### CusButton

```
rounded-xl (12) · font-medium (500) · gap 8 · transition-colors
focus: ring-2 ring-primary + ring-offset-2 ring-offset-background
disabled: opacity-60, cursor-not-allowed

sm  h 36  px 12  text-sm (14)
md  h 44  px 16  text-sm (14)      ← standart
lg  h 48  px 20  text-base (16)

primary    bg-primary   text-primary-fg   hover:bg-primary-hover
secondary  bg-surface-2 text-foreground   hover:bg-border-subtle  active:bg-border
ghost      transparent  text-foreground   hover:bg-surface-2
danger     bg-danger    text-white        hover:opacity-90  active:opacity-80

loading spinner: 16×16, border-2 border-current border-t-transparent, animate-spin
```

### CusInput

```
h 44 · rounded-xl (12) · border 1px border-border · bg-surface · text-sm (14)
padding: pl 16 (ikonkasiz) / pl 40 (chap ikonka) · pr 16 / pr 40 (o'ng ikonka)
placeholder: text-muted

label:  mb 4, text-sm (14), font-medium, text-foreground
focus:  border-primary + ring-2 ring-primary-soft
error:  border-danger  + ring-2 ring-danger-soft
error matni: mt 4, text-xs (12), text-danger
hint:        mt 4, text-xs (12), text-muted
ikonka: 18px, text-muted, chap/o'ng chetdan 12px, vertikal markazda
```

### CusCard

```
rounded-xl (12) · border 1px border-border-subtle · bg-surface · text-foreground
padding: none 0 · sm 8 · md 12 (standart) · lg 16
shadow:  none · sm shadow-sm · md shadow-md
interactive: cursor-pointer, hover:shadow-md, active:scale-[0.99]
```

### CusBadge

```
rounded-full
xs  px 6   py 2  text 9px
sm  px 8   py 2  text 10px
md  px 10  py 4  text 12px       ← standart

default       bg-surface-2   text-foreground     font-medium
brand         bg-primary-soft text-primary       font-medium
success       bg-success-soft text-success       font-medium
warning       bg-warning-soft text-warning       font-medium
danger        bg-danger-soft  text-danger        font-medium
accent-solid  bg-accent      text-accent-fg      font-semibold  ← rasm ustida
danger-solid  bg-danger      text-danger-fg      font-semibold  ← rasm ustida
overlay       bg-overlay-dark text-overlay-fg    font-semibold  ← rasm ustida
```

### CusSegment (tab / pereklyuchatel)

```
track: rounded-xl (12), border 1px border-border-subtle, bg-surface-2, padding 4
item:  rounded-lg (8), font-medium, whitespace-nowrap, gap 6
       sm  px 10  py 4  text-xs (12)
       md  px 12  py 6  text-sm (14)
active:   bg-surface  text-foreground  shadow-card
inactive: text-muted  hover:text-foreground
role="tablist" / role="tab" / aria-selected
```

### CusSwitch

```
track: w 44 · h 24 · rounded-full
  on:  bg-primary
  off: bg-surface-2 + ring-1 ring-inset ring-border
knob:  20×20 · rounded-full · bg-white · shadow-card
       absolute left 2, top 2 · on holatda translateX(20)
disabled: opacity-50
focus-visible: ring-2 ring-primary + ring-offset-2 ring-offset-surface
role="switch" + aria-checked + aria-label
```

### CusListItem (sozlamalar / menyu qatori)

```
qator:   px 16 · py 12 · gap 12 · hover:bg-surface-2
ikonka:  36×36 · rounded-xl (12) · bg-surface-2 · (danger: bg-danger-soft text-danger)
title:       text-sm (14) · font-medium · truncate
description: mt 2 · text-xs (12) · text-muted · truncate
trailing:    text-xs (12) · text-muted
chevron:     FiChevronRight 18px · text-subtle
danger holati: title text-danger
```

### CusSheet (pastdan/o'ngdan chiquvchi panel)

```
overlay: inset-0 · bg-black/50 · backdrop-blur-sm · animate-overlay-in · z-50
panel:   bg-background · text-foreground · shadow-xl · flex-col · overflow-hidden

bottom:  mt-auto · max-h 85vh · w-full · rounded-t-2xl (16) · animate-sheet-up
         grabber: 40×4 · rounded-full · bg-border · mx-auto · mt 8
right:   ml-auto · h-full · w-full max-w 384 · rounded-l-2xl · animate-sheet-right

header:  border-b border-border-subtle · px 16 · py 12
         sarlavha text-base (16) font-semibold
         yopish tugmasi: p 4 · rounded-full · text-muted · hover:bg-surface-2
content: p 16 (standart) · subtle-scrollbar · flex-1 overflow-y-auto
Esc bosilganda yopiladi, body scroll bloklanadi
```

### CusToast

```
joylashuv: fixed · bottom 80 · left 1/2 · translateX(-50%) · z-[100] · gap 8
element:   rounded-xl (12) · px 16 · py 8 · text-sm (14) · shadow-lg
info     bg-foreground text-background
success  bg-success    text-white
error    bg-danger     text-white
warning  bg-warning    text-white
default davomiylik: 3000 ms
```

### CusSkeleton

```
animate-pulse · bg-surface-2
rect   rounded-lg (8)
circle rounded-full
text   h 16 · rounded
```

---

## 5. Layout (mobil ilova)

```
App shell:   h-screen-safe · flex-col · overflow-hidden
  Header
  main:      flex-1 · overflow-y-auto · subtle-scrollbar
  BottomNav

Kontent konteyner: mx-auto max-w-md (448px)   ← barcha ekranlarda
```

### BottomNav

```
h 64 · border-t border-border-subtle · bg-background · pb-safe
max-w-md · 5 ta element · flex-1 har biri
ikonka 24×24 · label 10px · gap 4
active:   text-foreground · font-semibold · ikonka scale-110
inactive: text-muted · hover:text-foreground · active:scale-95
```

Header quyidagi sahifalarda **yashiriladi** (feature o'z panelini ko'rsatadi):
`/catalog`, `/new`, `/review`, `/profile` va ularning ichki sahifalari.
BottomNav `/catalog/:slug` da yashiriladi.

---

## 6. Adminka layout (mockup'dan olingan qiymatlar)

Adminka **desktop**, mobil qobiqdan tashqarida. Frame: 1440×900.

```
sidebar:   240 · bg-surface · border-r border-border
  brand bloki:  h 64 · border-b border-border-subtle · padding 0 16 · gap 10
    logo kvadrat 34×34 · rounded 11 · bg-brand-gradient · serif 19px 700 · #FFFFFF
    brend nomi   serif 17px 600
    ost yozuv    9.5px 600 · uppercase · ls .07em · text-muted
  nav:       padding 16 12 · guruhlar orasida gap 18
    guruh sarlavhasi  9.5px 600 · uppercase · ls .09em · text-subtle · padding 0 12 5
    nav element       h 38 · rounded 12 · padding 0 12 · gap 10 · text 13
      active   bg-primary-soft · text-primary · 600
      inactive text-muted · 500
    sanoq            11px · text-subtle (active'da text-primary 600)
  footer:    border-t border-border-subtle · padding 12 · avatar 32 · nom 12.5 · rol 10.5

topbar:    h 64 · border-b border-border-subtle · padding 0 24
  sarlavha  serif 22px 600
  ost yozuv 11.5px · text-muted
  tugma     h 36 · rounded 12 · text 13

content:   padding 24 · bloklar orasida gap 20 · kenglik 1152 (1440−240−48)

kartochka: rounded 16 · bg-surface · border 1px border-border-subtle · shadow-card
  sarlavha      14.5px 600 · pastida margin 18
  ost yozuv     12px · text-muted

jadval:
  header       h 44 · bg-surface-2 · border-b border-border · label 10.5px 600 uppercase ls .06em
  qator        h 76 · border-b border-border-subtle · padding 0 18 · gap 12
  tanlangan    bg-primary-soft
  footer       h 56 · border-t border-border-subtle
  rasm o'rni   44×58 · rounded 8 · bg-surface-2 · border 1px border-border
  amal tugma   28×28 · rounded 9 · bg-background · border 1px border-border

forma:
  label        12px 500 · text-muted · margin-bottom 6
  maydon       h 44 · rounded 12 · border 1px border-border · bg-background · text 13.5
  textarea     h 92 · padding 12 14 · line-height 1.55
  maydonlar orasida gap 14 (gorizontal) / 16 (vertikal)
  chip (tanlov) h 34 · rounded-full · text 12.5
    tanlangan   bg-primary · text-primary-fg
    tanlanmagan border 1px border-border · bg-background · text-muted
  o'lcham pill  min-w 62 · h 48 · rounded 12
    bor         border 1.5px primary · bg-primary-soft · text-primary
    yo'q        border 1px dashed border-border · text-subtle
  «qo'shish» blok  rounded 12 · border 1.5px dashed border-border · bg-background · text-muted

statistika kartochkasi: h 104 · rounded 16 · padding 16 18
  label 10px 600 uppercase ls .07em · text-muted
  qiymat 28px 600
  ost yozuv 11.5px · text-muted
  ikonka quti 30×30 · rounded 10 · bg-primary-soft · text-primary
```

---

## 7. Qat'iy qoidalar

1. **Hech qachon inline hex yozmang** — `bg-[#B08D57]` ❌, `bg-primary` ✅.
   Yagona istisno: `bg-brand-gradient` va `bg-overlay-*` ichidagi qat'iy qiymatlar (allaqachon `index.css` da).
2. **Emoji ishlatmang** — ikonkalar `react-icons` dan (`Fi`, `Md`, `Lu`, `Pi`, `Tb`, `Go`, `Fa`).
   Mockup'da inline SVG: stroke-based, 1.6–1.8 qalinlik, 24 viewBox, `currentColor`.
3. **Native `<button>` / `<input>` ishlatmang** umumiy UI da — `Cus*` komponentini oling yoki yangisini yarating.
4. **Klasslarni `cn()` orqali birlashtiring** (`@/utils/cn`).
5. **Narxni qo'lda hisoblamang** — `primaryPrice()`, `secondaryPrice()`, `offerPrice()`, `discountPercent()`
   (`src/features/catalog/utils/price.ts`). Format: `formatCurrency()` (`ru-RU`, `UZS`).
6. **Rus matnini inline yozmang** enum uchun — `utils/labels.ts` dagi `*_LABELS` map'lari:
   `KIND_LABELS`, `OFFER_LABELS`, `OFFER_SHORT_LABELS`, `SILHOUETTE_LABELS`, `NECKLINE_LABELS`,
   `SLEEVE_LABELS`, `FABRIC_LABELS`, `SHADE_LABELS`, `ACCESSORY_TYPE_LABELS`.
7. **Import'lar `@/` orqali** — `../` relative import taqiqlangan.
8. **`CusCalendar` ni barrel'dan import qilmang** — u Chakra UI ni tortadi (~390 kB).
   Faqat `lazy(() => import('@/components/ui/calendar/CusCalendar'))`.
9. **Dark mode** — `dark:` prefiksi (class strategiyasi). Token ishlatilsa avtomatik ishlaydi.
10. **Hit target** mobil ekranda 44px dan kichik bo'lmasin.

---

## 8. Domen konteksti (ekran chizishda kerak bo'ladi)

Biznes: **ijara (аренда) + sotuv (продажа) + o'lchov bo'yicha tikish (пошив)**. Backend yo'q.

`CatalogItem` = `Dress | Accessory` (ajratuvchi maydon `kind`).

**Umumiy maydonlar:** `id`, `slug`, `sku?`, `categoryId`, `subcategoryId?`, `tags?`, `name`,
`description?`, `careInstructions?`, `offerTypes: ('rent'|'sale'|'tailoring')[]`, `rentPrice?`,
`salePrice?`, `deposit?`, `oldPrice?`, `currency: 'UZS'`, `variants: ItemVariant[]`,
`defaultVariantId`, `isNew?`, `isFeatured?`, `isPopular?`, `isAvailable`, `bookedDates?: string[]`,
`createdAt`, `updatedAt`, `rating?`, `reviewCount?`.

**Dress:** `silhouette`, `neckline`, `sleeve`, `fabrics[]`, `shade`, `sizes: DressSize[]`
(RU 40–56 + `available`), `trainLength?`, `hasCorset?`, `isMaternityFriendly?`, `collectionYear?`.

**Accessory:** `accessoryType`, `material?`, `oneSize?`, `sizeLabels?[]`.

**ItemVariant:** `id`, `kind` (`brand` | `komplekt` | `ai`), `mainImage`, `otherImages[]`.

### Enumlar va ruscha yorliqlari

| Enum | Qiymatlar → yorliq |
|---|---|
| `ItemKind` | `dress` → Платья · `accessory` → Аксессуары |
| `OfferType` | `rent` → Аренда · `sale` → Продажа (qisqa: Покупка) · `tailoring` → Пошив на заказ (qisqa: Пошив) |
| `Silhouette` | `a-line` Силуэт «А» · `mermaid` Русалка · `princess` Пышное · `straight` Прямое · `short` Короткое |
| `Neckline` | `sweetheart` Сердечко · `v-neck` V-образный · `square` Квадратный · `boat` Лодочка · `off-shoulder` Открытые плечи · `one-shoulder` На одно плечо · `closed` Закрытый · `halter` Халтер |
| `Sleeve` | `none` Без бретелей · `strap` Тонкие бретели · `short` Короткий рукав · `long` Длинный рукав · `transparent` Прозрачный рукав |
| `Fabric` | `satin` Атлас · `lace` Кружево · `tulle` Фатин · `chiffon` Шифон · `crepe` Креп · `organza` Органза · `velvet` Бархат |
| `Shade` | `ivory` Айвори · `white` Белый · `champagne` Шампань · `blush` Пудровый · `beige` Бежевый · `pastel` Пастель |
| `AccessoryType` | `veil` Фата · `face-veil` Вуалетка · `tiara` Корона · `hairpin` Заколка · `jewelry` Украшения · `bracelet` Браслет · `gloves` Перчатки · `bolero` Болеро · `shoes` Обувь · `underskirt` Подъюбник · `belt` Пояс |

### Haqiqiy ma'lumot hajmi

27 ko'ylak · 64 aksessuar · 10 kategoriya · 14 subkategoriya · 32 sharh · 5 yangilik · 4 aksiya.

Kategoriyalar: Свадебные платья (5 subkat.), Платья с хиджабом (3), Обувь (6),
Фата, Заколки и гребни, Короны и ободки, Наборы украшений, Вуалетки, Перчатки, Браслеты на руку.

### Boshqa konstantalar (`src/constants/app.ts`)

```ts
APP_LOCALE = 'ru-RU'
APP_CURRENCY = 'UZS'
STORAGE_PREFIX = 'bridal-'
FITTING_SLOTS = ['10:00','11:30','13:00','14:30','16:00','17:30']
BOOKING_MAX_DAYS_AHEAD = 90
RENT_PERIOD_DAYS = 3          // ijara narxi shu muddat uchun
```

---

## 9. Tayyor CSS blok (boshqa muhitga ko'chirish uchun)

```css
:root {
  --color-background: #FFFDFB;
  --color-surface: #FAF6F2;
  --color-surface-2: #F1E9E2;
  --color-border: #E3D8CE;
  --color-border-subtle: #F1E9E2;
  --color-foreground: #2B2320;
  --color-muted: #8C7E75;
  --color-subtle: #C2B4A9;
  --color-primary: #B08D57;
  --color-primary-hover: #9A7A46;
  --color-primary-fg: #FFFFFF;
  --color-primary-soft: #F5EBDD;
  --color-accent: #D8A7B1;
  --color-accent-hover: #C88F9B;
  --color-accent-fg: #3A2A2E;
  --color-accent-soft: #F9EDEF;
  --color-danger: #C4485B;
  --color-danger-soft: #FBE9EC;
  --color-danger-fg: #FFFFFF;
  --color-success: #5B8C6E;
  --color-success-soft: #E7F1EA;
  --color-warning: #C9A227;
  --color-warning-soft: #FAF0D6;
  --color-overlay-fg: #FFFFFF;
  --color-overlay-fg-dark: #2B2320;
}

.dark {
  --color-background: #14100E;
  --color-surface: #1E1917;
  --color-surface-2: #2A2320;
  --color-border: #3A312C;
  --color-border-subtle: #241E1B;
  --color-foreground: #EFE7E0;
  --color-muted: #A2938A;
  --color-subtle: #6E6058;
  --color-primary: #C9A063;
  --color-primary-hover: #DBB77E;
  --color-primary-fg: #241B10;
  --color-primary-soft: #3A2E1C;
  --color-accent: #D8A7B1;
  --color-accent-hover: #E6BDC5;
  --color-accent-fg: #2B1B20;
  --color-accent-soft: #3A272C;
  --color-danger: #E06A7B;
  --color-danger-soft: #3D2027;
  --color-danger-fg: #2B1216;
  --color-success: #7BB394;
  --color-success-soft: #1E3328;
  --color-warning: #D9B24C;
  --color-warning-soft: #3A2F14;
}
```

Shriftlar:

```html
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap">
```
