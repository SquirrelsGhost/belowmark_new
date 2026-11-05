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

export interface VerificationContextParams {
  key?: string;
  city?: string;
  market?: string;
}

function link(path: string, token?: string, ctx?: VerificationContextParams): string {
  const url = new URL(path, env.appUrl);
  if (token) url.searchParams.set(AUTH_PARAMS.token, token);
  if (ctx?.key) url.searchParams.set("objekt", ctx.key);
  if (ctx?.city) url.searchParams.set("stadt", ctx.city);
  if (ctx?.market) url.searchParams.set("markt", ctx.market);
  return url.toString();
}

import { LocaleOption } from "@/lib/constants";

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
    const isTr = lang === "tr";
    const endDate = formatTrialEndDate(trialEndsAt, lang);

    const template: IMailTemplate = isTr
      ? {
          Subject: "Hoş geldiniz — Belowmark hesabınız ve otomatik ihale alarmınız aktif",
          Preheader: "E-posta adresiniz doğrulandı. İhaleleri inceleyin ve Investor paketiyle tam dosya detaylarını açın.",
          Greeting: "Merhaba,",
          Body: "E-posta adresiniz başarıyla doğrulandı ve Belowmark hesabınız etkinleştirildi. Bölgeniz için otomatik e-posta ihale alarmınız kuruldu. Dosya numaralarını (Esas No), TKGM ada/parsel bilgilerini, bilirkişi raporu yapay zeka analizini ve teklif sınırı hesaplayıcısını açmak için istediğiniz zaman Investor paketine geçebilirsiniz.",
          Action: "İhaleleri ve hesabımı aç",
          Expiry: `Kayıtlı aramalarınız ve izleme listeniz ücretsiz hesabınızda açık kalır (referans: ${endDate}).`,
          Ignore: "Hesap ayarlarınızı, kayıtlı aramalarınızı ve Investor abonelik seçeneklerinizi istediğiniz zaman hesabınızdan yönetebilirsiniz.",
        }
      : {
          Subject: "Willkommen bei Belowmark — Ihr Konto & Such-Alert sind aktiviert",
          Preheader: "Ihre E-Mail-Adresse ist bestätigt. Prüfen Sie aktuelle Termine und schalten Sie Aktenzeichen & Gutachten-KI frei.",
          Greeting: "Guten Tag,",
          Body: "Ihre E-Mail-Adresse ist bestätigt und Ihr Belowmark-Konto wurde freigeschaltet. Ihr kostenloser E-Mail-Suchauftrag für neue Versteigerungstermine ist aktiv. Um vollständige Aktenzeichen, exakte Hausnummern, Original-Bekanntmachungen/Gutachten, die Gutachten-KI und die Bankmappe freizuschalten, können Sie jederzeit den Investor-Zugang buchen.",
          Action: "Verfahren & Konto öffnen",
          Expiry: `Merkliste, Karte und automatische Such-Alerts stehen Ihnen im Basiskonto dauerhaft zur Verfügung (Stand: ${endDate}).`,
          Ignore: "Ihre Such-Alerts, Fristen-Erinnerungen und den Investor-Tarif (/buchen) verwalten Sie jederzeit direkt in Ihrem Konto.",
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
      eyebrow: isTr ? "Hesap Açılışı ve Ücretsiz İhale Alarmı" : "Kontoeröffnung & Kostenloser Such-Alert",
      baseUrl: env.appUrl,
    });
    await MailService.send({ to: to.email, ...rendered });
  };
}
