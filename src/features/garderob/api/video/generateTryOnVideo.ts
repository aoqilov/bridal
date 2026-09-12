import { buildVideoPrompt, VIDEO_PROMPT_VARIANT } from '../../prompt/video';
import {
  GENERATE_AUDIO,
  MAX_POLLS,
  MAX_PROMPT_CHARS,
  OPENROUTER_VIDEOS_URL,
  POLL_INTERVAL_MS,
  VIDEO_ASPECT_RATIO,
  VIDEO_CANDIDATES,
  VIDEO_DURATION,
  type VideoCandidate,
} from './model';

/**
 * Примерка videosi — mijoz TASDIQLAGAN rasm birinchi kadr bo'lib yuboriladi.
 *
 * Model yuz, ko'ylak yoki salon referenslarini ko'rmaydi: ular tayyor kadrda
 * allaqachon birlashtirilgan. Shu sababli qiyofa va ko'ylak mosligi muammosi
 * bu bosqichda tug'ilmaydi — model faqat harakat qo'shadi.
 *
 * Chaqiruv ikki bosqichli: `POST /videos` darhol `polling_url` qaytaradi,
 * natija esa daqiqalar ichida tayyor bo'ladi. Model siyosat bo'yicha rad etsa
 * (`model.ts` dagi izoh) — ro'yxatdagi keyingisi sinaladi.
 *
 * DIQQAT: so'rov brauzerdan ketadi, kalit bundle ichida ochiq (test bosqichi).
 * Serverga ko'chirilganda faqat shu fayl o'zgaradi.
 */

export type VideoPhase = 'starting' | 'generating';

export type VideoInput = {
  /** Tasdiqlangan примерка rasmi — hozircha data URL */
  image: string;
  /** Jarayon holati o'zgarganda chaqiriladi (kutish oynasi uchun) */
  onPhase?: (phase: VideoPhase) => void;
};

export type VideoResult = {
  /** Tayyor videoning URL manzili */
  video: string;
  /** Qaysi model chiqargani — narxni o'lchash va ro'yxatni qisqartirish uchun */
  model: string;
  /** So'rovning dollardagi narxi, OpenRouter qaytarmasa `null` */
  cost: number | null;
};

type JobResponse = {
  id?: string;
  status?: string;
  polling_url?: string;
  unsigned_urls?: string[];
  error?: unknown;
  usage?: { cost?: number };
};

const DONE = 'completed';
const FAILED = new Set(['failed', 'cancelled', 'expired']);

/**
 * Birinchi kadr uchun manzil.
 *
 * OpenRouter hujjati `frame_images` uchun "stable, directly downloadable image URL"
 * talab qiladi, bizda esa rasm faqat data URL ko'rinishida bor (saqlagich yo'q).
 * Amalda data URL qabul qilinmoqda — so'rov moderatsiya bosqichigacha yetib boryapti.
 * Agar biror model rasmni o'qiy olmasa, o'zgaradigan yagona joy shu funksiya:
 * rasm vaqtinchalik ommaviy saqlagichga yuklanib, o'sha URL qaytariladi.
 */
function frameImageUrl(image: string): string {
  return image;
}

/**
 * Modelning "odam rasmi bilan ishlamayman" javobimi.
 *
 * Aynan shu holatda keyingi modelga o'tamiz. Boshqa xatolarda (kvota, tarmoq,
 * noto'g'ri parametr) o'tish foydasiz — ular hamma modelda takrorlanadi.
 */
function isPolicyBlock(raw: string): boolean {
  return /SensitiveContent|PrivacyInformation|real person|usage guidelines|policy|block_reason|moderation|safety|violat/i.test(
    raw,
  );
}

