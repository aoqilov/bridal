import type { Promotion } from './helper.types.promotions';

const img = (seed: string, w = 800, h = 600): string =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-001',
    slug: 'archive-sale-50',
    title: 'Распродажа архива',
    subtitle: 'Скидки до 50% на коллекции прошлых лет',
    cover: img('promo-archive'),
    discountPercent: 50,
    startsAt: '2026-08-01',
    endsAt: '2026-08-31',
    description:
      'Освобождаем место под коллекцию 2026 года. Платья прошлых сезонов — в отличном состоянии, после профессиональной химчистки — продаём со скидкой до 50%.',
    conditions: [
      'Скидка только на модели коллекций 2023–2024',
      'Товар продаётся, аренда на эти модели не действует',
      'Размерный ряд ограничен — уточняйте наличие',
      'Действует до 31 августа 2026 года',
    ],
    ctaLabel: 'Смотреть модели',
    ctaUrl: '/catalog?kind=dress',
    accentColor: 'danger',
  },
  {
    id: 'promo-002',
    slug: 'accessories-free',
    title: 'Аксессуары в подарок',
    subtitle: 'Фата и подъюбник при аренде платья',
    cover: img('promo-accessories'),
    startsAt: '2026-07-01',
    endsAt: '2026-12-31',
    description:
      'При аренде любого свадебного платья фата и подъюбник — бесплатно. Не нужно доплачивать за то, без чего образ всё равно не собрать.',
    conditions: [
      'Действует при аренде платья категории «Свадебные»',
      'Фата и подъюбник — из доступных в наличии на дату',
      'Залог за аксессуары не взимается',
    ],
    ctaLabel: 'Выбрать платье',
    ctaUrl: '/catalog?kind=dress',
    accentColor: 'primary',
  },
  {
    id: 'promo-003',
    slug: 'early-booking-15',
    title: 'Ранняя бронь',
    subtitle: '−15% при бронировании за 3 месяца',
    cover: img('promo-early'),
    discountPercent: 15,
    startsAt: '2026-08-05',
    endsAt: '2026-12-31',
    description:
      'Забронируйте платье минимум за 90 дней до свадьбы и получите скидку 15% на аренду. Чем раньше — тем больше выбор моделей на вашу дату.',
    conditions: [
      'Бронь оформляется с внесением залога',
      'Дата свадьбы должна быть не раньше чем через 90 дней',
      'Не суммируется с другими скидками',
    ],
    ctaLabel: 'Записаться на примерку',
    ctaUrl: '/booking',
    accentColor: 'accent',
  },
  {
    id: 'promo-004',
    slug: 'second-dress',
    title: 'Второе платье',
    subtitle: '−30% на вечернее при аренде свадебного',
    cover: img('promo-second'),
    discountPercent: 30,
    startsAt: '2026-07-15',
    endsAt: '2026-10-15',
    description:
      'Многие невесты переодеваются к вечерней части. Возьмите вечернее или коктейльное платье вторым — со скидкой 30%.',
    conditions: [
      'Свадебное платье должно быть оформлено в аренду',
      'Скидка на категории «Вечерние платья» и «На помолвку»',
      'Обе позиции — на одну дату',
    ],
    ctaLabel: 'Смотреть вечерние',
    ctaUrl: '/catalog?cats=evening',
    accentColor: 'accent',
  },
];

export function getPromotionBySlug(slug: string): Promotion | undefined {
  return MOCK_PROMOTIONS.find((p) => p.slug === slug);
}
