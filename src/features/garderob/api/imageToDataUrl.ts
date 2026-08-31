/**
 * Rasmni modelga yuboriladigan data URL ko'rinishiga keltiradi.
 *
 * Katalog rasmlari `/assets/...` — lokal yo'l. Uni modelga o'sha holicha bersak
 * bo'lmaydi: OpenRouter serveri `localhost` ni ham, hali deploy qilinmagan yo'lni ham
 * ocha olmaydi. Shuning uchun faylni o'zimiz o'qib, kichraytirib, data URL qilamiz.
 */

/** Oddiy referens uchun maksimal tomon (px) */
const DEFAULT_MAX_SIDE = 1280;

/**
 * Naqsh va dantel detali muhim bo'lgan rasmlar uchun (ko'ylak).
 * Kichraytirilsa model naqshni loyqa chizadi — bu sifat pastligining asosiy sababi.
 */
export const DETAIL_MAX_SIDE = 2048;

export async function imageToDataUrl(
  src: string,
  maxSide: number = DEFAULT_MAX_SIDE,
): Promise<string> {
  // Yuz suratlari store'da allaqachon data URL bo'lib turadi — qayta ishlash shart emas
  if (src.startsWith('data:')) return src;

  const response = await fetch(src);
  if (!response.ok) throw new Error(`Rasm o'qilmadi: ${src}`);

  const bitmap = await createImageBitmap(await response.blob());

  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    throw new Error('canvas context topilmadi');
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvas.toDataURL('image/jpeg', 0.9);
}
