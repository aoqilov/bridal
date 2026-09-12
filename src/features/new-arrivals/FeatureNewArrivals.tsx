import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MdApps, MdGridView, MdViewAgenda, MdFiberNew } from 'react-icons/md';
import CusSegment, { type SegmentItem } from '@/components/ui/segment/CusSegment';
import { CusDayDivider } from '@/components/ui';
import { useHideOnScroll } from '@/hooks/useHideOnScroll';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/constants/routes';
import { type CatalogItem } from '@/features/catalog';
import ItemCard from '@/features/catalog/components/ItemCard';
import ItemThumb from '@/features/catalog/components/ItemThumb';
import ItemPostCard from '@/features/catalog/components/ItemPostCard';
import EmptyState from '@/features/catalog/components/EmptyState';
import { useNewArrivalGroups } from './hooks/useNewArrivalGroups';

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Kalendar sahifasidan qaytgan kun — lenta o'sha joyga ochiladi
  const pickedDate = searchParams.get('date');
  const headerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const { hidden: headerHidden } = useHideOnScroll(headerRef, {
    threshold: 200,
  });

  const { groups, total } = useNewArrivalGroups();

  /*
   * Sana berilgan bo'lsa o'sha kun guruhiga, aks holda eng pastga
   * (eng yangi mahsulot ko'rinsin — Telegram chat uslubi).
   */
  useLayoutEffect(() => {
    if (pickedDate) {
      document
        .getElementById(`day-${pickedDate}`)
        ?.scrollIntoView({ block: 'start' });
      return;
    }

    const scrollEl = findScrollableAncestor(rootRef.current);
    if (!scrollEl) return;
    scrollEl.scrollTop = scrollEl.scrollHeight;
  }, [view, pickedDate]);

  return (
    <div ref={rootRef} className="mx-auto flex min-h-full max-w-md flex-col">
      <div
        ref={headerRef}
        className="sticky top-0 z-10 border-b border-border-subtle bg-background px-4"
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
                <MdFiberNew size={22} className="text-primary" />
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
              <CusDayDivider
                label={g.label}
                onClick={() => navigate(ROUTES.NEW_ARRIVALS_CALENDAR)}
              />
              <GroupBody items={g.items} view={view} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
