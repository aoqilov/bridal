/**
 * Video generatsiyasining sozlamalari — barcha joy uchun yagona manba.
 *
 * Modellar ro'yxati: GET https://openrouter.ai/api/v1/videos/models
 *
 * NEGA ZANJIR KERAK: yirik provayderlar haqiqiy odam tasviri bo'lgan kirish
 * rasmini jonlantirishni taqiqlaydi va bu prompt yoki kadr sifatiga bog'liq emas:
 *
 *   bytedance/seedance-2.5 → 400 InputImageSensitiveContentDetected.PrivacyInformation
 *   google/veo-3.1-*       → failed: "input image violates Vertex AI's usage guidelines"
 *
 * Bizning butun oqim kelinning yuziga qurilgan, ya'ni bu filtrlarni chetlab
 * o'tib bo'lmaydi — faqat ruxsat beradigan model topish mumkin. Shuning uchun
 * modellar TARTIB bilan sinaladi: siyosat rad javobi kelsa keyingisiga o'tiladi,
 * boshqa xatoda esa to'xtaladi (`generateTryOnVideo.ts` — `isPolicyBlock`).
 *
 * Qaysi model ishlaganini bilgach ro'yxatni qisqartiring — har bir urinish vaqt oladi.
 */

export type VideoCandidate = {
  /** OpenRouter model id */
  model: string;
  /** Chiqish sifati — har bir model o'z ro'yxatidan qabul qiladi */
  resolution: string;
};

/**
 * Sinash tartibi. Uchalasi ham 9:16 va 5 sekundni qo'llaydi, shuning uchun
 * `VIDEO_DURATION` va `VIDEO_ASPECT_RATIO` umumiy qoladi.
 *
 * Kling va Hailuo — odam fotosidan video yasash uchun eng ko'p ishlatiladigan
 * modellar; Wan zaxira sifatida turadi.
 */
export const VIDEO_CANDIDATES: readonly VideoCandidate[] = [
  { model: 'kwaivgi/kling-v3.0-std', resolution: '720p' },
  { model: 'minimax/hailuo-3-max', resolution: '768p' },
  { model: 'alibaba/wan-2.7', resolution: '720p' },
];

/**
 * Klip uzunligi (sekund). Zanjirdagi uchala model ham qabul qiladigan eng katta
 * qiymat: Kling 3–15, Hailuo 5–15, Wan 2–10. 10 dan oshirsangiz Wan tushib
 * qoladi — o'shanda uni `VIDEO_CANDIDATES` dan olib tashlang.
 *
 * Narx sekundga qarab deyarli chiziqli o'sadi: Kling'da 5 sek = $0.42 (o'lchangan),
 * ya'ni 10 sek ≈ $0.84. Prompt bosqichlari ham shu qiymatdan hisoblanadi
 * (`prompt/buildVideoPrompt.ts`).
 */
export const VIDEO_DURATION = 10;

/** Telefon uchun vertikal kadr — примерка rasmi ham 9:16 da chiqadi */
export const VIDEO_ASPECT_RATIO = '9:16';

/**
 * Prompt uzunligi chegarasi (belgi).
 *
 * Kling shu chegaradan oshsa job'ni boshlaydi, keyin yiqitadi:
 * `ret:1201, msg:prompt: size must be between 0 and 2500`.
 * Xato pul yechilgandan keyin keladi, shuning uchun uzunlikni so'rovdan OLDIN
 * tekshiramiz (`generateTryOnVideo.ts`).
 */
export const MAX_PROMPT_CHARS = 2500;

/** Ovoz kerak emas: video sukut bilan avtoplay qilinadi */
export const GENERATE_AUDIO = false;

export const OPENROUTER_VIDEOS_URL = 'https://openrouter.ai/api/v1/videos';

/**
 * Holat tekshiruvi oralig'i. OpenRouter hujjati 30 sekundni tavsiya qiladi,
 * lekin foydalanuvchi ekranda kutib turadi — 10 sekundda tezroq javob beramiz.
 */
export const POLL_INTERVAL_MS = 10_000;

/** Maksimal tekshiruv soni — 60 × 10 sek = 10 daqiqa, keyin timeout */
export const MAX_POLLS = 60;
