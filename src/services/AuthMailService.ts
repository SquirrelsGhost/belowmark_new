import "server-only";
import { AUTH_PARAMS, AUTH_ROUTES } from "@/lib/auth/authConfig";
import { env } from "@/lib/env";
import { renderAuthMail } from "@/lib/mail/renderAuthMail";
import { MailService } from "@/services/MailService";
import { TranslationService } from "@/services/TranslationService";
import { AuthTranslations } from "@/translations/auth/AuthTranslations";
import { IAuthTranslation } from "@/translations/auth/IAuthTranslation";

type MailKind = keyof Omit<IAuthTranslation["Mail"], "Signature" | "Footer">;

interface Recipient {
  email: string;
  locale: string;
}

function link(path: string, token?: string): string {
  const url = new URL(path, env.appUrl);
  if (token) url.searchParams.set(AUTH_PARAMS.token, token);
  return url.toString();
}

async function send(kind: MailKind, recipient: Recipient, url: string): Promise<void> {
  const locale = TranslationService.NormalizeLocale(recipient.locale);
  const mail = AuthTranslations[locale].Mail;
  const rendered = renderAuthMail({
    template: mail[kind],
    url,
    signature: mail.Signature,
    footer: mail.Footer,
    lang: TranslationService.ToLocaleOption(locale),
  });
  await MailService.send({ to: recipient.email, ...rendered });
}

/**
 * AuthMailService
 *
 * The four account mails, each in the recipient's language. Links are built
 * from NEXT_PUBLIC_APP_URL — never from the request's Host header, which an
 * attacker could forge to receive someone else's reset token.
 */
export class AuthMailService {
  static sendVerification = (to: Recipient, token: string) => send("VerifyEmail", to, link(AUTH_ROUTES.verifyEmail, token));

  static sendPasswordReset = (to: Recipient, token: string) => send("ResetPassword", to, link(AUTH_ROUTES.resetPassword, token));

  static sendAccountExists = (to: Recipient) => send("AccountExists", to, link(AUTH_ROUTES.login));

  static sendPasswordChanged = (to: Recipient) => send("PasswordChanged", to, link(AUTH_ROUTES.forgotPassword));
}
