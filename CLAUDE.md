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
| `review/` | Sharh ma'lumoti va komponentlari (alohida sahifasi yo'q — tovar sahifasi va profil ishlatadi) |
| `garderob/` | Гардероб bo'limi (bottom nav) — образ yig'ish, примерка generatsiyasi, hamyon |
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
- `useFacesStore` (`bridal-faces`) — garderob uchun yuklangan yuz suratlari (`createPhotoStore`)
- `useWardrobeStore` (`bridal-wardrobe`) — sevimlilardan garderobga olingan tovarlar (`MAX_PICKED`), model sozlamalari va tayyor generatsiya rasmlari
- `useWalletStore` (`bridal-wallet`) — generatsiya uchun hamyon: balans, tranzaksiyalar, bepul birinchi generatsiya. Narxlar — `constants/pricing.ts`

Yangi global state kerak bo'lsa: `use<Name>Store.ts` yarat, `persist({ name: 'bridal-<name>' })` ishlat, barrel'ga qo'sh.

Server state (API cache) uchun Zustand ishlatma — kerak bo'lsa alohida yechim tanlash uchun so'rab ol.

## Гардероб UI (`features/garderob/components/`)

`FeatureGarderob` — faqat bosqich almashtirgichi (`generation` / `images` / `payment`).
"Генерация" bosqichi to'liq `components/generation/` da:

```
GenerationStep.tsx   yuqorida preview, pastda ikki qator — hammasini yig'adi
OutfitPreview.tsx    faol bo'limda nima tanlanganini ko'rsatadi
CategoryRow.tsx      1-qator: Лицо · Платье · Фата · Украшения · Настройка →
PickRowShell.tsx     2-qatorning qobig'i (sanoq, scroll, katak o'lchami)
PickTile.tsx           bitta katak — rasm, ✓ va ×
FacePickRow.tsx        yuz: `useFacesStore`, "+" galereyani ochadi
OutfitPickRow.tsx      kiyim: `useWardrobeStore`, "+" избранное ga olib boradi
ModelSetupSheet.tsx  "Настройка модели" — sheet ichida
```

Faol bo'lim (`tab`) — `GenerationStep` ichidagi lokal `useState`. Global state'ga
chiqarmang: uni boshqa hech kim o'qimaydi va saqlanishi ham shart emas.

Ikki qator manbasi butunlay boshqa — yuzlar galereyadan (data URL, `MAX_PHOTOS`),
tovarlar sevimlilardan (faqat `id`, `MAX_PICKED`). Shu sababli bitta universal
komponent emas, umumiy qobiq + ikkita yupqa adapter.

## Примерка generatsiyasi (`features/garderob/`)

Yuz surati + katalogdagi ko'ylak (va ixtiyoriy fata/taqinchoq) dan realistik to'liq
bo'y surat yasaydi. Model — OpenRouter orqali `google/gemini-3.1-flash-image`.

```
api/
  model.ts              model nomi, rasm limiti, aspect ratio — BITTA joyda
  imageToDataUrl.ts     /assets/... rasmni kichraytirib data URL ga o'giradi
  generateTryOn.ts      referenslarni yig'adi va so'rov yuboradi
prompt/
  modelOptions.ts       "Настройка модели" tanlovlari → inglizcha prompt bo'laklari
  buildBridalPrompt.ts  promptning o'zi
```

**Eng muhim qoida:** promptdagi `IMAGE 1`, `IMAGE 2` raqamlari so'rovdagi
`input_references` massivining tartibiga bog'langan. Raqamlar qo'lda yozilmaydi —
`buildBridalPrompt` ularni `kinds` massividan hisoblaydi. Referens qo'shsangiz yoki
tartibni o'zgartirsangiz prompt o'zi moslashadi; qo'lda raqam yozsangiz — buziladi.

**Kalit:** `.env` dagi `VITE_OPENROUTER_API_KEY` (shablon — `.env.example`).
`VITE_` prefiksi qiymatni bundle'ga qo'shadi, ya'ni kalit brauzerda **ochiq**.
Ommaga chiqarishdan oldin so'rovni serverga ko'chirish kerak — o'shanda faqat
`generateTryOn.ts` o'zgaradi, prompt va qolgan kod joyida qoladi.

**Provayder:** so'rov `IMAGE_PROVIDER` (`model.ts`) orqali **Vertex**'ga yo'naltiriladi.
Buni olib tashlamang: modelni ikki provayder beradi va `google-ai-studio` yuz surati
asosidagi generatsiyani muntazam bloklaydi (`400`, `block_reason: OTHER`). Filtr
barqaror emas, shuning uchun `generateTryOn.ts` blok xatosida bir marta qayta uradi
(`MAX_ATTEMPTS`) — boshqa xatolarda urinmaydi.

