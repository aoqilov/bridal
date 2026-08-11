import type { CatalogItem } from './helper.types.catalog';
import { MOCK_DRESSES } from './mockdata.dresses';
import { MOCK_ACCESSORIES } from './mockdata.accessories';

/** Butun katalog — ko'ylaklar + aksessuarlar bitta ro'yxatda */
export const MOCK_CATALOG: CatalogItem[] = [...MOCK_DRESSES, ...MOCK_ACCESSORIES];
