# Amira Bridal

Kelin ko'ylaklari saloni uchun PWA: katalog (ko'ylak + aksessuar), model sahifasi, примерка bron tizimi, aksiyalar, maqolalar va mijoz sharhlari.

**Stack:** React 18 · TypeScript · Vite · Tailwind CSS · Zustand · React Router v6 · Swiper · vite-plugin-pwa

## Ishga tushirish

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview
```

## Biznes modeli

| Taklif | Izoh |
|---|---|
| Аренда | 3 kunlik ijara + zaklad (qaytariladi) + химчистка narxga kiradi |
| Продажа | Sotib olish |
| Пошив на заказ | O'lchov bo'yicha tikish (30–45 kun) |

Backend yo'q — ma'lumot `src/features/*/mockdata.*.ts` fayllarida. Примерка arizasi `localStorage` ga yoziladi va Telegram havolasi orqali salonga yuboriladi.

## Marshrutlar

| Path | Sahifa |
|---|---|
| `/` | Bosh sahifa — salon, tanlangan modellar, aksiyalar |
| `/catalog` | Katalog: qidiruv, kategoriya filtri, ko'ylak/aksessuar tab, 4 xil ko'rinish |
| `/catalog/:slug` | Model sahifasi: galereya, o'lcham, xarakteristika, o'xshashlar |
| `/new` | Yangi kelganlar (sana bo'yicha guruhlangan) |
| `/booking` | Примерка: kalendar + vaqt sloti + forma |
| `/favorites` | Saqlangan modellar |
| `/promotions`, `/promotions/:slug` | Aksiyalar |
| `/news`, `/news/:slug` | Salon maqolalari |
| `/review` | Mijozlar sharhlari |
| `/profile` | Profil, mavzu, yordam |
| `/preview` | UI kit demo |

## Sozlash

Real salon ma'lumotlari uchun quyidagilarni almashtiring:

- `src/constants/app.ts` — `APP_NAME`, примерка vaqt slotlari, ijara muddati
- `src/constants/contact.ts` — Telegram username, telefon, manzillar (koordinatalar bilan)
- `src/constants/social.ts` — ijtimoiy tarmoqlar
- `src/features/home/mockdata.brand.ts` — salon nomi, tavsifi, logotip yo'li
- `src/features/catalog/mockdata.dresses.ts` / `mockdata.accessories.ts` — katalog
- `src/index.css` — rang tokenlari (brend palitrasi)
- `vite.config.ts` + `public/` — PWA manifest va ikonlar

Rasmlar hozircha `picsum.photos` placeholder — `mockdata.helpers.ts` dagi `img()` ni CDN URL bilan almashtiring.

## Ma'lum cheklovlar

- `npm run lint` ishlamaydi — `eslint` paketi va konfiguratsiya qo'shilmagan.
- PWA ikonlari (`pwa-192x192.png`, `pwa-512x512.png`) `public/` da yo'q — manifestda ko'rsatilgan, qo'shish kerak.
