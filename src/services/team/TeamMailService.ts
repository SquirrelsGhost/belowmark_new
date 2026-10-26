import "server-only";
import { fill } from "@/lib/appFormat";
import { env } from "@/lib/env";
import { renderAuthMail } from "@/lib/mail/renderAuthMail";
import { MarketCode } from "@/lib/constants";
import { TEAM_PARAMS, TEAM_ROUTES, TeamRole, TEAMS } from "@/lib/team/teamConfig";
import { MailService } from "@/services/MailService";
import { getTeamTranslation } from "@/translations/team/TeamTranslations";

export interface InviteMail {
  to: string;
  /** Language of the inviter — the invited person has no stored language yet */
  locale: "de" | "tr";
  inviter: string;
  team: string;
  role: TeamRole;
  market: MarketCode;
  token: string;
}

/**
 * TeamMailService
 *
 * The one mail an invited person gets. The link is built from
 * NEXT_PUBLIC_APP_URL, never from the request, and leads to a page where
 * they can accept or decline — no reminder mails follow.
 */
export class TeamMailService {
  static sendInvite = async (mail: InviteMail): Promise<void> => {
    const t = getTeamTranslation(mail.locale);
    const values = { inviter: mail.inviter, team: mail.team, role: t.Roles[mail.role], market: t.Markets[mail.market], days: TEAMS.inviteTtlDays };
    const template = Object.fromEntries(Object.entries(t.Mail.Invite).map(([key, text]) => [key, fill(text, values)])) as typeof t.Mail.Invite;
    const url = new URL(TEAM_ROUTES.invitation, env.appUrl);
    url.searchParams.set(TEAM_PARAMS.token, mail.token);
    const rendered = renderAuthMail({ template, url: url.toString(), signature: t.Mail.Signature, footer: t.Mail.Footer, lang: mail.locale });
    await MailService.send({ to: mail.to, ...rendered });
  };
}
