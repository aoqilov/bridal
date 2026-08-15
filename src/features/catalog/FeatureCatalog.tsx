import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MdCategory, MdApps, MdGridView, MdViewAgenda } from 'react-icons/md';
import { FiSearch } from 'react-icons/fi';
import CusSegment, { type SegmentItem } from '@/components/ui/segment/CusSegment';
import { useToast } from '@/components/ui';
import { useDebounce } from '@/hooks/useDebounce';
import { useHideOnScroll } from '@/hooks/useHideOnScroll';
import { cn } from '@/utils/cn';
import { MOCK_CATEGORIES, MOCK_CATALOG } from '@/features/catalog';
import ItemCard from './components/ItemCard';
import ItemThumb from './components/ItemThumb';
import ItemPostCard from './components/ItemPostCard';
import SearchBar from './components/SearchBar';
import RecentSearches from './components/RecentSearches';
import CategoryRail from './components/CategoryRail';
import SubcategoryGrid from './components/SubcategoryGrid';
import ShowResultsButton from './components/ShowResultsButton';
import EmptyState from './components/EmptyState';
import { useRecentSearches } from './hooks/useRecentSearches';
import { useSearchItems } from './hooks/useSearchItems';
import { useCategoryFilter } from './hooks/useCategoryFilter';
import { useActiveCategory } from './hooks/useActiveCategory';
import { useKindFilter } from './hooks/useKindFilter';
import { useViewMode, type ViewMode } from './hooks/useViewMode';

