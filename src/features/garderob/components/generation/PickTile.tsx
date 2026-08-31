import { MdCheck, MdClose } from 'react-icons/md';
import { cn } from '@/utils/cn';
import { TILE_CLASS } from './PickRowShell';

type Props = {
  image: string;
  label: string;
  active: boolean;
  onClick: () => void;
  /** O'chirish tugmasi — bosilganda buyum qatordan chiqadi */
  onRemove: () => void;
  removeLabel: string;
  /** Yuz suratlari doira, tovarlar burchakli kvadrat */
  shape?: 'circle' | 'rounded';
};

/**
 * 2-qatordagi bitta katak: rasm, faol holatda oltin halqa va ✓, burchakda ×.
 *
 * `PhotoCircle` dan farqi — o'chirish tugmasi ichiga kiritilgan va o'lchami
 * pastki panelga moslangan (`TILE_CLASS`), chunki bu yerda vertikal joy tor.
 */
export default function PickTile({
  image,
  label,
  active,
  onClick,
  onRemove,
  removeLabel,
  shape = 'rounded',
}: Props) {
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-[10px]';

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        aria-label={label}
        className={cn(
          'relative block transition',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          shapeClass,
          TILE_CLASS,
          !active && 'opacity-80 hover:opacity-100',
        )}
      >
        <span
          className={cn(
            'block h-full w-full overflow-hidden bg-surface-2',
            shapeClass,
            active && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
          )}
        >
          <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
        </span>

        {active && (
          <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-fg ring-2 ring-background">
            <MdCheck size={13} />
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-overlay-dark text-white backdrop-blur transition hover:bg-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <MdClose size={12} />
      </button>
    </div>
  );
}
