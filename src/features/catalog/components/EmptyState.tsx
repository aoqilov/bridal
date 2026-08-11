import type { ReactNode } from 'react';
import { FiSearch } from 'react-icons/fi';

type Props = {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
};

export default function EmptyState({ title, description, icon }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-surface-2 text-muted">
        {icon ?? <FiSearch size={28} />}
      </span>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && <p className="max-w-xs text-sm text-muted">{description}</p>}
    </div>
  );
}
