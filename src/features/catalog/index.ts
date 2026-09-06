export type {
  Category,
  Subcategory,
  CatalogItem,
  Dress,
  Accessory,
  DressSize,
  ItemVariant,
  ItemKind,
  OfferType,
  Silhouette,
  Neckline,
  Sleeve,
  Fabric,
  Shade,
  AccessoryType,
  Currency,
} from './helper.types.catalog';

export {
  ITEM_KINDS,
  OFFER_TYPES,
  SILHOUETTES,
  NECKLINES,
  SLEEVES,
  FABRICS,
  SHADES,
  ACCESSORY_TYPES,
  CURRENCIES,
  isDress,
  isAccessory,
} from './helper.types.catalog';

export { MOCK_CATEGORIES } from './mockdata.categories';
export { REAL_CATEGORIES, PREFIX_MAP } from './mockdata.categories.real';
export type { PrefixInfo } from './mockdata.categories.real';
export { MOCK_DRESSES } from './mockdata.dresses';
export { MOCK_ACCESSORIES } from './mockdata.accessories';
export { MOCK_CATALOG } from './mockdata.catalog';

export {
  getItemBySlug,
  getItemById,
  getRelatedItems,
  getMatchingAccessories,
} from './utils/getItem';

export { primaryPrice, secondaryPrice, offerPrice, discountPercent } from './utils/price';
export type { PriceView } from './utils/price';

export { defaultVariant, isHijabItem, HIJAB_CATEGORY_ID } from './utils/item';

export {
  KIND_LABELS,
  OFFER_LABELS,
  OFFER_SHORT_LABELS,
  SILHOUETTE_LABELS,
  NECKLINE_LABELS,
  SLEEVE_LABELS,
  FABRIC_LABELS,
  SHADE_LABELS,
  ACCESSORY_TYPE_LABELS,
} from './utils/labels';
