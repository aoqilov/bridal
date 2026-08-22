import { lazy, Suspense, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { MdApps, MdGridView, MdViewAgenda, MdFiberNew } from 'react-icons/md';
import CusSegment, { type SegmentItem } from '@/components/ui/segment/CusSegment';
import { CusDayDivider, CusSheet, CusSkeleton } from '@/components/ui';

// Chakra og'ir — kalendar faqat sheet ochilganda yuklansin
const CusCalendar = lazy(() => import('@/components/ui/calendar/CusCalendar'));
import { useHideOnScroll } from '@/hooks/useHideOnScroll';
import { cn } from '@/utils/cn';
import { groupByDay } from '@/utils/dayGroups';
import { MOCK_CATALOG, type CatalogItem } from '@/features/catalog';
import ItemCard from '@/features/catalog/components/ItemCard';
import ItemThumb from '@/features/catalog/components/ItemThumb';
import ItemPostCard from '@/features/catalog/components/ItemPostCard';
import EmptyState from '@/features/catalog/components/EmptyState';

type ViewMode = 'grid-3' | 'grid-2' | 'post';

const VIEW_ITEMS: SegmentItem<ViewMode>[] = [
  { value: 'grid-3', icon: <MdApps size={16} />, ariaLabel: 'Плитка 3 в ряд' },
  {
    value: 'grid-2',
    icon: <MdGridView size={16} />,
    ariaLabel: 'Карточки 2 в ряд',
  },
  {
    value: 'post',
    label: 'Пост',
    icon: <MdViewAgenda size={16} />,
    ariaLabel: 'Лента постов',
  },
];

function findScrollableAncestor(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null;
  while (node) {
    const style = getComputedStyle(node);
    if (style.overflowY === 'auto' || style.overflowY === 'scroll') return node;
    node = node.parentElement;
  }
  return null;
}

function GroupBody({ items, view }: { items: CatalogItem[]; view: ViewMode }) {
  if (view === 'grid-3') {
    return (
      <div className="grid grid-cols-3 gap-0.5">
        {items.map((p) => (
          <ItemThumb key={p.id} item={p} gallery />
        ))}
      </div>
    );
  }
  if (view === 'grid-2') {
    return (
      <div className="grid grid-cols-2 gap-3 px-4 pb-4">
        {items.map((p) => (
          <ItemCard key={p.id} item={p} gallery />
        ))}
      </div>
    );
  }
  return (
    <div className="divide-y divide-border-subtle">
      {items.map((p) => (
        <ItemPostCard key={p.id} item={p} gallery />
      ))}
    </div>
  );
}

export default function FeatureNewArrivals() {
  const [view, setView] = useState<ViewMode>('grid-3');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const { hidden: headerHidden } = useHideOnScroll(headerRef, {
    threshold: 200,
  });

  const { groups, total } = useMemo(() => {
    const filtered = MOCK_CATALOG.filter((p) => p.isAvailable && p.isNew);
    // O'sish tartibida: eng eski tepada, eng yangi pastda (Telegram chat uslubi)
    return {
      groups: groupByDay(filtered, (p) => p.createdAt, 'asc'),
      total: filtered.length,
    };
  }, []);

  // Kalendarda faqat mahsulot bor kunlar tanlanadi
  const dates = useMemo(() => groups.map((g) => g.date), [groups]);

  // Ilk mount va view mode o'zgarganda — eng pastga scroll (eng yangi mahsulot ko'rinsin)
  useLayoutEffect(() => {
    const scrollEl = findScrollableAncestor(rootRef.current);
    if (!scrollEl) return;
    scrollEl.scrollTop = scrollEl.scrollHeight;
  }, [view]);

  // Kalendardan sana tanlanganda — o'sha kun guruhiga o'tamiz
  const handlePickDate = (date: string) => {
    setPickedDate(date);
    setCalendarOpen(false);
    document
      .getElementById(`day-${date}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div ref={rootRef} className="mx-auto flex min-h-full max-w-md flex-col">
      <div
        ref={headerRef}
        className="sticky top-0 z-10 border-b border-border-subtle bg-background/95 px-4 backdrop-blur"
      >
        {/* Scroll paytida faqat sarlavha yig'iladi — segment doim ko'rinib turadi */}
        <div
          className={cn(
            'grid transition-all duration-300 ease-out',
            headerHidden ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100',
          )}
        >
          <div className="overflow-hidden">
            <div className="min-w-0 pt-3">
              <h1 className="flex items-center gap-1.5 text-lg font-bold text-foreground">
                <MdFiberNew size={22} className="text-accent" />
                Новинки
              </h1>
              <p className="text-[11px] text-muted">
                Свежие поступления · {total}
              </p>
            </div>
          </div>
        </div>

        <div className="py-3">
          <CusSegment
            items={VIEW_ITEMS}
            value={view}
            onChange={setView}
            size="sm"
            fullWidth
          />
        </div>
      </div>

      {groups.length === 0 ? (
        <EmptyState
          title="Пока нет новинок"
          description="Новые поступления скоро появятся в каталоге."
          icon={<MdFiberNew size={28} />}
        />
      ) : (
        <div className="flex-1">
          {groups.map((g) => (
            <section key={g.date} id={`day-${g.date}`} className="scroll-mt-28">
              <CusDayDivider label={g.label} onClick={() => setCalendarOpen(true)} />
              <GroupBody items={g.items} view={view} />
            </section>
          ))}
        </div>
      )}

      {groups.length > 0 && (
        <CusSheet
          open={calendarOpen}
          onClose={() => setCalendarOpen(false)}
          title="Выберите дату"
        >
          <div className="flex justify-center">
            <Suspense fallback={<CusSkeleton className="h-64 w-72" />}>
              <CusCalendar
                value={pickedDate ?? dates[dates.length - 1]}
                onChange={handlePickDate}
                availableDates={dates}
                min={dates[0]}
                max={dates[dates.length - 1]}
              />
            </Suspense>
          </div>
        </CusSheet>
      )}
    </div>
  );
}
