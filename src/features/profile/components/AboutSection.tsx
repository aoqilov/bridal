import { useEffect, useState } from 'react';
import { MdInstallMobile, MdDeleteSweep, MdInfoOutline } from 'react-icons/md';
import { CusListItem, useToast } from '@/components/ui';
import { APP_NAME, APP_VERSION, STORAGE_PREFIX } from '@/constants/app';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export default function AboutSection() {
  const { canInstall, install } = useInstallPrompt();
  const { show } = useToast();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(timer);
  }, [confirming]);

  const resetData = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
    show('Данные очищены, перезагружаем…', 'success');
    setConfirming(false);
    setTimeout(() => window.location.reload(), 600);
  };

  return (
    <section id="profile-about" className="scroll-mt-4">
      <h2 className="mb-3 px-4 text-base font-bold text-foreground">О приложении</h2>

      <div className="mx-4 overflow-hidden rounded-2xl bg-surface shadow-card">
        {canInstall && (
          <CusListItem
            icon={<MdInstallMobile size={20} />}
            title="Установить приложение"
            description="Быстрый запуск с домашнего экрана"
            onClick={install}
          />
        )}

        <CusListItem
          icon={<MdInfoOutline size={20} />}
          title={APP_NAME}
          description={`Версия ${APP_VERSION}`}
          chevron={false}
        />

        <CusListItem
          icon={<MdDeleteSweep size={20} />}
          title={confirming ? 'Точно очистить все данные?' : 'Очистить данные'}
          description="Избранное, история просмотров и профиль"
          onClick={resetData}
          danger
          chevron={false}
        />
      </div>

      <p className="px-4 pt-3 text-center text-[11px] text-subtle">
        Профиль, избранное и история хранятся только на этом устройстве
      </p>
    </section>
  );
}
