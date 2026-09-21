/**
 * Saqlanadigan to'liq bo'y suratining eng katta tomoni (px).
 *
 * Yuz suratidan farqli (`fileToSquarePhoto` — 768×768 kvadrat) bu yerda nisbat
 * SAQLANADI: sodda rejimda natija aynan shu fotoning o'zi bo'ladi, faqat
 * ko'ylagi almashadi. Kvadratga kessak mijozning oyog'i yoki boshi qirqiladi.
 *
 * 1280 — `imageToDataUrl` ning sukut chegarasi bilan bir xil. Kattaroq qilish
 * ma'nosiz: `imageToDataUrl` data URL ni o'zgarishsiz o'tkazadi, ya'ni bu yerda
 * saqlangan o'lcham modelga ketadigan o'lchamning o'zi. Kichraytirsak model
 * yuzni tanimay qoladi — to'liq bo'y kadrda yuz baribir kichik joy egallaydi.
 */
const MAX_SIDE = 1280;

/**
 * Tanlangan faylni nisbatini saqlagan holda kichraytirib jpeg data URL ga o'giradi.
 * Original faylni saqlash localStorage kvotasini to'ldirib qo'yadi.
 */
export async function fileToPortraitPhoto(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
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

  return canvas.toDataURL('image/jpeg', 0.85);
}
