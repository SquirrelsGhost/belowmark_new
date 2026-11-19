import type { LocaleOption } from "@/lib/constants";
import type { IMailTemplate } from "@/translations/auth/IAuthTranslation";

export interface AuthMailChrome {
  headerLine: string;
  codeHeading: string;
  copyLabel: string;
  securityLabel: string;
  otpLabel: string;
  otpHint: string;
  defaultDocCode: string;
  defaultEyebrow: string;
}

export const AUTH_MAIL_CHROME: Record<LocaleOption, AuthMailChrome> = {
  de: {
    headerLine: "BELOWMARK — KONTO & SICHERHEIT",
    codeHeading: "Ihr 6-stelliger Bestätigungscode",
    copyLabel: "Direktlink (falls die Schaltfläche nicht öffnet)",
    securityLabel: "Sicherheitshinweis",
    otpLabel: "Alternativ: 6-stelliger Bestätigungscode",
    otpHint: "Sie können diesen Code auch direkt auf der Registrierungs- oder Bestätigungsseite eingeben.",
    defaultDocCode: "BM-KONTO · SICHERHEIT",
    defaultEyebrow: "Konto- & Zugangsbestätigung",
  },
  tr: {
    headerLine: "BELOWMARK — HESAP VE GÜVENLİK",
    codeHeading: "6 Haneli Doğrulama Kodunuz",
    copyLabel: "Kopyalamak için doğrudan bağlantı",
    securityLabel: "Güvenlik Notu",
    otpLabel: "Alternatif: 6 Haneli Doğrulama Kodu",
    otpHint: "Bu kodu kayıt veya doğrulama ekranına doğrudan girebilirsiniz.",
    defaultDocCode: "BM-HESAP · GÜVENLİK",
    defaultEyebrow: "Hesap ve Erişim Doğrulaması",
  },
  en: {
    headerLine: "BELOWMARK — ACCOUNT & SECURITY",
    codeHeading: "Your 6-digit verification code",
    copyLabel: "Direct link (if the button does not open)",
    securityLabel: "Security notice",
    otpLabel: "Alternative: 6-digit verification code",
    otpHint: "You can also enter this code directly on the registration or verification page.",
    defaultDocCode: "BM-ACCOUNT · SECURITY",
    defaultEyebrow: "Account & Access Verification",
  },
  fr: {
    headerLine: "BELOWMARK — COMPTE & SÉCURITÉ",
    codeHeading: "Votre code de confirmation à 6 chiffres",
    copyLabel: "Lien direct (si le bouton ne s'ouvre pas)",
    securityLabel: "Note de sécurité",
    otpLabel: "Alternative : code de confirmation à 6 chiffres",
    otpHint: "Vous pouvez également saisir ce code directement sur la page d'inscription ou de confirmation.",
    defaultDocCode: "BM-COMPTE · SÉCURITÉ",
    defaultEyebrow: "Confirmation de Compte & d'Accès",
  },
  es: {
    headerLine: "BELOWMARK — CUENTA Y SEGURIDAD",
    codeHeading: "Tu código de verificación de 6 dígitos",
    copyLabel: "Enlace directo (si el botón no se abre)",
    securityLabel: "Aviso de seguridad",
    otpLabel: "Alternativa: código de verificación de 6 dígitos",
    otpHint: "También puedes introducir este código directamente en la página de registro o verificación.",
    defaultDocCode: "BM-CUENTA · SEGURIDAD",
    defaultEyebrow: "Confirmación de Cuenta y Acceso",
  },
  it: {
    headerLine: "BELOWMARK — ACCOUNT E SICUREZZA",
    codeHeading: "Il tuo codice di verifica a 6 cifre",
    copyLabel: "Link diretto (se il pulsante non si apre)",
    securityLabel: "Nota di sicurezza",
    otpLabel: "Alternativa: codice di verifica a 6 cifre",
    otpHint: "Puoi inserire questo codice anche direttamente nella pagina di registrazione o di conferma.",
    defaultDocCode: "BM-PROFILO · SICUREZZA",
    defaultEyebrow: "Conferma Account e Accesso",
  },
  pl: {
    headerLine: "BELOWMARK — KONTO I BEZPIECZEŃSTWO",
    codeHeading: "Twój 6-cyfrowy kod weryfikacyjny",
    copyLabel: "Bezpośredni link (jeśli przycisk nie działa)",
    securityLabel: "Informacja o bezpieczeństwie",
    otpLabel: "Alternatywnie: 6-cyfrowy kod weryfikacyjny",
    otpHint: "Możesz wpisać ten kod bezpośrednio na stronie rejestracji lub potwierdzenia.",
    defaultDocCode: "BM-KONTO · BEZPIECZEŃSTWO",
    defaultEyebrow: "Potwierdzenie Konta i Dostępu",
  },
  cs: {
    headerLine: "BELOWMARK — ÚČET A ZABEZPEČENÍ",
    codeHeading: "Váš 6místný ověřovací kód",
    copyLabel: "Přímý odkaz (pokud tlačítko nefunguje)",
    securityLabel: "Bezpečnostní upozornění",
    otpLabel: "Alternativa: 6místný ověřovací kód",
    otpHint: "Tento kód můžete zadat také přímo na stránce registrace nebo ověření.",
    defaultDocCode: "BM-ÚČET · ZABEZPEČENÍ",
    defaultEyebrow: "Potvrzení Účtu a Přístupu",
  },
  nl: {
    headerLine: "BELOWMARK — ACCOUNT & BEVEILIGING",
    codeHeading: "Uw 6-cijferige verificatiecode",
    copyLabel: "Directe link (als de knop niet opent)",
    securityLabel: "Beveiligingsmelding",
    otpLabel: "Alternatief: 6-cijferige verificatiecode",
    otpHint: "U kunt deze code ook rechtstreeks invoeren op de registratie- of bevestigingspagina.",
    defaultDocCode: "BM-ACCOUNT · BEVEILIGING",
    defaultEyebrow: "Account- & Toegangsbevestiging",
  },
  sv: {
    headerLine: "BELOWMARK — KONTO & SÄKERHET",
    codeHeading: "Din 6-siffriga verifieringskod",
    copyLabel: "Direktlänk (om knappen inte öppnas)",
    securityLabel: "Säkerhetsinformation",
    otpLabel: "Alternativ: 6-siffrig verifieringskod",
    otpHint: "Du kan också ange denna kod direkt på registrerings- eller verifieringssidan.",
    defaultDocCode: "BM-KONTO · SÄKERHET",
    defaultEyebrow: "Konto- & Åtkomstbekräftelse",
  },
};

