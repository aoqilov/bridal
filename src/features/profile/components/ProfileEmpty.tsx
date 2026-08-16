import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  icon: ReactNode;
  title: string;
  text: string;
  action?: { label: string; to: string };
};

/** Tab bo'sh bo'lganda — Instagram uslubidagi markazlashgan holat */
export default function ProfileEmpty({ icon, title, text, action }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 px-8 py-12 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full border-2 border-border text-muted">
        {icon}
      </span>
      <p className="mt-1 text-base font-semibold text-foreground">{title}</p>
      <p className="max-w-[16rem] text-xs leading-relaxed text-muted">{text}</p>
      {action && (
        <Link
          to={action.to}
          className="mt-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-fg transition hover:bg-primary-hover"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
