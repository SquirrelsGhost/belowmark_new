import Button from "@/components/ui/Button";
import { logoutAction, logoutEverywhereAction } from "@/lib/auth/actions/logoutAction";

interface SignOutFormsProps {
  logoutLabel: string;
  everywhereLabel: string;
}

/** Plain forms posting to Server Actions — they work before hydration, too. */
export default function SignOutForms({ logoutLabel, everywhereLabel }: SignOutFormsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <form action={logoutAction}>
        <Button type="submit" label={logoutLabel} variant="ink" />
      </form>
      <form action={logoutEverywhereAction}>
        <Button type="submit" label={everywhereLabel} variant="outline" />
      </form>
    </div>
  );
}
