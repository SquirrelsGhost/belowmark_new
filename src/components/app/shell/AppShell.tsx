import { ReactNode } from "react";
import PaperTexture from "@/components/ui/PaperTexture";

interface AppShellProps {
  /** Language of the content, so uppercase display type follows locale rules (İ/I) */
  lang: string;
  children: ReactNode;
}

/** Frame of the signed-in app: paper, fibre texture and room for the mobile tab bar. */
export default function AppShell({ lang, children }: AppShellProps) {
  return (
    <div lang={lang} className="min-h-screen pb-20 lg:pb-0">
      <PaperTexture />
      {children}
    </div>
  );
}
