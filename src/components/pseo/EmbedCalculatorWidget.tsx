// Interactive multi-country foreclosure & court auction calculator for third-party iframe embeds
"use client";

import { useState } from "react";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";
import { PricingCountryCode } from "@/lib/constants";

interface EmbedCalculatorWidgetProps {
  initialCountry: PricingCountryCode;
}

interface CountryCalcSpec {
  flag: string;
  label: string;
  currency: "EUR" | "CHF" | "GBP" | "TRY";
  locale: string;
  defaultVal: number;
  minRatio: number;
  safeRatio: number;
  depRatio: number;
  taxPct: number;
  minLabel: string;
  safeLabel: string;
  depLabel: string;
  hubPath: string;
}

const SPECS: Record<PricingCountryCode, CountryCalcSpec> = {
  DE: { flag: "🇩🇪", label: "DE · ZVG (§§ 74a/85a)", currency: "EUR", locale: "de-DE", defaultVal: 320000, minRatio: 0.5, safeRatio: 0.7, depRatio: 0.1, taxPct: 5.0, minLabel: "5/10-Grenze (§ 85a ZVG)", safeLabel: "7/10-Grenze (§ 74a ZVG)", depLabel: "10 % Sicherheit (§ 68 ZVG)", hubPath: "/zwangsversteigerungen" },
  AT: { flag: "🇦🇹", label: "AT · Ediktsdatei (§ 151 EO)", currency: "EUR", locale: "de-AT", defaultVal: 340000, minRatio: 0.5, safeRatio: 0.75, depRatio: 0.1, taxPct: 4.6, minLabel: "Geringstes Gebot (50 %)", safeLabel: "3/4-Schwelle (75 %)", depLabel: "10 % Vadium", hubPath: "/oesterreich/ediktsdatei" },
  CH: { flag: "🇨🇭", label: "CH · SchKG Steigerung", currency: "CHF", locale: "de-CH", defaultVal: 780000, minRatio: 0.65, safeRatio: 0.8, depRatio: 0.1, taxPct: 2.2, minLabel: "Richtwert 2. Steigerung", safeLabel: "Konservatives Gebotsziel", depLabel: "10 % Anzahlung", hubPath: "/schweiz/shab-versteigerungen" },
  TR: { flag: "🇹🇷", label: "TR · UYAP E-İhale", currency: "TRY", locale: "tr-TR", defaultVal: 4500000, minRatio: 0.5, safeRatio: 0.7, depRatio: 0.1, taxPct: 4.0, minLabel: "%50 Artırma Alt Sınırı", safeLabel: "%70 Güvenli Teklif", depLabel: "%10 Elektronik Teminat", hubPath: "/tr/icra-ihale" },
  IT: { flag: "🇮🇹", label: "IT · Aste PVP (75 %)", currency: "EUR", locale: "it-IT", defaultVal: 220000, minRatio: 0.75, safeRatio: 0.9, depRatio: 0.1, taxPct: 9.0, minLabel: "Offerta Minima (75 %)", safeLabel: "Prezzo Base / Target", depLabel: "10 % Cauzione", hubPath: "/it/aste-giudiziarie" },
  ES: { flag: "🇪🇸", label: "ES · Subastas BOE", currency: "EUR", locale: "es-ES", defaultVal: 240000, minRatio: 0.5, safeRatio: 0.7, depRatio: 0.05, taxPct: 8.0, minLabel: "50 % Mínimo (Art. 670 LEC)", safeLabel: "70 % Firme Directo", depLabel: "5 % Depósito BOE", hubPath: "/es/subastas-boe" },
  FR: { flag: "🇫🇷", label: "FR · Enchères TJ / Licitor", currency: "EUR", locale: "fr-FR", defaultVal: 260000, minRatio: 0.45, safeRatio: 0.7, depRatio: 0.1, taxPct: 7.5, minLabel: "Mise à prix indicative", safeLabel: "Budget enchère cible", depLabel: "10 % Chèque CARPA", hubPath: "/fr/encheres-immobilieres" },
  GB: { flag: "🇬🇧", label: "GB · UK Property Auctions", currency: "GBP", locale: "en-GB", defaultVal: 250000, minRatio: 0.85, safeRatio: 0.95, depRatio: 0.1, taxPct: 5.0, minLabel: "Guide Price (85 %)", safeLabel: "Est. Reserve Target", depLabel: "10 % Exchange Deposit", hubPath: "/en/uk-property-auctions" },
};

