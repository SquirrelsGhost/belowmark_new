import { ReactNode } from "react";

type PageAsideVariant = "stack" | "sticky";

interface PageAsideProps {
  variant?: PageAsideVariant;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<PageAsideVariant, string> = {
  stack: "flex flex-col gap-6",
  sticky: "lg:sticky lg:top-24 lg:self-start",
};

/** Complementary sidebar landmark for split-column pages. */
export default function PageAside({ variant = "stack", children }: PageAsideProps) {
  return <aside className={VARIANT_CLASSES[variant]}>{children}</aside>;
}
