/** Kun bo'yicha guruhlangan ro'yxat — lenta ajratgichlari uchun */
export type DayGroup<T> = {
  /** YYYY-MM-DD */
  date: string;
  /** Ekranda ko'rinadigan yorliq — «18 июня» */
  label: string;
  items: T[];
};

export function toDayKey(iso: string): string {
  return iso.slice(0, 10);
}

/** Joriy yil bo'lsa yil ko'rsatilmaydi */
export function formatDayLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const opts: Intl.DateTimeFormatOptions =
    d.getFullYear() === now.getFullYear()
      ? { day: 'numeric', month: 'long' }
      : { day: 'numeric', month: 'long', year: 'numeric' };
  return d.toLocaleDateString('ru-RU', opts);
}

/**
 * Elementlarni kun bo'yicha guruhlaydi.
 * `asc` — eng eski tepada (Telegram lentasi), `desc` — eng yangisi tepada.
 */
export function groupByDay<T>(
  items: T[],
  getIso: (item: T) => string,
  order: 'asc' | 'desc' = 'asc',
): DayGroup<T>[] {
  const sorted = [...items].sort((a, b) => {
    const diff = new Date(getIso(a)).getTime() - new Date(getIso(b)).getTime();
    return order === 'asc' ? diff : -diff;
  });

  const map = new Map<string, T[]>();
  for (const item of sorted) {
    const key = toDayKey(getIso(item));
    const arr = map.get(key);
    if (arr) arr.push(item);
    else map.set(key, [item]);
  }

  return Array.from(map.entries()).map(([date, groupItems]) => ({
    date,
    label: formatDayLabel(getIso(groupItems[0])),
    items: groupItems,
  }));
}
