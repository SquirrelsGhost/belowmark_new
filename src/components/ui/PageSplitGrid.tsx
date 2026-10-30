import { ReactNode } from "react";

type PageSplitGridVariant = "search" | "wideLeft" | "wideLeftCompact" | "listing";

interface PageSplitGridProps {
  variant?: PageSplitGridVariant;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<PageSplitGridVariant, string> = {
  search: "mt-8 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start",
  wideLeft: "mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]",
  wideLeftCompact: "mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]",
  listing: "mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]",
};

/** Responsive two-column page layout grid. */
export default function PageSplitGrid({ variant = "wideLeft", children }: PageSplitGridProps) {
  return <div className={VARIANT_CLASSES[variant]}>{children}</div>;
}