**To'lov:** pul so'rovdan oldin yechiladi, xato bo'lsa qaytariladi
(`GenerateBar.tsx` — `refundFree()` yoki `topUp()`).

**Rasm o'lchamlari:** yuz `768×768` (`fileToSquarePhoto.ts`), ko'ylak `2048px`
(`DETAIL_MAX_SIDE`). Ko'ylakni kichraytirsangiz model dantelni loyqa chizadi.

Modelni almashtirsangiz `MAX_INPUT_REFERENCES` ni ham yangi limitga moslang —
limitlar `GET https://openrouter.ai/api/v1/images/models` da.

**Tufli va etak uzunligi:** oyoq kiyim faqat etagi polgacha yetmaydigan ko'ylakda
ma'noli — polgacha ko'ylakda oyoq etak ostida qoladi. Uzunlik manbai —
`Dress.hemLength` (`'floor' | 'midi' | 'short'`), o'qish uchun `hemLengthOf(item)`
va `showsFeet(item)` (`catalog/utils/item.ts`); maydon yozilmagan bo'lsa siluetdan
taxmin qilinadi. "Туфли" bo'limi `GenerationStep` da shu shart bilan qo'shiladi,
`GenerateBar` esa polgacha ko'ylakda `shoesImage` ni umuman yubormaydi.

Prompt uchta joyda uzunlikka qarab boshqacha yoziladi: `LENGTH LOCK`, `FOOTWEAR`
va `DO NOT` ro'yxati. Oxirgisi muhim — polgacha ko'ylak uchun yozilgan
"no short dress, no mini dress" bandi kalta ko'ylakda aynan kerakli natijani
taqiqlab qo'yadi, shuning uchun u yerda taqiq emas, talab turadi. `FOOTWEAR`
bo'limi tufli tanlanmaganda ham yoziladi: oyoq ko'rinib turganda model baribir
biror poyabzal chizadi, qanday ekanini aytmasak — har safar boshqacha.

**Hijab:** ko'ylak hijab kategoriyasidanmi — `isHijabItem(item)` (`categoryId === 'hijab'`).
`neckline: 'closed'` bo'yicha aniqlamang: yopiq yoqa oddiy ko'ylaklarda ham bor.
Bosh rejimi — `headMode(model, hijab)` (`constants/setupsModel.ts`): `model.head`
tanlanmagan bo'lsa hijab ko'ylagida **ro'mol**, boshqasida soch. Shu sababli
"Настройка модели" ni ochmagan mijoz ham to'g'ri natija oladi.
UI da "Причёска" guruhi tepasida `Причёска | Платок` pereklyuchateli chiqadi
(`ModelSetup.tsx` — `HeadGroup`), variantlar `SCARF_GROUP` da.
**Hijabda yeng hech qachon ochiq bo'lmaydi** — `MODEST COVERAGE` bo'limi
(`buildBridalPrompt.ts`, `modest = hijab`). Bu `DRESS LOCK` ning "referensda yo'q
yengni o'ylab topma" bandiga qarshi turadi, shuning uchun ustuvorlik promptda
ochiq yozilgan va o'sha band hijabda boshqa matn bilan almashadi — ikkita
qarama-qarshi buyruq qolsa model ulardan birini tasodifan tanlaydi. Qulf bosh
rejimiga emas, **ko'ylak kategoriyasiga** bog'langan: mijoz ro'mol o'rniga sochni
tanlasa ham ko'ylak yopiq qoladi. `DO NOT` ro'yxatida ham hijab rejimida
"sleeveless", "bare arms" kabi otlar yozilmaydi — inkor qoidasiga qarang.

Promptda soch va ro'mol **bir vaqtda bo'lmaydi**: `describeModel` ikkisidan birini
`null` qiladi, `HAIR` bo'limi butunlay `HEADSCARF` ga almashadi, `hair` referens
rasmi yuborilmaydi va yuz referensi tavsifidan soch bandi olib tashlanadi —
ochiq sochli maneken rasmi yoki bitta "soch" jumlasi ham boshni ochib qo'yadi.

**Prompt tanlovlari:** `MODEL_GROUPS` (`constants/setupsModel.ts`) ga yangi variant
qo'shsangiz, `prompt/modelOptions.ts` dagi mos jadvalga ham qator qo'shing —
jadvalda yo'q qiymat promptga umuman tushmaydi.

**Pozalar:** poza modelga IKKI kanal orqali boradi — `POSE` matni va
`public/assets/setup/pose-N.png` diagramma rasmi (`poseReferenceImage()` orqali
referens sifatida yuboriladi). Promptda **rasm ustuvor** deb yozilgan, chunki matn
qo'l holatini ushlab turolmaydi: model ko'tarilgan qo'lni belga tushiradi.
Shu sababli matn va rasm bir-biriga mos bo'lishi SHART — ziddiyat bo'lsa rasm
yutadi. Pozani o'zgartirsangiz rasmni ham, `POSE_TITLES` yorlig'ini ham yangilang.
Tavsif fotografning ko'rsatmasi kabi yoziladi (og'irlik qaysi oyoqda, tirsak
tanadan uzoqmi, barmoqlar qanday); "modeldek turadi" model uchun bo'sh gap.
Yuz ifodasi — `EXPRESSION` konstantasi, hozircha sozlama emas.

