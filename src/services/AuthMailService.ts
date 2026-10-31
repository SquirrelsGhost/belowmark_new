import "server-only";
import { AUTH_PARAMS, AUTH_ROUTES } from "@/lib/auth/authConfig";
import { env } from "@/lib/env";
import { renderAuthMail } from "@/lib/mail/renderAuthMail";
import { MailService } from "@/services/MailService";
import { TranslationService } from "@/services/TranslationService";
import { AuthTranslations } from "@/translations/auth/AuthTranslations";
import { IAuthTranslation, IMailTemplate } from "@/translations/auth/IAuthTranslation";

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

function formatTrialEndDate(trialEndsAt: Date, lang: "de" | "tr"): string {
  return new Intl.DateTimeFormat(lang === "tr" ? "tr-TR" : "de-DE", {
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
  static sendVerification = (to: Recipient, token: string, verificationCode?: string) =>
    send("VerifyEmail", to, link(AUTH_ROUTES.verifyEmail, token), { verificationCode });

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
    const isTr = lang === "tr";
    const endDate = formatTrialEndDate(trialEndsAt, lang);

    const template: IMailTemplate = isTr
      ? {
          Subject: "Hoş geldiniz — 14 günlük tam deneme erişiminiz etkinleştirildi",
          Preheader: `Belowmark hesabınız doğrulandı. ${endDate} tarihine kadar tam erişiminiz açık.`,
          Greeting: "Merhaba,",
          Body: `E-posta adresiniz başarıyla doğrulandı ve Belowmark hesabınız etkinleştirildi. 14 günlük ücretsiz tam deneme erişiminiz şimdi başladı (${endDate} tarihine kadar geçerlidir).`,
          Action: "İhaleleri incelemeye başla",
          Expiry: `Deneme süreniz ${endDate} tarihinde kendiliğinden sona erer — otomatik abonelik veya gizli ücret yoktur.`,
          Ignore: "Hesap ayarlarınızı, kayıtlı aramalarınızı ve süre hatırlatıcılarınızı istediğiniz zaman hesabınızdan yönetebilirsiniz.",
        }
      : {
          Subject: "Willkommen bei Belowmark — Ihr 14-Tage-Testzugang ist freigeschaltet",
          Preheader: `Ihre E-Mail-Adresse ist bestätigt. Voller Zugang bis zum ${endDate}.`,
          Greeting: "Guten Tag,",
          Body: `Ihre E-Mail-Adresse ist bestätigt und Ihr Belowmark-Konto wurde freigeschaltet. Ihr kostenloser 14-tägiger Vollzugang läuft ab sofort bis einschließlich ${endDate}.`,
          Action: "Verfahren durchsuchen",
          Expiry: `Der Testzugang endet am ${endDate} automatisch — kein Abo, keine Kündigung nötig.`,
          Ignore: "Ihre Such-Alerts, Fristen-Erinnerungen und Kontoeinstellungen verwalten Sie jederzeit direkt in Ihrem Konto.",
        };

    const highlights = isTr
      ? [
          "Resmî icra ve mahkeme ihaleleri — muhammen bedel, yasal sınırlar ve masraflarla",
          "Kayıtlı Arama Alarmları (/app/alerts): Yeni ilan ve tarih değişikliklerinde otomatik e-posta",
          "Süre ve İhale Takipçisi (/app/termine): İhale öncesi otomatik hatırlatmalar ve takvim akışı",
        ]
      : [
          "Amtliche Zwangsversteigerungen mit Verkehrswert, 5/10- & 7/10-Grenzen und Gesamtkosten",
          "Such-Alerts (/app/alerts): Automatische E-Mail bei neuen Verfahren und Terminänderungen",
          "Termin-Begleiter (/app/termine): Automatische Fristen-Erinnerungen per E-Mail & Kalender-Feed",
        ];

    const rendered = renderAuthMail({
      template,
      url: link(AUTH_ROUTES.afterLogin),
      signature: mail.Signature,
      footer: mail.Footer,
      lang,
      highlights,
      docCode: isTr ? "BM-HESAP · ETKİNLEŞTİRME" : "BM-KONTO · FREISCHALTUNG",
      eyebrow: isTr ? "Hesap Açılışı ve 14 Günlük Tam Erişim" : "Kontoeröffnung & 14 Tage Vollzugang",
      baseUrl: env.appUrl,
    });
    await MailService.send({ to: to.email, ...rendered });
  };
}
