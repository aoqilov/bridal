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

**Variantlar:** `ItemVariant` — rang emas, **taqdimot turi**: `kind: 'brand' | 'komplekt' | 'ai'`
(бренд fotolari / to'liq komplekt / примерка uchun toza foto). Modelning rangi `Dress.shade` da,
variantda rang maydoni yo'q. Variant id'si `<tovar id>-<kind>`; mockdata'ga
`photoVariants(baseId, files)` (real fayllar) yoki `seedVariants(baseId, seed)` (picsum) orqali
yoziladi. Kerakli turdagini olish — `variantOfKind(item, kind)`, yo'q bo'lsa `defaultVariant` ga
qaytadi. Hozircha uchala variant bir xil rasmni ko'rsatadi: alohida fotolar hali suratga olinmagan.

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
- `useBodyPhotosStore` (`bridal-body-photos`) — sodda generatsiya uchun to'liq bo'y suratlari (`createPhotoStore`). `useFacesStore` dan alohida: kesim boshqa, o'lcham boshqa
- `useWardrobeStore` (`bridal-wardrobe`) — sevimlilardan garderobga olingan tovarlar (`MAX_PICKED`), model sozlamalari va tayyor generatsiya rasmlari
- `useWalletStore` (`bridal-wallet`) — generatsiya uchun hamyon: balans, tranzaksiyalar, bepul birinchi generatsiya. Narxlar — `constants/pricing.ts`

Yangi global state kerak bo'lsa: `use<Name>Store.ts` yarat, `persist({ name: 'bridal-<name>' })` ishlat, barrel'ga qo'sh.

Server state (API cache) uchun Zustand ishlatma — kerak bo'lsa alohida yechim tanlash uchun so'rab ol.

## Гардероб UI (`features/garderob/components/`)

`FeatureGarderob` — faqat bosqich almashtirgichi (`generation` / `images` / `payment`).
"Генерация" bosqichi to'liq `components/generation/` da:

```
GenerationStep.tsx   FAQAT rejim almashtirgichi (CusSegment: Обычная / Простая)
FullGeneration.tsx     to'liq oqim — yuz + ko'ylak + fata/taqinchoq/tufli + Настройка
SimpleGeneration.tsx   sodda oqim — to'liq bo'y surat + ko'ylak, boshqa hech nima
OutfitPreview.tsx    faol bo'limda nima tanlanganini ko'rsatadi
CategoryRow.tsx      1-qator chiplari — generic, ikkala rejim ishlatadi
PickRowShell.tsx     2-qatorning qobig'i (sanoq, scroll, katak o'lchami)
PickTile.tsx           bitta katak — rasm, ✓ va ×
FacePickRow.tsx        yuz: `useFacesStore`, "+" galereyani ochadi
BodyPickRow.tsx        to'liq bo'y surat: `useBodyPhotosStore`, "+" galereyani ochadi
OutfitPickRow.tsx      kiyim: `useWardrobeStore`, "+" избранное ga olib boradi
ModelSetupSheet.tsx  "Настройка модели" — sheet ichida (faqat to'liq rejimda)
```

Faol rejim (`mode`) va faol bo'lim (`tab`) — lokal `useState`. Global state'ga
chiqarmang: ularni boshqa hech kim o'qimaydi va saqlanishi ham shart emas.

Ikki qator manbasi butunlay boshqa — yuzlar galereyadan (data URL, `MAX_PHOTOS`),
tovarlar sevimlilardan (faqat `id`, `MAX_PICKED`). Shu sababli bitta universal
komponent emas, umumiy qobiq + ikkita yupqa adapter.

## Примерка generatsiyasi (`features/garderob/`)

Model — OpenRouter orqali `google/gemini-3.1-flash-image`. **Ikkita rejim bor:**

| Rejim | Mijoz beradi | Natija | Fayllar |
|---|---|---|---|
| **To'liq** (`Обычная`) | yuz surati + ko'ylak + ixtiyoriy fata/taqinchoq/tufli + "Настройка модели" | studiyada noldan qurilgan to'liq bo'y kadr | `generateTryOn.ts` + `buildBridalPrompt.ts` |
| **Sodda** (`Простая`) | o'zining to'liq bo'y surati + ko'ylak | o'sha fotoning o'zi, faqat kiyimi almashgan | `generateSwap.ts` + `buildSwapPrompt.ts` |

```
api/
  model.ts              model nomi, rasm limiti, aspect ratio — BITTA joyda
  imageToDataUrl.ts     /assets/... rasmni kichraytirib data URL ga o'giradi
  requestImage.ts       OpenRouter so'rovi — IKKALA rejim uchun yagona chiqish
  generateTryOn.ts      to'liq rejim: referenslarni yig'adi
  generateSwap.ts       sodda rejim: foto + ko'ylak fotolari
prompt/
  modelOptions.ts       "Настройка модели" tanlovlari → inglizcha prompt bo'laklari
  buildBridalPrompt.ts  to'liq rejim prompti
  buildSwapPrompt.ts    sodda rejim prompti
```

**Ikki prompt qasddan alohida.** To'liq rejimda surat noldan quriladi (fon, poza,
gavda, soch — hammasi promptdan), sodda rejimda esa surat allaqachon bor va undan
FAQAT bitta narsa o'zgaradi. Qulflari bir-biriga teskari: `BACKGROUND LOCK` fonni
**yozadi**, `PHOTOGRAPH LOCK` esa fonni **saqlaydi**; `BODY` gavdani **buyuradi**,
sodda rejim esa uni **fotodan oladi**. Bittaga qo'shsangiz bu qulflar shartlar
ichida chalkashadi. Umumiy qoidalar (`DRESS LOCK`, `COVERAGE LOCK`, `LENGTH LOCK`,
`MODEST COVERAGE`, inkor qoidasi) ikkalasida ham bir xil ishlaydi.

