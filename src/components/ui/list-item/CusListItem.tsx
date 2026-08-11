import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { cn } from '@/utils/cn';

type BaseProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  /** O'ng tomondagi qiymat yoki badge */
  trailing?: ReactNode;
  /** Strelka ko'rsatilsinmi (navigatsiya qatorlari uchun) */
  chevron?: boolean;
  danger?: boolean;
  className?: string;
};

type Props = BaseProps &
  (
    | { to: string; href?: never; onClick?: never }
    | { href: string; to?: never; onClick?: never }
    | { onClick: () => void; to?: never; href?: never }
    | { to?: never; href?: never; onClick?: never }
  );

/** Sozlamalar / menyu ro'yxatining bitta qatori */
export default function CusListItem({
  icon,
  title,
  description,
  trailing,
  chevron = true,
  danger,
  className,
  to,
  href,
  onClick,
}: Props) {
  const interactive = Boolean(to || href || onClick);

  const body = (
    <>
      {icon && (
        <span
          className={cn(
            'grid h-9 w-9 shrink-0 place-items-center rounded-xl',
            danger ? 'bg-danger-soft text-danger' : 'bg-surface-2 text-foreground',
          )}
        >
          {icon}
        </span>
      )}

      <span className="min-w-0 flex-1 text-left">
        <span
          className={cn(
            'block truncate text-sm font-medium',
            danger ? 'text-danger' : 'text-foreground',
          )}
        >
          {title}
        </span>
        {description && (
          <span className="mt-0.5 block truncate text-xs text-muted">
            {description}
          </span>
        )}
      </span>

      {trailing && <span className="shrink-0 text-xs text-muted">{trailing}</span>}

      {interactive && chevron && (
        <FiChevronRight size={18} className="shrink-0 text-subtle" />
      )}
    </>
  );

  const classes = cn(
    'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
    interactive && 'hover:bg-surface-2 focus:outline-none focus-visible:bg-surface-2',
    className,
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {body}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {body}
      </a>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {body}
      </button>
    );
  }

  return <div className={classes}>{body}</div>;
}
