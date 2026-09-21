/**
 * Примерка generatsiyasining model sozlamalari — barcha joy uchun yagona manba.
 *
 * Model imkoniyatlarini tekshirish: GET https://openrouter.ai/api/v1/images/models
 * Javobdagi `supported_parameters` da `input_references.max`, `aspect_ratio.values`
 * va `resolution.values` bor. Model qo'llamaydigan parametr 400 xatolikka olib keladi.
 */
export const IMAGE_MODEL = 'google/gemini-3.1-flash-image';

/**
 * Modelning `input_references` limiti.
 * google/gemini-3.1-flash-image (Nano Banana 2): 0–14 ta rasm.
 * Modelni almashtirsangiz shu sonni ham yangi model limitiga moslang.
 */
export const MAX_INPUT_REFERENCES = 14;

/**
 * Bitta ko'ylakdan modelga yuboriladigan rasmlar chegarasi.
 * Katalogda 1–4 ta foto bor; hammasini yuborish naqsh detalini yaxshilaydi,
 * lekin so'rov og'irlashadi — shuning uchun cheklaymiz.
 */
export const MAX_DRESS_REFERENCES = 4;

/**
 * Sodda rejimda ko'ylak referenslari chegarasi — qasddan kichik.
 *
 * U yerda kirish nomutanosib: ko'ylak `DETAIL_MAX_SIDE` (2048px) da ketadi,
 * mijoz fotosi esa 1280px da. To'rtta ko'ylak rasmi fotodan ~10 barobar ko'p
 * piksel beradi va model natija sifatida ko'ylak fotosining o'zini qaytaradi.
 * Ikkitasi naqsh uchun yetadi, muvozanat esa saqlanadi.
 */
export const MAX_SWAP_DRESS_REFERENCES = 2;

/** To'liq bo'y примерка kadri — vertikal. */
export const ASPECT_RATIO = '9:16';

/**
 * Sodda rejim uchun — natija mijoz suratining nisbatini saqlashi kerak,
 * shuning uchun nisbat foto o'lchamidan hisoblanadi (`nearestAspectRatio`).
 *
 * Ro'yxat `GET https://openrouter.ai/api/v1/images/models` dan olingan
 * (`google/gemini-3.1-flash-image` → `supported_parameters.aspect_ratio`).
 * TAXMIN QILMANG: avval bu yerda uchta qiymat bor edi va 2:3 foto eng yaqin
 * 3:4 ga o'tkazilardi — rasm 12% enga cho'zilib, odam pakana bo'lib qolardi.
 *
 * Model beradigan 14 tadan 1:4, 1:8, 4:1, 8:1 chiqarib tashlangan: ular lenta
 * shaklidagi kadrlar va ularga eng yaqin deb tushgan surat baribir buziladi.
 */
export const SUPPORTED_ASPECT_RATIOS = [
  '9:16',
  '2:3',
  '3:4',
  '4:5',
  '1:1',
  '5:4',
  '4:3',
  '3:2',
  '16:9',
] as const;

export type AspectRatio = string;

/** Surat o'lchamiga eng yaqin qo'llab-quvvatlanadigan nisbatni tanlaydi */
export function nearestAspectRatio(width: number, height: number): AspectRatio {
  if (!width || !height) return ASPECT_RATIO;
  const target = width / height;
  let best: AspectRatio = SUPPORTED_ASPECT_RATIOS[0];
  let bestGap = Infinity;
  for (const ratio of SUPPORTED_ASPECT_RATIOS) {
    const [w, h] = ratio.split(':').map(Number);
    const gap = Math.abs(w / h - target);
    if (gap < bestGap) {
      bestGap = gap;
      best = ratio;
    }
  }
  return best;
}

/** Chiqish o'lchami — model qo'llaydigan qiymatlardan. */
export const RESOLUTION = '2K';

export const OPENROUTER_IMAGES_URL = 'https://openrouter.ai/api/v1/images';

/**
 * Provayder marshruti — modelni ikki provayder beradi: `google-vertex` va
 * `google-ai-studio`. Ularning xavfsizlik siyosati bir xil emas: AI Studio
 * yuz surati asosida odam generatsiyasini ko'pincha bloklaydi
 * (`block_reason: OTHER`), Vertex esa bunday so'rovlarni o'tkazadi.
 *
 * Shuning uchun Vertex birinchi turadi. `allow_fallbacks` yoqilgan — Vertex
 * vaqtincha ishlamay qolsa, so'rov butunlay yiqilgandan ko'ra AI Studio orqali
 * ketgani afzal. Faqat Vertex kerak bo'lsa `allow_fallbacks` ni `false` qiling.
 */
export const IMAGE_PROVIDER = {
  order: ['google-vertex'],
  allow_fallbacks: true,
} as const;