**Tahrir promptida muvozanat qoidasi — `buildSwapPrompt` ga tegishdan oldin o'qing.**
Sodda rejim promptining birinchi varianti rasmni **umuman o'zgartirmay qaytardi**.
Sabab: "saqla" signallari "almashtir" signallaridan 7 barobar ko'p edi (102 : 15),
`PHOTOGRAPH LOCK — HIGHEST PRIORITY` sarlavhasi ustuvorlikni saqlashga bergandi,
matnda `The output IS IMAGE 1` degan literal "kirishni qaytar" buyrug'i turgandi va
`DO NOT` ro'yxati 15 ta `no changed X` bandidan iborat edi — inkor qoidasi bo'yicha
model "no" ni emas, "changed" so'zini ko'radi.

Tuzatishda **teskari tomonga o'tib ketdi**: `DRESS LOCK` ga `HIGHEST PRIORITY`
yorlig'i berilib, ko'ylak bo'limlari tepaga chiqarilgach model natija sifatida
**ko'ylak fotosining o'zini** qaytardi. Ya'ni bu bitta yo'nalishli qoida emas,
**muvozanat**: qaysi tomon og'sa — o'sha tomonning kirish rasmi qaytadi.

Uchinchi joylashuv — quyidagi simmetrik tartib — **sinab ko'rilgan va ishlaydi**.
Ikkala chetga og'ish ham real, shuning uchun bu yerga "yaxshilash" niyatida
tegishdan oldin natijani sinab ko'ring:

```
THE OUTPUT FRAME     ikkala yarmini bitta joyda bog'laydi ("u — o'z joyida — o'sha ko'ylakda")
THE GOWN ON HER      o'zgarish
WHAT SHE KEEPS       saqlanadigani
DRESS LOCK …         ko'ylak tafsilotlari (ustuvorlik yorlig'isiz)
```

Qoidalar: birorta bo'limga `HIGHEST PRIORITY` yozmang (u avtomatik g'olib chiqadi),
`DO NOT` ga `no changed …` bandlari qo'shmang (inkor qoidasi), va o'zgartirgandan
keyin muvozanatni o'lchang — promptni chiqarib ko'ylak so'zlari (`gown|dress|lace`)
va odam so'zlari (`she|her|woman|photograph`) nisbatini sanang.

