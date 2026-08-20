import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export type ProfileTab = {
  value: string;
  icon: ReactNode;
  label: string;
  /** Qatordagi element soni — yorliq yonida chipda ko'rsatiladi */
  count?: number;
};

type Props<T extends string> = {
  tabs: (ProfileTab & { value: T })[];
  value: T;
  onChange: (value: T) => void;
};

/** Ikonka + yorliq + soni ko'rinishidagi tab'lar — faol tagida siljiydigan chiziq */
export default function ProfileTabs<T extends string>({
  tabs,
  value,
  onChange,
}: Props<T>) {
  return (
    <div role="tablist" className="flex border-b border-border-subtle">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative flex min-w-0 flex-1 items-center justify-center gap-1.5 py-2.5 transition-colors',
              active ? 'text-foreground' : 'text-subtle hover:text-muted',
            )}
          >
            <span className="shrink-0">{tab.icon}</span>

            <span className="truncate text-[11px] font-medium">{tab.label}</span>

            {typeof tab.count === 'number' && (
              <span
                className={cn(
                  'shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                  active ? 'bg-primary text-primary-fg' : 'bg-surface-2 text-muted',
                )}
              >
                {tab.count}
              </span>
            )}

            {active && (
              <motion.span
                layoutId="profile-tab-underline"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
