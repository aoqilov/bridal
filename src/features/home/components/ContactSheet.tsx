import { useEffect, useState } from 'react';
import { FiCheck, FiClock, FiCopy, FiPhone } from 'react-icons/fi';
import { CusSheet, useToast } from '@/components/ui';
import {
  CONTACTS,
  buildPhoneLink,
  type ContactPerson,
} from '@/constants/contact';
import { SOCIALS } from '@/constants/social';
import { cn } from '@/utils/cn';

type Props = {
  open: boolean;
  onClose: () => void;
};

/** Telefon raqamlar ro'yxati — pastdan chiqadigan oyna */
export default function ContactSheet({ open, onClose }: Props) {
  return (
    <CusSheet open={open} onClose={onClose} title="Контакты">
      <div className="grid gap-2 pb-[env(safe-area-inset-bottom)]">
        {CONTACTS.map((person) => (
          <ContactRow key={person.id} person={person} />
        ))}
      </div>
    </CusSheet>
  );
}

// Telegram tugmasi rangi/ikonkasi — social konstantalaridan olinadi
const TELEGRAM = SOCIALS.find((s) => s.id === 'telegram');

function ContactRow({ person }: { person: ContactPerson }) {
  const { show } = useToast();
  const [copied, setCopied] = useState(false);

  // Nusxalangandan keyin ikonka 1.5s davomida "check" holatida turadi
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(person.phone);
      setCopied(true);
      show('Номер скопирован', 'success');
    } catch {
      show('Не удалось скопировать номер', 'error');
    }
  };

  const TelegramIcon = TELEGRAM?.icon;

  return (
    <div className="rounded-xl bg-surface px-3 py-3">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft font-serif text-base font-semibold text-primary">
          {person.name.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-sm font-semibold text-foreground">
            {person.name}
          </p>
          <p className="line-clamp-1 text-[11px] text-muted">{person.role}</p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Скопировать номер"
          className={cn(
            'shrink-0 rounded-lg p-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            copied ? 'text-success' : 'text-muted hover:text-foreground',
          )}
        >
          {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
        </button>
      </div>

      {person.hours && (
        <p className="mt-2 flex items-center gap-2 text-[11px] text-muted">
          <FiClock size={13} className="shrink-0" />
          <span className="line-clamp-1">{person.hours}</span>
        </p>
      )}

      <div className="mt-2.5 flex items-center gap-2">
        <a
          href={buildPhoneLink(person.phone)}
          className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-primary-fg transition hover:bg-primary-hover"
        >
          <FiPhone size={14} className="shrink-0" />
          <span className="line-clamp-1">{person.phone}</span>
        </a>
        {person.telegram && TelegramIcon && (
          <a
            href={`https://t.me/${person.telegram}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Написать в Telegram"
            className={cn(
              'grid h-10 w-10 shrink-0 place-items-center rounded-xl transition hover:opacity-90',
              TELEGRAM?.color,
            )}
          >
            <TelegramIcon size={18} />
          </a>
        )}
      </div>
    </div>
  );
}
