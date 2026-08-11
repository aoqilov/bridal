import { CusAccordion, type AccordionItem } from '@/components/ui';
import { FiExternalLink } from 'react-icons/fi';
import { MdShare } from 'react-icons/md';
import { SOCIALS } from '@/constants/social';
import { cn } from '@/utils/cn';

export default function SocialLinks() {
  const items: AccordionItem[] = [
    {
      id: 'socials',
      title: 'Мы в соцсетях',
      icon: <MdShare size={20} className="text-primary" />,
      content: (
        <div className="grid gap-2">
          {SOCIALS.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl bg-surface-2 px-3 py-2.5 transition hover:bg-surface"
              >
                <span
                  className={cn(
                    'grid h-9 w-9 shrink-0 place-items-center rounded-xl',
                    s.color,
                  )}
                >
                  <Icon size={18} />
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
      ),
    },
  ];

  return <CusAccordion items={items} type="single" />;
}
