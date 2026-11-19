import assert from "node:assert/strict";
import fs from "node:fs";
import { registerHooks } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import ts from "typescript";

const ROOT = process.cwd();

function resolveTsFile(base) {
  const candidates = [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")];
  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ?? null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") {
      return { url: "data:text/javascript,export {};", shortCircuit: true };
    }
    if (specifier === "react") {
      return { url: "data:text/javascript,export const cache = (fn) => fn;", shortCircuit: true };
    }
    if (specifier === "next/headers") {
      return {
        url: "data:text/javascript,export async function cookies(){return {get:()=>undefined};} export async function headers(){return {get:()=>null};}",
        shortCircuit: true,
      };
    }
    if (specifier.startsWith("@/")) {
      const found = resolveTsFile(path.join(ROOT, "src", specifier.slice(2)));
      if (found) return nextResolve(pathToFileURL(found).href, context);
    }
    if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:")) {
      const parentDir = path.dirname(fileURLToPath(context.parentURL));
      const found = resolveTsFile(path.resolve(parentDir, specifier));
      if (found) return nextResolve(pathToFileURL(found).href, context);
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith("file:") && url.endsWith(".json") && !context.importAttributes?.type) {
      const jsonText = fs.readFileSync(fileURLToPath(url), "utf8");
      return {
        format: "module",
        source: `export default ${jsonText};`,
        shortCircuit: true,
      };
    }
    if (url.startsWith("file:") && (url.endsWith(".ts") || url.endsWith(".tsx"))) {
      const sourceText = fs.readFileSync(fileURLToPath(url), "utf8");
      const transpiled = ts.transpileModule(sourceText, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
          jsx: ts.JsxEmit.ReactJSX,
        },
        fileName: fileURLToPath(url),
      });
      return {
        format: "module",
        source: transpiled.outputText,
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});

const { LOCALE_OPTIONS } = await import("../src/lib/constants.ts");
const { renderAuthMail } = await import("../src/lib/mail/renderAuthMail.ts");
const { buildWelcomeMailBundle } = await import("../src/lib/mail/welcomeMailCopy.ts");
const { buildVerifyReminderMailBundle, normalizeMailLang } = await import("../src/lib/mail/verifyReminderMailCopy.ts");
const { renderBillingMail } = await import("../src/lib/mail/renderBillingMail.ts");
const { renderAlertMail } = await import("../src/lib/mail/renderAlertMail.ts");
const { renderDeadlineMail } = await import("../src/lib/mail/renderDeadlineMail.ts");
const { TranslationService } = await import("../src/services/TranslationService.ts");
const { AuthTranslations } = await import("../src/translations/auth/AuthTranslations.ts");
const { BillingTranslations } = await import("../src/translations/billing/BillingTranslations.ts");
const { AlertsTranslations } = await import("../src/translations/alerts/AlertsTranslations.ts");
const { DeadlineTranslations } = await import("../src/translations/deadlines/DeadlineTranslations.ts");
const { TeamTranslations } = await import("../src/translations/team/TeamTranslations.ts");
const { legalDocument, legalDocumentText } = await import("../src/translations/legal/LegalDocuments.ts");

const GERMAN_ONLY_MARKERS = [
  "Guten Tag",
  "VERTRAGS- & EINGANGSBELEG",
  "BM-BELEG · VERTRAG",
  "Vertragsunterlagen auf dauerhaftem Datenträger",
  "Konto & Tarif öffnen",
  "BELOWMARK — SUCH-ALERTS",
  "BM-ALERT · SUCHAUFTRAG",
  "Benachrichtigung zu Ihren Such-Alerts",
  "Aktenblatt",
  "BELOWMARK — TERMIN- & FRISTEN-BEGLEITER",
  "BM-FRIST · TERMINBEGLEITER",
  "verfolgte Verfahren",
  "Amtliche Bekanntmachungen · Mit Quelle",
  "Impressum & Datenschutz",
  "Ihr 6-stelliger Bestätigungscode",
];

function assertNoGermanLeak(lang, label, rendered) {
  assert.ok(rendered.subject.length > 5, `[${lang}] ${label}: empty subject`);
  assert.ok(rendered.html.includes(`<html lang="${lang}">`), `[${lang}] ${label}: missing <html lang="${lang}">`);
  if (lang === "de") return;
  for (const marker of GERMAN_ONLY_MARKERS) {
    assert.ok(
      !rendered.text.includes(marker),
      `[${lang}] ${label}: German fallback leaked into text: "${marker}"`,
    );
    assert.ok(
      !rendered.html.includes(marker),
      `[${lang}] ${label}: German fallback leaked into html: "${marker}"`,
    );
  }
}

test("normalizeMailLang recognizes all 10 UI languages", () => {
  assert.equal(LOCALE_OPTIONS.length, 10);
  for (const lang of LOCALE_OPTIONS) {
    assert.equal(normalizeMailLang(lang), lang);
    assert.equal(normalizeMailLang(`${lang.toUpperCase()}-XX`), lang);
  }
});

