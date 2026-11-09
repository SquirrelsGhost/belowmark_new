// ---------------------------------------------------------------------------
// Die drei Einzel-/Story-Bildtypen: Objekt des Tages (inkl. Luftbild in Story),
// Zahl des Tages, Wissen. Mit strikter Titel-Kürzung & Höhenschutz, damit
// lange Objekttitel niemals in den Footer überlappen.
// ---------------------------------------------------------------------------

import { C, F, el, mono, upper, MarketLine } from "./brand.mjs";
import { AerialHeroBox } from "./mapTile.mjs";
import { T, money, number, dateLong, dateShort, time } from "./texts.mjs";
import { placeLine, cleanObjectTitle } from "./data.mjs";

function FactRow(label, value, { strong = false, compact = false, color = C.ink } = {}) {
  return el(
    {
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: 20,
      paddingTop: compact ? 7 : 10,
      paddingBottom: compact ? 7 : 10,
      borderBottom: `1px solid ${C.rule}`,
    },
    el({ fontSize: compact ? 24 : 26, color: C.inkSoft, fontWeight: strong ? 600 : 400 }, label),
    el({ fontFamily: F.mono, fontSize: compact ? 25 : 27, color, fontWeight: strong ? 600 : 400 }, value)
  );
}

function Panel(title, ...rows) {
  return el(
    { flexDirection: "column", border: `3px solid ${C.ink}`, background: C.paperBright, boxShadow: `10px 10px 0 ${C.ink}` },
    el({ background: C.ink, color: C.paperBright, padding: "14px 24px", fontFamily: F.display, fontSize: 32, letterSpacing: 2 }, title),
    el({ flexDirection: "column", padding: "6px 24px 12px" }, rows)
  );
}

function Headline({ size, lang, kicker, title, place, hasAerial = false }) {
  const titleLen = String(title ?? "").length;
  const placeLen = String(place ?? "").length;
  const rawBase = hasAerial
    ? (titleLen > 20 ? 64 : titleLen > 14 ? 74 : 84)
    : (titleLen > 22 ? 68 : titleLen > 16 ? 82 : titleLen > 12 ? 96 : 110);
  const big = Math.round(rawBase * (hasAerial ? 1 : size.scale));
  const placeSize = Math.round((placeLen > 24 ? rawBase * 0.48 : rawBase * 0.54) * (hasAerial ? 1 : size.scale));
  return el(
    { flexDirection: "column", marginTop: hasAerial ? 18 : 0 },
    !hasAerial ? mono(upper(kicker, lang), { fontSize: 21, letterSpacing: 2, marginBottom: 10 }) : null,
    el({ fontFamily: F.display, fontSize: big, lineHeight: 0.93, letterSpacing: -0.5, paddingTop: 4 }, upper(title, lang)),
    el({ fontFamily: F.display, fontSize: placeSize, lineHeight: 1.02, color: C.inkSoft, marginTop: 6, marginBottom: 18 }, upper(place, lang))
  );
}

function ValueBelowLine({ size, label, value }) {
  return el(
    { flexDirection: "column" },
    MarketLine({ size, label: null }),
    el(
      { justifyContent: "space-between", alignItems: "baseline", gap: 24, marginTop: 12, marginBottom: 20 },
      el({ fontFamily: F.serif, fontStyle: "italic", fontSize: 34, color: C.inkSoft }, label),
      el({ fontFamily: F.display, fontSize: Math.round(80 * size.scale), letterSpacing: 1 }, value)
    )
  );
}

