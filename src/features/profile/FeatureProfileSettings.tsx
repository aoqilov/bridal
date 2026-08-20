import { Link } from 'react-router-dom';
import {
  MdCheckCircle,
  MdChevronRight,
  MdDarkMode,
  MdInstallMobile,
} from 'react-icons/md';
import { CusListItem, CusSwitch } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useThemeStore, useUserStore } from '@/store/zustand';
import ProfileTopBar from './components/ProfileTopBar';
import InstallGuideSheet from './components/InstallGuideSheet';
import { useInstallFlow } from './hooks/useInstallFlow';

/** Sozlamalar ekrani — hisob, mavzu va ilovani o'rnatish */
export default function FeatureProfileSettings() {
  const user = useUserStore((s) => s.user);
  const theme = useThemeStore((s) => s.theme);
  const resolved = useThemeStore((s) => s.resolved);
  const setTheme = useThemeStore((s) => s.setTheme);
  const install = useInstallFlow();

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
        </div>

        {/* Ilovani o'rnatish — brauzer taklifi bo'lmasa yo'riqnoma ochiladi */}
        <div className="overflow-hidden rounded-2xl bg-surface shadow-card">
          {install.installed ? (
            <CusListItem
              icon={<MdCheckCircle size={20} />}
              title="Приложение установлено"
              description="Открывается с домашнего экрана"
              chevron={false}
            />
          ) : (
            <CusListItem
              icon={<MdInstallMobile size={20} />}
              title="Установить приложение"
              description="Иконка на экране телефона, запуск без браузера"
              onClick={install.start}
              chevron={false}
            />
          )}
        </div>
      </div>

      <InstallGuideSheet
        open={install.guideOpen}
        onClose={install.closeGuide}
        isIos={install.isIos}
      />
    </div>
  );
}
