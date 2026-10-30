import AccountOverviewTile from "@/components/account/AccountOverviewTile";
import AccountPanel from "@/components/account/AccountPanel";
import InvoiceDownloadLink from "@/components/account/InvoiceDownloadLink";
import { InvoiceListView } from "@/lib/invoice/invoiceView";
import { IAccountTranslation } from "@/translations/account/IAccountTranslation";

interface AccountOverviewPanelProps {
  t: IAccountTranslation["Overview"];
  invoiceText: IAccountTranslation["Invoices"];
  plan: { name: string; term?: string; isActive: boolean };
  latestInvoice?: InvoiceListView;
  billingHref: string;
  researchHref: string;
}

/** "Auf einen Blick": plan, latest invoice, the way back to the research. */
export default function AccountOverviewPanel({ t, invoiceText, plan, latestInvoice, billingHref, researchHref }: AccountOverviewPanelProps) {
  return (
    <AccountPanel id="ueberblick" title={t.Title} description={t.Description}>
      <div className="grid gap-px border border-rule bg-rule sm:grid-cols-3">
        <AccountOverviewTile label={t.Plan} link={{ href: billingHref, label: t.PlanCta }}>
          <p className={`font-narrow text-lg leading-tight font-semibold ${plan.isActive ? "text-verdict" : "text-ink"}`}>{plan.name}</p>
          {plan.term && <p className="mt-1 font-mono text-xs text-muted">{plan.term}</p>}
        </AccountOverviewTile>
        <AccountOverviewTile label={t.LatestInvoice} link={{ href: billingHref, label: t.AllInvoices }}>
          {latestInvoice ? (
            <div className="grid gap-2">
              <p className="font-mono text-sm">{latestInvoice.number}</p>
              <p className="font-mono text-xs text-muted">
                {latestInvoice.date} · {latestInvoice.amount}
              </p>
              <InvoiceDownloadLink href={latestInvoice.downloadHref} label={invoiceText.Download} ariaLabel={latestInvoice.downloadLabel} />
            </div>
          ) : (
            <p className="text-muted">{t.NoInvoice}</p>
          )}
        </AccountOverviewTile>
        <AccountOverviewTile label={t.Research} link={{ href: researchHref, label: t.ResearchCta }}>
          <p className="text-ink-soft">{t.ResearchBody}</p>
        </AccountOverviewTile>
      </div>
    </AccountPanel>
  );
}
