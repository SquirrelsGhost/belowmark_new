// ---------------------------------------------------------------------------
// 5-Slide Swipe-Karussell (1080×1350) für maximale Verweildauer, Saves & Shares.
//   Slide 1: Luftbild-Hook + Preis-Drop (-50 % unterm Gutachten)
//   Slide 2: Wertgrenzen-Balkenvergleich (100 % vs. 7/10 vs. 5/10 + €/m²)
//   Slide 3: Echte Cash- & Nebenkosten-Rechnung (inkl. 10 % Sicherheit)
//   Slide 4: Der Haken / Due-Diligence-Check (Besichtigung, Baujahr, Abt. II)
//   Slide 5: Diskussion + Speichern-Trigger + Marken-CTA (belowmark.com)
// ---------------------------------------------------------------------------

import { C, F, el, mono, upper, MarketLine } from "./brand.mjs";
import { AerialHeroBox } from "./mapTile.mjs";
import { money, number, dateLong, dateShort, time, T } from "./texts.mjs";
import { placeLine, cleanObjectTitle, extractDealInsights, nextRound } from "./data.mjs";

function SlideDots(active, total = 5, swipeLabel = "SWIPE →") {
  return el(
    { justifyContent: "space-between", alignItems: "center", marginTop: 18 },
    el(
      { alignItems: "center", gap: 10 },
      ...Array.from({ length: total }, (_, i) =>
        el({
          width: i + 1 === active ? 38 : 12,
          height: 12,
          background: i + 1 === active ? C.signal : "rgba(18,17,15,0.22)",
        })
      )
    ),
    active < total
      ? el(
          {
            background: C.ink,
            color: C.paperBright,
            padding: "8px 18px",
            fontFamily: F.mono,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 1.5,
          },
          swipeLabel
        )
      : mono(`${active} / ${total}`, { fontSize: 20, color: C.ink })
  );
}

function Pill(text, { accent = false } = {}) {
  return el(
    {
      background: accent ? C.signal : C.paperBright,
      color: accent ? C.paperBright : C.ink,
      border: `2px solid ${C.ink}`,
      padding: "7px 15px",
      fontFamily: F.mono,
      fontSize: 21,
      fontWeight: 600,
    },
    text
  );
}

function LedgerRow(label, sublabel, value, { highlight = false, last = false } = {}) {
  return el(
    {
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 14,
      paddingBottom: 14,
      borderBottom: last ? "none" : `1px solid ${C.rule}`,
    },
    el(
      { flexDirection: "column", gap: 3, maxWidth: 590 },
      el({ fontSize: 26, fontWeight: highlight ? 600 : 400, color: C.ink }, label),
      sublabel ? el({ fontFamily: F.mono, fontSize: 18, color: C.muted }, sublabel) : null
    ),
    el(
      {
        fontFamily: F.mono,
        fontSize: highlight ? 30 : 27,
        fontWeight: 600,
        color: highlight ? C.signal : C.ink,
      },
      value
    )
  );
}

