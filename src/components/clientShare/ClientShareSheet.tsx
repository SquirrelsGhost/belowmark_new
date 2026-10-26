import { CSSProperties, ReactNode } from "react";
import BidderFileSheet from "@/components/bidderFile/BidderFileSheet";

interface ClientShareSheetProps {
  lang: string;
  /** Broker's accent colour, already checked; null keeps the belowmark red */
  accent: string | null;
  toolbar?: ReactNode;
  children: ReactNode;
}

/** The printable sheet of a client link, with the broker's accent as a CSS variable (the one dynamic value). */
export default function ClientShareSheet({ lang, accent, toolbar, children }: ClientShareSheetProps) {
  const style = { "--brand-accent": accent ?? "var(--signal)" } as CSSProperties;
  return (
    <div style={style}>
      <BidderFileSheet lang={lang} toolbar={toolbar}>
        {children}
      </BidderFileSheet>
    </div>
  );
}
