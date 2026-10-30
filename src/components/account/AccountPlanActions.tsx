import Button from "@/components/ui/Button";
import { openPortalAction } from "@/lib/billing/actions/accountBillingActions";

interface AccountPlanActionsProps {
  /** "Investor buchen" / "Um drei Monate verlängern"; absent while a subscription renews */
  book?: { href: string; label: string };
  /** Shown while the monthly subscription renews */
  cancel?: { href: string; label: string };
  /** "Auf Pro upgraden" while Investor runs */
  upgrade?: { href: string; label: string };
  portalLabel: string;
  portalHint: string;
  /** No Stripe customer yet: explains where invoices will appear */
  portalUnavailable?: string;
}

/** Book or extend, open Stripe's portal, cancel the renewal — one row of plain links and forms. */
export default function AccountPlanActions({ book, cancel, upgrade, portalLabel, portalHint, portalUnavailable }: AccountPlanActionsProps) {
  return (
    <div className="mt-6 grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {upgrade && <Button href={upgrade.href} label={upgrade.label} variant="signal" withArrow />}
        {book && <Button href={book.href} label={book.label} variant={upgrade ? "outline" : "signal"} withArrow={!upgrade} />}
        {!portalUnavailable && (
          <form action={openPortalAction}>
            <Button type="submit" label={portalLabel} variant="outline" />
          </form>
        )}
        {cancel && <Button href={cancel.href} label={cancel.label} variant="outline" />}
      </div>
      <p className="max-w-lg text-sm leading-relaxed text-muted">{portalUnavailable ?? portalHint}</p>
    </div>
  );
}
