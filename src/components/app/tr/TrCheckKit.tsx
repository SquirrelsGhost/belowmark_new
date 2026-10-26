import CopyButton from "@/components/app/listing/CopyButton";
import SourceLink from "@/components/app/listing/SourceLink";
import TrPanel from "@/components/app/tr/TrPanel";
import { LABEL_CLASSES } from "@/lib/appStyles";
import { ESATIS_URL } from "@/lib/tr/trLinks";
import { checkKitText } from "@/lib/tr/trFormat";
import { ITrMarketTranslation } from "@/translations/trMarket/ITrMarketTranslation";

interface TrCheckKitProps {
  /** Turkish field name and value, in the order e-Satış asks for them */
  fields: [string, string | null][];
  labels: ITrMarketTranslation["CheckKit"];
}

/** Everything to paste into e-Satış after the e-Devlet login, as one copy. */
export default function TrCheckKit({ fields, labels }: TrCheckKitProps) {
  return (
    <TrPanel title={labels.Title} lead={labels.Lead}>
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 px-4 py-3">
        {fields.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className={LABEL_CLASSES}>{label}</dt>
            <dd className={`font-mono text-[12px] break-words ${value ? "" : "text-muted"}`}>{value ?? labels.NotStated}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap items-center gap-3 border-t border-rule px-4 py-3">
        <CopyButton text={checkKitText(fields, labels.NotStated)} label={labels.Copy} copiedLabel={labels.Copied} />
        <div className="min-w-48 flex-1">
          <SourceLink href={ESATIS_URL} label={labels.Open} host="esatis.uyap.gov.tr" />
        </div>
      </div>
    </TrPanel>
  );
}