function PriceHero({ size, lang, label, price, pct, sub, compact = false }) {
  const maxPx = compact ? 104 : 126 * size.scale;
  const priceSize = Math.round(Math.min(maxPx, 680 / (price.length * 0.47)));
  return el(
    { flexDirection: "column" },
    MarketLine({ size, label: null }),
    el({ fontFamily: F.serif, fontStyle: "italic", fontSize: compact ? 30 : 34, color: C.inkSoft, marginTop: 12 }, label),
    el(
      { justifyContent: "space-between", alignItems: "center", gap: 24 },
      el({ fontFamily: F.display, fontSize: priceSize, lineHeight: 1, color: C.signal, paddingTop: 6 }, price),
      pct > 0
        ? el(
            {
              flexShrink: 0,
              background: C.signal,
              color: C.paperBright,
              padding: compact ? "8px 18px" : "10px 22px",
              fontFamily: F.display,
              fontSize: Math.round((compact ? 56 : 70) * (compact ? 1 : size.scale)),
              boxShadow: `8px 8px 0 ${C.ink}`,
            },
            lang === "tr" ? `−%${pct}` : `−${pct}\u00a0%`
          )
        : null
    ),
    el({ fontFamily: F.mono, fontSize: compact ? 21 : 23, color: C.inkSoft, marginTop: 6, marginBottom: compact ? 18 : 22 }, sub)
  );
}

