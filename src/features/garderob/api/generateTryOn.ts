import { buildBridalPrompt, type RefKind } from '../prompt/buildBridalPrompt';
import { hairReferenceImage, poseReferenceImage } from '../prompt/modelOptions';
import { DETAIL_MAX_SIDE, imageToDataUrl } from './imageToDataUrl';
import {
  ASPECT_RATIO,
  IMAGE_MODEL,
  IMAGE_PROVIDER,
  MAX_DRESS_REFERENCES,
  MAX_INPUT_REFERENCES,
  OPENROUTER_IMAGES_URL,
  RESOLUTION,
} from './model';

/**
 * Примерка generatsiyasi — образ qismlarini yig'ib modelga yuboradi.
 *
 * DIQQAT: so'rov brauzerdan to'g'ridan-to'g'ri OpenRouter'ga ketadi, ya'ni API kalit
 * JS bundle ichida ochiq turadi va uni istalgan tashrifchi ko'chirib olishi mumkin.
 * Ommaviy ishga tushirishdan oldin bu chaqiruv serverga (masalan Vercel Function)
 * ko'chirilishi kerak — o'shanda faqat shu fayl o'zgaradi, qolgani joyida qoladi.
 */

export type GenerateInput = {
  /** Yuz surati — store'da data URL bo'lib turadi */
  faceImage: string;
  /** Ko'ylakning bir yoki bir nechta fotosi (`/assets/...`) — birinchisi asosiy */
  dressImages: string[];
  /** Ixtiyoriy — tanlanmagan bo'lsa `null` */
  veilImage?: string | null;
  jewelryImage?: string | null;
  /** `useWardrobeStore.model` — bo'y, gavda, poza, soch */
  model: Record<string, string>;
};

export type GenerateResult = {
  /** Tayyor rasm — data URL, to'g'ridan-to'g'ri `<img src>` ga beriladi */
  image: string;
  /** So'rovning dollardagi narxi, model qaytarmasa `null` */
  cost: number | null;
};

type OpenRouterImageResponse = {
  data: { b64_json: string; media_type?: string }[];
  usage?: { cost?: number };
};

type Reference = { kind: RefKind; src: string; maxSide?: number };

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
    return 'Модель отклонила запрос по правилам безопасности. Чаще всего помогает другое фото лица — светлое, анфас, где виден только один человек. Проверьте и фото товара: на нём не должно быть лица модели.';
  }
  if (/rate.?limit|429/i.test(raw)) {
    return 'Слишком много запросов — попробуйте через минуту.';
  }
  if (/insufficient|credit|balance|402/i.test(raw)) {
    return 'Недостаточно средств на счёте OpenRouter.';
  }
  return 'Не удалось создать изображение. Попробуйте ещё раз.';
}
const apiKeyOrg = "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"
export async function generateTryOn(input: GenerateInput): Promise<GenerateResult> {
  const apiKey = apiKeyOrg;
  if (!apiKey) {
    throw new Error('Генерация не настроена: не задан VITE_OPENROUTER_API_KEY.');
  }

  // Poza va soch — matn bilan yetarli aniqlik chiqmaydi, rasm ham yuboriladi
  const poseImage = poseReferenceImage(input.model);
  const hairImage = hairReferenceImage(input.model);

  // Tartib muhim: promptdagi IMAGE raqamlari aynan shu ketma-ketlikka bog'langan
  const references: Reference[] = [
    { kind: 'face', src: input.faceImage },
    ...input.dressImages
      .slice(0, MAX_DRESS_REFERENCES)
      // Naqsh va dantel detali shu rasmlardan olinadi — kattaroq o'lchamda yuboriladi
      .map((src): Reference => ({ kind: 'dress', src, maxSide: DETAIL_MAX_SIDE })),
    ...(input.veilImage ? [{ kind: 'veil' as const, src: input.veilImage }] : []),
    ...(input.jewelryImage
      ? [{ kind: 'jewelry' as const, src: input.jewelryImage }]
      : []),
    ...(hairImage ? [{ kind: 'hair' as const, src: hairImage }] : []),
    ...(poseImage ? [{ kind: 'pose' as const, src: poseImage }] : []),
  ];

  if (references.length > MAX_INPUT_REFERENCES) {
    throw new Error(
      `Слишком много изображений в образе (${references.length}) — модель принимает не больше ${MAX_INPUT_REFERENCES}.`,
    );
  }

  let dataUrls: string[];
  try {
    dataUrls = await Promise.all(
      references.map((ref) => imageToDataUrl(ref.src, ref.maxSide)),
    );
  } catch {
    throw new Error('Не удалось подготовить изображения образа.');
  }

  const prompt = buildBridalPrompt(
    references.map((ref) => ref.kind),
    input.model,
  );

  const body = JSON.stringify({
    model: IMAGE_MODEL,
    prompt,
    input_references: dataUrls.map((url) => ({
      type: 'image_url',
      image_url: { url },
    })),
    aspect_ratio: ASPECT_RATIO,
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
