import AuthNotice from "@/components/auth/AuthNotice";
import PrintButton from "@/components/consumer/PrintButton";

interface DeclarationReceiptProps {
  stamp: string;
  title: string;
  body: string;
  receivedLabel: string;
  receivedAt: string;
  contentLabel: string;
  content: string;
  /** "Ihr Vertrag endet am 26.11.2026" or the manual-review sentence */
  endLine: string;
  mailNote: string;
  printLabel: string;
}

const ROW_CLASSES = "grid gap-1 border-b border-rule py-3";
const DT_CLASSES = "font-mono text-[11px] tracking-[0.14em] text-muted uppercase";

/** What was received and when — shown at once and printable (§ 312k Abs. 3, § 356a BGB). */
export default function DeclarationReceipt(props: DeclarationReceiptProps) {
  return (
    <div className="grid gap-6">
      <AuthNotice stamp={props.stamp} title={props.title} body={props.body} />
      <dl className="border-t-2 border-ink">
        <div className={ROW_CLASSES}>
          <dt className={DT_CLASSES}>{props.receivedLabel}</dt>
          <dd className="font-mono text-sm font-medium text-ink">{props.receivedAt}</dd>
        </div>
        <div className={ROW_CLASSES}>
          <dt className={DT_CLASSES}>{props.contentLabel}</dt>
          <dd className="font-mono text-sm leading-relaxed whitespace-pre-line text-ink">{props.content}</dd>
        </div>
      </dl>
      <p className="font-narrow text-lg leading-snug font-semibold">{props.endLine}</p>
      <p className="text-sm text-muted">{props.mailNote}</p>
      <div>
        <PrintButton label={props.printLabel} />
      </div>
    </div>
  );
}
