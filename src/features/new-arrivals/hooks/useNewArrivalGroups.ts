import { useMemo } from 'react';
import { groupByDay, type DayGroup } from '@/utils/dayGroups';
import { MOCK_CATALOG, type CatalogItem } from '@/features/catalog';

type Result = {
  groups: DayGroup<CatalogItem>[];
  /** Faqat mahsulot bor kunlar — kalendar shu ro'yxatdan tanlaydi */
  dates: string[];
  total: number;
};

/**
 * Yangi kelganlar lentasi uchun kun guruhlari.
 * Lenta ham, kalendar sahifasi ham shu manbadan o'qiydi — ikkalasida bir xil
 * filtr va tartib bo'lishi shart, aks holda kalendardagi kun lentada topilmaydi.
 */
export function useNewArrivalGroups(): Result {
  return useMemo(() => {
    const filtered = MOCK_CATALOG.filter((p) => p.isAvailable && p.isNew);
    // O'sish tartibida: eng eski tepada, eng yangi pastda (Telegram chat uslubi)
    const groups = groupByDay(filtered, (p) => p.createdAt, 'asc');

    return {
      groups,
      dates: groups.map((g) => g.date),
      total: filtered.length,
    };
  }, []);
}
