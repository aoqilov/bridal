import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiArrowLeft, FiNavigation } from 'react-icons/fi';
import {
  buildYandexMapWidgetUrl,
  buildYandexMapsRouteUrl,
  type AddressPoint,
} from '@/constants/contact';

type Props = {
  point: AddressPoint;
  onClose: () => void;
};

export default function MapOverlay({ point, onClose }: Props) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onEsc);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onEsc);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 bg-background">
      <iframe
        src={buildYandexMapWidgetUrl(point.lat, point.lng, 16)}
        title={`Карта: ${point.title}`}
        className="absolute inset-0 h-full w-full border-0"
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Назад"
        className="absolute left-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-overlay-dark text-white shadow-lg backdrop-blur transition hover:bg-overlay-dark-strong"
        style={{ top: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <FiArrowLeft size={22} />
      </button>

      <div
        className="absolute inset-x-3 z-10 rounded-2xl bg-background/95 p-3 shadow-lg backdrop-blur"
        style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <p className="text-sm font-semibold text-foreground">{point.title}</p>
        <p className="mt-0.5 text-xs text-muted">{point.address}</p>
        <a
          href={buildYandexMapsRouteUrl(point.lat, point.lng)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover"
        >
          <FiNavigation size={16} />
          Построить маршрут
        </a>
      </div>
    </div>,
    document.body,
  );
}
