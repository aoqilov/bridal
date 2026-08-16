import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export type ProfileTab = {
  value: string;
  icon: ReactNode;
  label: string;
};

type Props<T extends string> = {
  tabs: (ProfileTab & { value: T })[];
  value: T;
  onChange: (value: T) => void;
};

/** Instagram uslubidagi ikonkali tab'lar — faol tagida siljiydigan chiziq */
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
            aria-label={tab.label}
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative flex flex-1 items-center justify-center py-2.5 transition-colors',
              active ? 'text-foreground' : 'text-subtle hover:text-muted',
            )}
          >
            {tab.icon}

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
