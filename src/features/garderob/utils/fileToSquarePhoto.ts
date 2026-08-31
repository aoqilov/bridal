/**
 * Saqlanadigan surat tomoni (px).
 *
 * Doiralar ekranda 64–83px, ya'ni ko'rinish uchun 320px ham yetardi. Lekin shu
 * surat примерка generatsiyasiga yuz referensi bo'lib ketadi — u yerda model
 * yuzni tanishi kerak, 320px esa buning uchun kam. 768×768 jpeg ≈ 80–120 KB,
 * `MAX_PHOTOS = 5` bilan jami ~0.5 MB — localStorage kvotasiga bemalol sig'adi.
 */
const FACE_SIZE = 768;

/**
 * Tanlangan faylni kvadrat (markazdan "cover" kesim) jpeg data URL ga aylantiradi.
 * Original faylni saqlash localStorage kvotasini to'ldirib qo'yadi.
 */
export async function fileToSquarePhoto(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = FACE_SIZE;
  canvas.height = FACE_SIZE;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas context topilmadi');

  const scale = Math.max(FACE_SIZE / bitmap.width, FACE_SIZE / bitmap.height);
  const w = bitmap.width * scale;
  const h = bitmap.height * scale;
  ctx.drawImage(bitmap, (FACE_SIZE - w) / 2, (FACE_SIZE - h) / 2, w, h);
  bitmap.close();

  return canvas.toDataURL('image/jpeg', 0.85);
}
