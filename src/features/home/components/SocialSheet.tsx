import { FiExternalLink } from 'react-icons/fi';
import { CusSheet } from '@/components/ui';
import { SOCIALS } from '@/constants/social';
import { cn } from '@/utils/cn';

type Props = {
  open: boolean;
  onClose: () => void;
};

/** Ijtimoiy tarmoqlar ro'yxati — pastdan chiqadigan oyna */
export default function SocialSheet({ open, onClose }: Props) {
  return (
    <CusSheet open={open} onClose={onClose} title="Мы в соцсетях">
      <div className="grid gap-2 pb-[env(safe-area-inset-bottom)]">
        {SOCIALS.map((s) => {
          const Icon = s.icon;
          return (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl bg-surface px-3 py-3 transition hover:bg-surface-2"
            >
              <span
                className={cn(
                  'grid h-10 w-10 shrink-0 place-items-center rounded-xl',
                  s.color,
                )}
              >
                <Icon size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{s.name}</p>
                <p className="line-clamp-1 text-[11px] text-muted">{s.handle}</p>
              </div>
              <FiExternalLink size={16} className="shrink-0 text-muted" />
            </a>
          );
        })}
      </div>
    </CusSheet>
  );
}
