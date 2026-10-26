import AuthTextLink from "@/components/auth/AuthTextLink";
import TeamActionButton from "@/components/app/team/TeamActionButton";
import TeamHint from "@/components/app/team/TeamHint";
import { AUTH_PARAMS, AUTH_ROUTES } from "@/lib/auth/authConfig";
import { fill } from "@/lib/appFormat";
import { acceptInviteAction, declineInviteAction } from "@/lib/team/invitationActions";
import { ITeamTranslation } from "@/translations/team/ITeamTranslation";

interface InvitationActionsProps {
  token: string;
  /** Path of this page incl. token, to come back after sign-in */
  returnTo: string;
  /** Signed-in address, null when signed out */
  viewerEmail: string | null;
  invitedEmail: string;
  isBlocked: boolean;
  labels: ITeamTranslation["Invitation"];
  errors: ITeamTranslation["Errors"];
}

/** What the person behind the link can do: accept with the right account, sign in first, or decline without any account. */
export default function InvitationActions({ token, returnTo, viewerEmail, invitedEmail, isBlocked, labels: L, errors }: InvitationActionsProps) {
  const loginHref = `${AUTH_ROUTES.login}?${AUTH_PARAMS.next}=${encodeURIComponent(returnTo)}`;
  const isRightAccount = viewerEmail === invitedEmail;
  const decline = <TeamActionButton action={declineInviteAction} fields={{ token }} label={L.Decline} errors={errors} tone="danger" doneMessage={`${L.Declined.Title} ${L.Declined.Body}`} />;

  return (
    <div className="flex flex-col items-start gap-5">
      {isBlocked && <p className="border-l-4 border-signal pl-3 text-sm leading-relaxed">{L.Blocked}</p>}
      {!isBlocked && isRightAccount && <TeamActionButton action={acceptInviteAction} fields={{ token }} label={L.Accept} errors={errors} tone="ink" size="large" />}
      {!isBlocked && viewerEmail && !isRightAccount && (
        <>
          <p className="text-sm leading-relaxed text-ink-soft">{fill(L.WrongAccount, { email: viewerEmail })}</p>
          <AuthTextLink href={loginHref} label={L.SwitchAccount} />
        </>
      )}
      {!isBlocked && !viewerEmail && (
        <>
          <AuthTextLink href={loginHref} label={L.LoginToAccept} />
          <TeamHint text={L.SignupHint} />
          <AuthTextLink href={AUTH_ROUTES.signup} label={L.SignupCta} size="xs" />
        </>
      )}
      <div className="w-full border-t border-rule pt-4">{decline}</div>
    </div>
  );
}
