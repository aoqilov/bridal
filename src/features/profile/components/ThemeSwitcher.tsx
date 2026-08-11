import { useThemeStore, type Theme } from '@/store/zustand';
import { cn } from '@/utils/cn';

const OPTIONS: { value: Theme; label: string; icon: string }[] = [
  { value: 'light', label: 'Светлая', icon: '☀️' },
  { value: 'dark', label: 'Тёмная', icon: '🌙' },
  { value: 'system', label: 'Система', icon: '🖥️' },
];

export default function ThemeSwitcher() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <div className="rounded-2xl bg-surface p-3 shadow-card">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Тема оформления</span>
      </div>

      <div
        role="radiogroup"
        aria-label="Тема"
        className="grid grid-cols-3 gap-1 rounded-lg bg-surface-2 p-1"
      >
        {OPTIONS.map((opt) => {
          const active = theme === opt.value;
          return (
            <button
              key={opt.value}
              role="radio"
              aria-checked={active}
              type="button"
              onClick={() => setTheme(opt.value)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-md px-2 py-2 text-xs font-medium transition',
                active
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted hover:text-foreground',
              )}
            >
              <span className="text-lg">{opt.icon}</span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
