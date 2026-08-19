/**
 * RU o'lchamlar to'ri — standart ayollar o'lchov jadvali (santimetrda).
 * Salon o'z jadvalini bergach shu yerdagi qiymatlar almashtiriladi.
 */
export type SizeChartRow = {
  ru: number;
  alias: string;
  /** Ko'krak aylanasi */
  bust: number;
  /** Bel aylanasi */
  waist: number;
  /** Son aylanasi */
  hips: number;
};

export const RU_SIZE_CHART: SizeChartRow[] = [
  { ru: 40, alias: 'XS', bust: 80, waist: 62, hips: 86 },
  { ru: 42, alias: 'S', bust: 84, waist: 66, hips: 90 },
  { ru: 44, alias: 'M', bust: 88, waist: 70, hips: 94 },
  { ru: 46, alias: 'L', bust: 92, waist: 74, hips: 98 },
  { ru: 48, alias: 'XL', bust: 96, waist: 78, hips: 102 },
  { ru: 50, alias: 'XXL', bust: 100, waist: 82, hips: 106 },
  { ru: 52, alias: '3XL', bust: 104, waist: 86, hips: 110 },
  { ru: 54, alias: '4XL', bust: 108, waist: 90, hips: 114 },
  { ru: 56, alias: '5XL', bust: 112, waist: 94, hips: 118 },
];
