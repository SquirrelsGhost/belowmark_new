// Needs useState and navigator.clipboard for country embed customization & 1-click snippet copy
"use client";

import { useState } from "react";
import { BELOWMARK_ORIGIN } from "@/lib/blog/blogSeo";
import { PRICING_COUNTRIES, PricingCountryCode } from "@/lib/constants";

const HUB_BY_COUNTRY: Record<PricingCountryCode, { label: string; path: string }> = {
  DE: { label: "🇩🇪 Deutschland (ZVG 5/10 & 7/10)", path: "/zwangsversteigerungen" },
  AT: { label: "🇦🇹 Österreich (Ediktsdatei)", path: "/oesterreich/ediktsdatei" },
  CH: { label: "🇨🇭 Schweiz (SHAB SchKG)", path: "/schweiz/shab-versteigerungen" },
  TR: { label: "🇹🇷 Türkei (UYAP E-İhale)", path: "/tr/icra-ihale" },
  IT: { label: "🇮🇹 Italien (Aste PVP)", path: "/it/aste-giudiziarie" },
  ES: { label: "🇪🇸 Spanien (Subastas BOE)", path: "/es/subastas-boe" },
  FR: { label: "🇫🇷 Frankreich (Enchères TJ)", path: "/fr/encheres-immobilieres" },
  GB: { label: "🇬🇧 Großbritannien (UK Auctions)", path: "/en/uk-property-auctions" },
};

export default function AtlasEmbedBox() {
  const [country, setCountry] = useState<PricingCountryCode>("DE");
  const [copied, setCopied] = useState(false);

  const hub = HUB_BY_COUNTRY[country];
  const iframeSrc = `${BELOWMARK_ORIGIN}/embed/rechner?country=${country}`;
  const snippet = `<iframe src="${iframeSrc}" width="100%" height="360" style="border:0;overflow:hidden;" loading="lazy" title="Belowmark Gebots- & Wertgrenzen-Rechner (${country})"></iframe>\n<p style="font-size:12px;margin-top:6px;">Quelle: <a href="${BELOWMARK_ORIGIN}/atlas">Belowmark Zwangsversteigerungs-Atlas</a> · <a href="${BELOWMARK_ORIGIN}${hub.path}">Aktive Auktionen (${country})</a></p>`;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="border-2 border-ink bg-paper-bright p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-2xl text-ink">Für Presse, Blogs & Finanzierungsberater</h2>
        <a
          href="/api/public/atlas"
          target="_blank"
          rel="noopener"
          className="border border-ink bg-paper px-2.5 py-1 font-mono text-[11px] font-semibold text-ink hover:bg-ink hover:text-paper-bright"
        >
          Live-JSON-API öffnen →
        </a>
      </div>
      <p className="mt-2 font-serif text-sm leading-relaxed text-ink-soft">
        Alle Kennzahlen dürfen unter Quellenangabe kostenfrei zitiert werden. Betten Sie unseren werbefreien Gebots- & Wertgrenzen-Rechner mit 1 Klick auf Ihrer Website ein:
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select
          aria-label="Rechner-Land für Embed wählen"
          value={country}
          onChange={(e) => setCountry(e.target.value as PricingCountryCode)}
          className="h-9 border-2 border-ink bg-paper px-2.5 font-mono text-xs font-semibold text-ink"
        >
          {PRICING_COUNTRIES.map((c) => (
            <option key={c} value={c}>{HUB_BY_COUNTRY[c].label}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={copyCode}
          className="h-9 cursor-pointer border-2 border-signal bg-signal px-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-paper-bright hover:bg-signal-deep"
        >
          {copied ? "✓ Embed-Code kopiert" : "Embed-Code kopieren"}
        </button>
      </div>

      <pre className="mt-3 overflow-x-auto border border-rule-strong bg-paper p-3 font-mono text-[11px] text-ink">
        {snippet}
      </pre>
    </div>
  );
}
