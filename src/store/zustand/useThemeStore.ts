import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type Resolved = 'light' | 'dark';

type ThemeState = {
  theme: Theme;
  resolved: Resolved;
  setTheme: (t: Theme) => void;
  init: () => void;
};

function getSystemResolved(): Resolved {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function apply(resolved: Resolved) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  document.documentElement.style.colorScheme = resolved;
}

let systemMql: MediaQueryList | null = null;
let systemListener: ((e: MediaQueryListEvent) => void) | null = null;

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolved: 'light',

      setTheme: (theme) => {
        const resolved = theme === 'system' ? getSystemResolved() : theme;
        apply(resolved);
        set({ theme, resolved });
        get().init();
      },

      init: () => {
        const { theme } = get();
        const resolved = theme === 'system' ? getSystemResolved() : theme;
        apply(resolved);
        set({ resolved });

        if (systemMql && systemListener) {
          systemMql.removeEventListener('change', systemListener);
          systemMql = null;
          systemListener = null;
        }

        if (theme === 'system' && typeof window !== 'undefined') {
          systemMql = window.matchMedia('(prefers-color-scheme: dark)');
          systemListener = (e) => {
            const next: Resolved = e.matches ? 'dark' : 'light';
            apply(next);
            set({ resolved: next });
          };
          systemMql.addEventListener('change', systemListener);
        }
      },
    }),
    { name: 'bridal-theme' },
  ),
);
