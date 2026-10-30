import { ReactNode } from "react";

type PageStackVariant =
  | "grid4"
  | "col6"
  | "col8Min"
  | "col10Min"
  | "col12Top"
  | "rowWrap"
  | "min0"
  | "top3"
  | "top8"
  | "top10"
  | "top10Narrow";

interface PageStackProps {
  variant?: PageStackVariant;
  children: ReactNode;
}

const STACK_CLASSES: Record<PageStackVariant, string> = {
  grid4: "grid gap-4",
  col6: "flex flex-col gap-6",
  col8Min: "flex min-w-0 flex-col gap-8",
  col10Min: "flex min-w-0 flex-col gap-10",
  col12Top: "mt-8 flex flex-col gap-12",
  rowWrap: "flex flex-wrap items-center gap-3",
  min0: "min-w-0",
  top3: "mt-3",
  top8: "mt-8",
  top10: "mt-10",
  top10Narrow: "mt-10 max-w-4xl",
};

/** Structural stack and spacing container for composed pages. */
export default function PageStack({ variant = "grid4", children }: PageStackProps) {
  return <div className={STACK_CLASSES[variant]}>{children}</div>;
}
