import { devLoginAction } from "@/lib/auth/actions/devLoginAction";
import { AUTH_PARAMS } from "@/lib/auth/authConfig";

interface DevQuickLoginButtonProps {
  account: string;
  email: string;
  label: string;
  next: string;
}

/** One test account, one click — posts straight to the dev-only Server Action. */
export default function DevQuickLoginButton({ account, email, label, next }: DevQuickLoginButtonProps) {
  return (
    <form action={devLoginAction}>
      <input type="hidden" name="account" value={account} />
      <input type="hidden" name={AUTH_PARAMS.next} value={next} />
      <button
        type="submit"
        title={email}
        className="flex h-full w-full flex-col items-start gap-0.5 border border-ink bg-paper-bright px-3 py-2.5 text-left transition-colors hover:bg-ink hover:text-paper-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
      >
        <span className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase">{account}</span>
        <span className="text-xs leading-snug opacity-80">{label}</span>
      </button>
    </form>
  );
}
