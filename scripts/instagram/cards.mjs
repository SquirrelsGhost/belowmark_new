// ---------------------------------------------------------------------------
// Die drei Bildtypen: Objekt des Tages, Zahl des Tages, Wissen.
// Jede Funktion gibt den Inhalt für Frame() zurück (brand.mjs).
// ---------------------------------------------------------------------------

import { C, F, el, mono, upper, MarketLine } from "./brand.mjs";
import { T, money, number, dateLong, dateShort, time } from "./texts.mjs";
import { placeLine } from "./data.mjs";

function FactRow(label, value, { strong = false, compact = false, color = C.ink } = {}) {
  return el(
    { justifyContent: "space-between", alignItems: "baseline", gap: 20, paddingTop: compact ? 8 : 11, paddingBottom: compact ? 8 : 11, borderBottom: `1px solid ${C.rule}` },
    el({ fontSize: compact ? 25 : 27, color: C.inkSoft, fontWeight: strong ? 600 : 400 }, label),
    el({ fontFamily: F.mono, fontSize: compact ? 26 : 28, color, fontWeight: strong ? 600 : 400 }, value)
  );
}

/** Kasten im Stil des Gebotsrechners: Tintenkopf, Papierfläche, harter Schatten. */
function Panel(title, ...rows) {
  return el(
    { flexDirection: "column", border: `3px solid ${C.ink}`, background: C.paperBright, boxShadow: `12px 12px 0 ${C.ink}` },
    el({ background: C.ink, color: C.paperBright, padding: "16px 26px", fontFamily: F.display, fontSize: 34, letterSpacing: 2 }, title),
    el({ flexDirection: "column", padding: "8px 26px 14px" }, rows)
  );
}

