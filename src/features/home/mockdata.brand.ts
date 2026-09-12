import type { ComponentType } from 'react';
import {
  MdCheckroom,
  MdContentCut,
  MdEventAvailable,
  MdSell,
} from 'react-icons/md';

export type Advantage = {
  id: string;
  title: string;
  /** Sarlavha yonidagi qisqa izoh */
  short: string;
  body: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

export const BRAND_INFO = {
  name: 'Amira Bridal',
  tagline: 'Свадебные платья и аксессуары в Ташкенте',
  description:
    'Более 8 лет мы одеваем невест Узбекистана. Аренда, продажа и пошив на заказ — под одной крышей. Примерка бесплатная и без обязательств.',
  // Salon egasi o'z logotipini shu yerga qo'yadi (public/ yoki src/assets/ dan yo'l)
  // Bo'sh bo'lsa — initial fallback ko'rsatiladi
  logo: '' as string,
  // Bosh sahifadagi muqova fotosi (public/ dagi yo'l). Bo'sh bo'lsa — neytral joy egallagich
  cover: '/assets/homebg.webp' as string,
};

/** Salonning asosiy biznes ustunliklari — bosh sahifadagi accordion uchun */
export const ADVANTAGES: Advantage[] = [
  {
    id: 'rent',
    title: 'Аренда платья',
    short: '3 дня · химчистка включена',
    body: 'Платье выдаётся на 3 дня, химчистка после свадьбы уже входит в стоимость. Залог фиксированный, указан на странице модели, и возвращается полностью при возврате в срок и без повреждений.',
    icon: MdCheckroom,
  },
  {
    id: 'sale',
    title: 'Продажа',
    short: 'Платье остаётся у вас',
    body: 'Понравившуюся модель можно выкупить — она остаётся у вас навсегда. Базовая подгонка по фигуре входит в стоимость: ушить корсет или подшить длину не будет стоить дополнительно.',
    icon: MdSell,
  },
  {
    id: 'tailoring',
    title: 'Пошив на заказ',
    short: 'По вашим меркам · 30–45 дней',
    body: 'Шьём по индивидуальным меркам: вы выбираете силуэт, ткань и отделку, мы отшиваем платье, которого нет ни у кого. Занимает 30–45 дней, поэтому приходите минимум за два месяца до даты.',
    icon: MdContentCut,
  },
  {
    id: 'fitting',
    title: 'Бесплатная примерка',
    short: 'Час времени, без обязательств',
    body: 'Примерка бесплатная и длится около часа — за визит успеваем показать 5–7 платьев. Отметьте модели в «Избранном», и мы подготовим их к вашему приходу. Ничего не подошло — просто приходите снова.',
    icon: MdEventAvailable,
  },
];