function describeError(raw: string): string {
  if (/rate.?limit|429/i.test(raw)) {
    return 'Слишком много запросов — попробуйте через минуту.';
  }
  if (isPolicyBlock(raw)) {
    return 'Видеомодели отклонили фото по правилам о реальных людях. Попробуйте другой образ или сообщите нам.';
  }
  if (/url|download|fetch/i.test(raw)) {
    return 'Модель не смогла принять изображение. Попробуйте ещё раз или выберите другой образ.';
  }
  return 'Не удалось создать видео. Попробуйте ещё раз.';
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/**
 * Tannarxni konsolga yozadi — `constants/pricing.ts` dagi `VIDEO_PRICE` ni
 * shu raqamga qarab belgilaymiz. `cost` har doim ham qaytmaydi, o'shanda
 * narxni OpenRouter hisobidan (Activity) qarash kerak.
 */
function logCost(model: string, cost: number | null): void {
  const price = cost === null ? 'narx qaytarilmadi' : `$${cost.toFixed(4)}`;
  console.info(
    `[video] ✓ ${model} · prompt: ${VIDEO_PROMPT_VARIANT} · ${VIDEO_DURATION} сек · ${price}`,
  );
}

/** Bitta model bilan urinish. Siyosat rad javobida `null` qaytaradi. */
async function tryCandidate(
  candidate: VideoCandidate,
  image: string,
  apiKey: string,
  onPhase?: (phase: VideoPhase) => void,
): Promise<VideoResult | null> {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    // OpenRouter statistikasi uchun — brauzerdan yuborishga ruxsat berilgan sarlavhalar
    'HTTP-Referer': window.location.origin,
    'X-Title': 'Amira Bridal',
  };

  onPhase?.('starting');

  const start = await fetch(OPENROUTER_VIDEOS_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: candidate.model,
      prompt: buildVideoPrompt(),
      duration: VIDEO_DURATION,
      resolution: candidate.resolution,
      aspect_ratio: VIDEO_ASPECT_RATIO,
      generate_audio: GENERATE_AUDIO,
      frame_images: [
        {
          type: 'image_url',
          image_url: { url: frameImageUrl(image) },
          frame_type: 'first_frame',
        },
      ],
    }),
  });

  if (!start.ok) {
    const raw = await start.text();
    if (isPolicyBlock(raw)) return null;
    throw new Error(describeError(raw));
  }

  const job = (await start.json()) as JobResponse;

  if (job.status === DONE && job.unsigned_urls?.[0]) {
    const cost = job.usage?.cost ?? null;
    logCost(candidate.model, cost);
    return { video: job.unsigned_urls[0], model: candidate.model, cost };
  }

  const pollingUrl = job.polling_url;
  if (!pollingUrl) {
    throw new Error('Сервис не вернул ссылку на задание. Попробуйте ещё раз.');
  }

  onPhase?.('generating');

  for (let attempt = 0; attempt < MAX_POLLS; attempt += 1) {
    await sleep(POLL_INTERVAL_MS);

    const response = await fetch(pollingUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!response.ok) {
      // Vaqtinchalik xato bo'lishi mumkin — keyingi urinishda tekshiramiz
      if (response.status >= 500) continue;
      throw new Error(describeError(await response.text()));
    }

    const state = (await response.json()) as JobResponse;

    if (state.status === DONE) {
      const video = state.unsigned_urls?.[0];
      if (!video) {
        throw new Error('Видео готово, но ссылка не пришла. Попробуйте ещё раз.');
      }
      const cost = state.usage?.cost ?? null;
      logCost(candidate.model, cost);
      return { video, model: candidate.model, cost };
    }

    if (state.status && FAILED.has(state.status)) {
      // Siyosat rad javobi ko'pincha shu yerda keladi — job boshlanadi, keyin yiqiladi
      const raw = JSON.stringify(state.error ?? state.status);
      if (isPolicyBlock(raw)) return null;
      throw new Error(describeError(raw));
    }
  }

  throw new Error('Видео готовится дольше обычного. Попробуйте позже.');
}

export async function generateTryOnVideo(input: VideoInput): Promise<VideoResult> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error('Видео не настроено: не задан VITE_OPENROUTER_API_KEY.');
  }

  /*
   * Uzunlikni oldindan tekshiramiz: Kling uzun promptni qabul qilganday
   * ko'rinadi, job'ni boshlaydi va faqat keyin yiqitadi — ya'ni xato pul
   * yechilgandan keyin chiqadi.
   */
  const length = buildVideoPrompt().length;
  if (length > MAX_PROMPT_CHARS) {
    throw new Error(
      `Промпт слишком длинный: ${length} символов при лимите ${MAX_PROMPT_CHARS}.`,
    );
  }

  for (const candidate of VIDEO_CANDIDATES) {
    const result = await tryCandidate(candidate, input.image, apiKey, input.onPhase);
    if (result) return result;
    // Siyosat bo'yicha rad etildi — keyingi modelni sinaymiz
    console.warn(`[video] ${candidate.model} отклонил изображение, пробуем следующую модель`);
  }

  throw new Error(
    'Ни одна видеомодель не приняла это изображение. Попробуйте другой образ.',
  );
}
