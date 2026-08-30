import { isDress, type CatalogItem } from '@/features/catalog';
import type { OutfitCategory } from '../helper.types.garderob';

/**
 * Katalog tovari garderobning qaysi bo'limiga tushadi.
 * "Украшения" — qolgan aksessuarlar uchun ham (перчатки, болеро, пояс...),
 * shunda hech bir tovar bo'limlar orasidan yo'qolib qolmaydi.
 * "Сумка" — katalogda hozircha bunday tur yo'q, bo'lim bo'sh turadi.
 */
export function itemCategory(item: CatalogItem): OutfitCategory {
  if (isDress(item)) return 'dress';

  switch (item.accessoryType) {
    case 'shoes':
      return 'shoes';
    case 'veil':
    case 'face-veil':
      return 'veil';
    default:
      return 'jewelry';
  }
}
