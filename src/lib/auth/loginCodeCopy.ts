export interface LoginCodeCopyEntry {
  toggle: string;
  hide: string;
  send: string;
  sending: string;
  sentHint: string;
  enterAboveHint: string;
}

export const LOGIN_CODE_COPY = {
  de: {
    toggle: "Ohne Passwort anmelden (6-Stellen-Code per E-Mail) →",
    hide: "Zurück zur Passwort-Anmeldung",
    send: "6-Stellen-Code an E-Mail senden",
    sending: "Code wird gesendet …",
    sentHint: "Falls ein Konto existiert, wurde ein 6-stelliger Zugangs-Code gesendet:",
    enterAboveHint: "Bitte oben unter 01 Ihre E-Mail-Adresse eintragen.",
  },
  tr: {
    toggle: "Şifresiz giriş yap (E-posta ile 6 haneli kod) →",
    hide: "Şifre ile girişe dön",
    send: "6 Haneli Giriş Kodu Gönder",
    sending: "Kod gönderiliyor …",
    sentHint: "Hesap mevcutsa 6 haneli giriş kodu e-posta adresinize gönderildi:",
    enterAboveHint: "Lütfen yukarıdaki 01 E-posta Adresi alanını doldurun.",
  },
  en: {
    toggle: "Sign in without password (6-digit email code) →",
    hide: "Back to password sign-in",
    send: "Send 6-digit login code",
    sending: "Sending code …",
    sentHint: "If an account exists, we sent a 6-digit sign-in code to your email:",
    enterAboveHint: "Please enter your email address in field 01 above.",
  },
  fr: {
    toggle: "Connexion sans mot de passe (code à 6 chiffres) →",
    hide: "Retour au mot de passe",
    send: "Envoyer le code à 6 chiffres",
    sending: "Envoi en cours …",
    sentHint: "Si un compte existe, un code à 6 chiffres vient d'être envoyé :",
    enterAboveHint: "Veuillez saisir votre adresse e-mail dans le champ 01 ci-dessus.",
  },
  es: {
    toggle: "Entrar sin contraseña (código de 6 dígitos) →",
    hide: "Volver a contraseña",
    send: "Enviar código de 6 dígitos",
    sending: "Enviando código …",
    sentHint: "Si existe una cuenta, hemos enviado un código de 6 dígitos a tu correo:",
    enterAboveHint: "Introduce tu correo electrónico en el campo 01 de arriba.",
  },
  it: {
    toggle: "Accedi senza password (codice a 6 cifre) →",
    hide: "Torna alla password",
    send: "Invia codice a 6 cifre",
    sending: "Invio in corso …",
    sentHint: "Se esiste un account, abbiamo inviato un codice a 6 cifre via e-mail:",
    enterAboveHint: "Inserisci il tuo indirizzo e-mail nel campo 01 qui sopra.",
  },
} as const satisfies Record<string, LoginCodeCopyEntry>;

export function detectLoginCodeLang(emailLabel: string): keyof typeof LOGIN_CODE_COPY {
  const low = emailLabel.toLowerCase();
  if (low.includes("posta")) return "tr";
  if (low.includes("correo")) return "es";
  if (low.includes("indirizzo")) return "it";
  if (low.includes("adresse e-mail") || low.includes("courriel")) return "fr";
  if (low.includes("email address") || low.includes("e-mail address")) return "en";
  return "de";
}
