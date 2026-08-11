import type { DressSize, ItemVariant } from './helper.types.catalog';

/** Placeholder rasm (keyinchalik CDN URL bilan almashtiriladi) */
export const img = (seed: string, w = 900, h = 1200): string =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const SIZE_ALIAS: Record<number, string> = {
  40: 'XS',
  42: 'S',
  44: 'M',
  46: 'L',
  48: 'XL',
  50: 'XXL',
};

/** RU o'lchamlar ro'yxati; ikkinchi argument — hozir salonda yo'q o'lchamlar */
export function sizes(available: number[], missing: number[] = []): DressSize[] {
  const mk = (ru: number, ok: boolean): DressSize => ({
    ru,
    label: SIZE_ALIAS[ru] ? `${ru} (${SIZE_ALIAS[ru]})` : String(ru),
    available: ok,
  });
  return [...available.map((n) => mk(n, true)), ...missing.map((n) => mk(n, false))].sort(
    (a, b) => a.ru - b.ru,
  );
}

/** Rang varianti — bitta asosiy + bir nechta qo'shimcha rasm */
export function variant(
  id: string,
  colorName: string,
  colorHex: string,
  seed: string,
  extra = 3,
): ItemVariant {
  return {
    id,
    colorName,
    colorHex,
    mainImage: img(`${seed}-0`),
    otherImages: Array.from({ length: extra }, (_, i) => img(`${seed}-${i + 1}`)),
  };
}

/** Bugundan N kun keyingi sana, "YYYY-MM-DD" — band kunlar demo uchun */
export function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
