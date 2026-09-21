import {
  ASPECT_RATIO,
  IMAGE_MODEL,
  IMAGE_PROVIDER,
  OPENROUTER_IMAGES_URL,
  RESOLUTION,
} from './model';

/**
 * OpenRouter'ga rasm so'rovi — ikkala generatsiya rejimi uchun yagona chiqish nuqtasi.
 *
 * DIQQAT: so'rov brauzerdan to'g'ridan-to'g'ri OpenRouter'ga ketadi, ya'ni API kalit
 * JS bundle ichida ochiq turadi va uni istalgan tashrifchi ko'chirib olishi mumkin.
 * Ommaviy ishga tushirishdan oldin bu chaqiruv serverga (masalan Vercel Function)
 * ko'chirilishi kerak — o'shanda FAQAT shu fayl o'zgaradi, prompt'lar ham,
 * `generateTryOn` ham, `generateSwap` ham joyida qoladi.
 */

export type ImageResult = {
  /** Tayyor rasm — data URL, to'g'ridan-to'g'ri `<img src>` ga beriladi */
  image: string;
  /** So'rovning dollardagi narxi, model qaytarmasa `null` */
  cost: number | null;
};

type OpenRouterImageResponse = {
  data: { b64_json: string; media_type?: string }[];
  usage?: { cost?: number };
};

/**
 * Google xavfsizlik filtri ishga tushganini aniqlaydi (`block_reason`).
 * Filtr barqaror emas — aynan bir xil so'rov keyingi urinishda o'tib ketishi
 * mumkin, shuning uchun faqat shu xato qayta urinishga arziydi.
 */
function isModerationBlock(raw: string): boolean {
  return /block_reason|blocked the request|moderation|safety/i.test(raw);
}

/** Filtr tasodifiy ishlagan holat uchun — birinchi urinish ham shu songa kiradi */
const MAX_ATTEMPTS = 2;

/**
 * Upstream xatoligini foydalanuvchi tushunadigan matnga aylantiradi.
 */
function describeError(raw: string): string {
  if (isModerationBlock(raw)) {
    return 'Модель отклонила запрос по правилам безопасности. Чаще всего помогает другое фото — светлое, где виден только один человек. Проверьте и фото товара: на нём не должно быть лица модели.';
  }
  // 'User not found' — OpenRouter kalitni tanimayapti: o'chirilgan yoki
  // ommaga chiqib ketgani uchun avtomatik bekor qilingan.
  if (/User not found|No auth credentials|Invalid API key|401/i.test(raw)) {
    return 'Ключ OpenRouter недействителен — создайте новый на openrouter.ai/keys и пропишите его в .env.';
  }
  if (/rate.?limit|429/i.test(raw)) {
    return 'Слишком много запросов — попробуйте через минуту.';
  }
  if (/insufficient|credit|balance|402/i.test(raw)) {
    return 'Недостаточно средств на счёте OpenRouter.';
  }
  return 'Не удалось создать изображение. Попробуйте ещё раз.';
}

type Options = {
  /** Kadr nisbati — sodda rejimda mijoz suratiga qarab hisoblanadi */
  aspectRatio?: string;
};

/**
 * Promptni va tayyorlangan referenslarni modelga yuboradi.
 * `dataUrls` tartibi promptdagi `IMAGE N` raqamlariga mos bo'lishi SHART.
 */
export async function requestImage(
  prompt: string,
  dataUrls: string[],
  options: Options = {},
): Promise<ImageResult> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error('Генерация не настроена: не задан VITE_OPENROUTER_API_KEY.');
  }

  const body = JSON.stringify({
    model: IMAGE_MODEL,
    prompt,
    input_references: dataUrls.map((url) => ({
      type: 'image_url',
      image_url: { url },
    })),
    aspect_ratio: options.aspectRatio ?? ASPECT_RATIO,
    resolution: RESOLUTION,
    output_format: 'png',
    n: 1,
    provider: IMAGE_PROVIDER,
  });

  let lastError = '';

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const response = await fetch(OPENROUTER_IMAGES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // OpenRouter statistikasi uchun — brauzerdan yuborishga ruxsat berilgan sarlavhalar
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Amira Bridal',
      },
      body,
    });

    if (response.ok) {
      const json = (await response.json()) as OpenRouterImageResponse;
      const image = json.data?.[0];
      if (!image?.b64_json) {
        throw new Error('Модель вернула пустой ответ. Попробуйте ещё раз.');
      }

      return {
        image: `data:${image.media_type ?? 'image/png'};base64,${image.b64_json}`,
        cost: json.usage?.cost ?? null,
      };
    }

    lastError = await response.text();
    // Bloklangan so'rov rasm qaytarmaydi va pul yechilmaydi — takrorlash xavfsiz
    if (!isModerationBlock(lastError)) break;
  }

  throw new Error(describeError(lastError));
}
