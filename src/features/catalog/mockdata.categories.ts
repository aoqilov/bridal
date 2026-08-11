import type { Category } from './helper.types.catalog';

// Placeholder rasm helper (keyinchalik CDN URL bilan almashtiriladi)
const img = (seed: string, w = 800, h = 600): string =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'wedding',
    slug: 'wedding',
    name: 'Свадебные платья',
    kind: 'dress',
    image: img('cat-wedding'),
    subcategories: [
      { id: 'wedding-princess', slug: 'princess', name: 'Пышные', categoryId: 'wedding' },
      { id: 'wedding-a-line', slug: 'a-line', name: 'Силуэт «А»', categoryId: 'wedding' },
      { id: 'wedding-mermaid', slug: 'mermaid', name: 'Русалка', categoryId: 'wedding' },
      { id: 'wedding-straight', slug: 'straight', name: 'Прямые', categoryId: 'wedding' },
    ],
  },
  {
    id: 'evening',
    slug: 'evening',
    name: 'Вечерние платья',
    kind: 'dress',
    image: img('cat-evening'),
    subcategories: [
      { id: 'evening-long', slug: 'long', name: 'Длинные', categoryId: 'evening' },
      { id: 'evening-cocktail', slug: 'cocktail', name: 'Коктейльные', categoryId: 'evening' },
    ],
  },
  {
    id: 'engagement',
    slug: 'engagement',
    name: 'Платья на помолвку',
    kind: 'dress',
    image: img('cat-engagement'),
  },
  {
    id: 'veils',
    slug: 'veils',
    name: 'Фата и накидки',
    kind: 'accessory',
    image: img('cat-veils'),
    subcategories: [
      { id: 'veils-short', slug: 'short', name: 'Короткая фата', categoryId: 'veils' },
      { id: 'veils-long', slug: 'long', name: 'Длинная фата', categoryId: 'veils' },
      { id: 'veils-bolero', slug: 'bolero', name: 'Болеро', categoryId: 'veils' },
    ],
  },
  {
    id: 'jewelry',
    slug: 'jewelry',
    name: 'Украшения',
    kind: 'accessory',
    image: img('cat-jewelry'),
    subcategories: [
      { id: 'jewelry-tiara', slug: 'tiara', name: 'Диадемы', categoryId: 'jewelry' },
      { id: 'jewelry-earrings', slug: 'earrings', name: 'Серьги и колье', categoryId: 'jewelry' },
      { id: 'jewelry-belt', slug: 'belt', name: 'Пояса', categoryId: 'jewelry' },
    ],
  },
  {
    id: 'shoes',
    slug: 'shoes',
    name: 'Обувь',
    kind: 'accessory',
    image: img('cat-shoes'),
  },
  {
    id: 'extras',
    slug: 'extras',
    name: 'Дополнительно',
    kind: 'accessory',
    image: img('cat-extras'),
    subcategories: [
      { id: 'extras-gloves', slug: 'gloves', name: 'Перчатки', categoryId: 'extras' },
      { id: 'extras-underskirt', slug: 'underskirt', name: 'Подъюбники', categoryId: 'extras' },
    ],
  },
];
