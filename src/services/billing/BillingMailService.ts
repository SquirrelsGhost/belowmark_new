import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { billingOrders, ConsumerDeclaration, users } from "@/db/schema";
import { isOfferId, OFFERS, toBillingCurrency } from "@/lib/billing/billingConfig";
import { fill, formatContractDate, formatPrice, formatReceiptTime } from "@/lib/billing/billingFormat";
import { vatNote } from "@/lib/billing/orderView";
import { LocaleOption } from "@/lib/constants";
import { env } from "@/lib/env";
import { LEGAL_OPERATOR } from "@/lib/legal/legalOperator";
import { renderBillingMail } from "@/lib/mail/renderBillingMail";
import { MailService } from "@/services/MailService";
import { BillingTranslations } from "@/translations/billing/BillingTranslations";
import { IBillingTranslation } from "@/translations/billing/IBillingTranslation";
import { legalDocument, legalDocumentText } from "@/translations/legal/LegalDocuments";
import { Locale } from "@/translations/Translations";

const toLang = (locale: string | null | undefined): LocaleOption => (locale === "tr" ? "tr" : "de");
const textsFor = (lang: LocaleOption): IBillingTranslation => BillingTranslations[lang === "tr" ? Locale.TR : Locale.DE];

const vatLabel = (t: IBillingTranslation, market: string): string => vatNote(t, env.billingVatMode, market === "TR" ? "TR" : "DE", env.billingTrKdvIncluded);

/** Plain text of a declaration as received — the same words go on the page, in the mail and to the operator. */
export function declarationContent(declaration: ConsumerDeclaration, t: IBillingTranslation, lang: LocaleOption): string {
  const labels = declaration.kind === "withdrawal" ? t.Withdraw : t.Cancel;
  const lines = [`${labels.Name}: ${declaration.name}`, `${labels.Email}: ${declaration.email}`];
  if (declaration.contractReference) lines.push(`${labels.Contract}: ${declaration.contractReference}`);
  if (declaration.kind === "cancellation") {
    lines.push(`${t.Cancel.Type}: ${declaration.cancellationType === "extraordinary" ? t.Cancel.Extraordinary : t.Cancel.Ordinary}`);
    lines.push(`${t.Cancel.When}: ${declaration.requestedEnd ? formatContractDate(declaration.requestedEnd, lang) : t.Cancel.NextPossible}`);
  }
  if (declaration.reason) lines.push(`${declaration.kind === "withdrawal" ? t.Withdraw.Statement : t.Cancel.Reason}: ${declaration.reason}`);
  return lines.join("\n");
}

/**
 * BillingMailService
 *
 * The mails the law expects after an order (contract confirmation with AGB
 * and Widerrufsbelehrung on a durable medium, § 312f Abs. 2 BGB) and after a
 * cancellation or withdrawal (receipt with content, date and time).
 */
export class BillingMailService {
  static sendOrderConfirmation = async (orderId: string): Promise<void> => {
    const [row] = await db
      .select({ order: billingOrders, email: users.email, locale: users.locale })
      .from(billingOrders)
      .innerJoin(users, eq(users.id, billingOrders.userId))
      .where(eq(billingOrders.id, orderId));
    if (!row || !isOfferId(row.order.offer)) return;

    const lang = toLang(row.locale);
    const t = textsFor(lang);
    const offer = OFFERS[row.order.offer];
    const offerText = t.Order.Offers[offer.id];
    const price = formatPrice({ amount: row.order.amount, currency: toBillingCurrency(row.order.currency) }, lang);
    const lines = fill(t.Mail.Order.Lines, {
      offer: offerText.Name,
      price,
      vat: vatLabel(t, row.order.market),
      date: formatReceiptTime(row.order.createdAt, lang),
      end: row.order.accessEndsAt ? formatContractDate(row.order.accessEndsAt, lang) : "—",
      term: offerText.Term,
      order: row.order.id,
    });
    const appendix = [legalDocumentText(legalDocument("terms", env.billingVatMode)), legalDocumentText(legalDocument("withdrawal", env.billingVatMode))].join("\n\n");
    const mail = renderBillingMail({
      subject: fill(t.Mail.Order.Subject, { offer: offerText.Name }),
      blocks: [
        t.Mail.Order.Greeting,
        t.Mail.Order.Body,
        lines,
        fill(t.Mail.Order.Consent, { date: formatReceiptTime(row.order.earlyStartConsentAt, lang) }),
        fill(t.Mail.Order.Attached, { version: row.order.termsVersion }),
      ],
      appendix,
      signature: t.Mail.Signature,
      footer: t.Mail.Footer,
      lang,
    });
    await MailService.send({ to: row.email, ...mail });
  };

