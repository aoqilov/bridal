import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuHeart } from 'react-icons/lu';
import { ROUTES } from '@/constants/routes';
import { HEADER_LOGO_SRC, HEADER_TITLE } from '@/constants/app';

export default function Header() {
  // Logo fayli hali qo'yilmagan bo'lsa — buzilgan rasm o'rniga faqat matn qoladi
  const [logoVisible, setLogoVisible] = useState(true);

  return (
    <header className="shrink-0 border-b border-border-subtle bg-background">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
        <Link
          to={ROUTES.HOME}
          className="flex min-w-0 items-center gap-2 text-foreground"
        >
          {logoVisible && (
            <img
              src={HEADER_LOGO_SRC}
              alt=""
              onError={() => setLogoVisible(false)}
              className="h-8 w-8 shrink-0 rounded-lg object-contain"
            />
          )}
          <span className="truncate font-logo text-xl font-bold tracking-tight">
            {HEADER_TITLE}
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            to={ROUTES.FAVORITES}
            aria-label="Избранное"
            title="Избранное"
            className="rounded-full p-2 text-foreground transition-colors hover:bg-surface-2 hover:text-primary"
          >
            <LuHeart className="h-5 w-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
