import Link from "next/link";
import ConsumerFooterButtons from "@/components/consumer/ConsumerFooterButtons";
import Container from "@/components/ui/Container";
import { ROUTES } from "@/lib/constants";
import { TranslationService } from "@/services/TranslationService";
import { BillingTranslations } from "@/translations/billing/BillingTranslations";

const LINK_CLASSES = "underline-offset-4 transition-colors hover:text-ink hover:underline";

/** Legal line at the end of every app page: Impressum, AGB, Widerruf, Datenschutz and the two consumer buttons. */
export default async function AppFooter() {
  const { Footer } = BillingTranslations[await TranslationService.GetUserLocale()];
  return (
    <footer className="mt-16 border-t border-rule">
      <Container className="flex flex-col gap-4 py-6 font-mono text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <span className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href={ROUTES.imprint} className={LINK_CLASSES}>{Footer.Imprint}</Link>
          <Link href={ROUTES.terms} className={LINK_CLASSES}>{Footer.Terms}</Link>
          <Link href={ROUTES.withdrawal} className={LINK_CLASSES}>{Footer.Withdrawal}</Link>
          <Link href={ROUTES.privacy} className={LINK_CLASSES}>{Footer.Privacy}</Link>
        </span>
        <ConsumerFooterButtons />
      </Container>
    </footer>
  );
}
