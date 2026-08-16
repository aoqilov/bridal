import { Link } from 'react-router-dom';
import { LuHeart } from 'react-icons/lu';
import { ROUTES } from '@/constants/routes';
import { APP_NAME } from '@/constants/app';

export default function Header() {
  return (
    <header className="shrink-0 border-b border-border-subtle bg-background">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
        <Link
          to={ROUTES.HOME}
          className="font-serif text-xl font-semibold tracking-tight text-foreground"
        >
          {APP_NAME}
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
