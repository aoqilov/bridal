import { NavLink } from "react-router-dom";
import type { IconType } from "react-icons";
import { CATALOG_CATEGORIES_PATH, ROUTES } from "@/constants/routes";
import { GoHome } from "react-icons/go";
import { LuStar, LuSearch } from "react-icons/lu";
import { PiMegaphoneBold } from "react-icons/pi";
import { TbUserSquareRounded } from "react-icons/tb";

type NavItem = {
  to: string;
  label: string;
  Icon: IconType;
  /** Ikonkani gorizontal ko'zgu qiladi — megafon chapga emas, o'ngga qaraydi */
  flip?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { to: ROUTES.HOME, label: "Главная", Icon: GoHome },
  { to: CATALOG_CATEGORIES_PATH, label: "Каталог", Icon: LuSearch },
  {
    to: ROUTES.NEW_ARRIVALS,
    label: "Новинки",
    Icon: PiMegaphoneBold,
    flip: true,
  },
  { to: ROUTES.REVIEW, label: "Отзывы", Icon: LuStar },
  { to: ROUTES.PROFILE, label: "Профиль", Icon: TbUserSquareRounded },
];

export default function BottomNav() {
  return (
    <nav className="pb-safe shrink-0 border-t border-border-subtle bg-background">
      <ul className="mx-auto flex h-16 max-w-md items-stretch justify-between">
        {NAV_ITEMS.map(({ to, label, Icon, flip }) => (
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
                  {/* Ko'zgu o'ramda — ikonkadagi scale animatsiyasi bilan to'qnashmasin */}
                  <span className={flip ? "inline-flex -scale-x-100" : "inline-flex"}>
                    <Icon
                      className={`h-6 w-6 transition-transform ${
                        isActive ? "scale-110" : "group-active:scale-95"
                      }`}
                    />
                  </span>
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
