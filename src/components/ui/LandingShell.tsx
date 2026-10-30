import { ReactNode } from "react";

interface LandingShellProps {
  /** Language of the content so uppercase display type follows locale rules (İ/I in Turkish). */
  lang: string;
  children: ReactNode;
}

/** Locale-aware wrapper for full-bleed marketing pages. */
export default function LandingShell({ lang, children }: LandingShellProps) {
  return <div lang={lang}>{children}</div>;
}
