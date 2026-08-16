import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { ROUTES } from '@/constants/routes';

type Props = {
  title: string;
  /** O'ng tomondagi tugmalar */
  actions?: ReactNode;
  /** `false` — orqaga tugmasi ko'rsatilmaydi (asosiy profil ekrani) */
  back?: boolean;
};

/** Profil bo'limining yuqori paneli — orqaga tugmasi, sarlavha, amallar */
export default function ProfileTopBar({ title, actions, back = true }: Props) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(ROUTES.PROFILE);
  };

  return (
    <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-border-subtle bg-background/95 px-3 py-2.5 backdrop-blur">
      {back ? (
        <button
          type="button"
          onClick={handleBack}
          aria-label="Назад"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-foreground transition-colors hover:bg-surface-2"
        >
          <FiArrowLeft size={20} />
        </button>
      ) : (
        <span className="w-1" />
      )}

      <h1 className="min-w-0 flex-1 truncate px-1 text-base font-semibold text-foreground">
        {title}
      </h1>

      {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
    </header>
  );
}
