import type { Category } from './helper.types.catalog';
import { REAL_CATEGORIES } from './mockdata.categories.real';
import { USE_REAL_DATA } from './mockdata.real';

// Placeholder rasm helper (keyinchalik CDN URL bilan almashtiriladi)
const img = (seed: string, w = 800, h = 800): string =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

/** Chap ustundagi dumaloq avatar — kichik, kvadrat kesim yetarli */
const avatar = (seed: string): string => img(seed, 240, 240);

/** O'ng gridning kvadrat kartochkasi */
const tile = (seed: string): string => img(seed, 600, 600);

const PLACEHOLDER_CATEGORIES: Category[] = [
  {
    id: 'wedding',
    slug: 'wedding',
    name: 'Свадебные платья',
    shortName: 'Свадебные',
    kind: 'dress',
    image: avatar('cat-wedding'),
    subcategories: [
      {
        id: 'wedding-princess',
        slug: 'princess',
        name: 'Пышные',
        categoryId: 'wedding',
        image: tile('sub-wedding-princess'),
      },
      {
        id: 'wedding-a-line',
        slug: 'a-line',
        name: 'Силуэт «А»',
        categoryId: 'wedding',
        image: tile('sub-wedding-a-line'),
      },
      {
        id: 'wedding-mermaid',
        slug: 'mermaid',
        name: 'Русалка',
        categoryId: 'wedding',
        image: tile('sub-wedding-mermaid'),
      },
      {
        id: 'wedding-straight',
        slug: 'straight',
        name: 'Прямые',
        categoryId: 'wedding',
        image: tile('sub-wedding-straight'),
      },
    ],
  },
  {
    id: 'evening',
    slug: 'evening',
    name: 'Вечерние платья',
    shortName: 'Вечерние',
    kind: 'dress',
    image: avatar('cat-evening'),
    subcategories: [
      {
        id: 'evening-long',
        slug: 'long',
        name: 'Длинные',
        categoryId: 'evening',
        image: tile('sub-evening-long'),
      },
      {
        id: 'evening-cocktail',
        slug: 'cocktail',
        name: 'Коктейльные',
        categoryId: 'evening',
        image: tile('sub-evening-cocktail'),
      },
    ],
  },
  {
    id: 'engagement',
    slug: 'engagement',
    name: 'Платья на помолвку',
    shortName: 'Помолвка',
    kind: 'dress',
    image: avatar('cat-engagement'),
  },
  {
    id: 'veils',
    slug: 'veils',
    name: 'Фата и накидки',
    shortName: 'Фата',
    kind: 'accessory',
    image: avatar('cat-veils'),
    subcategories: [
      {
        id: 'veils-short',
        slug: 'short',
        name: 'Короткая фата',
        categoryId: 'veils',
        image: tile('sub-veils-short'),
      },
      {
        id: 'veils-long',
        slug: 'long',
        name: 'Длинная фата',
        categoryId: 'veils',
        image: tile('sub-veils-long'),
      },
      {
        id: 'veils-bolero',
        slug: 'bolero',
        name: 'Болеро',
        categoryId: 'veils',
        image: tile('sub-veils-bolero'),
      },
    ],
  },
  {
    id: 'jewelry',
    slug: 'jewelry',
    name: 'Украшения',
    shortName: 'Украшения',
    kind: 'accessory',
    image: avatar('cat-jewelry'),
    subcategories: [
      {
        id: 'jewelry-tiara',
        slug: 'tiara',
        name: 'Диадемы',
        categoryId: 'jewelry',
        image: tile('sub-jewelry-tiara'),
      },
      {
        id: 'jewelry-earrings',
        slug: 'earrings',
        name: 'Серьги и колье',
        categoryId: 'jewelry',
        image: tile('sub-jewelry-earrings'),
      },
      {
        id: 'jewelry-belt',
        slug: 'belt',
        name: 'Пояса',
        categoryId: 'jewelry',
        image: tile('sub-jewelry-belt'),
      },
    ],
  },
  {
    id: 'shoes',
    slug: 'shoes',
    name: 'Обувь',
    shortName: 'Обувь',
    kind: 'accessory',
    image: avatar('cat-shoes'),
  },
  {
    id: 'extras',
    slug: 'extras',
    name: 'Дополнительно',
    shortName: 'Разное',
    kind: 'accessory',
    image: avatar('cat-extras'),
    subcategories: [
      {
        id: 'extras-gloves',
        slug: 'gloves',
        name: 'Перчатки',
        categoryId: 'extras',
        image: tile('sub-extras-gloves'),
      },
      {
        id: 'extras-underskirt',
        slug: 'underskirt',
        name: 'Подъюбники',
        categoryId: 'extras',
        image: tile('sub-extras-underskirt'),
      },
    ],
  },
];

/**
 * Katalogda ko'rinadigan kategoriyalar.
 * `USE_REAL_DATA = true` — salonning haqiqiy bo'limlari (mockdata.categories.real.ts),
 * aks holda picsum placeholder daraxti.
 */
export const MOCK_CATEGORIES: Category[] = USE_REAL_DATA
  ? REAL_CATEGORIES
  : PLACEHOLDER_CATEGORIES;
