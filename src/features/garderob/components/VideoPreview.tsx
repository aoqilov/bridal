import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  MdClose,
  MdDelete,
  MdFileDownload,
  MdMusicNote,
  MdMusicOff,
} from 'react-icons/md';
import type { GeneratedVideo } from '@/store/zustand';
import { fetchVideoObjectUrl } from '../api/video/videoObjectUrl';
import { VIDEO_MUSIC_SRC, VIDEO_MUSIC_VOLUME } from '../api/video/music';

type Props = {
  item: GeneratedVideo | null;
  onClose: () => void;
  onDelete: (id: string) => void;
};

/**
 * Tayyor videoni to'liq ekranda ko'rish.
 *
 * Video manzili kalit talab qiladi, shuning uchun u avval yuklab olinib
 * `blob:` ga aylantiriladi (`videoObjectUrl.ts` dagi izoh). Shu sababli
 * oyna ochilganda qisqa kutish bo'ladi.
 *
 * Musiqa alohida `<audio>` orqali ijro etiladi va video bilan sinxron
 * to'xtaydi — videoning o'zida ovoz yo'q (`music.ts` dagi izoh).
 */
export default function VideoPreview({ item, onClose, onDelete }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!item) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onEsc);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onEsc);
    };
  }, [item, onClose]);

  // Videoni yuklab olish; oyna yopilganda blob bo'shatiladi
  useEffect(() => {
    if (!item) return;

    let objectUrl: string | null = null;
    let cancelled = false;

    setSrc(null);
    setError(null);

    fetchVideoObjectUrl(item.url)
      .then((url) => {
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url;
        setSrc(url);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Не удалось загрузить видео.');
        }
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [item]);

  if (!item) return null;

  const download = () => {
    if (!src) return;
    const link = document.createElement('a');
    link.href = src;
    link.download = `amira-video-${item.id}.mp4`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  /** Video o'ynay boshlaganda musiqa ham boshlanadi */
  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio || muted) return;
    audio.volume = VIDEO_MUSIC_VOLUME;
    // Brauzer ovozli avtoijroni bloklashi mumkin — o'shanda jim qolaveradi
    void audio.play().catch(() => undefined);
  };

  const stopMusic = () => {
    audioRef.current?.pause();
  };

  const toggleMusic = () => {
    setMuted((prev) => {
      const next = !prev;
      const audio = audioRef.current;
      if (audio) {
        if (next) audio.pause();
        else void audio.play().catch(() => undefined);
      }
      return next;
    });
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр видео"
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
    >
      {/* Fon musiqasi — fayl bo'lmasa jim qoladi, video baribir ishlaydi */}
      <audio ref={audioRef} src={VIDEO_MUSIC_SRC} loop preload="auto" />

      <div className="flex items-center justify-between p-3">
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={muted ? 'Включить музыку' : 'Выключить музыку'}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {muted ? <MdMusicOff size={20} /> : <MdMusicNote size={20} />}
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <MdClose size={22} />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-4">
        {src ? (
          <video
            src={src}
            poster={item.poster}
            controls
            autoPlay
            loop
            muted
            playsInline
            onPlay={startMusic}
            onPause={stopMusic}
            className="max-h-full max-w-full rounded"
          />
        ) : (
          /* Yuklanayotganda muqova ko'rinib turadi — ekran bo'sh qolmaydi */
          <div className="relative max-h-full">
            <img
              src={item.poster}
              alt=""
              className="max-h-[70vh] max-w-full rounded opacity-50"
            />
            <div className="absolute inset-0 grid place-items-center">
              {error ? (
                <p className="max-w-[16rem] px-4 text-center text-sm text-white">
                  {error}
                </p>
              ) : (
                <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-md gap-2 px-4 pb-6 pt-4">
        <button
          type="button"
          onClick={download}
          disabled={!src}
          className="flex flex-1 items-center justify-center gap-2 rounded bg-accent py-3 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <MdFileDownload size={18} />
          Скачать
        </button>

        <button
          type="button"
          onClick={() => {
            onDelete(item.id);
            onClose();
          }}
          className="flex flex-1 items-center justify-center gap-2 rounded bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <MdDelete size={18} />
          Удалить из памяти
        </button>
      </div>
    </div>,
    document.body,
  );
}