**Rasmlar tomoni ham shu muvozanatga kiradi — va u yerda og'ish kuchliroq.**
Matn muvozanatlangani bilan kirish pikseli nomutanosib bo'lsa natija baribir
ko'ylakka og'adi. Sodda rejimda shuning uchun uchta chora bor (`generateSwap.ts`):

- `MAX_SWAP_DRESS_REFERENCES = 2` — to'liq rejimdagi 4 emas;
- ko'ylak referensi o'lchami **fotoga bog'langan**, qat'iy `DETAIL_MAX_SIDE` emas;
- foto `MIN_DRESS_SIDE` dan kichik bo'lsa ko'ylak referensi **bittaga** tushadi.

Sabab: `fileToPortraitPhoto` suratni hech qachon kattalashtirmaydi, ya'ni mijoz
800px foto yuklasa u 800px bo'lib qoladi. Ko'ylak qat'iy 2048px da ketganda bu
~13 barobar ko'p piksel bo'lardi va model ko'ylak fotosining o'zini qaytarardi —
og'ish foydalanuvchi qaysi suratni yuklaganiga qarab paydo bo'lib, yo'qolib
turardi. Endi nisbat har qanday fotoda ~2× atrofida qoladi.

Muvozanat `console.info('[swap] …')` da chop etiladi: foto o'lchami, tanlangan
nisbat, ko'ylak referenslari va `og'irlik ko'ylak/foto` ko'rsatkichi. Natija yana
chetga og'sa — birinchi navbatda shu qatorga qarang.

**Sodda rejimda "Настройка модели" yo'q va bo'lmaydi ham** — poza, gavda, soch, fon
va yorug'lik mijoz fotosidan keladi, ularni sozlash fotodagi haqiqiy holatga qarshi
ishlaydi. Hijab ko'ylagi bundan mustasno: `isHijabItem` bo'lsa prompt yeng va
bo'yinni yopadi hamda boshga ko'ylak matosidagi ro'mol qo'shadi — yuzga tegilmaydi.

**Suratlar ikki xil store'da:** `useFacesStore` — kvadrat yuz kesimlari (768×768,
`fileToSquarePhoto`), `useBodyPhotosStore` — nisbati saqlangan to'liq bo'y kadrlari
(1280px, `fileToPortraitPhoto`). Birlashtirmang: mijoz yuz kesimini sodda rejimga
yoki butun bo'y suratini yuz referensiga tanlab qo'yadi — ikkala holda ham natija
buziladi. `imageToDataUrl` data URL ni o'zgarishsiz o'tkazadi, ya'ni saqlangan
o'lcham modelga ketadigan o'lchamning o'zi.

**Kadr nisbati — `SUPPORTED_ASPECT_RATIOS` ni taxmin bilan qisqartirmang.** Sodda
rejimda chiqish nisbati mijoz fotosidan hisoblanadi (`nearestAspectRatio`), ro'yxat
esa `GET /api/v1/images/models` dagi haqiqiy qiymatlardan olingan. Boshida u yerda
uchta qiymat bor edi (`1:1 · 3:4 · 9:16`) va 2:3 foto eng yaqin 3:4 ga o'tkazilardi
— rasm 12% enga cho'zilib, mijoz **pakana va enli** bo'lib chiqardi. Model 14 ta
nisbatni qo'llaydi; ulardan lenta shaklidagilari (`1:4`, `1:8`, `4:1`, `8:1`)
chiqarib tashlangan, qolgani ro'yxatda. Buning ustiga promptdagi
`HER HEIGHT AND PROPORTIONS` bandi bo'y va oyoq uzunligini kadrdagi nuqtalarga
bog'lab qulflaydi — ikkalasi birga ishlaydi, bittasini olib tashlamang.

**Eng muhim qoida:** promptdagi `IMAGE 1`, `IMAGE 2` raqamlari so'rovdagi
`input_references` massivining tartibiga bog'langan. Raqamlar qo'lda yozilmaydi —
`buildBridalPrompt` ularni `kinds` massividan hisoblaydi. Referens qo'shsangiz yoki
tartibni o'zgartirsangiz prompt o'zi moslashadi; qo'lda raqam yozsangiz — buziladi.

