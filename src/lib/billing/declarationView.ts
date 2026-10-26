import "server-only";
import { formatContractDate, formatReceiptTime, fill } from "@/lib/billing/billingFormat";
import { DECLARATION_RECEIPT_PARAM } from "@/lib/billing/billingRoutes";
import { LocaleOption } from "@/lib/constants";
import { declarationContent } from "@/services/billing/BillingMailService";
import { ConsumerDeclarationService } from "@/services/billing/ConsumerDeclarationService";
import { IBillingTranslation } from "@/translations/billing/IBillingTranslation";

export interface DeclarationReceiptView {
  stamp: string;
  title: string;
  body: string;
  receivedLabel: string;
  receivedAt: string;
  contentLabel: string;
  content: string;
  endLine: string;
  mailNote: string;
  printLabel: string;
}

/** The receipt behind `?eingang=<id>`, ready for <DeclarationReceipt />; null when there is none. */
export async function loadDeclarationReceipt(
  params: Record<string, string | string[] | undefined>,
  kind: "cancellation" | "withdrawal",
  t: IBillingTranslation,
  lang: LocaleOption,
): Promise<DeclarationReceiptView | null> {
  const id = params[DECLARATION_RECEIPT_PARAM];
  if (typeof id !== "string") return null;
  const declaration = await ConsumerDeclarationService.get(id);
  if (!declaration || declaration.kind !== kind) return null;

  const labels = kind === "withdrawal" ? t.Withdraw : t.Cancel;
  const endLine = declaration.effectiveEnd ? `${labels.Done.Ends} ${formatContractDate(declaration.effectiveEnd, lang)}.` : labels.Done.EndsManual;
  return {
    stamp: labels.Eyebrow,
    title: labels.Done.Title,
    body: labels.Done.Body,
    receivedLabel: labels.Done.Received,
    receivedAt: formatReceiptTime(declaration.receivedAt, lang),
    contentLabel: labels.Done.Content,
    content: declarationContent(declaration, t, lang),
    endLine,
    mailNote: fill(labels.Done.MailNote, { email: declaration.email }),
    printLabel: labels.Done.Print,
  };
}
