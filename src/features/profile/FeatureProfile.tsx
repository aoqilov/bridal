import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MdFavoriteBorder,
  MdGridOn,
  MdHistory,
  MdInstallMobile,
  MdSettings,
  MdStar,
} from 'react-icons/md';
import { useToast } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useFavoritesStore, useRecentlyViewedStore, useUserStore } from '@/store/zustand';
import { MOCK_CATALOG, getItemById, type CatalogItem } from '@/features/catalog';
import ItemThumb from '@/features/catalog/components/ItemThumb';
import {
  MOCK_REVIEWS,
  CURRENT_USER_ID,
  ReviewThumb,
  type Review,
} from '@/features/review';
import ProfileTopBar from './components/ProfileTopBar';
import ProfileTabs, { type ProfileTab } from './components/ProfileTabs';
import ProfileEmpty from './components/ProfileEmpty';
import InstallGuideSheet from './components/InstallGuideSheet';
import { useInstallFlow } from './hooks/useInstallFlow';

type Tab = 'favorites' | 'recent' | 'reviews';
type MyReview = { review: Review; item: CatalogItem };

export default function FeatureProfile() {
  const [tab, setTab] = useState<Tab>('favorites');

  const user = useUserStore((s) => s.user);
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const recentIds = useRecentlyViewedStore((s) => s.ids);
  const { show } = useToast();
  const install = useInstallFlow();

  const favorites = useMemo(() => toItems(favoriteIds), [favoriteIds]);
  const recent = useMemo(() => toItems(recentIds), [recentIds]);

  const reviews = useMemo<MyReview[]>(
    () =>
      MOCK_REVIEWS.filter((r) => r.author.id === CURRENT_USER_ID)
        .map((review) => ({ review, item: getItemById(review.itemId, MOCK_CATALOG) }))
        .filter((x): x is MyReview => x.item !== null)
        .sort(
          (a, b) =>
            new Date(b.review.createdAt).getTime() -
            new Date(a.review.createdAt).getTime(),
        ),
    [],
  );

  const displayName = user?.name?.trim() || 'Гость';
  const initial = displayName[0]?.toUpperCase() ?? 'Г';
  const bio = [user?.city, user?.phone].filter(Boolean).join(' · ');

  const stats: { id: Tab; value: number; label: string }[] = [
    { id: 'favorites', value: favorites.length, label: 'избранных' },
    { id: 'recent', value: recent.length, label: 'просмотров' },
    { id: 'reviews', value: reviews.length, label: 'отзывов' },
  ];

  const tabs: (ProfileTab & { value: Tab })[] = [
    { value: 'favorites', icon: <MdGridOn size={22} />, label: 'Избранное' },
    { value: 'recent', icon: <MdHistory size={22} />, label: 'Просмотренные' },
    { value: 'reviews', icon: <MdStar size={22} />, label: 'Мои отзывы' },
  ];

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
      <ProfileTopBar
        title={displayName}
        back={false}
        actions={
          <>
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
        }
      />

      {/* Avatar chapda, sonlar o'ngda */}
      <section className="flex items-center gap-5 px-4 pt-4">
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

        <div className="flex min-w-0 flex-1 justify-around">
          {stats.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setTab(s.id)}
              className="flex flex-col items-center px-1 transition-opacity hover:opacity-70"
            >
              <span className="text-base font-bold text-foreground">{s.value}</span>
              <span className="text-[11px] text-muted">{s.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Ism va bio */}
      <section className="px-4 pt-3">
        <p className="text-sm font-semibold text-foreground">{displayName}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">
          {bio || 'Заполните профиль, чтобы оформлять заказы быстрее'}
        </p>
      </section>

      {/* Tugmalar qatori */}
      <section className="flex gap-2 px-4 pt-3">
        <Link
          to={ROUTES.PROFILE_EDIT}
          className="flex-1 rounded-lg bg-surface-2 py-1.5 text-center text-xs font-semibold text-foreground transition hover:bg-surface"
        >
          {user?.name ? 'Редактировать профиль' : 'Заполнить профиль'}
        </Link>
        <button
          type="button"
          onClick={shareProfile}
          className="flex-1 rounded-lg bg-surface-2 py-1.5 text-center text-xs font-semibold text-foreground transition hover:bg-surface"
        >
          Поделиться
        </button>
      </section>

      <div className="mt-4">
        <ProfileTabs tabs={tabs} value={tab} onChange={setTab} />
      </div>

      {tab === 'favorites' &&
        (favorites.length > 0 ? (
          <ThumbGrid items={favorites} />
        ) : (
          <ProfileEmpty
            icon={<MdFavoriteBorder size={30} />}
            title="Здесь пока пусто"
            text="Нажмите на сердечко у товара — он появится в этом списке."
            action={{ label: 'Перейти в каталог', to: ROUTES.CATALOG }}
          />
        ))}

      {tab === 'recent' &&
        (recent.length > 0 ? (
          <ThumbGrid items={recent} />
        ) : (
          <ProfileEmpty
            icon={<MdHistory size={30} />}
            title="Вы ещё ничего не смотрели"
            text="Товары, которые вы открывали, появятся в этом списке."
            action={{ label: 'Перейти в каталог', to: ROUTES.CATALOG }}
          />
        ))}

      {tab === 'reviews' &&
        (reviews.length > 0 ? (
          <div className="grid grid-cols-3 gap-0.5">
            {reviews.map(({ review, item }) => (
              <ReviewThumb key={review.id} review={review} item={item} />
            ))}
          </div>
        ) : (
          <ProfileEmpty
            icon={<MdStar size={30} />}
            title="Отзывов пока нет"
            text="Поделитесь фото покупки — это помогает другим выбрать."
            action={{ label: 'Все отзывы', to: ROUTES.REVIEW }}
          />
        ))}

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

function ThumbGrid({ items }: { items: CatalogItem[] }) {
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {items.map((item) => (
        <ItemThumb key={item.id} item={item} />
      ))}
    </div>
  );
}