**Kalit:** `.env` dagi `VITE_OPENROUTER_API_KEY` (shablon — `.env.example`).
`VITE_` prefiksi qiymatni bundle'ga qo'shadi, ya'ni kalit brauzerda **ochiq**.
Ommaga chiqarishdan oldin so'rovni serverga ko'chirish kerak — o'shanda faqat
`requestImage.ts` o'zgaradi, ikkala prompt ham, qolgan kod ham joyida qoladi.
**Kalitni hech qachon kodga yozmang:** `.env` gitignore'da, kod esa commit bo'ladi
va OpenRouter ommaviy repolardan topilgan kalitni avtomatik bekor qiladi
(`401 User not found`).

**Provayder:** so'rov `IMAGE_PROVIDER` (`model.ts`) orqali **Vertex**'ga yo'naltiriladi.
Buni olib tashlamang: modelni ikki provayder beradi va `google-ai-studio` yuz surati
asosidagi generatsiyani muntazam bloklaydi (`400`, `block_reason: OTHER`). Filtr
barqaror emas, shuning uchun `requestImage.ts` blok xatosida bir marta qayta uradi
(`MAX_ATTEMPTS`) — boshqa xatolarda urinmaydi.

**To'lov:** pul so'rovdan oldin yechiladi, xato bo'lsa qaytariladi
(`GenerateBar.tsx` — `refundFree()` yoki `topUp()`).

**Qaysi foto ketadi:** ko'ylak rasmi `variantOfKind(item, 'ai')` dan olinadi
(`GenerateBar.tsx`), UI dagi preview'lar esa `defaultVariant` da qoladi — mijoz brend
fotosini ko'radi, model esa generatsiya uchun tayyorlangan fotoni oladi.

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

**To'q fon sinab ko'rilgan va rad etilgan** (`public/bgimage.jpg` — qora devor,
qora pol, burchakda vazalar). Sabab: fon rasmi referens sifatida yuborilganda
qorong'i xona modelning ekspozitsiyasini ham tortib ketadi — "xona to'q, model
yorug'" degan bandni promptda qanchalik ajratib yozmang, natija xira chiqadi.
Qaytadan urinmoqchi bo'lsangiz oldin shu muammoni hal qiling, sahnani
qo'shish — oson qismi.

**Taqinchoq — naqsh ko'ylakka sizib o'tadi.** Katalogdagi taqinchoq fotolari
(`nabor-*.jpg`) buyum emas, **sahna**: baxmal tagliklarda komplekt, atrofida
atirgul, sham va atlas mato. Rasm matndan kuchli bo'lgani uchun model o'sha
kristall-gul naqshini KO'YLAKKA ko'chiradi va ko'ylakka o'zidan bezak qo'shadi —
`DRESS LOCK` dagi "ADD NOTHING" bandi bunga yolg'iz bardosh bermaydi. Shuning
uchun `case 'jewelry'` tavsifida uchta narsa alohida yoziladi: rasmda nima bor,
undan faqat buyumlar olinadi, va **`THE GOWN TAKES NOTHING FROM THIS IMAGE`**.
`OUTPUT` da ham alohida band bor — u ko'ylakdan nimadir yo'qolganini emas,
ko'ylakka nimadir QO'SHILGANINI tekshiradi (band faqat taqinchoq tanlanganda
chiqadi). Yangi taqinchoq fotosi qo'shsangiz shu xavfni yodda tuting: fon qancha
"boy" bo'lsa, ko'ylakka shuncha ko'p narsa sizadi.

Hijab rejimida sirg'a tushmaydi — ro'mol quloqni yopadi, ya'ni "earrings at the
ears" bandi `HEADSCARF` bilan ziddiyatga tushardi. Shu sababli `scarfMode` da
tavsif ham, `accessoryLines` ham boshqacha yoziladi: sirg'a "do'konda qoladi",
qolgan buyumlar taqiladi.

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
