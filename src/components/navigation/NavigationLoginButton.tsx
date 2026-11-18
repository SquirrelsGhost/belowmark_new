import Link from "next/link";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

interface NavigationLoginButtonProps {
  loginLabel: string;
  signupLabel: string;
}

/** Sign-in text link plus the primary "test access" call to action. */
export default function NavigationLoginButton({ loginLabel, signupLabel }: NavigationLoginButtonProps) {
  return (
    <div className="ml-2 flex shrink-0 items-center gap-3 whitespace-nowrap sm:gap-4">
      <Link href={ROUTES.login} className="hidden whitespace-nowrap font-narrow text-sm font-medium tracking-[0.08em] uppercase underline-offset-4 hover:underline sm:inline-block">
        {loginLabel}
      </Link>
      <Button label={signupLabel} href={ROUTES.signup} variant="signal" size="sm" />
    </div>
  );
}
