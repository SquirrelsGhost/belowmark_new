import Button from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

interface NavigationLoginButtonProps {
  loginLabel: string;
  signupLabel: string;
}

/** Sign-in link plus primary sign-up call to action. */
export default function NavigationLoginButton({ loginLabel, signupLabel }: NavigationLoginButtonProps) {
  return (
    <div className="flex items-center gap-1">
      <span className="hidden sm:inline-flex">
        <Button label={loginLabel} href={ROUTES.login} variant="ghost" size="sm" />
      </span>
      <Button label={signupLabel} href={ROUTES.signup} variant="primary" size="sm" withArrow />
    </div>
  );
}
