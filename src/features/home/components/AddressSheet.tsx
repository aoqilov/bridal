import { useEffect, useState } from 'react';
import {
  FiCheck,
  FiClock,
  FiCopy,
  FiMapPin,
  FiNavigation,
  FiPhone,
} from 'react-icons/fi';
import { CusAccordion, CusSheet, useToast, type AccordionItem } from '@/components/ui';
import {
  ADDRESSES,
  buildYandexMapsRouteUrl,
  type AddressPoint,
} from '@/constants/contact';
import { cn } from '@/utils/cn';

type Props = {
  open: boolean;
  onClose: () => void;
};

/** Salon manzillari — akkordeon, har birini nusxalash mumkin */
export default function AddressSheet({ open, onClose }: Props) {
  const items: AccordionItem[] = ADDRESSES.map((point) => ({
    id: point.id,
    title: point.title,
    icon: <FiMapPin size={18} className="text-primary" />,
    content: <AddressDetails point={point} />,
  }));

  return (
    <CusSheet open={open} onClose={onClose} title="Адреса салонов">
      <div className="pb-[env(safe-area-inset-bottom)]">
        <CusAccordion
          items={items}
          type="single"
          defaultOpenIds={ADDRESSES[0] ? [ADDRESSES[0].id] : []}
        />
      </div>
    </CusSheet>
  );
}

function AddressDetails({ point }: { point: AddressPoint }) {
  const { show } = useToast();
  const [copied, setCopied] = useState(false);

  // Nusxalangandan keyin ikonka 1.5s davomida "check" holatida turadi
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const fullAddress = [point.address, point.landmark].filter(Boolean).join(', ');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      show('Адрес скопирован', 'success');
    } catch {
      show('Не удалось скопировать адрес', 'error');
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleCopy}
        className="flex w-full items-start gap-2 rounded-xl bg-surface-2 px-3 py-2.5 text-left transition hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-sm text-foreground">{point.address}</span>
          {point.landmark && (
            <span className="mt-0.5 block text-[11px] text-muted">{point.landmark}</span>
          )}
        </span>
        <span
          className={cn(
            'mt-0.5 shrink-0 transition-colors',
            copied ? 'text-success' : 'text-muted',
          )}
          aria-label="Скопировать адрес"
        >
          {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
        </span>
      </button>

      <div className="mt-2.5 space-y-1.5">
        <p className="flex items-center gap-2 text-xs text-foreground">
          <FiClock size={14} className="shrink-0 text-muted" />
          <span className="line-clamp-1">{point.hours}</span>
        </p>
        <a
          href={`tel:${point.phone.replace(/[^\d+]/g, '')}`}
          className="flex items-center gap-2 text-xs text-foreground hover:text-primary"
        >
          <FiPhone size={14} className="shrink-0 text-muted" />
          <span className="line-clamp-1">{point.phone}</span>
        </a>
      </div>

      <a
        href={buildYandexMapsRouteUrl(point.lat, point.lng)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-primary-fg transition hover:bg-primary-hover"
      >
        <FiNavigation size={14} />
        Построить маршрут
      </a>
    </div>
  );
}
