import { NavLink } from "react-router-dom";
import { CATALOG_CATEGORIES_PATH, ROUTES } from "@/constants/routes";
import { GoHome } from "react-icons/go";
import { LuStar, LuCalendarHeart, LuSearch } from "react-icons/lu";
import { TbUserSquareRounded } from "react-icons/tb";

const NAV_ITEMS = [
  { to: ROUTES.HOME, label: "Главная", Icon: GoHome },
  { to: CATALOG_CATEGORIES_PATH, label: "Каталог", Icon: LuSearch },
  { to: ROUTES.BOOKING, label: "Примерка", Icon: LuCalendarHeart },
  { to: ROUTES.REVIEW, label: "Отзывы", Icon: LuStar },
  { to: ROUTES.PROFILE, label: "Профиль", Icon: TbUserSquareRounded },
] as const;

export default function BottomNav() {
  return (
    <nav className="pb-safe shrink-0 border-t border-border-subtle bg-background">
      <ul className="mx-auto flex h-16 max-w-md items-stretch justify-between">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `group flex h-full flex-col items-center justify-center gap-1 transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`h-6 w-6 transition-transform ${
                      isActive ? "scale-110" : "group-active:scale-95"
                    }`}
                  />
                  <span
                    className={`text-[10px] leading-none ${isActive ? "font-semibold" : "font-normal"}`}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
