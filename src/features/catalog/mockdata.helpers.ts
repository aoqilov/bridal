import { VARIANT_KINDS, type DressSize, type ItemVariant } from './helper.types.catalog';

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

/**
 * Bitta modelning uchala varianti — picsum placeholder rasmlar bilan.
 * `baseId` tovarning `id` si: variant id'lari `<baseId>-brand` ko'rinishida
 * chiqadi, ya'ni `defaultVariantId` ni ham shu qoidadan yozish mumkin.
 */
export function seedVariants(baseId: string, seed: string, extra = 3): ItemVariant[] {
  return VARIANT_KINDS.map((kind) => ({
    id: `${baseId}-${kind}`,
    kind,
    mainImage: img(`${seed}-0`),
    otherImages: Array.from({ length: extra }, (_, i) => img(`${seed}-${i + 1}`)),
  }));
}

/** Bugundan N kun keyingi sana, "YYYY-MM-DD" — band kunlar demo uchun */
export function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

// ================================================================
// Real rasmlar — public/assets/ ichidagi lokal fayllar
// (yuqoridagi `img`/`variant` — picsum placeholder, real data'da ishlatilmaydi)
// ================================================================

/** public/assets/ ichidagi faylga yo'l: photo('w-sweetheart-1-1.jpg') */
export const photo = (file: string): string => `/assets/${file}`;

/**
 * Ketma-ket nomlangan fayllar: photoSet('aurora-ivory', 4)
 * → aurora-ivory-1.webp … aurora-ivory-4.webp
 */
export function photoSet(base: string, count: number, ext = 'webp'): string[] {
  return Array.from({ length: count }, (_, i) => photo(`${base}-${i + 1}.${ext}`));
}

/**
 * Bitta modelning uchala varianti — lokal fayllar bilan. Birinchi rasm asosiy
 * (kartochkada ko'rinadi).
 *   photoVariants('d-amira', [photo('amira-1.jpg'), photo('amira-2.jpg')])
 *
 * Hozircha uchala variant ham bir xil rasmni ko'rsatadi: salonda brend /
 * komplekt / примерка uchun alohida fotolar hali yo'q. Foto tayyor bo'lganda
 * shu funksiya emas, o'sha modelning qatori o'zgartiriladi — qolganlari
 * joyida qoladi.
 */
export function photoVariants(baseId: string, files: string[]): ItemVariant[] {
  const [main, ...rest] = files;
  return VARIANT_KINDS.map((kind) => ({
    id: `${baseId}-${kind}`,
    kind,
    mainImage: main,
    otherImages: rest,
  }));
}
