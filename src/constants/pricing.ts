/**
 * Примерка generatsiyasining narxlari (so'm).
 * Bitta joyda turadi — tarif o'zgarsa faqat shu fayl tahrirlanadi.
 */

/** Bitta rasm generatsiyasi */
export const GENERATION_PRICE = 3_000;

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
