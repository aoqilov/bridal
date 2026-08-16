import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui';
import { STORAGE_PREFIX } from '@/constants/app';

/**
 * Lokal ma'lumotlarni tozalash — ikki bosqichli tasdiq bilan.
 * Birinchi bosish tasdiq so'raydi, 3 soniyada o'zi bekor bo'ladi.
 */
export function useClearAppData() {
  const { show } = useToast();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(timer);
  }, [confirming]);

  const clear = () => {
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

  return { confirming, clear };
}