test("all auth, welcome, reminder, team, billing, alert, and deadline mails render natively in all 10 languages with zero German leakage", () => {
  for (const lang of LOCALE_OPTIONS) {
    const localeEnum = TranslationService.NormalizeLocale(lang);
    const authMail = AuthTranslations[localeEnum].Mail;

    for (const kind of ["VerifyEmail", "ResetPassword", "AccountExists", "PasswordChanged"]) {
      const rendered = renderAuthMail({
        template: authMail[kind],
        url: "https://www.belowmark.com/bestaetigen?token=abc",
        signature: authMail.Signature,
        footer: authMail.Footer,
        lang,
        verificationCode: kind === "VerifyEmail" ? "482910" : undefined,
      });
      assertNoGermanLeak(lang, `Auth.${kind}`, rendered);
    }

    const welcome = buildWelcomeMailBundle(lang, "31.12.2026");
    const welcomeRendered = renderAuthMail({
      template: welcome.template,
      url: "https://www.belowmark.com/app",
      signature: authMail.Signature,
      footer: authMail.Footer,
      lang,
      highlights: welcome.highlights,
      docCode: welcome.docCode,
      eyebrow: welcome.eyebrow,
    });
    assertNoGermanLeak(lang, "WelcomeTrial", welcomeRendered);

    const reminder = buildVerifyReminderMailBundle(lang);
    const reminderRendered = renderAuthMail({
      template: reminder.template,
      url: "https://www.belowmark.com/bestaetigen?token=xyz",
      signature: reminder.signature,
      footer: reminder.footer,
      lang,
      verificationCode: "193847",
      highlights: reminder.highlights,
      docCode: reminder.docCode,
      eyebrow: reminder.eyebrow,
    });
    assertNoGermanLeak(lang, "VerifyReminder", reminderRendered);

    const teamMail = TeamTranslations[localeEnum].Mail;
    const teamRendered = renderAuthMail({
      template: teamMail.Invite,
      url: "https://www.belowmark.com/konto/team/einladung?token=inv",
      signature: teamMail.Signature,
      footer: teamMail.Footer,
      lang,
    });
    assertNoGermanLeak(lang, "TeamInvite", teamRendered);

    const billingMail = BillingTranslations[localeEnum].Mail;
    const termsText = legalDocumentText(legalDocument("terms", "inclusive", lang));
    const withdrawalText = legalDocumentText(legalDocument("withdrawal", "inclusive", lang));
    const billingRendered = renderBillingMail({
      subject: billingMail.Order.Subject,
      blocks: [
        billingMail.Order.Greeting,
        billingMail.Order.Body,
        billingMail.Order.Lines,
      ],
      appendix: `${termsText}\n\n${withdrawalText}`,
      signature: billingMail.Signature,
      footer: billingMail.Footer,
      lang,
    });
    assertNoGermanLeak(lang, "BillingOrder", billingRendered);

    const cancelRendered = renderBillingMail({
      subject: billingMail.CancelReceipt.Subject,
      blocks: [billingMail.CancelReceipt.Body],
      signature: billingMail.Signature,
      footer: billingMail.Footer,
      lang,
    });
    assertNoGermanLeak(lang, "BillingCancelReceipt", cancelRendered);

    const withdrawRendered = renderBillingMail({
      subject: billingMail.WithdrawReceipt.Subject,
      blocks: [billingMail.WithdrawReceipt.Body],
      signature: billingMail.Signature,
      footer: billingMail.Footer,
      lang,
    });
    assertNoGermanLeak(lang, "BillingWithdrawReceipt", withdrawRendered);

    const alertsMail = AlertsTranslations[localeEnum].Mail;
    const alertRendered = renderAlertMail({
      lang,
      subject: alertsMail.Subject,
      preheader: alertsMail.Preheader,
      greeting: alertsMail.Greeting,
      intro: alertsMail.Intro,
      sections: [
        {
          name: "Portfolio Alert",
          summary: "1×",
          items: [
            {
              kind: alertsMail.Kinds.new,
              title: "ul. Marszałkowska 10",
              reference: "I Co 124/26",
              dateLine: "15.12.2026",
              valueLine: "850 000 PLN",
              url: "https://www.belowmark.com/app/objekt/pl-1",
            },
          ],
          more: null,
          searchUrl: "https://www.belowmark.com/app",
        },
      ],
      openSearch: alertsMail.OpenSearch,
      note: alertsMail.LockedValues,
      source: alertsMail.Source.DE,
      manage: alertsMail.Manage,
      manageUrl: "https://www.belowmark.com/app/alerts",
      signature: alertsMail.Signature,
      footer: alertsMail.Footer,
    });
    assertNoGermanLeak(lang, "AlertDigest", alertRendered);

    const deadlineMail = DeadlineTranslations[localeEnum].Mail;
    const deadlineRendered = renderDeadlineMail({
      lang,
      subject: deadlineMail.Subject,
      preheader: deadlineMail.Preheader,
      greeting: deadlineMail.Greeting,
      intro: deadlineMail.Intro,
      sections: [
        {
          title: "ul. Marszałkowska 10",
          reference: "I Co 124/26",
          url: "https://www.belowmark.com/app/objekt/pl-1",
          items: [
            {
              when: deadlineMail.Today,
              date: "20.11.2026",
              title: "Wadium",
              detail: "10%",
              source: "KPC art. 962",
            },
          ],
        },
      ],
      openListing: deadlineMail.OpenListing,
      manage: deadlineMail.Manage,
      manageUrl: "https://www.belowmark.com/app/termine",
      signature: deadlineMail.Signature,
      footer: deadlineMail.Footer,
    });
    assertNoGermanLeak(lang, "DeadlineDigest", deadlineRendered);
  }
});
