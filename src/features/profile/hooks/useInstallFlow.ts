import { useState } from 'react';
import { useToast } from '@/components/ui';
import { useInstallPrompt } from './useInstallPrompt';

/**
 * Ilovani o'rnatish oqimi — profil va sozlamalar ekranlari uchun umumiy.
 * Brauzer taklifi tayyor bo'lsa tizim oynasi ochiladi, aks holda (iOS,
 * dev server, qo'llab-quvvatlamaydigan brauzer) qo'lda qo'shish yo'riqnomasi.
 */
export function useInstallFlow() {
  const { canInstall, installed, isIos, install } = useInstallPrompt();
  const [guideOpen, setGuideOpen] = useState(false);
  const { show } = useToast();

  const start = async () => {
    if (!canInstall) {
      setGuideOpen(true);
      return;
    }
    const outcome = await install();
    if (outcome === 'accepted') show('Приложение устанавливается', 'success');
    else if (outcome === 'unavailable') setGuideOpen(true);
  };

  return {
    installed,
    isIos,
    guideOpen,
    closeGuide: () => setGuideOpen(false),
    start,
  };
}
