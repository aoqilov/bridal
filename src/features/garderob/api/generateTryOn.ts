import type { HemLength } from '@/features/catalog';
import { buildBridalPrompt, type RefKind } from '../prompt/buildBridalPrompt';
import {
  hairReferenceImage,
  poseReferenceImage,
  scarfReferenceImage,
} from '../prompt/modelOptions';
import { DETAIL_MAX_SIDE, imageToDataUrl } from './imageToDataUrl';
import { MAX_DRESS_REFERENCES, MAX_INPUT_REFERENCES } from './model';
import { requestImage, type ImageResult } from './requestImage';

/**
 * To'liq примерка generatsiyasi — образ qismlarini yig'ib modelga yuboradi.
 *
 * Bu yerda mijozdan faqat YUZ surati olinadi: gavda, poza, soch va fon
 * promptdan quriladi. Mijoz o'zining to'liq bo'y suratini beradigan sodda
 * rejim — `generateSwap.ts` da.
 */

export type GenerateInput = {
  /** Yuz surati — store'da data URL bo'lib turadi */
  faceImage: string;
  /** Ko'ylakning bir yoki bir nechta fotosi (`/assets/...`) — birinchisi asosiy */
  dressImages: string[];
  /** Ixtiyoriy — tanlanmagan bo'lsa `null` */
  veilImage?: string | null;
  jewelryImage?: string | null;
  /**
   * Tufli — faqat etagi kalta ko'ylakda beriladi. Polgacha ko'ylakda oyoq etak
   * ostida qoladi, ya'ni referens ham, prompt bandi ham bekorga ketadi.
   */
  shoesImage?: string | null;
  /** `useWardrobeStore.model` — bo'y, gavda, poza, soch/ro'mol */
  model: Record<string, string>;
  /**
   * Tanlangan ko'ylak hijab kategoriyasidanmi (`isHijabItem`).
   * Foydalanuvchi "Причёска / Платок" pereklyuchatelini bosmagan bo'lsa sukut
   * qiymatni shu belgilaydi — hijab ko'ylagida bosh ro'mol bilan chiziladi.
   */
  hijab?: boolean;
  /**
   * Ko'ylak etagi qayerda tugaydi (`hemLengthOf`). Prompt shunga qarab
   * LENGTH LOCK, FOOTWEAR va DO NOT bo'limlarini boshqacha yozadi.
   */
  hemLength?: HemLength;
};

export type GenerateResult = ImageResult;

type Reference = { kind: RefKind; src: string; maxSide?: number };

export async function generateTryOn(input: GenerateInput): Promise<GenerateResult> {
  // Poza va soch — matn bilan yetarli aniqlik chiqmaydi, rasm ham yuboriladi.
  // Soch va ro'mol bir-birini almashtiradi: rejimni `headMode` hal qiladi va
  // ikkalasidan ko'pi bilan bittasi rasm qaytaradi.
  const hijab = input.hijab ?? false;
  const poseImage = poseReferenceImage(input.model);
  const hairImage = hairReferenceImage(input.model, hijab);
  const scarfImage = scarfReferenceImage(input.model, hijab);

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
    ...(input.shoesImage ? [{ kind: 'shoes' as const, src: input.shoesImage }] : []),
    ...(hairImage ? [{ kind: 'hair' as const, src: hairImage }] : []),
    ...(scarfImage ? [{ kind: 'scarf' as const, src: scarfImage }] : []),
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
    hijab,
    input.hemLength ?? 'floor',
  );

  return requestImage(prompt, dataUrls);
}
