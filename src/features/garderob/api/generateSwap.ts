import type { HemLength } from '@/features/catalog';
import { buildSwapPrompt, type SwapRefKind } from '../prompt/buildSwapPrompt';
import { DETAIL_MAX_SIDE, imageToDataUrl } from './imageToDataUrl';
import {
  MAX_INPUT_REFERENCES,
  MAX_SWAP_DRESS_REFERENCES,
  nearestAspectRatio,
} from './model';
import { requestImage, type ImageResult } from './requestImage';

/**
 * Sodda примерка generatsiyasi — mijozning to'liq bo'y suratidagi kiyimni
 * katalogdagi ko'ylakka almashtiradi.
 *
 * `generateTryOn` dan farqi: u yerda suratni noldan quramiz (poza, gavda, soch,
 * fon — hammasi "Настройка модели" va promptdan), bu yerda esa hammasi mijoz
 * fotosidan keladi va biz faqat ko'ylakni almashtiramiz. Shuning uchun bu yerda
 * na `model` sozlamalari, na poza/soch referenslari bor — ular bo'lsa fotodagi
 * haqiqiy holatga qarshi ishlaydi.
 */

export type SwapInput = {
  /**
   * Mijozning to'liq bo'y surati — `useBodyPhotosStore` da data URL bo'lib turadi.
   * Nisbati saqlangan (`fileToPortraitPhoto`), chunki natija shu kadrning o'zi.
   */
  bodyImage: string;
  /** Ko'ylakning bir yoki bir nechta fotosi (`/assets/...`) — birinchisi asosiy */
  dressImages: string[];
  /** Tanlangan ko'ylak hijab kategoriyasidanmi (`isHijabItem`) */
  hijab?: boolean;
  /** Ko'ylak etagi qayerda tugaydi (`hemLengthOf`) — LENGTH LOCK shunga bog'liq */
  hemLength?: HemLength;
};

export type SwapResult = ImageResult;

type Reference = { kind: SwapRefKind; src: string; maxSide?: number };

/** Foto o'lchami o'qilmasa — `fileToPortraitPhoto` ning yuqori chegarasi */
const FALLBACK_PHOTO_SIDE = 1280;

/**
 * Ko'ylak referensining quyi chegarasi. Bundan kichrayganda dantel va naqsh
 * loyqalanib ketadi — muvozanat uchun bo'lsa ham bundan pastga tushmaymiz.
 */
const MIN_DRESS_SIDE = 1024;

/**
 * Data URL dagi rasmning o'lchamini o'qiydi — chiqish nisbatini tanlash uchun.
 * O'qib bo'lmasa `null`, chaqiruvchi sukut nisbatga qaytadi.
 */
function imageSize(dataUrl: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

export async function generateSwap(input: SwapInput): Promise<SwapResult> {
  // Ko'ylak rasmisiz prompt buziladi: `imageLabel([])` "IMAGES  and undefined"
  // beradi va model almashtiradigan narsani topolmay suratni o'zgarishsiz
  // qaytaradi. Yiqilgani yaxshi — pul yechilmaydi va sabab ko'rinadi.
  if (input.dressImages.length === 0) {
    throw new Error('У выбранного платья нет фотографии для генерации.');
  }

  const size = await imageSize(input.bodyImage);
  const photoSide = size ? Math.max(size.width, size.height) : FALLBACK_PHOTO_SIDE;

  /**
   * Ko'ylak referensi mijoz fotosidan KATTA bo'lmasligi kerak.
   *
   * `fileToPortraitPhoto` suratni hech qachon kattalashtirmaydi, ya'ni mijoz
   * kichik foto yuklasa u kichik bo'lib qoladi. Ko'ylak esa qat'iy 2048px da
   * ketardi — 800px foto bilan bu ~13 barobar ko'p piksel va model natija
   * sifatida ko'ylak fotosining o'zini qaytaradi. Shuning uchun o'lcham
   * fotoga bog'landi. Pastki chegara — naqsh butunlay loyqalanib ketmasin.
   */
  const dressMaxSide = Math.min(DETAIL_MAX_SIDE, Math.max(MIN_DRESS_SIDE, photoSide));

  /**
   * Foto juda kichik bo'lsa ikkita ko'ylak rasmi ham birgalikda undan og'ir
   * tushadi — bunday holda bittasi bilan cheklanamiz.
   */
  const dressCount = photoSide >= MIN_DRESS_SIDE ? MAX_SWAP_DRESS_REFERENCES : 1;

  // Tartib muhim: promptdagi IMAGE raqamlari aynan shu ketma-ketlikka bog'langan
  const references: Reference[] = [
    { kind: 'photo', src: input.bodyImage },
    ...input.dressImages
      .slice(0, dressCount)
      .map((src): Reference => ({ kind: 'dress', src, maxSide: dressMaxSide })),
  ];

  if (references.length > MAX_INPUT_REFERENCES) {
    throw new Error(
      `Слишком много изображений (${references.length}) — модель принимает не больше ${MAX_INPUT_REFERENCES}.`,
    );
  }

  let dataUrls: string[];
  try {
    dataUrls = await Promise.all(
      references.map((ref) => imageToDataUrl(ref.src, ref.maxSide)),
    );
  } catch {
    throw new Error('Не удалось подготовить изображения.');
  }

  const prompt = buildSwapPrompt(
    references.map((ref) => ref.kind),
    { hijab: input.hijab ?? false, hemLength: input.hemLength ?? 'floor' },
  );

  // Natija mijoz kadrining nisbatini saqlashi kerak — aks holda model suratni
  // o'zi qayta kadrlaydi va fon/poza qulflari bilan ziddiyatga tushadi
  const aspectRatio = size ? nearestAspectRatio(size.width, size.height) : undefined;

  // Muvozanat shu raqamlarda ko'rinadi: ko'ylak fotodan og'ir tushsa, model
  // natija sifatida ko'ylak rasmining o'zini qaytaradi
  console.info(
    `[swap] foto ${size ? `${size.width}×${size.height}` : '?'} → ${aspectRatio ?? 'sukut'} · ` +
      `ko'ylak ${dressCount} dona × ${dressMaxSide}px · ` +
      `og'irlik ko'ylak/foto ≈ ${((dressCount * dressMaxSide ** 2) / photoSide ** 2).toFixed(1)}×`,
  );

  return requestImage(prompt, dataUrls, { aspectRatio });
}
