import AccountPanel from "@/components/account/AccountPanel";
import DeleteAccountForm from "@/components/account/DeleteAccountForm";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";
import { IBillingTranslation } from "@/translations/billing/IBillingTranslation";

interface AccountDataPanelProps {
  t: IBillingTranslation["Data"];
  fields: IAuthTranslation["Fields"];
  exportHref: string;
  errorTitle: string;
  pendingLabel: string;
  email: string;
  hasRunningPlan: boolean;
}

/** Art. 15/20 DSGVO download and Art. 17 deletion, both without writing to anyone. */
export default function AccountDataPanel({ t, fields, exportHref, errorTitle, pendingLabel, email, hasRunningPlan }: AccountDataPanelProps) {
  return (
    <AccountPanel id="daten" title={t.Title} description={t.Description}>
      <div className="grid gap-2">
        {/* A plain download link: the route answers with an attachment */}
        <a
          href={exportHref}
          download
          className="inline-flex w-fit items-center gap-3 border border-rule-strong px-5 py-3 font-narrow font-semibold tracking-[0.08em] text-ink uppercase transition-colors hover:bg-ink hover:text-paper-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
        >
          {t.Export}
        </a>
        <p className="max-w-lg text-sm leading-relaxed text-muted">{t.ExportHint}</p>
      </div>
      <div className="mt-8 border-t border-rule pt-5">
        <h3 className="font-narrow text-xl font-semibold">{t.DeleteTitle}</h3>
        <div className="mt-4">
          <DeleteAccountForm t={t} fields={fields} errorTitle={errorTitle} pendingLabel={pendingLabel} email={email} hasRunningPlan={hasRunningPlan} />
        </div>
      </div>
    </AccountPanel>
  );
}
