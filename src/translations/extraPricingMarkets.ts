import type { LocaleOption } from "@/lib/constants";
import type { IMarketPlans } from "./ITranslation";

interface ExtraCountryCopy {
  nlLabel: string;
  nlScope: string;
  plLabel: string;
  plScope: string;
  freeTag: string;
  forever: string;
  freeCta: string;
  freeNote: string;
  perMonth: string;
  forThreeMonths: string;
  invCta: string;
  proCta: string;
  cancelMonthly: string;
}

const COPY: Record<LocaleOption, ExtraCountryCopy> = {
  de: {
    nlLabel: "Niederlande",
    nlScope: "Executieveilingen · 12 Provinzen",
    plLabel: "Polen",
    plScope: "Licytacje Komornicze · 16 Woiwodschaften",
    freeTag: "Für die erste Orientierung.",
    forever: "dauerhaft",
    freeCta: "Kostenlos starten",
    freeNote: "Vollzugang jederzeit im Dashboard zubuchbar.",
    perMonth: "im Monat",
    forThreeMonths: "für drei Monate",
    invCta: "Investor werden",
    proCta: "Pro buchen",
    cancelMonthly: "Monatlich kündbar.",
  },
  en: {
    nlLabel: "Netherlands",
    nlScope: "Executieveilingen · 12 Provinces",
    plLabel: "Poland",
    plScope: "Licytacje Komornicze · 16 Voivodeships",
    freeTag: "For initial orientation.",
    forever: "forever",
    freeCta: "Start for free",
    freeNote: "Upgrade to full access anytime in the dashboard.",
    perMonth: "per month",
    forThreeMonths: "for three months",
    invCta: "Become an Investor",
    proCta: "Book Pro",
    cancelMonthly: "Cancel monthly.",
  },
  fr: {
    nlLabel: "Pays-Bas",
    nlScope: "Executieveilingen · 12 Provinces",
    plLabel: "Pologne",
    plScope: "Licytacje Komornicze · 16 Voïvodies",
    freeTag: "Pour une première orientation.",
    forever: "permanent",
    freeCta: "Commencer gratuitement",
    freeNote: "Accès complet activable à tout moment.",
    perMonth: "par mois",
    forThreeMonths: "pour trois mois",
    invCta: "Devenir Investor",
    proCta: "Souscrire à Pro",
    cancelMonthly: "Résiliable mensuellement.",
  },
  es: {
    nlLabel: "Países Bajos",
    nlScope: "Executieveilingen · 12 Provincias",
    plLabel: "Polonia",
    plScope: "Licytacje Komornicze · 16 Voivodatos",
    freeTag: "Para una primera orientación.",
    forever: "para siempre",
    freeCta: "Empezar gratis",
    freeNote: "Acceso completo disponible en cualquier momento.",
    perMonth: "al mes",
    forThreeMonths: "por tres meses",
    invCta: "Hacerse Investor",
    proCta: "Contratar Pro",
    cancelMonthly: "Cancelable mes a mes.",
  },
  it: {
    nlLabel: "Paesi Bassi",
    nlScope: "Executieveilingen · 12 Province",
    plLabel: "Polonia",
    plScope: "Licytacje Komornicze · 16 Voivodati",
    freeTag: "Per un primo orientamento.",
    forever: "per sempre",
    freeCta: "Inizia gratis",
    freeNote: "Accesso completo attivabile in qualsiasi momento.",
    perMonth: "al mese",
    forThreeMonths: "per tre mesi",
    invCta: "Diventa Investor",
    proCta: "Attiva Pro",
    cancelMonthly: "Disdicibile mensilmente.",
  },
  tr: {
    nlLabel: "Hollanda",
    nlScope: "Executieveilingen · 12 Eyalet",
    plLabel: "Polonya",
    plScope: "Licytacje Komornicze · 16 Voyvodalık",
    freeTag: "İlk inceleme için.",
    forever: "süresiz",
    freeCta: "Ücretsiz başla",
    freeNote: "Tam erişim panelden her zaman açılabilir.",
    perMonth: "aylık",
    forThreeMonths: "üç aylık",
    invCta: "Investor ol",
    proCta: "Pro satın al",
    cancelMonthly: "Aylık iptal edilebilir.",
  },
};