export default function EmbedCalculatorWidget({ initialCountry }: EmbedCalculatorWidgetProps) {
  const [country, setCountry] = useState<PricingCountryCode>(initialCountry);
  const spec = SPECS[country];
  const [value, setValue] = useState<number>(spec.defaultVal);
  const [taxPct, setTaxPct] = useState<number>(spec.taxPct);

  const switchCountry = (next: PricingCountryCode) => {
    setCountry(next);
    setValue(SPECS[next].defaultVal);
    setTaxPct(SPECS[next].taxPct);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat(spec.locale, { style: "currency", currency: spec.currency, maximumFractionDigits: 0 }).format(Math.round(n));

  const minBid = value * spec.minRatio;
  const safeBid = value * spec.safeRatio;
  const deposit = value * spec.depRatio;
  const totalWithTax = safeBid * (1 + taxPct / 100);

  return (
    <div className="border-2 border-ink bg-paper-bright p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-3">
        <div>
          <span className="bg-signal px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-paper-bright">
            BELOWMARK GEBOTS- & WERTGRENZEN-RECHNER
          </span>
          <h1 className="mt-1 font-display text-lg text-ink sm:text-xl">{spec.flag} {spec.label}</h1>
        </div>
        <select
          aria-label="Land wählen"
          value={country}
          onChange={(e) => switchCountry(e.target.value as PricingCountryCode)}
          className="h-9 border-2 border-ink bg-paper px-2.5 font-mono text-xs font-semibold text-ink"
        >
          {(Object.keys(SPECS) as PricingCountryCode[]).map((c) => (
            <option key={c} value={c}>{SPECS[c].flag} {SPECS[c].label}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink">
              Verkehrswert / Gutachtenwert ({spec.currency})
            </label>
            <input
              type="number"
              min={5000}
              step={5000}
              value={value}
              onChange={(e) => setValue(Math.max(0, Number(e.target.value) || 0))}
              className="mt-1 h-10 w-full border-2 border-ink bg-paper px-3 font-mono text-sm font-bold text-ink"
            />
          </div>
          <div>
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink">
              Erwerbsteuer & Nebenkosten (%)
            </label>
            <input
              type="number"
              min={0}
              max={25}
              step={0.5}
              value={taxPct}
              onChange={(e) => setTaxPct(Math.max(0, Number(e.target.value) || 0))}
              className="mt-1 h-10 w-full border-2 border-ink bg-paper px-3 font-mono text-sm font-bold text-ink"
            />
          </div>
        </div>

        <div className="space-y-2 border-2 border-ink bg-paper-deep p-3.5 font-mono text-xs">
          <div className="flex justify-between border-b border-rule pb-1.5">
            <span className="text-ink-soft">{spec.depLabel}</span>
            <span className="font-bold text-ink">{fmt(deposit)}</span>
          </div>
          <div className="flex justify-between border-b border-rule pb-1.5">
            <span className="text-ink-soft">{spec.minLabel}</span>
            <span className="font-bold text-signal">{fmt(minBid)}</span>
          </div>
          <div className="flex justify-between border-b border-rule pb-1.5">
            <span className="text-ink-soft">{spec.safeLabel}</span>
            <span className="font-bold text-ink">{fmt(safeBid)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Kapitalbedarf inkl. {taxPct} % NK</span>
            <span className="font-bold text-ink">{fmt(totalWithTax)}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-2.5 font-mono text-[11px]">
        <a href={`${BELOWMARK_ORIGIN}/atlas`} target="_blank" rel="noopener" className="text-ink-soft underline hover:text-ink">
          Quelle: Belowmark Marktatlas (8 Länder)
        </a>
        <a
          href={`${BELOWMARK_ORIGIN}${spec.hubPath}`}
          target="_blank"
          rel="noopener"
          className="bg-signal px-3 py-1 font-semibold uppercase tracking-wider text-paper-bright hover:bg-signal-deep"
        >
          Aktive Auktionen prüfen →
        </a>
      </div>
    </div>
  );
}
