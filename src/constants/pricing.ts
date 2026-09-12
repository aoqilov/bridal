/**
 * Примерка generatsiyasining narxlari (so'm).
 * Bitta joyda turadi — tarif o'zgarsa faqat shu fayl tahrirlanadi.
 */

/** Bitta rasm generatsiyasi */
export const GENERATION_PRICE = 3_000;

/**
 * Tayyor rasmdan video yasash.
 *
 * VAQTINCHALIK QIYMAT: Seedance 2.5 narxi model sahifasida ko'rsatilmagan.
 * Bir nechta test generatsiyasidan keyin javobdagi `usage.cost` ni o'lchab,
 * shu raqamni haqiqiy tannarxga qarab qo'ying — video rasmdan o'nlab marta qimmat.
 */
export const VIDEO_PRICE = 45_000;

/**
 * "Видео" rejimining to'liq narxi — avval rasm chiziladi, keyin undan video.
 * Pul boshida bitta summa bo'lib yechiladi; mijoz rasmni tasdiqlamasa
 * video qismi (`VIDEO_PRICE`) qaytariladi, rasm esa galereyada qoladi.
 */
export const VIDEO_TOTAL_PRICE = GENERATION_PRICE + VIDEO_PRICE;

/** Hamyonni tez to'ldirish summalari */
export const TOPUP_PRESETS = [10_000, 30_000, 50_000, 100_000];

/** Paketlar — ko'proq generatsiya, arzonroq narx */
export type GenerationPack = {
  /** Nechta generatsiyaga yetadi */
  count: number;
  /** To'lanadigan summa */
  price: number;
};

export const GENERATION_PACKS: GenerationPack[] = [
  { count: 5, price: 13_000 },
  { count: 10, price: 24_000 },
];

/** Paketdagi chegirma foizi — badge uchun */
export function packDiscount(pack: GenerationPack): number {
  const full = pack.count * GENERATION_PRICE;
  return Math.round((1 - pack.price / full) * 100);
}

/** To'lov usullari — hozircha mock, keyin haqiqiy API ulanadi */
export const PAYMENT_METHODS = ['Payme', 'Click', 'Uzum'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
