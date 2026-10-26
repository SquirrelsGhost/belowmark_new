import AccountDetailRow from "@/components/account/AccountDetailRow";
import AccountDetails from "@/components/account/AccountDetails";
import AccountPanel from "@/components/account/AccountPanel";
import AccountPlanActions from "@/components/account/AccountPlanActions";
import BillingNotice from "@/components/billing/BillingNotice";
import { AccountPlanView } from "@/lib/billing/accountPlanView";
import { BILLING_ACCOUNT_ANCHOR } from "@/lib/billing/billingRoutes";
import { IBillingTranslation } from "@/translations/billing/IBillingTranslation";

interface AccountPlanPanelProps {
  t: IBillingTranslation["Account"];
  view: AccountPlanView;
  /** Outcome of a payment or portal visit (?zahlung=…) */
  notice?: { message: string; tone: "verdict" | "signal" };
}

/** "Tarif und Rechnungen": what is booked, until when, and the next step. */
export default function AccountPlanPanel({ t, view, notice }: AccountPlanPanelProps) {
  return (
    <AccountPanel id={BILLING_ACCOUNT_ANCHOR} title={t.Title} description={t.Description}>
      {notice && (
        <div className="mb-5">
          <BillingNotice tone={notice.tone} message={notice.message} />
        </div>
      )}
      <AccountDetails>
        <AccountDetailRow label={t.PlanLabel} value={view.plan} tone={view.isActive ? "verdict" : "default"} />
        {view.term && <AccountDetailRow label={t.Status} value={view.term} />}
      </AccountDetails>
      <AccountPlanActions book={view.book} cancel={view.cancel} portalLabel={t.Portal} portalHint={t.PortalHint} portalUnavailable={view.portalUnavailable} />
    </AccountPanel>
  );
}
