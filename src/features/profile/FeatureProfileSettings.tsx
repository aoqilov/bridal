import { Link } from 'react-router-dom';
import { FiCalendar, FiCreditCard, FiMaximize, FiRefreshCw } from 'react-icons/fi';
import {
  MdChevronRight,
  MdDarkMode,
  MdDeleteSweep,
  MdFavoriteBorder,
  MdHistory,
  MdInfoOutline,
  MdInstallMobile,
  MdLocationOn,
  MdSupportAgent,
} from 'react-icons/md';
import {
  CusAccordion,
  CusListItem,
  CusSwitch,
  type AccordionItem,
} from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { APP_NAME, APP_VERSION } from '@/constants/app';
import {
  ADDRESSES,
  buildContactTelegramLink,
  buildYandexMapsRouteUrl,
} from '@/constants/contact';
import {
  useFavoritesStore,
  useRecentlyViewedStore,
  useThemeStore,
  useUserStore,
} from '@/store/zustand';
import { useToast } from '@/components/ui';
import { cn } from '@/utils/cn';
import ProfileTopBar from './components/ProfileTopBar';
import { useClearAppData } from './hooks/useClearAppData';
import { useInstallPrompt } from './hooks/useInstallPrompt';

const FAQ: AccordionItem[] = [
  {
    id: 'fitting',
    title: 'Как записаться на примерку?',
    icon: <FiCalendar size={18} />,
    content:
      'Выберите дату и время на странице «Примерка» — мы перезвоним для подтверждения. Примерка бесплатная и длится около часа.',
  },
  {
    id: 'deposit',
    title: 'Как работает залог?',
    icon: <FiRefreshCw size={18} />,
    content:
      'Залог фиксированный, указан на странице каждой модели. Возвращается полностью, если изделие вернули в срок и без повреждений. Химчистка после свадьбы входит в стоимость аренды.',
  },
  {
    id: 'payment',
    title: 'Какие способы оплаты?',
    icon: <FiCreditCard size={18} />,
    content:
      'Наличными в салоне, переводом на карту (Uzcard / Humo) или онлайн — по договорённости с менеджером. Бронь фиксируется после внесения залога.',
  },
  {
    id: 'size',
    title: 'А если платье не по размеру?',
    icon: <FiMaximize size={18} />,
    content:
      'Базовая подгонка по фигуре входит в стоимость: ушить корсет, подшить длину. Пошив по индивидуальным меркам занимает 30–45 дней — обращайтесь минимум за два месяца.',
  },
];

