import { useEffect, useState } from 'react';
import {
  FiClock,
  FiPhone,
  FiNavigation,
  FiMaximize2,
  FiCopy,
  FiCheck,
} from 'react-icons/fi';
import { cn } from '@/utils/cn';
import { useToast } from '@/components/ui';
import {
  buildYandexMapWidgetUrl,
  buildYandexMapsRouteUrl,
  type AddressPoint,
} from '@/constants/contact';

type Props = {
  point: AddressPoint;
  onOpenMap: (point: AddressPoint) => void;
};

export default function AddressCard({ point, onOpenMap }: Props) {
  const { show } = useToast();
  const [copied, setCopied] = useState(false);

  // Nusxalangandan keyin ikonka 1.5s davomida "check" holatida turadi
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    const text = [point.address, point.landmark].filter(Boolean).join(', ');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      show('Адрес скопирован', 'success');
    } catch {
      show('Не удалось скопировать адрес', 'error');
    }
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-card">
      <button
        type="button"
        onClick={() => onOpenMap(point)}
        aria-label={`Открыть карту: ${point.title}`}
        className="group relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        {/* iframe atrofidagi Yandex kontrollari ko'rinmasligi uchun kattalashtirib qirqamiz */}
        <iframe
          src={buildYandexMapWidgetUrl(point.lat, point.lng, 14)}
          title={`Карта: ${point.title}`}
          loading="lazy"
          className="pointer-events-none absolute -inset-10 h-[calc(100%+5rem)] w-[calc(100%+5rem)] border-0"
        />
        <span className="absolute inset-0 bg-overlay-dark/0 transition-colors group-hover:bg-overlay-dark/25" />
        <span className="absolute bottom-2 right-2 grid h-7 w-7 place-items-center rounded-lg bg-overlay-dark text-white backdrop-blur">
          <FiMaximize2 size={14} />
        </span>
      </button>

      <div className="flex flex-1 flex-col p-3">
        <p className="line-clamp-1 text-sm font-semibold text-foreground">
          {point.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs text-foreground">{point.address}</p>
        {point.landmark && (
          <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">{point.landmark}</p>
        )}

        <div className="mt-3 space-y-1.5 border-t border-border-subtle pt-3">
          <p className="flex items-center gap-2 text-xs text-foreground">
            <FiClock size={14} className="shrink-0 text-muted" />
            <span className="line-clamp-1">{point.hours}</span>
          </p>
          <a
            href={`tel:${point.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 text-xs text-foreground hover:text-primary"
          >
            <FiPhone size={14} className="shrink-0 text-muted" />
            <span className="line-clamp-1">{point.phone}</span>
          </a>
        </div>

        <div className="mt-3 flex items-stretch gap-2">
          <a
            href={buildYandexMapsRouteUrl(point.lat, point.lng)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-primary-fg transition hover:bg-primary-hover"
          >
            <FiNavigation size={14} />
            Построить маршрут
          </a>

          <button
            type="button"
            onClick={handleCopy}
            aria-label="Скопировать адрес"
            className={cn(
              'grid w-10 shrink-0 place-items-center rounded-xl border border-border-subtle bg-surface-2 transition',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              copied ? 'text-success' : 'text-muted hover:text-primary',
            )}
          >
            {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
          </button>
        </div>
      </div>
    </article>
  );
}
