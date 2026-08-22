// Salon bilan bog'lanish uchun placeholder ma'lumotlar
// Haqiqiy raqam/username bilan almashtiring
export const SALON_TELEGRAM = 'amira_bridal';
export const SALON_PHONE = '+998 90 000 00 00';

export type AddressPoint = {
  id: string;
  title: string;
  address: string;
  landmark?: string;
  hours: string;
  phone: string;
  lat: number;
  lng: number;
};

export const ADDRESSES: AddressPoint[] = [
  {
    id: 'salon-tashkent',
    title: 'Салон в Ташкенте',
    address: 'ул. Мустакиллик, 78',
    landmark: 'ТЦ «Малика», 2 этаж',
    hours: 'Пн–Вс · 10:00 – 20:00',
    phone: '+998 90 000 00 00',
    lat: 41.311081,
    lng: 69.240562,
  },
  {
    id: 'salon-chilanzar',
    title: 'Салон · Чиланзар',
    address: 'ул. Бунёдкор, 12',
    landmark: 'Рядом с метро «Новза»',
    hours: 'Пн–Сб · 10:00 – 19:00',
    phone: '+998 90 000 00 01',
    lat: 41.275318,
    lng: 69.204399,
  },
  {
    id: 'atelier-yunusabad',
    title: 'Ателье · Юнусабад',
    address: 'ул. Амира Темура, 108',
    landmark: 'БЦ «Пойтахт», 1 этаж',
    hours: 'Пн–Пт · 10:00 – 18:00',
    phone: '+998 90 000 00 02',
    lat: 41.338745,
    lng: 69.284523,
  },
];

export type ContactPerson = {
  id: string;
  name: string;        // "Наргиза"
  role: string;        // "Владелица салона"
  phone: string;
  telegram?: string;   // username, "@" siz
  hours?: string;
};

/** Salon xodimlari / bo'limlar telefonlari — "Контакты" plitkasi uchun */
export const CONTACTS: ContactPerson[] = [
  {
    id: 'owner',
    name: 'Наргиза',
    role: 'Владелица салона',
    phone: '+998 90 000 00 00',
    telegram: SALON_TELEGRAM,
    hours: 'Пн–Вс · 10:00 – 20:00',
  },
  {
    id: 'shop',
    name: 'Салон · Мустакиллик',
    role: 'Приём звонков и запись',
    phone: '+998 71 200 00 78',
    hours: 'Пн–Вс · 10:00 – 20:00',
  },
  {
    id: 'atelier',
    name: 'Дилноза',
    role: 'Ателье · пошив на заказ',
    phone: '+998 90 000 00 02',
    hours: 'Пн–Пт · 10:00 – 18:00',
  },
];

/** Asosiy kontakt — plitkada ko'rsatiladi */
export const PRIMARY_CONTACT = CONTACTS[0];

// Yandex map widget URL — iframe uchun (marker bilan)
export function buildYandexMapWidgetUrl(
  lat: number,
  lng: number,
  zoom = 16,
): string {
  return `https://yandex.uz/map-widget/v1/?ll=${lng},${lat}&z=${zoom}&pt=${lng},${lat},pm2rdm`;
}

// Yandex Maps — batafsil ko'rish / yo'nalish qurish uchun tashqi link
export function buildYandexMapsRouteUrl(lat: number, lng: number): string {
  return `https://yandex.uz/maps/?ll=${lng},${lat}&z=16&pt=${lng},${lat},pm2rdm&rtext=~${lat},${lng}&rtt=auto`;
}

export function buildTelegramLink(): string {
  return `https://t.me/${SALON_TELEGRAM}`;
}

export function buildPhoneLink(phone = SALON_PHONE): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function buildTelegramItemLink(itemName: string, url: string): string {
  const text = encodeURIComponent(
    `Здравствуйте! Меня интересует модель «${itemName}»\n${url}`,
  );
  return `https://t.me/${SALON_TELEGRAM}?text=${text}`;
}

/** Примерка arizasini Telegram orqali yuborish */
export function buildTelegramFittingLink(params: {
  itemName?: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  size?: string;
  comment?: string;
}): string {
  const lines = [
    'Здравствуйте! Хочу записаться на примерку.',
    params.itemName ? `Модель: ${params.itemName}` : null,
    params.size ? `Размер: ${params.size}` : null,
    `Дата: ${params.date}, ${params.time}`,
    `Имя: ${params.name}`,
    `Телефон: ${params.phone}`,
    params.comment ? `Комментарий: ${params.comment}` : null,
  ].filter(Boolean);
  return `https://t.me/${SALON_TELEGRAM}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function buildContactTelegramLink(message = 'Здравствуйте!'): string {
  return `https://t.me/${SALON_TELEGRAM}?text=${encodeURIComponent(message)}`;
}
