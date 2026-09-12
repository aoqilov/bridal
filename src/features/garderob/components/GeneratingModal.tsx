import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GENERATION_QUOTES, QUOTE_INTERVAL_MS } from '../mockdata.quotes';
import GenerationNote from './GenerationNote';

type Props = {
  open: boolean;
  /** Nima yasalayotgani — matn shunga qarab o'zgaradi */
  kind?: 'image' | 'video';
};

/**
 * Генерация kutish oynasi — yopilmaydi, jarayon tugagach o'zi ketadi.
 * Kutish zerikarli bo'lmasin deb sitatalar 10 soniyada almashib turadi.
 */
export default function GeneratingModal({ open, kind = 'image' }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    setIndex(0);
    const id = window.setInterval(
      () => setIndex((prev) => (prev + 1) % GENERATION_QUOTES.length),
      QUOTE_INTERVAL_MS,
    );
    // Oyna ochiq turganda orqa fon scroll qilinmasin
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearInterval(id);
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Создаём образ"
      className="fixed inset-0 z-50 grid place-items-center px-6"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-sm rounded-2xl bg-surface p-6 text-center shadow-card-hover">
        {/* Aylanuvchi halqa — jarayon ketayotganini bildiradi */}
        <span className="mx-auto mb-4 block h-12 w-12 animate-spin rounded-full border-2 border-border border-t-primary" />

        <p className="font-serif text-xl font-semibold text-foreground">
          {kind === 'video' ? 'Снимаем ваше видео…' : 'Создаём ваш образ…'}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          {kind === 'video'
            ? 'Это занимает несколько минут — не закрывайте страницу.'
            : 'Вы — воплощение красоты, платье лишь подчеркнёт её.'}
        </p>

        <div className="mt-5 min-h-[76px] rounded-xl bg-surface-2 px-4 py-3">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="font-serif text-sm italic leading-relaxed text-foreground"
            >
              «{GENERATION_QUOTES[index]}»
            </motion.p>
          </AnimatePresence>
        </div>

        <GenerationNote className="mt-4" />

        <p className="mt-2 text-[10px] leading-relaxed text-subtle">
          Приложение пока в разработке — возможны ошибки и неточности в изображениях.
          Просим отнестись с пониманием.
        </p>
      </div>
    </div>,
    document.body,
  );
}