function cleanDeKind(raw, fallback) {
  if (!raw) return fallback;
  return (
    String(raw)
      .replace(/^\s*(?:[A-ZÄÖÜ]{1,4}\s+)?\d+\s*K\s*[\d/-]+(?:\s*\(\d+\))?\s*:\s*/iu, "")
      .split(/[,(;:]/)[0]
      .trim() || fallback
  );
}

function Headline({ size, lang, kicker, title, place }) {
  const titleLen = String(title ?? "").length;
  const placeLen = String(place ?? "").length;
  const baseTitle = titleLen > 18 ? 96 : titleLen > 14 ? 108 : 120;
  const big = Math.round(baseTitle * size.scale);
  const placeSize = Math.round((placeLen > 24 ? baseTitle * 0.5 : baseTitle * 0.58) * size.scale);
  return el(
    { flexDirection: "column" },
    mono(upper(kicker, lang), { fontSize: 21, letterSpacing: 2, marginBottom: 12 }),
    el({ fontFamily: F.display, fontSize: big, lineHeight: 0.92, letterSpacing: -1, paddingTop: 8 }, upper(title, lang)),
    el({ fontFamily: F.display, fontSize: placeSize, lineHeight: 1, color: C.inkSoft, marginTop: 8, marginBottom: 22 }, upper(place, lang))
  );
}

function ValueBelowLine({ size, label, value }) {
  return el(
    { flexDirection: "column" },
    MarketLine({ size, label: null }),
    el(
      { justifyContent: "space-between", alignItems: "baseline", gap: 24, marginTop: 14, marginBottom: 26 },
      el({ fontFamily: F.serif, fontStyle: "italic", fontSize: 36, color: C.inkSoft }, label),
      el({ fontFamily: F.display, fontSize: Math.round(84 * size.scale), letterSpacing: 1 }, value)
    )
  );
}

/**
 * Der Preis, der fängt: DE die 5/10-Grenze (darunter kein Zuschlag im ersten Termin),
 * TR das Startgebot aus dem Aushang — jeweils mit Abstand zum amtlichen Wert.
 */
function PriceHero({ size, lang, label, price, pct, sub }) {
  // Lange Beträge (TL) kleiner setzen, damit Preis und Abschlag in eine Zeile passen
  const priceSize = Math.round(Math.min(138 * size.scale, 700 / (price.length * 0.47)));
  return el(
    { flexDirection: "column" },
    MarketLine({ size, label: null }),
    el({ fontFamily: F.serif, fontStyle: "italic", fontSize: 36, color: C.inkSoft, marginTop: 14 }, label),
    el(
      { justifyContent: "space-between", alignItems: "center", gap: 24 },
      el({ fontFamily: F.display, fontSize: priceSize, lineHeight: 1, color: C.signal, paddingTop: 8 }, price),
      pct > 0
        ? el(
            { flexShrink: 0, background: C.signal, color: C.paperBright, padding: "10px 22px", fontFamily: F.display, fontSize: Math.round(76 * size.scale), boxShadow: `8px 8px 0 ${C.ink}` },
            lang === "tr" ? `−%${pct}` : `−${pct}\u00a0%`
          )
        : null
    ),
    el({ fontFamily: F.mono, fontSize: 24, color: C.inkSoft, marginTop: 6, marginBottom: 26 }, sub)
  );
}

export function objectCard({ listing, lang, size, day }) {
  const t = T[lang];
  const kicker = t.kicker(listing.authority);
  const title = lang === "de" ? cleanDeKind(listing.segmentLabel, t.segment[listing.segment]) : t.segment[listing.segment];
  const head = Headline({ size, lang, kicker, title, place: placeLine(listing) });

  if (listing.market === "DE") {
    const v = listing.appraisedValue;
    const living = listing.livingAreaM2 ?? listing.usableAreaM2 ?? null;
    const land = listing.landAreaM2 ?? null;
    const primaryArea = living ?? land ?? null;
    const perM2 = primaryArea && primaryArea > 0 ? Math.round(v / primaryArea) : null;
    const livingExtras = [
      listing.rooms ?? null,
      listing.yearBuilt ? `Bj. ${listing.yearBuilt}` : null,
    ].filter(Boolean);
    const livingText = living
      ? `${number(living, lang)} m²${livingExtras.length ? ` · ${livingExtras.join(" · ")}` : ""}`
      : null;
    const landText = land
      ? `${number(land, lang)} m²${perM2 ? ` · ${money(perM2, lang)}/m²` : ""}`
      : null;

    const rawRows = [
      [t.hearing, `${dateLong(listing.hearingAt, lang)} · ${time(listing.hearingAt, lang)}`, true],
      livingText ? [listing.livingAreaM2 ? "Wohnfläche" : t.livingArea, livingText, true] : null,
      landText ? [perM2 ? "Grundstück · Richtwert/m²" : t.landArea, landText, !livingText] : perM2 ? [t.valuePerM2, `${money(perM2, lang)} / m²`, false] : null,
      ...(listing.limitsWaived ? [] : [[t.limit7, money(v * 0.7, lang), false]]),
      [
        t.security,
        listing.transferTaxPct
          ? `${money(v * 0.1, lang)} · GrESt ${String(listing.transferTaxPct).replace(".", ",")} %`
          : money(v * 0.1, lang),
        false,
      ],
    ].filter(Boolean);

    const compact = rawRows.length >= 6;
    const rows = rawRows.map(([lbl, val, strong]) => FactRow(lbl, val, { strong, compact }));

    const value = listing.limitsWaived
      ? ValueBelowLine({ size, label: t.valueLabel, value: money(v, lang) })
      : PriceHero({ size, lang, label: t.priceLabel, price: money(v * 0.5, lang), pct: 50, sub: t.priceSub(money(v, lang)) });
    return [
      head,
      value,
      Panel(upper(t.panel, lang), rows),
      el({ fontFamily: F.serif, fontStyle: "italic", fontSize: 27, color: C.inkSoft, marginTop: compact ? 22 : 30 }, listing.limitsWaived ? t.limitsWaived : t.limitsNote),
    ];
  }

  const tr = listing.tr;
  const rounds = listing.rounds.filter((r) => Date.parse(r.end) >= day.getTime());
  const startPct = Math.round((tr.startingBid / listing.appraisedValue) * 100);
  const bldgArea = tr.buildingAreaM2 ?? listing.livingAreaM2 ?? null;
  const netArea = tr.netAreaM2 ?? null;
  const landArea = tr.landAreaM2 ?? listing.landAreaM2 ?? null;
  const primaryTrArea = bldgArea ?? netArea ?? tr.areaM2 ?? landArea ?? null;
  const trPerM2 = primaryTrArea && primaryTrArea > 0 ? Math.round(listing.appraisedValue / primaryTrArea) : null;

  const bldgParts = [];
  if (bldgArea && netArea && bldgArea !== netArea) {
    bldgParts.push(`Brüt ${number(bldgArea, lang)} m² / Net ${number(netArea, lang)} m²`);
  } else if (bldgArea) {
    bldgParts.push(`${number(bldgArea, lang)} m²`);
  } else if (netArea) {
    bldgParts.push(`Net ${number(netArea, lang)} m²`);
  }
  if (tr.rooms) bldgParts.push(tr.rooms);
  if (tr.floor) bldgParts.push(tr.floor);

  const landParts = [];
  if (landArea) landParts.push(`${number(landArea, lang)} m²`);
  if (tr.arsaPayi) landParts.push(`Pay ${tr.arsaPayi}`);

  const rawTrRows = [
    ...rounds.slice(0, 2).map((r) => [t.round(r.round), `${dateShort(r.start, lang)} – ${dateShort(r.end, lang)}`, true]),
    bldgParts.length > 0 ? [t.area, bldgParts.join(" · "), true] : null,
    landParts.length > 0 ? [t.landArea, landParts.join(" · "), bldgParts.length === 0] : null,
    trPerM2 ? [t.valuePerM2, `${money(trPerM2, lang)} / m²`, false] : null,
    [
      t.security,
      tr.vatRate !== null && tr.vatRate !== undefined
        ? `${money(listing.appraisedValue * 0.1, lang)} · KDV %${tr.vatRate}`
        : money(listing.appraisedValue * 0.1, lang),
      false,
    ],
  ].filter(Boolean);

  const compactTr = rawTrRows.length >= 6;
  const rows = rawTrRows.map(([lbl, val, strong]) => FactRow(lbl, val, { strong, compact: compactTr }));
  const value = PriceHero({ size, lang, label: t.priceLabel, price: money(tr.startingBid, lang), pct: 100 - startPct, sub: t.priceSub(money(listing.appraisedValue, lang)) });
  return [
    head,
    value,
    Panel(upper(t.panel, lang), rows),
    el({ fontFamily: F.serif, fontStyle: "italic", fontSize: 27, color: C.inkSoft, marginTop: compactTr ? 22 : 30 }, t.limitsNote),
  ];
}

export function statCard({ stat, lang, size }) {
  const t = T[lang];
  if (stat.variant === "median") {
    const max = Math.max(1, ...stat.rows.map((r) => r.value));
    return [
      el({ fontFamily: F.display, fontSize: Math.round(96 * size.scale), lineHeight: 0.95, paddingTop: 10 }, upper(t.statMedianTitle, lang)),
      mono(upper(t.statMedian(stat.days), lang), { fontSize: 22, color: C.ink, marginTop: 14, marginBottom: 44 }),
      ...stat.rows.map((r) =>
        el(
          { flexDirection: "column", marginBottom: 46 },
          el(
            { justifyContent: "space-between", alignItems: "baseline" },
            el({ fontFamily: F.display, fontSize: Math.round(64 * size.scale) }, upper(t.segmentPlural[r.segment], lang)),
            el({ fontFamily: F.display, fontSize: Math.round(72 * size.scale), color: C.signal }, money(r.value, lang))
          ),
          el({ height: 26, width: `${Math.round((r.value / max) * 100)}%`, background: C.ink, marginTop: 10 }),
          mono(t.statBasis(number(r.count, lang)), { fontSize: 19, marginTop: 8 })
        )
      ),
      el({ height: 56 }),
      MarketLine({ size, label: null }),
      el({ fontFamily: F.serif, fontStyle: "italic", fontSize: 46, marginTop: 22 }, t.statPromise),
    ];
  }

  const max = Math.max(1, ...stat.regions.map((r) => r.count));
  return [
    el({ fontFamily: F.display, fontSize: Math.round(300 * size.scale), lineHeight: 0.9, letterSpacing: -4, paddingTop: 20 }, number(stat.total, lang)),
    el({ fontFamily: F.display, fontSize: Math.round(54 * size.scale), lineHeight: 1.02, marginTop: 10, marginBottom: 30 }, upper(t.statWeek(stat.days), lang)),
    MarketLine({ size, label: null }),
    mono(upper(t.statRegions, lang), { fontSize: 22, color: C.ink, marginTop: 28, marginBottom: 14 }),
    ...stat.regions.map((r) =>
      el(
        { alignItems: "center", gap: 18, marginBottom: 12 },
        el({ width: 300, fontSize: 30, color: C.inkSoft }, r.name),
        el({ flex: 1 }, el({ height: 26, width: `${Math.round((r.count / max) * 100)}%`, background: C.signal })),
        el({ width: 90, justifyContent: "flex-end", fontFamily: F.mono, fontSize: 28 }, number(r.count, lang))
      )
    ),
    el({ height: 56 }),
    el({ fontFamily: F.serif, fontStyle: "italic", fontSize: 44, marginTop: 20 }, t.statPromise),
  ];
}

export function tipCard({ tip, index, count, lang, size }) {
  const t = T[lang];
  return [
    el(
      { justifyContent: "space-between", alignItems: "center" },
      el({ border: `3px solid ${C.signal}`, color: C.signal, padding: "10px 20px", fontFamily: F.mono, fontSize: 30, fontWeight: 600 }, tip.kicker),
      mono(t.tipOf(index, count), { fontSize: 22 })
    ),
    el({ fontFamily: F.display, fontSize: Math.round(140 * size.scale), lineHeight: 0.95, marginTop: 52, marginBottom: 34, paddingTop: 12 }, upper(tip.title, lang)),
    MarketLine({ size, label: null }),
    el({ fontSize: Math.round(46 * size.scale), lineHeight: 1.36, color: C.ink, marginTop: 34 }, tip.body),
    el(
      { marginTop: 34, paddingLeft: 26, borderLeft: `6px solid ${C.signal}` },
      el({ fontFamily: F.serif, fontStyle: "italic", fontSize: Math.round(46 * size.scale), color: C.inkSoft, lineHeight: 1.25 }, tip.note)
    ),
    el({ height: 56 }),
    mono(t.tipPromise, { fontSize: 24, color: C.ink }),
  ];
}
