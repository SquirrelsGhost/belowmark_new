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

export interface VerificationContextParams {
  key?: string;
  city?: string;
  market?: string;
}

function link(path: string, token?: string, ctx?: VerificationContextParams, baseOverride?: string): string {
  const url = new URL(path, baseOverride || env.appUrl);
  if (token) url.searchParams.set(AUTH_PARAMS.token, token);
  if (ctx?.key) url.searchParams.set("objekt", ctx.key);
  if (ctx?.city) url.searchParams.set("stadt", ctx.city);
  if (ctx?.market) url.searchParams.set("markt", ctx.market);
  return url.toString();
}

function resolvePublicBaseUrl(candidate?: string): string {
  const raw = (candidate || env.appUrl || "https://www.belowmark.com").trim();
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(raw)) {
    return "https://www.belowmark.com";
  }
  return raw;
}

import { LocaleOption } from "@/lib/constants";
import { buildVerifyReminderMailBundle } from "@/lib/mail/verifyReminderMailCopy";
import { buildWelcomeMailBundle } from "@/lib/mail/welcomeMailCopy";

const INTL_LOCALES: Record<LocaleOption, string> = {
  de: "de-DE",
  tr: "tr-TR",
  en: "en-GB",
  it: "it-IT",
  es: "es-ES",
  fr: "fr-FR",
};

function formatTrialEndDate(trialEndsAt: Date, lang: LocaleOption): string {
  return new Intl.DateTimeFormat(INTL_LOCALES[lang], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(trialEndsAt);
}

async function send(
  kind: MailKind,
  recipient: Recipient,
  url: string,
  extra?: { verificationCode?: string },
): Promise<void> {
  const locale = TranslationService.NormalizeLocale(recipient.locale);
  const lang = TranslationService.ToLocaleOption(locale);
  const mail = AuthTranslations[locale].Mail;
  const rendered = renderAuthMail({
    template: mail[kind],
    url,
    signature: mail.Signature,
    footer: mail.Footer,
    lang,
    verificationCode: extra?.verificationCode,
    baseUrl: env.appUrl,
  });
  await MailService.send({ to: recipient.email, ...rendered });
}

/**
 * AuthMailService
 *
 * All account & lifecycle mails (verification with 1-click link + 6-digit OTP code,
 * welcome & 14-day trial activation, password reset, account-exists notice, and
 * password-changed security alert), each in the recipient's language.
 */
export class AuthMailService {
  static sendVerification = (
    to: Recipient,
    token: string,
    verificationCode?: string,
    ctx?: VerificationContextParams,
  ) =>
    send("VerifyEmail", to, link(AUTH_ROUTES.verifyEmail, token, ctx), { verificationCode });

  static sendPasswordReset = (to: Recipient, token: string) =>
    send("ResetPassword", to, link(AUTH_ROUTES.resetPassword, token));

  static sendAccountExists = (to: Recipient) =>
    send("AccountExists", to, link(AUTH_ROUTES.login));

  static sendPasswordChanged = (to: Recipient) =>
    send("PasswordChanged", to, link(AUTH_ROUTES.forgotPassword));

  static sendWelcomeTrial = async (to: Recipient, trialEndsAt: Date): Promise<void> => {
    const locale = TranslationService.NormalizeLocale(to.locale);
    const lang = TranslationService.ToLocaleOption(locale);
    const mail = AuthTranslations[locale].Mail;
    const endDate = formatTrialEndDate(trialEndsAt, lang);
    const bundle = buildWelcomeMailBundle(lang, endDate);

    const rendered = renderAuthMail({
      template: bundle.template,
      url: link(AUTH_ROUTES.afterLogin),
      signature: mail.Signature,
      footer: mail.Footer,
      lang,
      highlights: bundle.highlights,
      docCode: bundle.docCode,
      eyebrow: bundle.eyebrow,
      baseUrl: env.appUrl,
    });
    await MailService.send({ to: to.email, ...rendered });
  };

  /** Sends the strict 1× verification reminder with a fresh 72h link + 6-digit code in the user's locale. */
  static sendVerificationReminder = async (
    to: Recipient,
    token: string,
    verificationCode: string,
    baseUrl?: string,
  ): Promise<void> => {
    const locale = TranslationService.NormalizeLocale(to.locale);
    const lang = TranslationService.ToLocaleOption(locale);
    const publicBase = resolvePublicBaseUrl(baseUrl);
    const bundle = buildVerifyReminderMailBundle(lang);

    const rendered = renderAuthMail({
      template: bundle.template,
      url: link(AUTH_ROUTES.verifyEmail, token, undefined, publicBase),
      signature: bundle.signature,
      footer: bundle.footer,
      lang,
      verificationCode,
      highlights: bundle.highlights,
      docCode: bundle.docCode,
      eyebrow: bundle.eyebrow,
      baseUrl: publicBase,
    });
    await MailService.send({ to: to.email, ...rendered });
  };
}