export function normalizeMailLang(raw?: string | null): LocaleOption {
  const prefix = (raw ?? "de").trim().toLowerCase().slice(0, 2);
  if (
    prefix === "tr" ||
    prefix === "en" ||
    prefix === "fr" ||
    prefix === "es" ||
    prefix === "it" ||
    prefix === "pl" ||
    prefix === "cs" ||
    prefix === "nl" ||
    prefix === "sv"
  ) {
    return prefix;
  }
  return "de";
}

export interface VerifyReminderMailBundle {
  template: IMailTemplate;
  highlights: [string, string, string];
  docCode: string;
  eyebrow: string;
  signature: string;
  footer: string;
}

export function buildVerifyReminderMailBundle(lang: LocaleOption): VerifyReminderMailBundle {
  switch (lang) {
    case "tr":
      return {
        template: {
          Subject: "Kısa hatırlatma: E-postanızı doğrulayın — 1 Ücretsiz Dosya hakkınız hazır (abonelik yok)",
          Preheader: "%100 ücretsiz ve abonelik tuzağı olmadan kendiliğinden sona erer. Yeni 72 saatlik doğrulama bağlantınız hazır.",
          Greeting: "Merhaba,",
          Body: "Kısa süre önce Belowmark'ta ücretsiz hesap oluşturdunuz ancak e-posta doğrulaması henüz tamamlanmadı. Önceki bağlantının süresi dolmuş olabileceği için aşağıda 72 saat geçerli yeni bir 1-tık doğrulama bağlantısı ve taze 6 haneli kod gönderiyoruz. Önemli güvence: Kayıt %100 ücretsizdir ve abonelik tuzağı olmadan kendiliğinden sona erer — kart bilgisi kayıtlı değildir, otomatik çekim veya abonelik yenilemesi kesinlikle yapılmaz.",
          Action: "E-posta adresimi şimdi doğrula",
          Expiry: "Bu tek seferlik hatırlatmadaki yeni bağlantı ve 6 haneli kod 72 saat geçerlidir. Başka hatırlatma e-postası gönderilmeyecektir.",
          Ignore: "Kaydı tamamlamak istemiyorsanız bu e-postayı yok sayabilirsiniz — hiçbir işlem veya iptal gerekmez, hesabınız etkinleştirilmez.",
        },
        highlights: [
          "%100 ücretsiz & abonelik tuzağı yok: Ödeme bilgisi kayıtlı değil, 14 günlük test kendiliğinden sona erer",
          "Yeni 1-tık bağlantı + 6 haneli doğrulama kodu (72 saat boyunca geçerli)",
          "Doğrulama sonrası anında: 1 Ücretsiz Tam İhale Dosyası + ücretsiz arama alarmları aktif",
        ],
        docCode: "BM-HESAP · HATIRLATMA (1/1)",
        eyebrow: "Tek Seferlik Doğrulama Hatırlatması · Abonelik Yok",
        signature: "Emre Ak — Belowmark",
        footer: "Bu e-posta, tamamlanmamış Belowmark hesap kaydınız için gönderilen tek seferlik doğrulama hatırlatmasıdır.",
      };
    case "en":
      return {
        template: {
          Subject: "Quick reminder: Verify your email — your 1 Free Dossier is waiting (no subscription)",
          Preheader: "100% free & ends automatically with zero subscription trap. Fresh 72-hour verification link inside.",
          Greeting: "Hello,",
          Body: "You recently created a free Belowmark account, and only the email confirmation is still open. In case your initial 24-hour link expired, we have generated a fresh 1-click verification link and 6-digit code below (valid for 72 hours). Full peace of mind: Belowmark is 100% free to test and ends automatically without any subscription trap — no payment details are on file, and there is never an automatic charge or renewal.",
          Action: "Verify my email address now",
          Expiry: "This one-time reminder's fresh link and 6-digit code are valid for 72 hours. We will not send any further reminder emails.",
          Ignore: "If you no longer wish to activate your account, simply ignore this message — nothing is activated and no cancellation is needed.",
        },
        highlights: [
          "100% free & no subscription trap: No payment details stored, 14-day test ends automatically at zero cost",
          "Fresh 1-click confirmation link + 6-digit code (valid for 72 hours)",
          "Immediately after confirmation: 1 Free Full Property Dossier + free search alerts unlocked",
        ],
        docCode: "BM-ACCOUNT · REMINDER (1/1)",
        eyebrow: "One-Time Verification Reminder · No Subscription",
        signature: "Emre Ak — Belowmark",
        footer: "This is a one-time confirmation reminder for your pending Belowmark registration.",
      };
    case "fr":
      return {
        template: {
          Subject: "Petit rappel : Confirmez votre e-mail — votre 1 Dossier Gratuit vous attend (sans abonnement)",
          Preheader: "100 % gratuit & prend fin automatiquement sans piège d'abonnement. Nouveau lien valable 72 h.",
          Greeting: "Bonjour,",
          Body: "Vous avez récemment créé un compte gratuit sur Belowmark, mais votre adresse e-mail n'est pas encore confirmée. Si votre premier lien de 24 h a expiré, voici un nouveau lien de confirmation en 1 clic ainsi qu'un nouveau code à 6 chiffres (valables 72 heures). Garantie totale : l'inscription est 100 % gratuite et prend fin automatiquement sans aucun piège d'abonnement — aucune carte bancaire enregistrée, aucun prélèvement automatique.",
          Action: "Confirmer mon adresse e-mail",
          Expiry: "Ce rappel unique contient un nouveau lien et un code valables 72 heures. Aucun autre rappel ne vous sera envoyé.",
          Ignore: "Si vous ne souhaitez plus activer votre compte, ignorez simplement cet e-mail — aucun compte payant n'est ouvert et aucune résiliation n'est nécessaire.",
        },
        highlights: [
          "100 % gratuit & sans piège d'abonnement : aucune carte enregistrée, fin automatique sans frais",
          "Nouveau lien en 1 clic + code à 6 chiffres (valables 72 heures)",
          "Dès confirmation : 1 Dossier Complet Gratuit + alertes d'enchères gratuites activés",
        ],
        docCode: "BM-COMPTE · RAPPEL (1/1)",
        eyebrow: "Rappel Unique de Confirmation · Sans Abonnement",
        signature: "Emre Ak — Belowmark",
        footer: "Cet e-mail est un rappel unique concernant votre inscription en attente sur Belowmark.",
      };
    case "es":
      return {
        template: {
          Subject: "Breve recordatorio: Confirma tu correo — tu 1 Expediente Gratis te espera (sin suscripción)",
          Preheader: "100 % gratis y finaliza automáticamente sin trampa de suscripción. Nuevo enlace válido 72 h.",
          Greeting: "Hola,",
          Body: "Hace poco creaste tu cuenta gratuita en Belowmark y solo falta confirmar tu correo electrónico. Por si tu enlace inicial de 24 h caducó, aquí tienes un nuevo enlace de confirmación en 1 clic y un nuevo código de 6 dígitos (válidos durante 72 horas). Con total tranquilidad: es 100 % gratis y finaliza automáticamente sin trampa de suscripción — sin datos de pago guardados ni cargos automáticos.",
          Action: "Confirmar mi correo ahora",
          Expiry: "El nuevo enlace y código de este recordatorio único son válidos durante 72 horas. No enviaremos más recordatorios.",
          Ignore: "Si ya no deseas activar la cuenta, simplemente ignora este correo — no se activa nada ni hace falta cancelar.",
        },
        highlights: [
          "100 % gratis y sin trampa de suscripción: sin tarjeta registrada, finaliza automáticamente sin costes",
          "Nuevo enlace en 1 clic + código de 6 dígitos (válidos durante 72 horas)",
          "Al confirmar: 1 Expediente Completo Gratis + alertas BOE gratuitas al instante",
        ],
        docCode: "BM-CUENTA · RECORDATORIO (1/1)",
        eyebrow: "Recordatorio Único de Verificación · Sin Suscripción",
        signature: "Emre Ak — Belowmark",
        footer: "Este mensaje es un recordatorio único para completar el registro pendiente en Belowmark.",
      };
    case "it":
      return {
        template: {
          Subject: "Breve promemoria: Conferma la tua e-mail — il tuo 1 Fascicolo Gratis ti aspetta (nessun abbonamento)",
          Preheader: "100% gratuito e termina automaticamente senza trappole di abbonamento. Nuovo link valido 72 ore.",
          Greeting: "Buongiorno,",
          Body: "Di recente hai registrato un account gratuito su Belowmark, ma manca ancora la conferma dell'indirizzo e-mail. Se il primo link da 24 ore è scaduto, trovi qui sotto un nuovo link di conferma in 1 clic e un nuovo codice a 6 cifre (validi per 72 ore). Massima trasparenza: è 100% gratuito e termina automaticamente senza alcuna trappola di abbonamento — nessuna carta salvata e nessun addebito automatico.",
          Action: "Conferma ora la mia e-mail",
          Expiry: "Il nuovo link e il codice di questo promemoria unico sono validi per 72 ore. Non invieremo ulteriori solleciti.",
          Ignore: "Se non desideri più attivare l'account, ignora semplicemente questa e-mail — non verrà attivato nulla e non serve alcuna disdetta.",
        },
        highlights: [
          "100% gratuito e senza trappola di abbonamento: nessuna carta salvata, scadenza automatica senza costi",
          "Nuovo link in 1 clic + codice a 6 cifre (validi per 72 ore)",
          "Subito dopo la conferma: 1 Fascicolo Completo Gratis + avvisi d'asta gratuiti attivi",
        ],
        docCode: "BM-PROFILO · PROMEMORIA (1/1)",
        eyebrow: "Promemoria Unico di Conferma · Nessun Abbonamento",
        signature: "Emre Ak — Belowmark",
        footer: "Questa e-mail è un promemoria unico per completare la registrazione in sospeso su Belowmark.",
      };
    case "pl":
      return {
        template: {
          Subject: "Krótkie przypomnienie: Potwierdź e-mail — Twoje 1 Darmowe Akta czekają (bez subskrypcji)",
          Preheader: "100% za darmo i kończy się automatycznie bez pułapki abonamentowej. Nowy link ważny przez 72 godz.",
          Greeting: "Dzień dobry,",
          Body: "Niedawno utworzyłeś bezpłatne konto w Belowmark, ale brakuje jeszcze potwierdzenia adresu e-mail. Na wypadek wygaśnięcia pierwszego 24-godzinnego linku wygenerowaliśmy poniżej świeży link weryfikacyjny 1-klik oraz nowy 6-cyfrowy kod (ważne przez 72 godziny). Pełne bezpieczeństwo: rejestracja jest w 100% darmowa i kończy się automatycznie bez żadnej pułapki subskrypcyjnej — nie zapisujemy karty płatniczej i nigdy nie pobieramy opłat automatycznie.",
          Action: "Potwierdź mój adres e-mail",
          Expiry: "Nowy link i 6-cyfrowy kod z tego jednorazowego przypomnienia są ważne przez 72 godziny. Nie wyślemy kolejnych wiadomości przypominających.",
          Ignore: "Jeśli nie chcesz już aktywować konta, zignoruj tę wiadomość — nic nie zostanie aktywowane i nie trzeba niczego anulować.",
        },
        highlights: [
          "100% za darmo i bez pułapki subskrypcyjnej: brak danych płatniczych, automatyczny koniec po 14 dniach",
          "Nowy link potwierdzający 1-klik + 6-cyfrowy kod (ważne przez 72 godziny)",
          "Natychmiast po potwierdzeniu: 1 Darmowe Pełne Akta Nieruchomości + bezpłatne alerty licytacji",
        ],
        docCode: "BM-KONTO · PRZYPOMNIENIE (1/1)",
        eyebrow: "Jednorazowe Przypomnienie o Weryfikacji · Bez Subskrypcji",
        signature: "Emre Ak — Belowmark",
        footer: "To jednorazowe przypomnienie dotyczące niepotwierdzonej rejestracji konta w serwisie Belowmark.",
      };
    case "cs":
      return {
        template: {
          Subject: "Krátké připomenutí: Potvrďte e-mail — Váš 1 Bezplatný Spis čeká (bez předplatného)",
          Preheader: "100% zdarma a končí automaticky bez pasti předplatného. Nový ověřovací odkaz platný 72 hodin.",
          Greeting: "Dobrý den,",
          Body: "Nedávno jste si na Belowmark vytvořili bezplatný účet a zbývá už jen potvrdit e-mailovou adresu. Pro případ, že původní 24hodinový odkaz vypršel, posíláme níže nový ověřovací odkaz na 1 kliknutí i čerstvý 6místný kód (platné 72 hodin). Naprostá jistota: vyzkoušení je 100% zdarma a skončí automaticky bez jakékoliv pasti předplatného — nejsou uloženy žádné platební údaje a nikdy nedochází k automatickému stržení.",
          Action: "Potvrdit mou e-mailovou adresu",
          Expiry: "Nový odkaz a 6místný kód v této jednorázové připomínce platí 72 hodin. Další připomínky již zasílat nebudeme.",
          Ignore: "Pokud si účet nepřejete aktivovat, tuto zprávu jednoduše ignorujte — nic se neaktivuje a není třeba nic rušit.",
        },
        highlights: [
          "100% zdarma a bez pasti předplatného: žádné platební údaje, 14denní test skončí automaticky zdarma",
          "Čerstvý odkaz na 1 kliknutí + 6místný ověřovací kód (platné 72 hodin)",
          "Ihned po potvrzení: 1 Bezplatný Kompletní Spis + bezplatní hlídací psi dražeb",
        ],
        docCode: "BM-ÚČET · PŘIPOMÍNKA (1/1)",
        eyebrow: "Jednorázová Připomínka Ověření · Bez Předplatného",
        signature: "Emre Ak — Belowmark",
        footer: "Toto je jednorázové připomenutí nedokončené registrace účtu na portálu Belowmark.",
      };
    case "nl":
      return {
        template: {
          Subject: "Korte herinnering: Bevestig uw e-mail — uw 1 Gratis Dossier staat klaar (geen abonnement)",
          Preheader: "100% gratis & eindigt automatisch zonder abonnementsval. Nieuwe verificatielink (72 uur geldig).",
          Greeting: "Goedendag,",
          Body: "U heeft onlangs een gratis Belowmark-account aangemaakt, maar alleen de e-mailbevestiging staat nog open. Voor het geval uw eerste 24-uurslink is verlopen, vindt u hieronder een nieuwe 1-klik-bevestigingslink en een verse 6-cijferige code (72 uur geldig). Volledige zekerheid: testen is 100% gratis en stopt automatisch zonder abonnementsval — er zijn geen betaalgegevens opgeslagen en er vindt nooit een automatische incasso plaats.",
          Action: "Mijn e-mailadres nu bevestigen",
          Expiry: "De nieuwe link en 6-cijferige code in deze eenmalige herinnering zijn 72 uur geldig. Wij sturen geen verdere herinneringen.",
          Ignore: "Wilt u uw account niet meer activeren, negeer dit bericht dan gerust — er wordt niets geactiveerd en opzeggen is niet nodig.",
        },
        highlights: [
          "100% gratis & geen abonnementsval: geen betaalgegevens geregistreerd, stopt automatisch zonder kosten",
          "Nieuwe 1-klik-bevestigingslink + 6-cijferige code (72 uur geldig)",
          "Direct na bevestiging: 1 Gratis Volledig Dossier + gratis zoekalerts geactiveerd",
        ],
        docCode: "BM-ACCOUNT · HERINNERING (1/1)",
        eyebrow: "Eenmalige Verificatieherinnering · Geen Abonnement",
        signature: "Emre Ak — Belowmark",
        footer: "Dit is een eenmalige bevestigingsherinnering voor uw openstaande registratie op Belowmark.",
      };
    case "sv":
      return {
        template: {
          Subject: "Kort påminnelse: Bekräfta din e-post — din 1 Kostnadsfria Akt väntar (ingen prenumeration)",
          Preheader: "100 % gratis & avslutas automatiskt utan prenumerationsfälla. Ny 72-timmars verifieringslänk.",
          Greeting: "Hej,",
          Body: "Du skapade nyligen ett kostnadsfritt konto på Belowmark och bara e-postbekräftelsen återstår. Om din första 24-timmarslänk har hunnit gå ut får du här en ny 1-klickslänk samt en ny 6-siffrig kod (giltiga i 72 timmar). Full trygghet: testet är 100 % gratis och avslutas automatiskt utan prenumerationsfälla — inga kortuppgifter sparas och ingen automatisk debitering sker någonsin.",
          Action: "Bekräfta min e-postadress nu",
          Expiry: "Den nya länken och 6-siffriga koden i denna engångspåminnelse gäller i 72 timmar. Vi skickar inga fler påminnelsemejl.",
          Ignore: "Om du inte längre vill aktivera kontot kan du bara ignorera detta mejl — ingenting aktiveras och ingen uppsägning behövs.",
        },
        highlights: [
          "100 % gratis & ingen prenumerationsfälla: inga betalningsuppgifter sparade, avslutas automatiskt utan kostnad",
          "Ny 1-klickslänk + 6-siffrig verifieringskod (giltiga i 72 timmar)",
          "Direkt efter bekräftelse: 1 Kostnadsfri Komplett Fastighetsakt + gratis sökbevakningar",
        ],
        docCode: "BM-KONTO · PÅMINNELSE (1/1)",
        eyebrow: "Engångspåminnelse om Verifiering · Ingen Prenumeration",
        signature: "Emre Ak — Belowmark",
        footer: "Detta är en engångspåminnelse för din väntande kontoregistrering på Belowmark.",
      };
    default:
      return {
        template: {
          Subject: "Kurze Erinnerung: E-Mail bestätigen — Ihr 1 Gratis-Dossier wartet (kein Abo)",
          Preheader: "100 % kostenlos & endet automatisch ohne Abo-Falle. Frischer Bestätigungslink (72 Std. gültig).",
          Greeting: "Guten Tag,",
          Body: "Sie haben sich vor Kurzem kostenlos bei Belowmark registriert — es fehlt nur noch der letzte Klick zur Bestätigung Ihrer E-Mail-Adresse. Falls Ihr erster 24-Stunden-Link bereits abgelaufen ist, erhalten Sie hier einen frischen 1-Klick-Bestätigungslink sowie einen neuen 6-stelligen Code (72 Stunden gültig). Wichtig zur Sicherheit: Ihr Testzugang ist 100 % kostenlos und endet automatisch ohne Abo-Falle — es sind keine Zahlungsdaten hinterlegt und es erfolgt niemals eine automatische Abbuchung oder Verlängerung.",
          Action: "E-Mail-Adresse jetzt bestätigen",
          Expiry: "Dies ist eine einmalige Erinnerung — der neue Link und der 6-stellige Code sind 72 Stunden gültig. Sie erhalten keine weiteren Erinnerungs-Mails.",
          Ignore: "Falls Sie Ihr Konto doch nicht aktivieren möchten, ignorieren Sie diese Nachricht einfach — es entsteht kein Vertrag und es ist keinerlei Kündigung nötig.",
        },
        highlights: [
          "100 % kostenlos & endet automatisch ohne Abo-Falle: Keine Zahlungsdaten, keine Abbuchung",
          "Frischer 1-Klick-Bestätigungslink + 6-stelliger Sicherheitscode (72 Stunden gültig)",
          "Sofort nach Bestätigung: 1 vollständiges Gratis-Dossier + kostenlose Such-Alerts frei",
        ],
        docCode: "BM-KONTO · ERINNERUNG (1/1)",
        eyebrow: "Einmalige Bestätigungs-Erinnerung · Kein Abo",
        signature: "Emre Ak — Belowmark",
        footer: "Sie erhalten diese einmalige Nachricht, weil für diese E-Mail-Adresse eine noch unbestätigte Registrierung auf Belowmark vorliegt.",
      };
  }
}
