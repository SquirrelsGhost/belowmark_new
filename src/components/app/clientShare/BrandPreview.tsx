import { CSSProperties } from "react";
import ClientShareLetterhead from "@/components/clientShare/ClientShareLetterhead";
import ClientShareTitle from "@/components/clientShare/ClientShareTitle";
import { LABEL_CLASSES } from "@/lib/appStyles";
import { BrokerBrandView } from "@/types/clientShare.types";

interface BrandPreviewProps {
  title: string;
  brand: BrokerBrandView | null;
  kicker: string;
  sheetTitle: string;
  /** Example line for the object, so the preview reads like a real link */
  object: string;
}

/** The top of a client link as the client sees it — the same components as the real page. */
export default function BrandPreview({ title, brand, kicker, sheetTitle, object }: BrandPreviewProps) {
  const style = { "--brand-accent": brand?.accentColor ?? "var(--signal)" } as CSSProperties;
  return (
    <div className="flex flex-col gap-2">
      <span className={LABEL_CLASSES}>{title}</span>
      <div style={style} className="flex flex-col gap-4 border border-rule bg-paper-bright p-5 shadow-[6px_6px_0_0_var(--ink)]">
        <ClientShareLetterhead brand={brand} dates={[]} />
        <ClientShareTitle kicker={kicker} title={sheetTitle} fileNo="—" object={object} subtitle="" />
      </div>
    </div>
  );
}
