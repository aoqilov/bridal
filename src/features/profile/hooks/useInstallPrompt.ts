import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

/** Ilova allaqachon alohida oyna sifatida ochilganmi */
function detectInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  const standalone = window.matchMedia('(display-mode: standalone)').matches;
  // iOS Safari `display-mode` ni bermaydi — o'zining bayrog'i bor
  const iosStandalone = (navigator as { standalone?: boolean }).standalone === true;
  return standalone || iosStandalone;
}

/** iOS'da `beforeinstallprompt` yo'q — u yerda faqat qo'lda qo'shish mumkin */
function detectIos(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/**
 * PWA o'rnatish taklifi.
 *
 * `canInstall` faqat brauzer o'rnatish shartlarini tekshirgandan keyin true bo'ladi
 * (HTTPS yoki localhost, service worker, manifest va ikonkalar joyida).
 * Dev serverda SW o'chirilgan (`vite.config.ts` → `devOptions.enabled: false`),
 * shuning uchun taklif faqat build qilingan ilovada chiqadi.
 */
export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(detectInstalled);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);

    // Ilova o'rnatilgandan keyin alohida oynada ochilishi mumkin
    const media = window.matchMedia('(display-mode: standalone)');
    const onModeChange = () => setInstalled(detectInstalled());
    media.addEventListener('change', onModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      media.removeEventListener('change', onModeChange);
    };
  }, []);

  /** Brauzer taklifini ochadi. Natija: qabul qilindi / rad etildi / taklif yo'q */
  const install = async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    if (!deferred) return 'unavailable';
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    return outcome;
  };

  return {
    /** Brauzer o'rnatish taklifini berishga tayyor */
    canInstall: deferred !== null,
    installed,
    isIos: detectIos(),
    install,
  };
}