  /** A cancellation made in the Stripe portal gets the same kind of confirmation as one made here. */
  static sendPortalCancellation = async (userId: string, endsAt: Date): Promise<void> => {
    const [user] = await db.select({ email: users.email, locale: users.locale, planOffer: users.planOffer }).from(users).where(eq(users.id, userId));
    if (!user) return;
    const lang = toLang(user.locale);
    const t = textsFor(lang);
    const offerId = isOfferId(user.planOffer) ? user.planOffer : "investor-monat";
    const mail = renderBillingMail({
      subject: t.Mail.CancelReceipt.Subject,
      blocks: [
        fill(t.Mail.CancelReceipt.Body, {
          received: formatReceiptTime(new Date(), lang),
          content: `${t.Cancel.Ordinary} · ${t.Order.Offers[offerId].Name} · ${user.email}`,
          end: `${t.Cancel.Done.Ends} ${formatContractDate(endsAt, lang)}.`,
        }),
      ],
      signature: t.Mail.Signature,
      footer: t.Mail.Footer,
      lang,
    });
    await MailService.send({ to: user.email, ...mail });
  };

  /** Receipt for "Jetzt kündigen" / "Widerruf bestätigen", sent to the address the person gave. */
  static sendDeclarationReceipt = async (declaration: ConsumerDeclaration, lang: LocaleOption): Promise<void> => {
    const t = textsFor(lang);
    const isWithdrawal = declaration.kind === "withdrawal";
    const template = isWithdrawal ? t.Mail.WithdrawReceipt : t.Mail.CancelReceipt;
    const end = declaration.effectiveEnd ? `${t.Cancel.Done.Ends} ${formatContractDate(declaration.effectiveEnd, lang)}.` : t.Cancel.Done.EndsManual;
    const mail = renderBillingMail({
      subject: template.Subject,
      blocks: [fill(template.Body, { received: formatReceiptTime(declaration.receivedAt, lang), content: declarationContent(declaration, t, lang), end })],
      signature: t.Mail.Signature,
      footer: t.Mail.Footer,
      lang,
    });
    await MailService.send({ to: declaration.email, ...mail });
  };

  /** Copy to the operator: withdrawals always need a person (refund), cancellations when no contract matched. */
  static notifyOperator = async (declaration: ConsumerDeclaration): Promise<void> => {
    const to = env.operatorEmail || LEGAL_OPERATOR.email;
    const t = textsFor("de");
    const kind = declaration.kind === "withdrawal" ? "Widerruf" : "Kündigung";
    const mail = renderBillingMail({
      subject: `[Belowmark] ${kind} eingegangen (${declaration.status})`,
      blocks: [
        `Eingang: ${formatReceiptTime(declaration.receivedAt, "de")}`,
        declarationContent(declaration, t, "de"),
        `Konto zugeordnet: ${declaration.userId ? "ja" : "nein"} · Status: ${declaration.status} · Vertragsende: ${declaration.effectiveEnd ? formatContractDate(declaration.effectiveEnd, "de") : "offen"}`,
        declaration.kind === "withdrawal"
          ? "Zu tun: Wirksamkeit prüfen, Wertersatz für die genutzten Tage berechnen, Rest im Stripe-Dashboard erstatten und das Abo dort sofort beenden."
          : "Zu tun, falls Status „manual“: Vertrag zuordnen und das Vertragsende per E-Mail mitteilen.",
      ],
      signature: "belowmark",
      footer: `Erklärung ${declaration.id}`,
      lang: "de",
    });
    await MailService.send({ to, ...mail });
  };
}