export function objectCard({ listing, lang, size, day, aerial = null }) {
  const t = T[lang];
  const kicker = t.kicker(listing.authority);
  const title = cleanObjectTitle(listing, t.segment[listing.segment]);
  const isStoryWithAerial = Boolean(aerial && size.height > 1500);
  const place = placeLine(listing);

  const aerialNode = isStoryWithAerial
    ? AerialHeroBox({
        aerial,
        width: size.width - size.padX * 2,
        height: 360,
        badgeLeft: upper(listing.authority || "AMTSGERICHT", lang).slice(0, 32),
        badgeRight: null,
        sectorLabel: upper(place, lang),
      })
    : null;

  const head = Headline({ size, lang, kicker, title, place, hasAerial: isStoryWithAerial });

  if (listing.market === "DE") {
    const v = listing.appraisedValue;
    const isCondo = listing.segment === "apartment";
    const living = listing.livingAreaM2 ?? listing.usableAreaM2 ?? null;
    const land = !isCondo ? (listing.landAreaM2 ?? null) : null;
    const primaryArea = living ?? listing.landAreaM2 ?? null;
    const perM2 = primaryArea && primaryArea > 0 ? Math.round(v / primaryArea) : null;
    const livingExtras = [
      listing.rooms && !/zimmer/i.test(title) ? listing.rooms : null,
      listing.yearBuilt ? `Bj. ${listing.yearBuilt}` : null,
    ].filter(Boolean);
    const livingText = living ? `${number(living, lang)} m²${livingExtras.length ? ` · ${livingExtras.join(" · ")}` : ""}` : null;
    const landText = land ? `${number(land, lang)} m²${perM2 ? ` · ${money(perM2, lang)}/m²` : ""}` : null;

    const rawRows = [
      [t.hearing, `${dateLong(listing.hearingAt, lang)} · ${time(listing.hearingAt, lang)}`, true],
      livingText ? [listing.livingAreaM2 ? "Wohnfläche" : t.livingArea, livingText, true] : null,
      landText
        ? [perM2 ? "Grundstück · Richtwert/m²" : t.landArea, landText, !livingText]
        : perM2
          ? [t.valuePerM2, `${money(perM2, lang)} / m²`, false]
          : null,
      ...(listing.limitsWaived || isStoryWithAerial ? [] : [[t.limit7, money(v * 0.7, lang), false]]),
      [
        t.security,
        listing.transferTaxPct
          ? `${money(v * 0.1, lang)} · GrESt ${String(listing.transferTaxPct).replace(".", ",")} %`
          : money(v * 0.1, lang),
        false,
      ],
    ].filter(Boolean);

    const compact = rawRows.length >= 5 || isStoryWithAerial;
    const rows = rawRows.map(([lbl, val, strong]) => FactRow(lbl, val, { strong, compact }));

    const value = listing.limitsWaived
      ? ValueBelowLine({ size, label: t.valueLabel, value: money(v, lang) })
      : PriceHero({ size, lang, label: t.priceLabel, price: money(v * 0.5, lang), pct: 50, sub: t.priceSub(money(v, lang)), compact: isStoryWithAerial });

    return [
      aerialNode,
      head,
      value,
      Panel(upper(t.panel, lang), rows),
      !isStoryWithAerial
        ? el({ fontFamily: F.serif, fontStyle: "italic", fontSize: 25, color: C.inkSoft, marginTop: 18 }, listing.limitsWaived ? t.limitsWaived : t.limitsNote)
        : null,
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
    ...rounds.slice(0, isStoryWithAerial ? 1 : 2).map((r) => [t.round(r.round), `${dateShort(r.start, lang)} – ${dateShort(r.end, lang)}`, true]),
    bldgParts.length > 0 ? [t.area, bldgParts.join(" · "), true] : null,
    landParts.length > 0 ? [t.landArea, landParts.join(" · "), bldgParts.length === 0] : null,
    !isStoryWithAerial && trPerM2 ? [t.valuePerM2, `${money(trPerM2, lang)} / m²`, false] : null,
    [
      t.security,
      tr.vatRate !== null && tr.vatRate !== undefined
        ? `${money(listing.appraisedValue * 0.1, lang)} · KDV %${tr.vatRate}`
        : money(listing.appraisedValue * 0.1, lang),
      false,
    ],
  ].filter(Boolean);

  const compactTr = rawTrRows.length >= 5 || isStoryWithAerial;
  const rows = rawTrRows.map(([lbl, val, strong]) => FactRow(lbl, val, { strong, compact: compactTr }));
  const value = PriceHero({
    size,
    lang,
    label: t.priceLabel,
    price: money(tr.startingBid, lang),
    pct: 100 - startPct,
    sub: t.priceSub(money(listing.appraisedValue, lang)),
    compact: isStoryWithAerial,
  });
  return [
    aerialNode,
    head,
    value,
    Panel(upper(t.panel, lang), rows),
    !isStoryWithAerial
      ? el({ fontFamily: F.serif, fontStyle: "italic", fontSize: 25, color: C.inkSoft, marginTop: 18 }, t.limitsNote)
      : null,
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
    el({ fontFamily: F.display, fontSize: Math.round(280 * size.scale), lineHeight: 0.9, letterSpacing: -4, paddingTop: 16 }, number(stat.total, lang)),
    el({ fontFamily: F.display, fontSize: Math.round(52 * size.scale), lineHeight: 1.02, marginTop: 10, marginBottom: 28 }, upper(t.statWeek(stat.days), lang)),
    MarketLine({ size, label: null }),
    mono(upper(t.statRegions, lang), { fontSize: 22, color: C.ink, marginTop: 26, marginBottom: 14 }),
    ...stat.regions.map((r) =>
      el(
        { alignItems: "center", gap: 18, marginBottom: 12 },
        el({ width: 310, fontSize: 29, color: C.inkSoft }, r.name),
        el({ flex: 1 }, el({ height: 26, width: `${Math.round((r.count / max) * 100)}%`, background: C.signal })),
        el({ width: 90, justifyContent: "flex-end", fontFamily: F.mono, fontSize: 28 }, number(r.count, lang))
      )
    ),
    el({ height: 44 }),
    el({ fontFamily: F.serif, fontStyle: "italic", fontSize: 42, marginTop: 16 }, t.statPromise),
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
    el({ fontFamily: F.display, fontSize: Math.round(132 * size.scale), lineHeight: 0.95, marginTop: 48, marginBottom: 32, paddingTop: 10 }, upper(tip.title, lang)),
    MarketLine({ size, label: null }),
    el({ fontSize: Math.round(45 * size.scale), lineHeight: 1.36, color: C.ink, marginTop: 32 }, tip.body),
    el(
      { marginTop: 32, paddingLeft: 26, borderLeft: `6px solid ${C.signal}` },
      el({ fontFamily: F.serif, fontStyle: "italic", fontSize: Math.round(44 * size.scale), color: C.inkSoft, lineHeight: 1.25 }, tip.note)
    ),
    el({ height: 48 }),
    mono(t.tipPromise, { fontSize: 24, color: C.ink }),
  ];
}
