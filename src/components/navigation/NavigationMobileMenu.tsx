// Needs outside-click and Escape listeners to close the mobile navigation disclosure cleanly
"use client";

import { ReactNode, useEffect, useRef } from "react";

interface NavigationMobileMenuProps {
  label: string;
  children: ReactNode;
}

/** Responsive mobile/tablet drawer (< lg) for the landing page masthead. */
export default function NavigationMobileMenu({ label, children }: NavigationMobileMenuProps) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const close = () => {
      if (ref.current?.open) ref.current.open = false;
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <details ref={ref} className="group relative ml-1 shrink-0 lg:hidden">
      <summary
        aria-label={label}
        className="flex size-9 cursor-pointer list-none items-center justify-center border-2 border-ink bg-paper-bright font-mono text-sm font-bold text-ink select-none hover:bg-paper group-open:bg-ink group-open:text-paper-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal [&::-webkit-details-marker]:hidden"
      >
        <span className="group-open:hidden">☰</span>
        <span className="hidden group-open:inline">✕</span>
      </summary>
      <div
        onClick={() => {
          if (ref.current) ref.current.open = false;
        }}
        className="absolute top-full right-0 z-50 mt-3 w-[min(19rem,calc(100vw-2.5rem))] divide-y divide-rule border-2 border-ink bg-paper-bright shadow-[6px_6px_0_0_var(--ink)]"
      >
        {children}
      </div>
    </details>
  );
}
