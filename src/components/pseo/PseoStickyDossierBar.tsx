import Link from "next/link";
import { PseoLocale } from "@/types/pseo.types";

interface PseoStickyDossierBarProps {
  locale: PseoLocale;
  locationName: string;
  totalCount: number;
  targetHref: string;
}

const COPY: Record<
  PseoLocale,
  { badge: string; text: (loc: string, count: number) => string; cta: string }
> = {
  de: {
    badge: "1 GRATIS-DOSSIER",
    text: (loc, count) => `${count} aktive Verfahren (${loc}) — 1 Wunschobjekt inkl. Adresse, Aktenzeichen & Gutachten kostenlos öffnen`,
    cta: "1 Gratis-Dossier einlösen →",
  },
  tr: {
    badge: "1 ÜCRETSİZ DOSYA",
    text: (loc, count) => `${loc} için ${count} aktif ihale — açık adres, esas no ve bilirkişi özetini 1 tıkla ücretsiz açın`,
    cta: "Ücretsiz Dosyayı Aç →",
  },
  en: {
    badge: "1 FREE DOSSIER",
    text: (loc, count) => `${count} active lots (${loc}) — unlock 1 full property dossier with address & legal pack for free`,
    cta: "Claim 1 Free Dossier →",
  },
  it: {
    badge: "1 FASCICOLO GRATIS",
    text: (loc, count) => `${count} aste attive (${loc}) — sblocca gratis 1 fascicolo completo con indirizzo, R.G.E. e perizia CTU`,
    cta: "Sblocca 1 Fascicolo Gratis →",
  },
  es: {
    badge: "1 EXPEDIENTE GRATIS",
    text: (loc, count) => `${count} subastas BOE activas (${loc}) — desbloquea gratis 1 expediente con dirección, cargas y edicto`,
    cta: "Abrir 1 Expediente Gratis →",
  },
  fr: {
    badge: "1 DOSSIER GRATUIT",
    text: (loc, count) => `${count} enchères actives (${loc}) — débloquez gratuitement 1 dossier complet avec adresse et cahier TJ`,
    cta: "Débloquer 1 Dossier Gratuit →",
  },
};

export default function PseoStickyDossierBar({
  locale,
  locationName,
  totalCount,
  targetHref,
}: PseoStickyDossierBarProps) {
  const c = COPY[locale];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-paper-bright/95 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-stretch justify-between gap-2.5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5 text-xs text-ink sm:text-sm">
          <span className="shrink-0 bg-verdict px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-paper-bright">
            🎁 {c.badge}
          </span>
          <span className="line-clamp-1 font-medium">{c.text(locationName, totalCount)}</span>
        </div>
        <Link
          href={targetHref}
          className="inline-flex shrink-0 items-center justify-center border-2 border-ink bg-signal px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-paper-bright shadow-[2px_2px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5"
        >
          {c.cta}
        </Link>
      </div>
    </div>
  );
}
