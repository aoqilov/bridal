import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  MdEdit,
  MdFavorite,
  MdFavoriteBorder,
  MdInstallMobile,
  MdIosShare,
  MdLock,
  MdSettings,
} from 'react-icons/md';
import { useToast } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import {
  MAX_PICKED,
  useFavoritesStore,
  useUserStore,
  useWardrobeStore,
} from '@/store/zustand';
import { MOCK_CATALOG, getItemById, type CatalogItem } from '@/features/catalog';
import ItemThumb from '@/features/catalog/components/ItemThumb';
import {
  REQUIRED_CATEGORIES,
  UNLOCKED_CATEGORIES,
  isOutfitCategory,
  itemCategory,
} from '@/features/garderob';
import ProfileTopBar from './components/ProfileTopBar';
import ProfileEmpty from './components/ProfileEmpty';
import FavoritePickThumb from './components/FavoritePickThumb';
import CategoryChips, { type CategoryChip } from './components/CategoryChips';
import InstallGuideSheet from './components/InstallGuideSheet';
import { useInstallFlow } from './hooks/useInstallFlow';
import {
  FAVORITE_CATEGORIES,
  FAVORITE_CATEGORY_LABELS,
  matchesFavoriteCategory,
  type FavoriteCategory,
} from './utils/favoriteCategory';

/**
 * Tanlash rejimida faqat ochiq bo'limlardan olish mumkin (hozircha — "Платье"),
 * qolganlari qulflangan. Oddiy ko'rishda hamma bo'lim ochiq.
 */
function isLockedInPickMode(value: FavoriteCategory): boolean {
  return !(UNLOCKED_CATEGORIES as string[]).includes(value);
}

