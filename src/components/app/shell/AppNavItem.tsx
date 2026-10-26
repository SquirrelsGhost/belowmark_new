// Needs usePathname to mark the current section
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_ROUTES } from "@/lib/appConstants";

interface AppNavItemProps {
  href: string;
  label: string;
  /** Small counter next to the label, e.g. saved proceedings */
  count?: number;
  /** "bar" for the masthead, "tab" for the mobile tab bar */
  variant?: "bar" | "tab";
}

const BAR_CLASSES = "relative hidden h-16 items-center gap-2 px-3 font-narrow text-sm font-semibold tracking-[0.08em] uppercase lg:inline-flex";
const TAB_CLASSES = "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 font-narrow text-[11px] font-semibold tracking-[0.08em] uppercase";

/** Section link; the active one gets the red market line. */
export default function AppNavItem({ href, label, count, variant = "bar" }: AppNavItemProps) {
  const pathname = usePathname();
  const isActive = href === APP_ROUTES.search ? pathname === href || pathname.startsWith(APP_ROUTES.listing) : pathname.startsWith(href);
  const line = variant === "bar" ? "absolute inset-x-3 bottom-0 h-[3px]" : "absolute inset-x-4 top-0 h-[3px]";

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`${variant === "bar" ? BAR_CLASSES : TAB_CLASSES} ${isActive ? "text-ink" : "text-ink-soft hover:text-ink"}`}
    >
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="min-w-5 bg-ink px-1 text-center font-mono text-[10px] leading-4 text-paper-bright">{count}</span>
      )}
      <span aria-hidden="true" className={`${line} ${isActive ? "bg-signal" : "bg-transparent"}`} />
    </Link>
  );
}
