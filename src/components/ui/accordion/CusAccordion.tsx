import { useState, type ReactNode } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { cn } from '@/utils/cn';

export type AccordionItem = {
  id: string;
  title: string;
  icon?: ReactNode;
  content: ReactNode;
};

type Props = {
  items: AccordionItem[];
  type?: 'single' | 'multiple';
  defaultOpenIds?: string[];
  className?: string;
};

export default function CusAccordion({
  items,
  type = 'single',
  defaultOpenIds = [],
  className,
}: Props) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpenIds));

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (type === 'single') next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={cn('divide-y divide-border-subtle rounded-2xl bg-surface', className)}>
      {items.map((item) => {
        const open = openIds.has(item.id);
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={open}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2"
            >
              {item.icon && (
                <span className="shrink-0 text-foreground">{item.icon}</span>
              )}
              <span className="flex-1 text-sm font-semibold text-foreground">
                {item.title}
              </span>
              <FiChevronDown
                size={18}
                className={cn(
                  'shrink-0 text-muted transition-transform duration-300',
                  open && 'rotate-180',
                )}
              />
            </button>
            <div
              className={cn(
                'grid transition-all duration-300 ease-out',
                open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 pt-1 text-sm text-foreground">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
