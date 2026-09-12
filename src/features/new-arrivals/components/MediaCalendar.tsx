import { useLayoutEffect, useMemo, useRef } from 'react';
import { cn } from '@/utils/cn';
import type { DayGroup } from '@/utils/dayGroups';
import { defaultVariant } from '@/features/catalog/utils/item';
import type { CatalogItem } from '@/features/catalog';

type Props = {
  /** Kun bo'yicha guruhlangan mahsulotlar — faqat shu kunlar bosiladi */
  groups: DayGroup<CatalogItem>[];
  /** Tanlangan kun (YYYY-MM-DD) */
  value?: string | null;
  onPick: (date: string) => void;
  /**
   * Hafta sarlavhasi qaysi balandlikda yopishadi — sahifaning yuqori paneli
   * ham sticky bo'lgani uchun uning balandligi shu yerdan beriladi.
   */
  stickyTop?: string;
};

/** Dushanbadan boshlanadigan hafta — ruscha bir harfli sarlavhalar */
const WEEKDAYS = ['П', 'В', 'С', 'Ч', 'П', 'С', 'В'];

/** Mahalliy vaqtdagi kun kaliti — `toISOString()` UTC ga surib yuboradi */
function dayKey(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

/** Oyning 1-kuni haftaning nechanchi kataklariga tushadi (dushanba — 0) */
function leadingBlanks(year: number, month: number): number {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

function monthTitle(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Telegram uslubidagi media-kalendar: mahsulot kelgan kun katagida o'sha kunning
 * birinchi rasmi turadi, qolgan kunlar oddiy raqam. Chakra'ga bog'liq emas —
 * shuning uchun `CusCalendar` dan farqli o'laroq lazy yuklash shart emas.
 */
export default function MediaCalendar({
  groups,
  value,
  onPick,
  stickyTop = 'top-0',
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  /** date → muqova va soni */
  const byDate = useMemo(() => {
    const map = new Map<string, { cover: string; count: number }>();
    for (const g of groups) {
      const first = g.items[0];
      map.set(g.date, {
        cover: first ? defaultVariant(first).mainImage : '',
        count: g.items.length,
      });
    }
    return map;
  }, [groups]);

  /** Birinchi mahsulot oyidan oxirgisigacha — orasidagi bo'sh oylar ham chiqadi */
  const months = useMemo(() => {
    if (groups.length === 0) return [];
    const first = new Date(groups[0].date);
    const last = new Date(groups[groups.length - 1].date);

    const out: { year: number; month: number }[] = [];
    const cursor = new Date(first.getFullYear(), first.getMonth(), 1);
    const end = new Date(last.getFullYear(), last.getMonth(), 1);

    while (cursor <= end) {
      out.push({ year: cursor.getFullYear(), month: cursor.getMonth() });
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return out;
  }, [groups]);

  // Ochilganda eng so'nggi oy ko'rinsin — lentaning o'zi ham shu tartibda
  useLayoutEffect(() => {
    rootRef.current?.scrollIntoView({ block: 'end' });
  }, []);

  if (months.length === 0) return null;

  return (
    <div ref={rootRef}>
      <div
        className={cn(
          'sticky z-[1] grid grid-cols-7 gap-1.5 bg-background pb-2 pt-1',
          stickyTop,
        )}
      >
        {WEEKDAYS.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="text-center text-[10px] uppercase tracking-[0.14em] text-subtle"
          >
            {w}
          </span>
        ))}
      </div>

      <div className="space-y-5">
        {months.map(({ year, month }) => {
          const total = new Date(year, month + 1, 0).getDate();
          const blanks = leadingBlanks(year, month);

          return (
            <section key={`${year}-${month}`}>
              <h3 className="mb-2.5 text-center font-serif text-base capitalize text-foreground">
                {monthTitle(year, month)}
              </h3>

              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: blanks }, (_, i) => (
                  <span key={`blank-${i}`} aria-hidden />
                ))}

                {Array.from({ length: total }, (_, i) => {
                  const day = i + 1;
                  const key = dayKey(year, month, day);
                  const entry = byDate.get(key);
                  const selected = value === key;

                  if (!entry) {
                    return (
                      <span
                        key={key}
                        className="grid aspect-square place-items-center text-[13px] text-subtle"
                      >
                        {day}
                      </span>
                    );
                  }

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onPick(key)}
                      aria-label={`${day}, ${entry.count} моделей`}
                      aria-pressed={selected}
                      className={cn(
                        'relative grid aspect-square place-items-center overflow-hidden rounded-full',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                        selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
                      )}
                    >
                      {entry.cover && (
                        <img
                          src={entry.cover}
                          alt=""
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      )}

                      {/* Raqam har qanday rasmda o'qilishi uchun qoplama */}
                      <span className="absolute inset-0 bg-overlay-dark" aria-hidden />

                      <span className="relative text-[13px] font-semibold text-overlay-fg">
                        {day}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
