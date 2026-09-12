/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        border: 'var(--color-border)',
        'border-subtle': 'var(--color-border-subtle)',

        foreground: 'var(--color-foreground)',
        muted: 'var(--color-muted)',
        subtle: 'var(--color-subtle)',

        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          fg: 'var(--color-primary-fg)',
          soft: 'var(--color-primary-soft)',
        },

        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          fg: 'var(--color-accent-fg)',
          soft: 'var(--color-accent-soft)',
        },

        danger: {
          DEFAULT: 'var(--color-danger)',
          soft: 'var(--color-danger-soft)',
          fg: 'var(--color-danger-fg)',
        },

        // Rasm ustidagi `bg-overlay-*` qoplamalari uchun matn ranglari
        overlay: {
          fg: 'var(--color-overlay-fg)',
          'fg-dark': 'var(--color-overlay-fg-dark)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          soft: 'var(--color-success-soft)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          soft: 'var(--color-warning-soft)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        // Faqat header'dagi brend so'zi uchun
        logo: ['"Comic Relief"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // Qiymatlar src/index.css dagi --radius-* dan keladi — radiusni
        // o'zgartirish uchun markupga emas, o'sha to'rt o'zgaruvchiga tegiladi.
        lg: 'var(--radius-sm)',
        xl: 'var(--radius-md)',
        '2xl': 'var(--radius-lg)',
        '3xl': 'var(--radius-xl)',
      },
      boxShadow: {
        card: '0 4px 16px rgb(154 190 160 / 0.18)',
        'card-hover': '0 8px 24px rgb(154 190 160 / 0.26)',
        // Rasm ramkasi (CusPlate) — kartadan biroz chuqurroq
        plate: '0 6px 20px rgb(154 190 160 / 0.20)',
        // Rasm ustidan ko'tariladigan kartochka — soya tepaga tushadi
        sheet: '0 -8px 24px rgba(0, 0, 0, 0.10)',
      },
    },
  },
  plugins: [],
};
