import { ReactNode } from "react";

interface NavigationProps {
  children: ReactNode;
  /** Accessible name of the nav landmark */
  label: string;
}

const SHELL_CLASSES =
  "pointer-events-auto mx-auto flex w-full max-w-5xl items-center gap-2 rounded-full border border-line-strong bg-canvas/60 py-2 pr-2 pl-5 shadow-[0_8px_40px_-12px_rgb(0_0_0/0.5)] backdrop-blur-2xl backdrop-saturate-150";

/** Floating glass navigation bar, pinned to the top of the viewport. */
export default function Navigation({ children, label }: NavigationProps) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-4">
      <nav aria-label={label} className={SHELL_CLASSES}>
        {children}
      </nav>
    </header>
  );
}
