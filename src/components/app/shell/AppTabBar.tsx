import { ReactNode } from "react";

interface AppTabBarProps {
  label: string;
  children: ReactNode;
}

/** Bottom tab bar on phones — horizontally scrollable on narrow screens so 7 tabs never overflow. */
export default function AppTabBar({ label, children }: AppTabBarProps) {
  return (
    <nav
      aria-label={label}
      className="fixed inset-x-0 bottom-0 z-40 flex overflow-x-auto border-t-2 border-ink bg-paper-bright/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
    >
      {children}
    </nav>
  );
}
