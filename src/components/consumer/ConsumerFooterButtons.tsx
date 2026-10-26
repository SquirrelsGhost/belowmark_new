import Link from "next/link";
import { BILLING_ROUTES } from "@/lib/billing/billingConfig";
import { TranslationService } from "@/services/TranslationService";
import { BillingTranslations } from "@/translations/billing/BillingTranslations";

interface ConsumerFooterButtonsProps {
  /** "paper" on the ink landing footer, "ink" on paper pages */
  tone?: "ink" | "paper";
}

const TONE_CLASSES = {
  ink: "border-ink text-ink hover:bg-ink hover:text-paper-bright",
  paper: "border-paper-bright text-paper-bright hover:bg-paper-bright hover:text-ink",
} as const;

/**
 * The two buttons the law wants on every page: "Verträge hier kündigen"
 * (§ 312k BGB) and "Vertrag widerrufen" (§ 356a BGB). Framed buttons, not
 * plain links, so they stand out from Impressum and AGB.
 */
export default async function ConsumerFooterButtons({ tone = "ink" }: ConsumerFooterButtonsProps) {
  const { Footer } = BillingTranslations[await TranslationService.GetUserLocale()];
  const classes = `inline-flex min-h-10 items-center border-2 px-3.5 py-2 font-narrow text-xs font-semibold tracking-[0.08em] uppercase transition-colors ${TONE_CLASSES[tone]}`;
  return (
    <span className="flex flex-wrap gap-2.5">
      <Link href={BILLING_ROUTES.cancel} className={classes}>
        {Footer.Cancel}
      </Link>
    </span>
  );
}
