import type {
  AccessoryType,
  Fabric,
  HemLength,
  ItemKind,
  Neckline,
  OfferType,
  Shade,
  Silhouette,
  Sleeve,
} from '../helper.types.catalog';

export const KIND_LABELS: Record<ItemKind, string> = {
  dress: 'Платья',
  accessory: 'Аксессуары',
};

export const OFFER_LABELS: Record<OfferType, string> = {
  rent: 'Аренда',
  sale: 'Продажа',
  tailoring: 'Пошив на заказ',
};

/** Segment / chip kabi tor joylar uchun qisqartirilgan yorliqlar */
export const OFFER_SHORT_LABELS: Record<OfferType, string> = {
  rent: 'Аренда',
  sale: 'Покупка',
  tailoring: 'Пошив',
};

export const SILHOUETTE_LABELS: Record<Silhouette, string> = {
  'a-line': 'Силуэт «А»',
  mermaid: 'Русалка',
  princess: 'Пышное',
  straight: 'Прямое',
  short: 'Короткое',
};

export const HEM_LENGTH_LABELS: Record<HemLength, string> = {
  floor: 'В пол',
  midi: 'Миди',
  short: 'Короткое',
};

export const NECKLINE_LABELS: Record<Neckline, string> = {
  sweetheart: 'Сердечко',
  'v-neck': 'V-образный',
  square: 'Квадратный',
  boat: 'Лодочка',
  'off-shoulder': 'Открытые плечи',
  'one-shoulder': 'На одно плечо',
  closed: 'Закрытый',
  halter: 'Халтер',
};

export const SLEEVE_LABELS: Record<Sleeve, string> = {
  none: 'Без бретелей',
  strap: 'Тонкие бретели',
  short: 'Короткий рукав',
  long: 'Длинный рукав',
  transparent: 'Прозрачный рукав',
};

export const FABRIC_LABELS: Record<Fabric, string> = {
  satin: 'Атлас',
  lace: 'Кружево',
  tulle: 'Фатин',
  chiffon: 'Шифон',
  crepe: 'Креп',
  organza: 'Органза',
  velvet: 'Бархат',
};

export const SHADE_LABELS: Record<Shade, string> = {
  ivory: 'Айвори',
  white: 'Белый',
  champagne: 'Шампань',
  blush: 'Пудровый',
  beige: 'Бежевый',
  pastel: 'Пастель',
};

export const ACCESSORY_TYPE_LABELS: Record<AccessoryType, string> = {
  veil: 'Фата',
  'face-veil': 'Вуалетка',
  tiara: 'Корона',
  hairpin: 'Заколка',
  jewelry: 'Украшения',
  bracelet: 'Браслет',
  gloves: 'Перчатки',
  bolero: 'Болеро',
  shoes: 'Обувь',
  underskirt: 'Подъюбник',
  belt: 'Пояс',
};