export default function FeatureProfile() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // `/profile?pick=dress` — garderob uchun tanlash rejimi (`OutfitStrip` dagi "+")
  const pick = params.get('pick');
  const pickMode = isOutfitCategory(pick);

  const [category, setCategory] = useState<FavoriteCategory>(() => {
    if (!isOutfitCategory(pick)) return 'all';
    // Qulflangan bo'lim so'ralsa — birinchi ochiq bo'lim ochiladi
    return isLockedInPickMode(pick) ? UNLOCKED_CATEGORIES[0] : pick;
  });

  const user = useUserStore((s) => s.user);
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const picked = useWardrobeStore((s) => s.picked);
  const togglePick = useWardrobeStore((s) => s.toggle);
  const { show } = useToast();
  const install = useInstallFlow();

  // Chegara har bo'lim uchun alohida — pastki paneldagi sanoq ham shu bo'lim bo'yicha
  const pickedInCategory = picked.filter((x) => x.category === category).length;

  const handlePick = (item: CatalogItem) => {
    if (!togglePick(item.id, itemCategory(item))) {
      show(`Можно взять не больше ${MAX_PICKED} вещей`, 'error');
    }
  };

  const categoryItems = useMemo<CategoryChip<FavoriteCategory>[]>(
    () =>
      FAVORITE_CATEGORIES.map((value) => {
        const label = FAVORITE_CATEGORY_LABELS[value];
        const locked = pickMode && isLockedInPickMode(value);
        return {
          value,
          label,
          icon: locked ? <MdLock size={12} /> : undefined,
          ariaLabel: locked ? `${label} — скоро` : label,
        };
      }),
    [pickMode],
  );

  const changeCategory = (value: FavoriteCategory) => {
    if (pickMode && isLockedInPickMode(value)) {
      show('Этот раздел скоро появится', 'info');
      return;
    }
    setCategory(value);
  };

  const favorites = useMemo(() => toItems(favoriteIds), [favoriteIds]);

  // Segmentda tanlangan bo'lim bo'yicha sevimlilar
  const categoryFavorites = useMemo(
    () => favorites.filter((item) => matchesFavoriteCategory(item, category)),
    [favorites, category],
  );

  const displayName = user?.name?.trim() || 'Гость';
  const initial = displayName[0]?.toUpperCase() ?? 'Г';
  const bio = [user?.city, user?.phone].filter(Boolean).join(' · ');

  const shareProfile = async () => {
    const url = window.location.origin;
    try {
      if (navigator.share) await navigator.share({ title: displayName, url });
      else {
        await navigator.clipboard.writeText(url);
        show('Ссылка скопирована', 'success');
      }
    } catch {
      // Foydalanuvchi bekor qildi — xabar kerak emas
    }
  };

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col bg-background pb-8">
      {/* Tanlash rejimida panel garderobga qaytish uchun xizmat qiladi */}
      <ProfileTopBar
        title={pickMode ? 'Выберите одежду' : displayName}
        back={pickMode}
        actions={
          pickMode ? undefined : (
            <>
              {/* "Поделиться" tugmalar qatoridan panelga ko'chdi */}
              <button
                type="button"
                onClick={shareProfile}
                aria-label="Поделиться"
                title="Поделиться"
                className="grid h-9 w-9 place-items-center rounded-full text-foreground transition-colors hover:bg-surface-2"
              >
                <MdIosShare size={22} />
              </button>

              {/* O'rnatilgan bo'lsa tugma kerak emas */}
              {!install.installed && (
                <button
                  type="button"
                  onClick={install.start}
                  aria-label="Установить приложение"
                  title="Установить приложение"
                  className="grid h-9 w-9 place-items-center rounded-full text-foreground transition-colors hover:bg-surface-2"
                >
                  <MdInstallMobile size={22} />
                </button>
              )}
              <Link
                to={ROUTES.PROFILE_SETTINGS}
                aria-label="Настройки"
                className="grid h-9 w-9 place-items-center rounded-full text-foreground transition-colors hover:bg-surface-2"
              >
                <MdSettings size={22} />
              </Link>
            </>
          )
        }
      />

      {!pickMode && (
        <>
          {/* Avatar chapda, ism va bio o'ngda — sonlar tab qatorida */}
          <section className="flex items-center gap-4 px-4 pt-4">
            <span className="grid h-[86px] w-[86px] shrink-0 place-items-center overflow-hidden rounded-full bg-brand-gradient p-[3px]">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="h-full w-full rounded-full border-2 border-background object-cover"
                />
              ) : (
                <span className="grid h-full w-full place-items-center rounded-full border-2 border-background bg-surface-2 text-2xl font-bold text-foreground">
                  {initial}
                </span>
              )}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-foreground">
                {displayName}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">
                {bio || 'Заполните профиль, чтобы оформлять заказы быстрее'}
              </p>
            </div>

            {/* Profilni tahrirlash — alohida tugmalar qatori o'rniga ikonka */}
            <Link
              to={ROUTES.PROFILE_EDIT}
              aria-label={user?.name ? 'Редактировать профиль' : 'Заполнить профиль'}
              title={user?.name ? 'Редактировать профиль' : 'Заполнить профиль'}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <MdEdit size={18} />
            </Link>
          </section>

          {/* Sevimlilar soni — bo'lim tugmalari qatoridan oldin */}
          <p className="mt-4 flex items-center justify-center gap-1.5 px-4 text-sm font-semibold text-foreground">
            <MdFavorite size={18} className="text-danger" />
            Мои избранные
            <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] font-bold leading-none text-muted">
              {favorites.length}
            </span>
          </p>
        </>
      )}

      {favorites.length > 0 ? (
        <>
          {/*
            Scroll paytida bo'lim tugmalari yuqori panel tagida qotib qoladi.
            top-[57px] — ProfileTopBar balandligi (36px tugma + py-2.5 + 1px chegara).
            z-[9] — panel (z-10) tagida qolsin.
          */}
          <div className="sticky top-[57px] z-[9] mt-2 border-y border-border-subtle bg-surface/95 px-4 py-2.5 backdrop-blur">
            <CategoryChips
              items={categoryItems}
              value={category}
              onChange={changeCategory}
            />
          </div>

          {categoryFavorites.length > 0 ? (
            <div className="grid grid-cols-3 gap-0.5">
              {categoryFavorites.map((item) =>
                pickMode ? (
                  <FavoritePickThumb
                    key={item.id}
                    item={item}
                    selected={picked.some((x) => x.id === item.id)}
                    onToggle={() => handlePick(item)}
                  />
                ) : (
                  <ItemThumb key={item.id} item={item} />
                ),
              )}
            </div>
          ) : (
            <p className="px-4 py-4 text-center text-xs text-muted">
              В разделе «{FAVORITE_CATEGORY_LABELS[category]}» пока пусто.
            </p>
          )}
        </>
      ) : (
        <ProfileEmpty
          icon={<MdFavoriteBorder size={30} />}
          title="Здесь пока пусто"
          text="Нажмите на сердечко у товара — он появится в этом списке."
          action={{ label: 'Перейти в каталог', to: ROUTES.CATALOG }}
        />
      )}

      {/* Tanlash rejimidagi pastki panel — sanoq va garderobga qaytish */}
      {pickMode && (
        <div className="sticky bottom-0 z-[9] mt-auto flex items-center gap-3 border-t border-border-subtle bg-background/95 px-4 py-3 backdrop-blur">
          <p className="flex-1 text-xs text-muted">
            Выбрано {pickedInCategory} из {MAX_PICKED}
            {!(REQUIRED_CATEGORIES as string[]).includes(category) &&
              ' · выбирать необязательно'}
          </p>
          <button
            type="button"
            onClick={() => navigate(ROUTES.GARDEROB)}
            className="rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover"
          >
            Готово
          </button>
        </div>
      )}

      <InstallGuideSheet
        open={install.guideOpen}
        onClose={install.closeGuide}
        isIos={install.isIos}
      />
    </div>
  );
}

function toItems(ids: string[]): CatalogItem[] {
  return ids
    .map((id) => getItemById(id, MOCK_CATALOG))
    .filter((item): item is CatalogItem => item !== null);
}
