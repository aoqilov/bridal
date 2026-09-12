/**
 * Tayyor videoni ilova ichida ko'rsatish uchun yuklab oladi.
 *
 * MUAMMO: OpenRouter qaytaradigan `unsigned_urls[0]` — imzosiz manzil, uni
 * o'qish uchun `Authorization` sarlavhasi kerak. `<video src="...">` esa
 * sarlavha yubora olmaydi, shuning uchun to'g'ridan-to'g'ri qo'yilgan havola
 * ishlamaydi (brauzerda ochilgani — o'sha yerda openrouter.ai sessiyasi borligi uchun).
 *
 * YECHIM: videoni kalit bilan yuklab olib, `blob:` manzilga aylantiramiz —
 * u sarlavha talab qilmaydi va `<video>` ham, `download` havolasi ham ishlaydi.
 *
 * Blob faqat joriy sahifa umri davomida yashaydi, shuning uchun store'da baribir
 * asl havola saqlanadi va oyna ochilganda qayta yuklanadi. Doimiy saqlash uchun
 * video o'z serverimizga ko'chirilishi kerak.
 */

/** Kalit talab qiladigan manzillar — qolganiga sarlavha qo'shilmaydi */
function needsAuth(url: string): boolean {
  return url.includes('openrouter.ai');
}

export async function fetchVideoObjectUrl(url: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined;

  const headers: Record<string, string> =
    needsAuth(url) && apiKey ? { Authorization: `Bearer ${apiKey}` } : {};

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error('Не удалось загрузить видео. Возможно, ссылка устарела.');
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
