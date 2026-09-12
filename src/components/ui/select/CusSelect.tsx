import { useId, useState } from 'react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';
import { cn } from '@/utils/cn';

export type SelectOption = {
  value: string;
  label: string;
  /** O'ngda ko'rinadigan raqam — masalan tovarlar soni */
  count?: number;
  /** Yorliq oldidagi rang nuqtasi */
  hex?: string;
  disabled?: boolean;
};

type Props = {
  options: SelectOption[];
  /** Tanlangan qiymatlar — bir nechta bo'lishi mumkin */
  selected: Set<string>;
  onToggle: (value: string) => void;
  /** Hech narsa tanlanmaganda tugmada turadigan matn */
  placeholder: string;
  /** Ro'yxat shuncha qatordan oshsa ichida scroll boshlanadi */
  maxVisible?: number;
  className?: string;
};

/** Bitta qator balandligi — ro'yxat balandligi shundan hisoblanadi */
const ROW_HEIGHT = '2.5rem';

/**
 * Ko'p tanlovli select.
 *
 * Ro'yxat absolut emas, oqim ichida ochiladi: panel va sheet'lar `overflow-y-auto`
 * konteyner ichida turadi, absolut ro'yxat esa o'sha konteynerning pastki chetida
 * kesilib qolardi. Oqimdagi ro'yxat kontentni suradi va hech qayerda kesilmaydi.
 */
export default function CusSelect({
  options,
  selected,
  onToggle,
  placeholder,
  maxVisible = 6,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  const chosen = options.filter((o) => selected.has(o.value));
  const summary = chosen.length > 0 ? chosen.map((o) => o.label).join(', ') : placeholder;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={listId}
        className={cn(
          'flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-[13px] transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          chosen.length > 0
            ? 'border-primary bg-primary-soft text-primary'
            : 'border-border-subtle bg-surface-2 text-muted hover:border-border',
        )}
      >
        <span className="min-w-0 flex-1 truncate">{summary}</span>

        {chosen.length > 0 && (
          <span className="shrink-0 rounded-full bg-primary px-1.5 text-[10px] font-semibold leading-4 text-primary-fg">
            {chosen.length}
          </span>
        )}

        <FiChevronDown
          size={16}
          className={cn('shrink-0 transition-transform duration-200', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      <div
        id={listId}
        className={cn(
          'grid transition-all duration-200 ease-out',
          open ? 'mt-1.5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
        aria-hidden={!open}
      >
        <div className="overflow-hidden">
          <div
            className="subtle-scrollbar overflow-y-auto rounded-xl border border-border-subtle bg-surface"
            style={{ maxHeight: `calc(${maxVisible} * ${ROW_HEIGHT})` }}
          >
            {options.map((option) => {
              const active = selected.has(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  disabled={option.disabled}
                  tabIndex={open ? 0 : -1}
                  onClick={() => onToggle(option.value)}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
                    active ? 'bg-primary-soft text-primary' : 'text-foreground hover:bg-surface-2',
                    option.disabled && 'pointer-events-none opacity-40',
                  )}
                >
                  <span
                    className={cn(
                      'grid h-4 w-4 shrink-0 place-items-center rounded border',
                      active ? 'border-primary bg-primary text-primary-fg' : 'border-border',
                    )}
                    aria-hidden
                  >
                    {active && <FiCheck size={11} strokeWidth={3} />}
                  </span>

                  {option.hex && (
                    <span
                      className="h-3.5 w-3.5 shrink-0 rounded-full border border-border-subtle"
                      style={{ backgroundColor: option.hex }}
                      aria-hidden
                    />
                  )}

                  <span className="min-w-0 flex-1 truncate text-[13px]">{option.label}</span>

                  {option.count !== undefined && (
                    <span className="shrink-0 text-[11px] tabular-nums text-subtle">
                      {option.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
