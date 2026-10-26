"use client";

// Client component: a <details> menu only needs JavaScript to close itself on
// outside click, Escape and navigation — without JS it still opens and works.
import { ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface AppAccountMenuProps {
  /** Content of the <summary> button */
  trigger: ReactNode;
  /** Accessible name of the button */
  label: string;
  /** The dropdown panel */
  children: ReactNode;
}

/** Account dropdown in the masthead, built on <details> so it degrades to a plain disclosure. */
export default function AppAccountMenu({ trigger, label, children }: AppAccountMenuProps) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const close = (focusTrigger: boolean) => {
      const menu = ref.current;
      if (!menu?.open) return;
      menu.open = false;
      if (focusTrigger) menu.querySelector("summary")?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) close(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <details ref={ref} className="group relative">
      <summary
        aria-label={label}
        className="flex cursor-pointer list-none items-center gap-2.5 py-1 select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal [&::-webkit-details-marker]:hidden"
      >
        {trigger}
      </summary>
      <div className="absolute top-full right-0 z-50 mt-4 w-[min(20rem,calc(100vw-2rem))] border-2 border-ink bg-paper-bright shadow-[6px_6px_0_0_var(--ink)]">
        {children}
      </div>
    </details>
  );
}
