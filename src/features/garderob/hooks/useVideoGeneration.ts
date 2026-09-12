import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui';
import { VIDEO_PRICE } from '@/constants/pricing';
import { useWalletStore, useWardrobeStore } from '@/store/zustand';
import { generateTryOnVideo, type VideoPhase } from '../api/video/generateTryOnVideo';

type RunOptions = {
  /**
   * Pul allaqachon yechilganmi.
   *
   * "Видео" rejimida to'liq summa boshida yechiladi (`VIDEO_TOTAL_PRICE`),
   * shuning uchun tasdiqlash bosqichida qayta yechilmaydi. Galereyadagi eski
   * rasmdan video yasalganda esa faqat shu yerda `VIDEO_PRICE` yechiladi.
   */
  prepaid?: boolean;
};

/**
 * Tasdiqlangan rasmdan video yasash — ikki joyda ishlatiladi:
 * "Генерация → Видео" oqimida va galereyadagi tayyor rasm ustida.
 *
 * To'lov qoidasi bitta: xato bo'lsa video puli (`VIDEO_PRICE`) har doim
 * qaytariladi — pul boshida yechilganmi yoki shu yerdami, ahamiyati yo'q.
 */
export function useVideoGeneration() {
  const addVideo = useWardrobeStore((s) => s.addVideo);
  const spend = useWalletStore((s) => s.spend);
  const topUp = useWalletStore((s) => s.topUp);
  const { show } = useToast();

  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<VideoPhase>('starting');

  // Sahifa almashsa tugagan so'rov o'chirilgan komponentga tegmasin
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const run = useCallback(
    async (image: string, options?: RunOptions): Promise<boolean> => {
      if (busy) return false;

      if (!options?.prepaid && !spend(VIDEO_PRICE, 'Создание видео')) {
        show('Недостаточно средств — пополните кошелёк', 'error');
        return false;
      }

      alive.current = true;
      setBusy(true);
      setPhase('starting');

      try {
        const result = await generateTryOnVideo({ image, onPhase: setPhase });
        addVideo(result.video, image);
        return true;
      } catch (err) {
        // Video chiqmadi — pul qaytariladi
        topUp(VIDEO_PRICE, 'Возврат за неудачное видео');
        if (alive.current) {
          show(err instanceof Error ? err.message : 'Не удалось создать видео', 'error');
        }
        return false;
      } finally {
        if (alive.current) setBusy(false);
      }
    },
    [addVideo, busy, show, spend, topUp],
  );

  return { run, busy, phase };
}
