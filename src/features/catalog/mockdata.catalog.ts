import type { CatalogItem } from './helper.types.catalog';
import { MOCK_DRESSES } from './mockdata.dresses';
import { MOCK_ACCESSORIES } from './mockdata.accessories';
import { REAL_ACCESSORIES, REAL_DRESSES, USE_REAL_DATA } from './mockdata.real';

/**
 * Butun katalog — ko'ylaklar + aksessuarlar bitta ro'yxatda.
 * `USE_REAL_DATA = true` bo'lganda faqat `mockdata.real.ts` dagi haqiqiy modellar
 * ishlatiladi, picsum placeholder ma'lumot chiqib ketadi.
 */
export const MOCK_CATALOG: CatalogItem[] = USE_REAL_DATA
  ? [...REAL_DRESSES, ...REAL_ACCESSORIES]
  : [...MOCK_DRESSES, ...MOCK_ACCESSORIES];