export default function FeatureCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const inputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { view, setView } = useViewMode();
  // Qidiruv paneli yopiq turadi; URL'da `q` bo'lsa ochiq holatda ochiladi
  const [searchOpen, setSearchOpen] = useState(() => query.length > 0);
  const isCategories = view === 'categories';
  const { hidden: headerHidden } = useHideOnScroll(headerRef, {
    threshold: 200,
    disabled: isCategories,
  });

  const setQuery = (next: string) => {
    setSearchParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (next) p.set('q', next);
        else p.delete('q');
        return p;
      },
      { replace: true },
    );
  };

  const debouncedQuery = useDebounce(query, 250);
  const searched = useSearchItems(debouncedQuery, MOCK_CATALOG, MOCK_CATEGORIES);
  const filter = useCategoryFilter();
  const kindFilter = useKindFilter();
  const { recent, add, remove, clear: clearRecent } = useRecentSearches();
  const toast = useToast();

  const hasQuery = debouncedQuery.trim().length > 0;
  const hasFilter = filter.count > 0;
  const hasAnyParam = query.length > 0 || hasFilter || kindFilter.kind !== 'all';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.show('Ссылка скопирована', 'success');
    } catch {
      toast.show('Не удалось скопировать', 'error');
    }
  };

  // Tanlangan tab ichidagi kategoriyalar
  const categoriesToShow = useMemo(
    () =>
      kindFilter.kind === 'all'
        ? MOCK_CATEGORIES
        : MOCK_CATEGORIES.filter((c) => c.kind === kindFilter.kind),
    [kindFilter.kind],
  );

  const { activeCategory, activeCategoryId, setActiveCategoryId } =
    useActiveCategory(categoriesToShow);

  // Sanoq: barcha mavjud tovarlar (filterdan mustaqil)
  const { countsByCategory, countsBySubcategory } = useMemo(() => {
    const byCat: Record<string, number> = {};
    const bySub: Record<string, number> = {};
    for (const i of MOCK_CATALOG) {
      if (!i.isAvailable) continue;
      byCat[i.categoryId] = (byCat[i.categoryId] ?? 0) + 1;
      if (i.subcategoryId) {
        bySub[i.subcategoryId] = (bySub[i.subcategoryId] ?? 0) + 1;
      }
    }
    return { countsByCategory: byCat, countsBySubcategory: bySub };
  }, []);

  // Query + kind tab + kategoriya filtri kombinatsiyasi
  const itemsToShow = useMemo(() => {
    const base = hasQuery ? searched : MOCK_CATALOG.filter((i) => i.isAvailable);
    return base.filter(kindFilter.matches).filter(filter.matches);
  }, [hasQuery, searched, filter, kindFilter]);

  const segmentItems: SegmentItem<ViewMode>[] = [
    {
      value: 'categories',
      label: 'Категории',
      icon: <MdCategory size={16} />,
      ariaLabel: 'Категории',
    },
    { value: 'grid-3', icon: <MdApps size={16} />, ariaLabel: 'Плитка 3 в ряд' },
    { value: 'grid-2', icon: <MdGridView size={16} />, ariaLabel: 'Карточки 2 в ряд' },
    { value: 'post', label: 'Пост', icon: <MdViewAgenda size={16} />, ariaLabel: 'Лента постов' },
  ];

  const toggleSearch = () => {
    const next = !searchOpen;
    setSearchOpen(next);
    if (next) requestAnimationFrame(() => inputRef.current?.focus());
    else inputRef.current?.blur();
  };

  const handleSubmit = (value: string) => {
    const trimmed = value.trim();
    if (trimmed) add(trimmed);
    inputRef.current?.blur();
  };

  const handleSelectRecent = (q: string) => {
    setQuery(q);
    inputRef.current?.focus();
  };

  // Action bar: tanlanganlar 3 ustunli plitkada ochiladi
  const handleShowResults = () => {
    setView('grid-3');
  };

  const emptyByFilter =
    itemsToShow.length === 0 && (hasQuery || hasFilter || kindFilter.kind !== 'all');

  return (
    <div className={cn('mx-auto flex max-w-md flex-col', isCategories ? 'h-full' : 'min-h-full')}>
      <div
        ref={headerRef}
        className={cn(
          'sticky top-0 z-10 border-b border-border-subtle bg-background/95 px-4 pb-3 pt-3 backdrop-blur transition-transform duration-300 ease-out',
          headerHidden && '-translate-y-full',
        )}
      >
        {/* Qidiruv — tugma bosilganda tepadan pastga ochiladi */}
        <div
          className={cn(
            '-mx-1 grid transition-all duration-300 ease-out',
            searchOpen ? 'grid-rows-[1fr] pb-3 opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
          aria-hidden={!searchOpen}
        >
          <div className="overflow-hidden p-1">
            <SearchBar
              ref={inputRef}
              value={query}
              onChange={setQuery}
              onSubmit={handleSubmit}
              tabIndex={searchOpen ? 0 : -1}
            />
          </div>
        </div>

        <div className="flex items-stretch gap-2">
          <CusSegment
            items={segmentItems}
            value={view}
            onChange={setView}
            size="sm"
            fullWidth
            className="flex-1"
          />

          <span className="w-px shrink-0 bg-border" aria-hidden="true" />

          <button
            type="button"
            onClick={toggleSearch}
            aria-expanded={searchOpen}
            aria-label={searchOpen ? 'Скрыть поиск' : 'Поиск'}
            className={cn(
              'relative grid w-10 shrink-0 place-items-center rounded-xl border transition-colors',
              searchOpen
                ? 'border-primary bg-primary-soft text-primary'
                : 'border-border-subtle bg-surface-2 text-muted hover:text-foreground',
            )}
          >
            <FiSearch size={16} />
            {hasQuery && !searchOpen && (
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </button>
        </div>
      </div>

      {searchOpen && !hasQuery && recent.length > 0 && (
        <RecentSearches
          items={recent}
          onSelect={handleSelectRecent}
          onRemove={remove}
          onClearAll={clearRecent}
        />
      )}

      {isCategories ? (
        <div className="flex min-h-0 flex-1">
          <CategoryRail
            categories={categoriesToShow}
            activeCategoryId={activeCategoryId}
            selectedCategoryIds={filter.selectedCategoryIds}
            selectedSubcategoryIds={filter.selectedSubcategoryIds}
            onSelect={setActiveCategoryId}
            className="w-[88px] shrink-0"
          />
          <SubcategoryGrid
            category={activeCategory}
            countsByCategory={countsByCategory}
            countsBySubcategory={countsBySubcategory}
            selectedCategoryIds={filter.selectedCategoryIds}
            selectedSubcategoryIds={filter.selectedSubcategoryIds}
            onToggleCategory={filter.toggleCategory}
            onToggleSubcategory={filter.toggleSubcategory}
            className="min-w-0 flex-1"
          />
        </div>
      ) : (
        <div className="flex-1">
          {emptyByFilter ? (
            <EmptyState
              title="Ничего не найдено"
              description={
                hasQuery && hasFilter
                  ? `По запросу «${debouncedQuery}» с выбранными фильтрами ничего не найдено. Попробуйте изменить запрос или сбросить фильтры.`
                  : hasQuery
                    ? `По запросу «${debouncedQuery}» ничего не найдено. Попробуйте изменить запрос.`
                    : 'По выбранным фильтрам ничего не найдено. Попробуйте выбрать другие категории.'
              }
            />
          ) : view === 'grid-3' ? (
            <section className="grid grid-cols-3 gap-0.5 p-0.5">
              {itemsToShow.map((i) => (
                <ItemThumb key={i.id} item={i} />
              ))}
            </section>
          ) : view === 'grid-2' ? (
            <section className="p-4">
              {(hasQuery || hasFilter) && (
                <p className="mb-3 text-xs text-muted">
                  Найдено:{' '}
                  <span className="font-semibold text-foreground">{itemsToShow.length}</span>
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                {itemsToShow.map((i) => (
                  <ItemCard key={i.id} item={i} />
                ))}
              </div>
            </section>
          ) : (
            <section className="divide-y divide-border-subtle">
              {itemsToShow.map((i) => (
                <ItemPostCard key={i.id} item={i} />
              ))}
            </section>
          )}
        </div>
      )}

      {isCategories && (
        <ShowResultsButton
          count={itemsToShow.length}
          onClick={handleShowResults}
          onClear={filter.clear}
          onCopy={handleCopyLink}
          showCopy={hasAnyParam}
        />
      )}
    </div>
  );
}
