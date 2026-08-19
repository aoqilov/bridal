import { useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShare2, FiHeart } from 'react-icons/fi';
import { useHideOnScroll } from '@/hooks/useHideOnScroll';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

type Props = {
  title: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
};

type IconButtonProps = {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  /** Panel fon oldida (scroll qilingan) yoki rasm ustida suzib turgan holat */
  solid: boolean;
  active?: boolean;
};

function IconButton({ label, icon, onClick, solid, active }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'grid h-10 w-10 shrink-0 place-items-center rounded-full transition-all duration-300 active:scale-95',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        active && 'bg-danger text-white shadow-card',
        !active && solid && 'text-foreground hover:bg-surface-2',
        !active && !solid && 'bg-overlay-dark text-white backdrop-blur hover:bg-overlay-dark-strong',
      )}
    >
      {icon}
    </button>
  );
}

/**
 * Galereya ustida suzuvchi panel: scroll qilinganda fon va tovar nomi bilan
 * "qattiq" holatga o'tadi. `-mb-14` — keyingi blok panel tagidan boshlanadi.
 */
export default function ItemTopBar({
  title,
  isFavorite,
  onToggleFavorite,
  onShare,
}: Props) {
  const navigate = useNavigate();
  const anchorRef = useRef<HTMLDivElement>(null);

  // Hook threshold'dan o'tganini `hidden` orqali bildiradi — bu yerda u "qattiq holat" signali
  const { hidden: solid } = useHideOnScroll(anchorRef, { threshold: 180 });

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(ROUTES.CATALOG);
  };

  return (
    <div
      ref={anchorRef}
      className={cn(
        'sticky top-0 z-30 -mb-14 h-14 transition-colors duration-300',
        solid && 'border-b border-border-subtle bg-background/90 backdrop-blur',
      )}
    >
      <div className="mx-auto flex h-full max-w-md items-center gap-2 px-2">
        <IconButton
          label="Назад"
          icon={<FiArrowLeft size={20} />}
          onClick={handleBack}
          solid={solid}
        />

        <h2
          className={cn(
            'min-w-0 flex-1 truncate font-serif text-lg font-semibold text-foreground transition-opacity duration-300',
            solid ? 'opacity-100' : 'opacity-0',
          )}
          aria-hidden={!solid}
        >
          {title}
        </h2>

        <IconButton
          label="Поделиться"
          icon={<FiShare2 size={18} />}
          onClick={onShare}
          solid={solid}
        />
        <IconButton
          label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
          icon={<FiHeart size={18} fill={isFavorite ? 'currentColor' : 'none'} />}
          onClick={onToggleFavorite}
          solid={solid}
          active={isFavorite}
        />
      </div>
    </div>
  );
}