export function buildObjectCarouselSlides({ listing, lang, size, day, aerial }) {
  const t = T[lang];
  const isTr = lang === "tr";
  const ins = extractDealInsights(listing);
  const v = listing.appraisedValue;
  const title = cleanObjectTitle(listing, t.segment[listing.segment]);
  const place = placeLine(listing);
  const discountPct = isTr
    ? Math.max(1, Math.round(100 - ((listing.tr?.startingBid || v * 0.5) / v) * 100))
    : 50;

  const titleSize = title.length > 20 ? 64 : title.length > 15 ? 74 : 84;

  // ── SLIDE 1: LUFTBILD + PREIS-SCHOCK ───────────────────────────────────────
  const trRound = isTr ? nextRound(listing, day) : null;
  const dateChip = isTr
    ? trRound
      ? `İhale ${dateShort(trRound.start, lang)}`
      : "Resmi İlan"
    : `Termin ${dateShort(listing.hearingAt, lang)}`;

  const isCondo = listing.segment === "apartment";
  const showRoomsChip = Boolean((isTr ? listing.tr?.rooms : listing.rooms) && !/zimmer/i.test(title));
  const pills = [
    ins.area ? `${number(ins.area, lang)} m² Wfl.` : null,
    !isTr && !isCondo && listing.landAreaM2 && listing.landAreaM2 !== ins.area ? `${number(listing.landAreaM2, lang)} m² Grund` : null,
    showRoomsChip ? (isTr ? listing.tr?.rooms : listing.rooms) : null,
    !isTr && listing.yearBuilt ? `Bj. ${listing.yearBuilt}` : null,
    dateChip,
  ].filter(Boolean).slice(0, 4);

  const startPriceStr = money(ins.startBid, lang);
  const priceFontSize = startPriceStr.length > 12 ? 78 : startPriceStr.length > 9 ? 94 : 108;

  const slide1 = [
    AerialHeroBox({
      aerial,
      width: size.width - size.padX * 2,
      height: 370,
      badgeLeft: upper(listing.authority || (isTr ? "İCRA MÜDÜRLÜĞÜ" : "AMTSGERICHT"), lang).slice(0, 34),
      badgeRight: listing.limitsWaived ? (isTr ? "LİMİTSİZ" : "OHNE 5/10") : isTr ? `−%${discountPct}` : `−${discountPct} %`,
      sectorLabel: upper(place, lang),
    }),
    el(
      { flexDirection: "column", marginTop: 22 },
      el({ fontFamily: F.display, fontSize: titleSize, lineHeight: 0.94, letterSpacing: -0.5 }, upper(title, lang)),
      el({ fontFamily: F.display, fontSize: 42, lineHeight: 1.05, color: C.inkSoft, marginTop: 6 }, upper(place, lang))
    ),
    el(
      {
        marginTop: 18,
        paddingTop: 16,
        borderTop: `6px solid ${C.signal}`,
        justifyContent: "space-between",
        alignItems: "flex-end",
      },
      el(
        { flexDirection: "column" },
        el(
          { fontFamily: F.serif, fontStyle: "italic", fontSize: 30, color: C.inkSoft },
          listing.limitsWaived
            ? (isTr ? "Muhammen bedel" : "Wertgrenzen entfallen · Verkehrswert")
            : (isTr ? "Açık artırma başlangıç bedeli" : "Zuschlag im 1. Termin möglich ab")
        ),
        el(
          { fontFamily: F.display, fontSize: priceFontSize, lineHeight: 0.95, color: C.signal, marginTop: 4 },
          listing.limitsWaived ? money(v, lang) : startPriceStr
        )
      ),
      el(
        { flexDirection: "column", alignItems: "flex-end", gap: 4, paddingBottom: 6 },
        mono(isTr ? "MUHAMMEN BEDEL" : "GUTACHTENWERT", { fontSize: 18 }),
        el(
          {
            fontFamily: F.mono,
            fontSize: 30,
            fontWeight: 600,
            color: C.ink,
            ...(listing.limitsWaived ? {} : { textDecoration: "line-through" }),
          },
          money(v, lang)
        ),
        ins.startPerM2
          ? mono(isTr ? `Başlangıç: ${money(ins.startPerM2, lang)}/m²` : `ab ${money(ins.startPerM2, lang)}/m²`, {
              fontSize: 20,
              color: C.signal,
              fontWeight: 600,
            })
          : null
      )
    ),
    el({ flexWrap: "wrap", gap: 10, marginTop: 18 }, ...pills.map((p, idx) => Pill(p, { accent: idx === pills.length - 1 }))),
    el({ flex: 1 }),
    SlideDots(1, 5, isTr ? "HESAP & RİSKLER →" : "RECHNUNG & HAKEN →"),
  ];

  // ── SLIDE 2: WERTGRENZEN & M²-VERGLEICH ────────────────────────────────────
  const bars = isTr
    ? [
        {
          label: "100 % · Muhammen Bedel (Bilirkişi)",
          val: money(v, lang),
          sub: ins.fullPerM2 ? `${money(ins.fullPerM2, lang)} / m²` : "Resmi değerleme",
          pct: 100,
          color: C.ink,
        },
        {
          label: `%${100 - discountPct} · Açık Artırma Başlangıç Bedeli`,
          val: money(ins.startBid, lang),
          sub: ins.startPerM2 ? `${money(ins.startPerM2, lang)} / m² (−%${discountPct})` : `−%${discountPct} fark`,
          pct: Math.max(25, 100 - discountPct),
          color: C.signal,
        },
      ]
    : [
        {
          label: "100 % · Verkehrswert laut Gutachten",
          val: money(v, lang),
          sub: ins.fullPerM2 ? `${money(ins.fullPerM2, lang)} / m² Richtwert` : "Amtlicher Gutachtenwert",
          pct: 100,
          color: C.ink,
        },
        {
          label: "70 % · Gläubiger-Schutzgrenze (§ 74a ZVG)",
          val: money(ins.limit70, lang),
          sub: ins.limit70PerM2 ? `${money(ins.limit70PerM2, lang)} / m² (−30 %)` : "Darunter kann Gläubiger Versagung beantragen",
          pct: 70,
          color: C.inkSoft,
        },
        {
          label: "50 % · Gesetzliche Untergrenze (§ 85a ZVG)",
          val: money(ins.startBid, lang),
          sub: ins.startPerM2 ? `${money(ins.startPerM2, lang)} / m² (−50 %)` : "Darunter im 1. Termin kein Zuschlag",
          pct: 50,
          color: C.signal,
        },
      ];

  const slide2 = [
    mono(isTr ? "SLIDE 2 / 5 · FİYAT ANALİZİ" : "SLIDE 2 / 5 · WERTGRENZEN-CHECK", { fontSize: 21, color: C.signal, fontWeight: 600 }),
    el(
      { fontFamily: F.display, fontSize: 80, lineHeight: 0.95, marginTop: 10, marginBottom: 22 },
      upper(isTr ? "İHALE FİYATI NASIL OLUŞUR?" : "WO LIEGT DIE PREISGRENZE?", lang)
    ),
    MarketLine({ size, label: null }),
    el(
      { flexDirection: "column", gap: 28, marginTop: 32 },
      ...bars.map((b) =>
        el(
          {
            flexDirection: "column",
            background: C.paperBright,
            border: `3px solid ${C.ink}`,
            padding: "20px 24px",
            ...(b.color === C.signal ? { boxShadow: `8px 8px 0 ${C.ink}` } : {}),
          },
          el(
            { justifyContent: "space-between", alignItems: "baseline" },
            el({ fontSize: 25, fontWeight: 600, color: C.ink }, b.label),
            el({ fontFamily: F.display, fontSize: 52, color: b.color, lineHeight: 1 }, b.val)
          ),
          el(
            { height: 22, width: "100%", background: C.paperDeep, marginTop: 12 },
            el({ height: 22, width: `${b.pct}%`, background: b.color })
          ),
          mono(b.sub, { fontSize: 20, color: b.color === C.signal ? C.signal : C.muted, marginTop: 10 })
        )
      )
    ),
    el(
      { marginTop: 28, paddingLeft: 22, borderLeft: `6px solid ${C.signal}` },
      el(
        { fontFamily: F.serif, fontStyle: "italic", fontSize: 31, lineHeight: 1.28, color: C.inkSoft },
        isTr
          ? "UYAP e-Satış'ta son 10 dakikada gelen her teklif süreyi uzatır. Tavan bütçenizi ihaleden önce belirleyin."
          : listing.limitsWaived
            ? "Achtung Folgetermin: In diesem Verfahren sind die 5/10- und 7/10-Grenzen bereits aufgehoben!"
            : "Im 1. Termin ist unter 50 % gesetzlich Schluss. Zwischen 50 % und 70 % entscheidet die Bank, ob sie zustimmt."
      )
    ),
    el({ flex: 1 }),
    SlideDots(2, 5, isTr ? "NAKİT HESABI →" : "CASH-RECHNUNG →"),
  ];

  // ── SLIDE 3: ECHTE CASH- & NEBENKOSTEN-RECHNUNG ────────────────────────────
  const slide3 = [
    mono(isTr ? "SLIDE 3 / 5 · MALİYET TABLOSU" : "SLIDE 3 / 5 · ECHTE KALKULATION", { fontSize: 21, color: C.signal, fontWeight: 600 }),
    el(
      { fontFamily: F.display, fontSize: 78, lineHeight: 0.95, marginTop: 10, marginBottom: 22 },
      upper(isTr ? "NE KADAR NAKİT GEREKİR?" : "WAS BRAUCHST DU AUF DEM TISCH?", lang)
    ),
    MarketLine({ size, label: null }),
    el(
      {
        flexDirection: "column",
        marginTop: 28,
        border: `3px solid ${C.ink}`,
        background: C.paperBright,
        boxShadow: `10px 10px 0 ${C.ink}`,
      },
      el(
        { background: C.ink, color: C.paperBright, padding: "16px 24px", justifyContent: "space-between", alignItems: "center" },
        el({ fontFamily: F.display, fontSize: 32, letterSpacing: 1.5 }, isTr ? "BAŞLANGIÇ BEDELİYLE ÖRNEK HESAP" : "BEISPIEL BEI ZUSCHLAG ZUR 5/10-GRENZE"),
        mono(place.split("·").pop().trim(), { fontSize: 19, color: "#d8d3c8" })
      ),
      el(
        { flexDirection: "column", padding: "10px 24px 18px" },
        LedgerRow(
          isTr ? "İhale Öncesi Teminat (%10)" : "Pflicht-Sicherheit im Termin (§ 68 ZVG)",
          isTr ? "Muhammen bedelin %10'u — teklif öncesi yatırılır" : "10 % vom Verkehrswert · Bankscheck / Gerichtskasse (kein Bargeld!)",
          money(ins.deposit10, lang),
          { highlight: true }
        ),
        LedgerRow(
          isTr ? "Başlangıç İhale Bedeli" : "Beispiel-Meistgebot (5/10-Grenze)",
          isTr ? `Muhammen bedel: ${money(v, lang)}` : `50 % vom Gutachtenwert (${money(v, lang)})`,
          money(ins.startBid, lang)
        ),
        LedgerRow(
          isTr ? `KDV (%${ins.taxPct})` : `Grunderwerbsteuer (${String(ins.taxPct).replace(".", ",")} %)`,
          isTr ? "İlandaki KDV oranına göre tahmini" : `Landessatz ${listing.region} auf das Meistgebot`,
          `+ ${money(ins.taxOnStart, lang)}`
        ),
        LedgerRow(
          isTr ? "Tapu Harcı & Masraflar (~%1,5)" : "Zuschlagsgebühr & Grundbuch (~1,5 %)",
          isTr ? "Tahmini tescil ve damga giderleri" : "Kein Notar nötig · keine Maklerprovision (0 €)!",
          `+ ${money(ins.courtFeesEst, lang)}`,
          { last: true }
        )
      ),
      el(
        {
          background: C.signal,
          color: C.paperBright,
          padding: "18px 24px",
          justifyContent: "space-between",
          alignItems: "center",
        },
        el(
          { flexDirection: "column" },
          el({ fontFamily: F.display, fontSize: 32, letterSpacing: 1 }, isTr ? "TOPLAM TAHMİNİ MALİYET" : "GESAMTKAPITAL (OHNE SANIERUNG)"),
          el({ fontFamily: F.mono, fontSize: 18, color: "#f9dedc" }, isTr ? "Teminat tutarı ihale bedeline mahsup edilir" : "Die 10 % Sicherheit werden auf den Kaufpreis angerechnet")
        ),
        el({ fontFamily: F.display, fontSize: 54 }, money(ins.totalAtStart, lang))
      )
    ),
    el({ flex: 1 }),
    SlideDots(3, 5, isTr ? "RİSK KONTROLÜ →" : "DER HAKEN →"),
  ];

  // ── SLIDE 4: DER HAKEN / DUE DILIGENCE ─────────────────────────────────────
  const checkItems = isTr
    ? [
        {
          icon: "01",
          title: `${listing.authority} · ${trRound ? `${dateShort(trRound.start, lang)} – ${dateShort(trRound.end, lang)}` : "Resmi Satış"}`,
          desc: `Dosya No: ${listing.fileNo || "İlanda belirtilmiştir"} · Elektronik teklif (UYAP e-Satış).`,
        },
        {
          icon: "02",
          title: "Şartname & Tapu Kaydı Kontrolü",
          desc: "Taşınmaz üzerindeki şerhler, imar durumu ve fiili kullanım durumu ihaleden önce mutlaka incelenmelidir.",
        },
        {
          icon: "03",
          title: "Tahliye & Teslim Süreci",
          desc: "İçeride kiracı veya borçlu bulunması halinde tahliye süreci alıcı tarafından takip edilir.",
        },
      ]
    : [
        {
          icon: "01",
          title: ins.noInsideInspection ? "Achtung: Keine Innenbesichtigung!" : "Gutachten & Objektzustand prüfen",
          desc: ins.noInsideInspection
            ? "Laut amtlichem Text fand keine Innenbesichtigung statt. Unbedingt Sanierungspuffer einkalkulieren!"
            : `Baujahr ${listing.yearBuilt || "laut Gutachten"}${ins.features.length ? ` · Merkmale: ${ins.features.join(", ")}` : ""}. Vorab Außenbesichtigung vor Ort machen!`,
          warn: ins.noInsideInspection,
        },
        {
          icon: "02",
          title: "Grundbuch Abt. II & Geringstes Gebot (§ 44 ZVG)",
          desc: "Bestehen bleibende Rechte (z. B. Wohnrecht, Grundschuld) kommen zum Bargebot obendrauf. Immer Gutachten lesen!",
          warn: false,
        },
        {
          icon: "03",
          title: `Gerichtstermin: ${dateLong(listing.hearingAt, lang)} · ${time(listing.hearingAt, lang)}`,
          desc: `${listing.authority} · Personalausweis + bestätigten Scheck / Überweisungsnachweis rechtzeitig bereithalten.`,
          warn: false,
        },
      ];

  const slide4 = [
    mono(isTr ? "SLIDE 4 / 5 · DİKKAT EDİLECEKLER" : "SLIDE 4 / 5 · DUE-DILIGENCE-CHECK", { fontSize: 21, color: C.signal, fontWeight: 600 }),
    el(
      { fontFamily: F.display, fontSize: 78, lineHeight: 0.95, marginTop: 10, marginBottom: 22 },
      upper(isTr ? "TEKLİF VERMEDEN ÖNCE 3 KONTROL" : "WORAUF DU HIER ACHTEN MUSST", lang)
    ),
    MarketLine({ size, label: null }),
    el(
      { flexDirection: "column", gap: 20, marginTop: 28 },
      ...checkItems.map((item) =>
        el(
          {
            gap: 20,
            padding: "20px 24px",
            background: C.paperBright,
            border: `3px solid ${item.warn ? C.signal : C.ink}`,
            ...(item.warn ? { boxShadow: `8px 8px 0 ${C.signal}` } : {}),
          },
          el(
            {
              width: 56,
              height: 56,
              flexShrink: 0,
              background: item.warn ? C.signal : C.ink,
              color: C.paperBright,
              alignItems: "center",
              justifyContent: "center",
              fontFamily: F.display,
              fontSize: 32,
            },
            item.icon
          ),
          el(
            { flexDirection: "column", gap: 6, flex: 1 },
            el({ fontSize: 27, fontWeight: 600, color: item.warn ? C.signal : C.ink }, item.title),
            el({ fontSize: 23, lineHeight: 1.32, color: C.inkSoft }, item.desc)
          )
        )
      )
    ),
    el({ flex: 1 }),
    SlideDots(4, 5, isTr ? "TÜM İLANLAR →" : "ALLE AUSHÄNGE →"),
  ];

  // ── SLIDE 5: DISKUSSION + SAVE + CTA ───────────────────────────────────────
  const cityClean = listing.place.split(",")[0].trim();
  const slide5 = [
    mono(isTr ? "SLIDE 5 / 5 · KARAR SENİN" : "SLIDE 5 / 5 · DEIN URTEIL", { fontSize: 21, color: C.signal, fontWeight: 600 }),
    el(
      { fontFamily: F.display, fontSize: 86, lineHeight: 0.94, marginTop: 12, marginBottom: 20 },
      upper(isTr ? "FIRSAT MI, RİSK Mİ?" : "TOP-DEAL ODER FINGER WEG?", lang)
    ),
    MarketLine({ size, label: null }),
    el(
      { fontFamily: F.serif, fontStyle: "italic", fontSize: 38, lineHeight: 1.28, color: C.ink, marginTop: 28 },
      isTr
        ? `${cityClean} bölgesinde ${money(ins.startBid, lang)} başlangıç bedeliyle bu ihaleye girer miydin? Yorumlara yaz!`
        : `Würdest du in ${cityClean} ab ${money(ins.startBid, lang)} mitbieten — oder wo liegt deine persönliche Schmerzgrenze?`
    ),
    el(
      {
        flexDirection: "column",
        gap: 18,
        marginTop: 34,
        padding: "28px 30px",
        background: C.ink,
        color: C.paperBright,
        boxShadow: `12px 12px 0 ${C.signal}`,
      },
      mono(isTr ? "RESMİ İLAN VERİTABANI" : "ALLE AMTLICHEN AUSHÄNGE & RECHNER", { fontSize: 20, color: "#f09a93" }),
      el(
        { fontFamily: F.display, fontSize: 54, lineHeight: 1.02 },
        isTr
          ? "81 İLDE TÜM İCRA İHALELERİ TEK EKRANDA"
          : "3.400+ ZWANGSVERSTEIGERUNGEN IN DEINER PLZ PRÜFEN"
      ),
      el(
        { fontSize: 25, lineHeight: 1.35, color: "#ded9ce" },
        isTr
          ? "• Günlük resmi ilan taraması  • Teminat & KDV hesaplayıcı  • İhale takvimi"
          : "• Täglich frisch aus den Amtsgerichten  • 5/10- & Nebenkosten-Rechner  • PDF-Gutachten"
      ),
      el(
        {
          marginTop: 10,
          background: C.signal,
          color: C.paperBright,
          padding: "16px 24px",
          justifyContent: "space-between",
          alignItems: "center",
        },
        el({ fontFamily: F.display, fontSize: 38, letterSpacing: 1.5 }, "BELOWMARK.COM"),
        el({ fontFamily: F.mono, fontSize: 22, fontWeight: 600 }, isTr ? "LİNK BİYOGRAFİDE ↑" : "LINK IN DER BIO ↑")
      )
    ),
    el(
      { marginTop: 26, justifyContent: "space-between", alignItems: "center" },
      Pill(isTr ? "KAYDET (İHALE TARİHİ)" : "BEITRAG SPEICHERN FÜR DEN TERMIN"),
      Pill(isTr ? "ARKADAŞINA GÖNDER" : "TEILEN MIT INVESTOREN", { accent: true })
    ),
    el({ flex: 1 }),
    SlideDots(5, 5),
  ];

  return [slide1, slide2, slide3, slide4, slide5];
}