/** Sozlamalar ekrani — guruhlangan qatorlar */
export default function FeatureProfileSettings() {
  const user = useUserStore((s) => s.user);
  const theme = useThemeStore((s) => s.theme);
  const resolved = useThemeStore((s) => s.resolved);
  const setTheme = useThemeStore((s) => s.setTheme);
  const { canInstall, install } = useInstallPrompt();
  const { confirming, clear } = useClearAppData();
  const { show } = useToast();

  const favoritesCount = useFavoritesStore((s) => s.ids.length);
  const clearFavorites = useFavoritesStore((s) => s.clear);
  const recentCount = useRecentlyViewedStore((s) => s.ids.length);
  const clearRecent = useRecentlyViewedStore((s) => s.clear);

  const point = ADDRESSES[0];
  const displayName = user?.name?.trim() || 'Гость';
  const initial = displayName[0]?.toUpperCase() ?? 'Г';
  const isDark = resolved === 'dark';

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col bg-background pb-8">
      <ProfileTopBar title="Настройки" />

      <div className="space-y-4 px-4 pt-4">
        {/* Hisob */}
        <Link
          to={ROUTES.PROFILE_EDIT}
          className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-card transition hover:bg-surface-2"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-surface-2">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-base font-bold text-foreground">{initial}</span>
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-foreground">
              {displayName}
            </span>
            <span className="block truncate text-xs text-muted">
              {user?.phone || 'Профиль не заполнен'}
            </span>
          </span>
          <MdChevronRight size={20} className="shrink-0 text-subtle" />
        </Link>

        {/* Ko'rinish */}
        <div className="overflow-hidden rounded-2xl bg-surface shadow-card">
          <div className="flex w-full items-center gap-3 px-4 py-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-foreground">
              <MdDarkMode size={20} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-foreground">
                Тёмная тема
              </span>
              <span className="mt-0.5 block text-xs text-muted">
                {theme === 'system' ? 'Сейчас: как в системе' : 'Выбрано вручную'}
              </span>
            </span>
            <CusSwitch
              label="Тёмная тема"
              checked={isDark}
              onChange={(next) => setTheme(next ? 'dark' : 'light')}
            />
          </div>

          {theme !== 'system' && (
            <CusListItem
              title="Следовать системе"
              description="Тема будет меняться вместе с телефоном"
              onClick={() => setTheme('system')}
              chevron={false}
            />
          )}

          {canInstall && (
            <CusListItem
              icon={<MdInstallMobile size={20} />}
              title="Установить приложение"
              description="Быстрый запуск с домашнего экрана"
              onClick={install}
              chevron={false}
            />
          )}
        </div>

        {/* Aloqa */}
        <div className="overflow-hidden rounded-2xl bg-surface shadow-card">
          <CusListItem
            icon={<MdSupportAgent size={20} />}
            title="Написать в Telegram"
            description="Ответим в рабочее время"
            href={buildContactTelegramLink('Здравствуйте! У меня вопрос по платью.')}
          />
          {point && (
            <CusListItem
              icon={<MdLocationOn size={20} />}
              title="Где нас найти"
              description={point.address}
              href={buildYandexMapsRouteUrl(point.lat, point.lng)}
            />
          )}
          <CusListItem
            icon={<FiCalendar size={18} />}
            title="Записаться на примерку"
            description="Выбрать дату и время"
            to={ROUTES.BOOKING}
          />
        </div>

        {/* Yordam */}
        <div>
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted">
            Частые вопросы
          </h2>
          <CusAccordion items={FAQ} className="shadow-card" />
        </div>

        {/* Saqlangan ma'lumotlar — tozalash mumkin bo'lgani ko'rsatiladi */}
        {(favoritesCount > 0 || recentCount > 0) && (
          <div className="overflow-hidden rounded-2xl bg-surface shadow-card">
            {favoritesCount > 0 && (
              <CusListItem
                icon={<MdFavoriteBorder size={20} />}
                title="Очистить избранное"
                description={`${favoritesCount} товаров`}
                chevron={false}
                onClick={() => {
                  clearFavorites();
                  show('Избранное очищено', 'success');
                }}
              />
            )}
            {recentCount > 0 && (
              <CusListItem
                icon={<MdHistory size={20} />}
                title="Очистить историю просмотров"
                description={`${recentCount} товаров`}
                chevron={false}
                onClick={() => {
                  clearRecent();
                  show('История очищена', 'success');
                }}
              />
            )}
          </div>
        )}

        {/* Ilova haqida */}
        <div className="overflow-hidden rounded-2xl bg-surface shadow-card">
          <CusListItem
            icon={<MdInfoOutline size={20} />}
            title={APP_NAME}
            description={`Версия ${APP_VERSION}`}
            chevron={false}
          />
        </div>

        <button
          type="button"
          onClick={clear}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-2xl bg-surface py-3.5 text-sm font-semibold shadow-card transition',
            confirming ? 'text-danger' : 'text-danger hover:bg-danger-soft',
          )}
        >
          <MdDeleteSweep size={18} />
          {confirming ? 'Точно очистить все данные?' : 'Очистить данные'}
        </button>

        <p className="px-2 text-center text-[11px] text-subtle">
          Профиль, избранное и история хранятся только на этом устройстве
        </p>
      </div>
    </div>
  );
}
