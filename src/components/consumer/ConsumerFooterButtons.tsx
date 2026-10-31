import Link from "next/link";
import { BILLING_ROUTES } from "@/lib/billing/billingConfig";
import { TranslationService } from "@/services/TranslationService";
import { BillingTranslations } from "@/translations/billing/BillingTranslations";

interface ConsumerFooterButtonsProps {
  /** "paper" on the ink landing footer, "ink" on paper pages */
  tone?: "ink" | "paper";
}

const TONE_CLASSES = {
  ink: "text-muted underline-offset-4 transition-colors hover:text-ink hover:underline",
  paper: "text-paper/75 underline-offset-4 transition-colors hover:text-paper-bright hover:underline",
} as const;

/**
 * Quiet inline cancellation link (§ 312k BGB) blending into the legal footer links
 * instead of rendering a heavy framed button bar.
 */
export default async function ConsumerFooterButtons({ tone = "ink" }: ConsumerFooterButtonsProps) {
  const { Footer } = BillingTranslations[await TranslationService.GetUserLocale()];
  return (
    <Link href={BILLING_ROUTES.cancel} className={TONE_CLASSES[tone]}>
      {Footer.Cancel}
    </Link>
  );
}
