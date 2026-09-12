/**
 * Video ijro etilayotganda fonda eshitiladigan musiqa.
 *
 * MUHIM: bu musiqa faqat ILOVA ICHIDA eshitiladi. Yuklab olingan yoki
 * ulashilgan faylda u BO'LMAYDI — video va audio alohida oqim bo'lib ijro
 * etiladi, birlashtirilmaydi. Faylning o'ziga singdirish uchun ffmpeg kerak
 * (server tomonida yoki ffmpeg.wasm bilan), bu alohida ish.
 *
 * Fayl `public/assets/audio/` ga qo'yiladi. Fayl bo'lmasa hech narsa
 * buzilmaydi — audio jim qoladi, video odatdagidek ishlaydi.
 *
 * HUQUQ: salon ulashadigan videoda musiqa bo'ladi, shuning uchun faqat
 * litsenziyasi ruxsat beradigan trek qo'ying (royalty-free yoki sotib olingan).
 */
export const VIDEO_MUSIC_SRC = '/assets/audio/bridal-theme.m4a';

/** Fon musiqasi balandligi — video ovozi yo'q, shuning uchun juda baland kerak emas */
export const VIDEO_MUSIC_VOLUME = 0.5;