**Soch:** poza kabi ikki kanal — `HAIR` matni va `hair-N.png` referens rasmi
(`hairReferenceImage()`). Rasm `MODEL_GROUPS` dagi `image` maydonidan olinadi,
ya'ni rasmi yo'q variant faqat matn bilan ishlaydi va hech narsa buzilmaydi.
Rasmdan FAQAT turmak shakli olinadi — **rang, uzunlik va tuzilish yuz suratidan**.
Bu band majburiy: referens manekenlarning sochi to'q jigarrang, bandsiz qolsa
har bir mijoz jigarrang sochli chiqadi.

**Diagramma faqat bo'yindan pastga.** Poza rasmidan bosh OLINMAYDI — buni
`HEAD ANGLE LOCK` boshqaradi va yuz doim kameraga tik qaraydi. Sabab: yuz
referensi anfas surat, bosh burilsa uning yarmi ko'rinmay qoladi va model
qolganini o'zi to'qiydi — qiyofa boshqa odamga aylanadi. Yangi poza qo'shsangiz
tavsifda boshni burmang; tanani burasiz, bo'yin boshni kameraga qaytaradi.

**INKOR QOIDASI — promptga tegishdan oldin o'qing.** Rasm modellari inkorni
tushunmaydi, ular **so'zlarni** ko'radi. `no bouquet` yozsangiz model promptda
"bouquet" so'zini ko'radi va gul chizadi. Bu loyihada shu xato uch marta
takrorlangan:

| Yozilgan | Natijada chiqqan |
|---|---|
| `no added sleeves` | yeng yo'qolgan |
| `no hand on the hip` | qo'l belga qo'yilgan |
| `no bouquet, no flowers` | qo'lda guldasta paydo bo'lgan |

Shuning uchun **taqiqlangan narsaning nomini promptga yozmang**. Uning o'rniga
nima BO'LISHI kerakligini ijobiy ayting: `no bouquet` emas, balki
"HER HANDS ARE EMPTY. Both hands are bare and open... carrying nothing whatsoever".
`DO NOT` ro'yxati faqat zaxira va u yerda ham xavfli ot ishlatilmaydi
("nothing held or carried in either hand").

**Ko'ylak qulflari:** `DRESS LOCK` (bezak), `LENGTH LOCK` (uzunlik) va
`COVERAGE LOCK` (yeng, bo'yin, bandlar, orqa). Uchinchisi kerak, chunki model
shaffof dantel yengni "ochiq yelka" deb o'qib, ko'ylakni yengsiz qilib chizadi.

**Fon:** `BACKGROUND` (`buildBridalPrompt.ts`) — hamma generatsiya uchun bitta
studiya: oq devor + **jigarrang yog'och pol**. Fon qulfining o'zi yetarli emas:
katalog fotolari ko'chada olingan va ular 2048px da yuboriladi, ya'ni rasm matndan
kuchli. Shuning uchun **har bir referens tavsifida** "bu fotoning joyi, yorug'ligi
va soyalari olinmaydi" bandi turadi. Yangi referens turi qo'shsangiz shu bandni
ham yozing — aks holda o'sha rasmning foni natijaga sizib chiqadi. Pol qasddan jigarrang, chunki oq
ko'ylak etagi oq polda ko'rinmay ketadi. Matn bir xillik uchun juda aniq
yozilgan, lekin baribir piksel darajasida bir xil fon bermaydi — buning uchun
tayyor fon rasmi kerak (`RefKind` ga `background` qo'shib, poza diagrammasi
kabi referens qilib yuboriladi).

**Gavda tavsifi:** `BUILD` jadvaliga yorliq emas, anatomiya yoziladi (yelka, qo'l,
ko'krak, qorin, son, yuz — alohida-alohida). Modelning "kelin fotosi = ozg'in
manekenchi" moyilligi juda kuchli: `plus-size` kabi mavhum so'z e'tiborga
olinmaydi. Shu sababli gavda promptga uch joyda tushadi — birinchi qatorda
(`short`), `BODY` bo'limida (`full`) va `DO NOT` ro'yxatida. Uchtasidan birini
olib tashlasangiz natija yana ozg'in tomonga siljiydi.

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

**Shrift:** `font-sans` (Inter) — asosiy matn; `font-serif` (Cormorant Garamond) — model nomi va bo'lim sarlavhalari; `font-logo` (Comic Relief) — faqat header'dagi brend so'zi.

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
