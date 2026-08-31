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

/** To'liq bo'y примерка kadri — vertikal. */
export const ASPECT_RATIO = '9:16';

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
