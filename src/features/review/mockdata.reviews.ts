import type { Review } from './helper.types.review';

// ---- Helpers ----
const img = (seed: string, size = 600): string =>
  `https://picsum.photos/seed/${seed}/${size}/${size}`;

const avatar = (seed: string): string =>
  `https://picsum.photos/seed/${seed}/96/96`;

/**
 * Joriy foydalanuvchi id'si (mock).
 * Auth qo'shilganda `useUserStore.user.id` bilan almashtiriladi.
 */
export const CURRENT_USER_ID = 'me';

// ---- Mijozlar sharhlari (kelin ko'ylaklari va aksessuarlar) ----
export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r-100',
    itemId: 'd-victoria',
    author: { id: CURRENT_USER_ID, name: 'Вы', avatar: avatar('rev-me'), city: 'Ташкент' },
    rating: 5,
    title: 'Идеально село по фигуре',
    description:
      'Брала в аренду на свадьбу. Подогнали по фигуре за один визит, атлас плотный — не просвечивает.',
    images: [img('review-me-a'), img('review-me-b')],
    createdAt: '2026-08-09T10:00:00Z',
    likeCount: 12,
    isVerifiedPurchase: true,
  },
  {
    id: 'r-101',
    itemId: 'a-veil-classic',
    author: { id: CURRENT_USER_ID, name: 'Вы', avatar: avatar('rev-me'), city: 'Ташкент' },
    rating: 4,
    title: 'Фата лёгкая, гребень держит',
    description:
      'Два метра — красиво на фото. Сняла звезду только за то, что путается на ветру.',
    images: [img('review-me-c')],
    createdAt: '2026-08-05T12:30:00Z',
    likeCount: 4,
    isVerifiedPurchase: true,
  },
  {
    id: 'r-001',
    itemId: 'd-aurora',
    author: { id: 'u-01', name: 'Дилноза А.', avatar: avatar('rev-u-01'), city: 'Ташкент' },
    rating: 5,
    title: 'Платье мечты',
    description:
      'Шлейф отстегнули перед танцами — очень удобно. Все гости спрашивали, где брала.',
    images: [img('review-aurora-1'), img('review-aurora-2'), img('review-aurora-3')],
    createdAt: '2026-08-02T09:15:00Z',
    likeCount: 34,
    isVerifiedPurchase: true,
  },
  {
    id: 'r-002',
    itemId: 'd-bella',
    author: { id: 'u-02', name: 'Малика Р.', avatar: avatar('rev-u-02'), city: 'Самарканд' },
    rating: 5,
    title: 'Кружево живое, не колючее',
    description:
      'Русалка сидит плотно, но дышать можно. На примерке дали три размера — выбрали свой.',
    images: [img('review-bella-1'), img('review-bella-2')],
    createdAt: '2026-07-28T14:00:00Z',
    likeCount: 21,
    isVerifiedPurchase: true,
  },
  {
    id: 'r-003',
    itemId: 'd-dolce',
    author: { id: 'u-03', name: 'Севара К.', avatar: avatar('rev-u-03'), city: 'Ташкент' },
    rating: 5,
    title: 'Вышивка ручная — видно вблизи',
    description:
      'Дорого, но за такую работу не жалко. Шлейф 2,5 метра — на фото невероятно.',
    images: [img('review-dolce-1')],
    createdAt: '2026-07-25T16:40:00Z',
    likeCount: 45,
    isVerifiedPurchase: true,
  },
  {
    id: 'r-004',
    itemId: 'a-tiara-crystal',
    author: { id: 'u-04', name: 'Нилуфар Т.', avatar: avatar('rev-u-04'), city: 'Бухара' },
    rating: 5,
    title: 'Не давит на голову',
    description: 'Носила весь день, голова не болела. Кристаллы блестят даже в помещении.',
    images: [img('review-tiara-1'), img('review-tiara-2')],
    createdAt: '2026-07-21T11:05:00Z',
    likeCount: 17,
    isVerifiedPurchase: true,
  },
  {
    id: 'r-005',
    itemId: 'd-olivia',
    author: { id: 'u-05', name: 'Зарина М.', avatar: avatar('rev-u-05'), city: 'Ташкент' },
    rating: 5,
    title: 'На помолвку — то что нужно',
    description: 'Пудровый цвет нежный, на фото выглядит дороже своей цены.',
    images: [img('review-olivia-1')],
    createdAt: '2026-07-18T13:20:00Z',
    likeCount: 28,
    isVerifiedPurchase: true,
  },
  {
    id: 'r-006',
    itemId: 'd-camellia',
    author: { id: 'u-06', name: 'Гулноза Ш.', avatar: avatar('rev-u-06'), city: 'Наманган' },
    rating: 4,
    title: 'Пышность максимальная',
    description:
      'Юбка огромная — в машину садилась с помощью. Но эффект того стоит, все ахнули.',
    images: [img('review-camellia-1'), img('review-camellia-2')],
    createdAt: '2026-07-14T10:00:00Z',
    likeCount: 19,
    isVerifiedPurchase: true,
  },
  {
    id: 'r-007',
    itemId: 'a-shoes-ivory',
    author: { id: 'u-07', name: 'Шахноза Б.', avatar: avatar('rev-u-07'), city: 'Ташкент' },
    rating: 4,
    title: 'Каблук устойчивый',
    description: 'Протанцевала всю ночь. Стелька мягкая, но размер советую брать на размер больше.',
    images: [img('review-shoes-1')],
    createdAt: '2026-07-10T18:30:00Z',
    likeCount: 9,
    isVerifiedPurchase: true,
  },
  {
    id: 'r-008',
    itemId: 'd-eliza',
    author: { id: 'u-08', name: 'Мадина Ю.', avatar: avatar('rev-u-08'), city: 'Фергана' },
    rating: 5,
    title: 'Скромно и элегантно',
    description: 'Закрытая спина и длинный рукав — как раз для нашей церемонии.',
    images: [img('review-eliza-1'), img('review-eliza-2')],
    createdAt: '2026-07-06T09:45:00Z',
    likeCount: 23,
    isVerifiedPurchase: true,
  },
  {
    id: 'r-009',
    itemId: 'a-cape-train',
    author: { id: 'u-09', name: 'Азиза Н.', avatar: avatar('rev-u-09'), city: 'Ташкент' },
    rating: 5,
    title: 'Превратила простое платье',
    description: 'Взяла накидку к прямому платью — получился совершенно другой образ.',
    images: [img('review-cape-1')],
    createdAt: '2026-07-02T15:10:00Z',
    likeCount: 31,
    isVerifiedPurchase: true,
  },
  {
    id: 'r-010',
    itemId: 'd-gracia',
    author: { id: 'u-10', name: 'Феруза Х.', avatar: avatar('rev-u-10'), city: 'Ташкент' },
    rating: 4,
    title: 'Минимализм в лучшем виде',
    description: 'Без декора, но крой идеальный. Креп не мнётся за день.',
    images: [img('review-gracia-1')],
    createdAt: '2026-06-28T12:00:00Z',
    likeCount: 14,
    isVerifiedPurchase: true,
  },
  {
    id: 'r-011',
    itemId: 'd-isabel',
    author: { id: 'u-11', name: 'Лола С.', avatar: avatar('rev-u-11'), city: 'Андижан' },
    rating: 5,
    title: 'Для росписи — супер',
    description: 'Короткое, лёгкое, не жарко. Взяли в аренду на один день, вышло недорого.',
    images: [img('review-isabel-1'), img('review-isabel-2')],
    createdAt: '2026-06-22T11:30:00Z',
    likeCount: 26,
    isVerifiedPurchase: true,
  },
  {
    id: 'r-012',
    itemId: 'a-bolero-lace',
    author: { id: 'u-12', name: 'Камола Э.', avatar: avatar('rev-u-12'), city: 'Ташкент' },
    rating: 4,
    title: 'Спасло на прохладном вечере',
    description: 'Кружево тонкое, но плечи закрывает. Хорошо сочеталось с моим платьем.',
    images: [img('review-bolero-1')],
    createdAt: '2026-06-15T17:00:00Z',
    likeCount: 8,
    isVerifiedPurchase: true,
  },
];
