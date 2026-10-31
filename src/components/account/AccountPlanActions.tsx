import Button from "@/components/ui/Button";
import { cancelSubscriptionAction, openPortalAction } from "@/lib/billing/actions/accountBillingActions";

interface AccountPlanActionsProps {
  /** Shown while the monthly subscription renews */
  cancel?: { href: string; label: string };
  portalLabel: string;
  portalHint: string;
  /** No Stripe customer yet: explains where invoices will appear */
  portalUnavailable?: string;
}

/** Open Stripe's portal, cancel the renewal — booking itself happens in the package cards above. */
export default function AccountPlanActions({ cancel, portalLabel, portalHint, portalUnavailable }: AccountPlanActionsProps) {
  return (
    <div className="mt-6 grid gap-4">
      {(cancel || !portalUnavailable) && (
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {!portalUnavailable && (
          <form action={openPortalAction}>
            <Button type="submit" label={portalLabel} variant="outline" />
          </form>
        )}
        {cancel && (
          <form action={cancelSubscriptionAction}>
            <Button type="submit" label={cancel.label} variant="outline" />
          </form>
        )}
      </div>
      )}
      <p className="max-w-lg text-sm leading-relaxed text-muted">{portalUnavailable ?? portalHint}</p>
    </div>
  );
}