function buildExtra(c: ExtraCountryCopy): { NL: IMarketPlans; PL: IMarketPlans } {
  return {
    NL: {
      Label: c.nlLabel,
      Scope: c.nlScope,
      Free: {
        Name: "Free Scout",
        Tagline: c.freeTag,
        Price: "0 €",
        Period: c.forever,
        Features: [
          "Executieveilingen across all 12 Dutch provinces (Amsterdam, Rotterdam, Utrecht)",
          "1 Free Dossier included · exact street & auction values locked afterwards",
          "No payment details required, no auto-renewal",
        ],
        Cta: c.freeCta,
        Note: c.freeNote,
      },
      Investor: {
        Name: "Investor",
        Tagline: "Full access to Dutch notarial executieveilingen (Art. 3:268 BW) & Kadaster data.",
        Price: "39 €",
        Period: c.perMonth,
        AltPrice: "99 €",
        AltPeriod: c.forThreeMonths,
        Features: [
          "Full access to all Dutch executieveilingen, Bijzondere Veilingvoorwaarden & Kadaster",
          "Inzet & Afslag calculator, 10% waarborgsom & overdrachtsbelasting (2% / 10.4%)",
          "Email search alerts, auction calendar feed & portfolio tracking",
        ],
        Cta: c.invCta,
        Note: c.cancelMonthly,
      },
      Pro: {
        Name: "Pro",
        Tagline: "For property investors, brokers & shared team underwriting.",
        Price: "129 €",
        Period: c.perMonth,
        AltPrice: "329 €",
        AltPeriod: c.forThreeMonths,
        Features: [
          "Everything in Investor included",
          "White-label client dossiers & PDF reports with custom branding",
          "Shared team watchlists (up to 3 teams of 5 seats) with workflow notes",
        ],
        Cta: c.proCta,
        Note: c.cancelMonthly,
      },
    },
    PL: {
      Label: c.plLabel,
      Scope: c.plScope,
      Free: {
        Name: "Free Scout",
        Tagline: c.freeTag,
        Price: "0 zł",
        Period: c.forever,
        Features: [
          "3,000+ official Polish bailiff auctions (KRK) across all 16 Voivodeships",
          "1 Free Dossier included · exact address & case file Km locked afterwards",
          "No payment details required, no auto-renewal",
        ],
        Cta: c.freeCta,
        Note: c.freeNote,
      },
      Investor: {
        Name: "Investor",
        Tagline: "Full access to official Polish bailiff real estate e-auctions (KRK · 3/4 & 2/3 KPC).",
        Price: "129 zł",
        Period: c.perMonth,
        AltPrice: "329 zł",
        AltPeriod: c.forThreeMonths,
        Features: [
          "Full access to 3,000+ Polish bailiff auctions, Suma oszacowania & Cena wywołania",
          "3/4 (1st round) & 2/3 (2nd round) KPC calculator, 10% rękojmia & 2% PCC tax",
          "Daily email alerts, e-licytacje deadline reminders & calendar sync",
        ],
        Cta: c.invCta,
        Note: c.cancelMonthly,
      },
      Pro: {
        Name: "Pro",
        Tagline: "For investment funds, sourcing agencies & team underwriting.",
        Price: "399 zł",
        Period: c.perMonth,
        AltPrice: "990 zł",
        AltPeriod: c.forThreeMonths,
        Features: [
          "Everything in Investor included",
          "White-label client links & branded PDF investment memos",
          "Shared team watchlists (up to 3 teams of 5 seats) with deal workflow",
        ],
        Cta: c.proCta,
        Note: c.cancelMonthly,
      },
    },
  };
}

export const EXTRA_PRICING_MARKETS: Record<LocaleOption, { NL: IMarketPlans; PL: IMarketPlans }> = {
  de: buildExtra(COPY.de),
  en: buildExtra(COPY.en),
  fr: buildExtra(COPY.fr),
  es: buildExtra(COPY.es),
  it: buildExtra(COPY.it),
  tr: buildExtra(COPY.tr),
};
