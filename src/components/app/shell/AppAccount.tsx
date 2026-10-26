import AppAccountMenu from "@/components/app/shell/AppAccountMenu";
import AppAccountMenuLink from "@/components/app/shell/AppAccountMenuLink";
import { APP_ROUTES } from "@/lib/appConstants";
import { logoutAction } from "@/lib/auth/actions/logoutAction";

interface AppAccountLabels {
  /** Visible trigger text, e.g. "Konto" */
  Trigger: string;
  Open: string;
  SignedInAs: string;
  Settings: string;
  Password: string;
  SignOut: string;
}

interface AppAccountProps {
  email: string;
  /** Access level in words, e.g. "Vollzugang · Investor" */
  access: string;
  /** Full access shows a green dot, free a red one */
  hasFullAccess: boolean;
  labels: AppAccountLabels;
}

/** Password panel anchor on the account page */
const PASSWORD_ANCHOR = "#password";

/** Masthead account menu: monogram trigger, address, access level, links and sign-out. */
export default function AppAccount({ email, access, hasFullAccess, labels }: AppAccountProps) {
  const monogram = email.charAt(0).toUpperCase();
  const dot = hasFullAccess ? "bg-verdict" : "bg-signal";

  const trigger = (
    <>
      <span aria-hidden="true" className="relative grid size-8 place-items-center border-2 border-ink bg-paper-bright font-narrow text-sm font-bold text-ink group-open:bg-ink group-open:text-paper-bright">
        {monogram}
        <span className={`absolute -right-1 -bottom-1 size-2.5 rounded-full border-2 border-paper ${dot}`} />
      </span>
      <span className="hidden font-narrow text-xs font-semibold tracking-[0.08em] text-ink-soft uppercase group-hover:text-ink sm:inline">{labels.Trigger}</span>
      <span aria-hidden="true" className="hidden text-[10px] text-muted transition-transform group-open:rotate-180 sm:inline">
        ▾
      </span>
    </>
  );

  return (
    <div className="ml-2 border-l border-rule pl-4">
      <AppAccountMenu trigger={trigger} label={labels.Open}>
        <div className="border-b border-rule px-4 pt-4 pb-3.5">
          <p className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">{labels.SignedInAs}</p>
          <p className="mt-1 truncate font-mono text-[13px] text-ink" title={email}>
            {email}
          </p>
          <p className="mt-2.5 flex items-center gap-2 text-xs text-ink-soft">
            <span aria-hidden="true" className={`size-2 rounded-full ${dot}`} />
            {access}
          </p>
        </div>
        <nav aria-label={labels.Trigger} className="py-1.5">
          <AppAccountMenuLink href={APP_ROUTES.account} label={labels.Settings} index="01" />
          <AppAccountMenuLink href={`${APP_ROUTES.account}${PASSWORD_ANCHOR}`} label={labels.Password} index="02" />
        </nav>
        <form action={logoutAction} className="border-t-2 border-ink">
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-between px-4 py-3 font-narrow text-xs font-semibold tracking-[0.1em] text-signal uppercase transition-colors hover:bg-signal hover:text-paper-bright focus-visible:bg-signal focus-visible:text-paper-bright focus-visible:outline-none"
          >
            {labels.SignOut}
            <span aria-hidden="true">⏻</span>
          </button>
        </form>
      </AppAccountMenu>
    </div>
  );
}
