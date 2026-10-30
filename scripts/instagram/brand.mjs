// ---------------------------------------------------------------------------
// Markenrahmen für die Instagram-Bilder im Stil „Amtlicher Aushang“:
// Papier, Tinte und die rote Marktlinie (#c8362b) aus dem Logo — die
// Schlagzeile steht über der Linie, das Versprechen darunter.
// Farben und Schriften wie src/styles/globals.css.
// ---------------------------------------------------------------------------

import { createElement } from "react";

export const C = {
  paper: "#eeeae1",
  paperDeep: "#e4dfd3",
  paperBright: "#f7f4ee",
  ink: "#12110f",
  inkSoft: "#3b3933",
  muted: "#6e695e",
  rule: "rgba(18,17,15,0.16)",
  signal: "#c8362b",
  caution: "#b9771a",
};

export const F = {
  display: "Archivo Condensed",
  sans: "Archivo",
  mono: "IBM Plex Mono",
  serif: "Newsreader",
};

/** Formate: Feed 4:5 und Story 9:16 (mit Rand für die Instagram-Bedienelemente). */
export const SIZES = {
  feed: { width: 1080, height: 1350, padX: 72, padTop: 60, padBottom: 50, scale: 1, justify: "flex-start" },
  story: { width: 1080, height: 1920, padX: 80, padTop: 220, padBottom: 260, scale: 1.15, justify: "center" },
};

/** div mit Flexbox (Satori verlangt display:flex, sobald es mehrere Kinder gibt). */
export function el(style, ...children) {
  return createElement("div", { style: { display: "flex", ...style } }, ...children.flat().filter((c) => c !== null && c !== false && c !== undefined));
}

export const upper = (text, lang) => text.toLocaleUpperCase(lang === "tr" ? "tr-TR" : "de-DE");

export function mono(text, style = {}) {
  return el({ fontFamily: F.mono, fontSize: 22, letterSpacing: 2, color: C.muted, ...style }, text);
}

/** Logo: nur die Wortmarke mit der roten Marktlinie darüber. */
function BrandMark() {
  return el(
    { flexDirection: "column", gap: 4 },
    el({ height: 3, background: C.signal }),
    el({ fontFamily: F.display, fontSize: 40, letterSpacing: 5, color: C.ink, lineHeight: 1 }, "BELOWMARK")
  );
}

/** Die rote Marktlinie über die ganze Breite, mit kleiner Beschriftung rechts. */
export function MarketLine({ size, label }) {
  return el(
    { flexDirection: "column", marginLeft: -size.padX, marginRight: -size.padX },
    el({ height: 8, background: C.signal }),
    label ? el({ justifyContent: "flex-end", paddingRight: size.padX, paddingTop: 10 }, mono(label, { color: C.signal, fontSize: 18, letterSpacing: 4 })) : null
  );
}

/**
 * Ganzer Rahmen: Kopf mit Logo und Rubrik, Inhalt, Fuß mit Quelle, Haftungshinweis und Domain.
 */
export function Frame({ size, lang, rubric, date, source, disclaimer, cta, children }) {
  const pad = { paddingLeft: size.padX, paddingRight: size.padX };
  return el(
    {
      width: size.width,
      height: size.height,
      flexDirection: "column",
      background: C.paper,
      color: C.ink,
      fontFamily: F.sans,
      paddingTop: size.padTop,
      paddingBottom: size.padBottom,
    },
    el(
      { ...pad, justifyContent: "space-between", alignItems: "center" },
      BrandMark(),
      el(
        { flexDirection: "column", alignItems: "flex-end", gap: 6 },
        el(
          { alignItems: "center", gap: 10 },
          el({ width: 14, height: 14, background: C.signal }),
          mono(upper(rubric, lang), { color: C.ink, fontSize: 22, fontWeight: 600 })
        ),
        mono(date, { fontSize: 20 })
      )
    ),
    el({ ...pad, marginTop: 28 }, el({ flex: 1, height: 3, background: C.ink })),
    el({ ...pad, flexDirection: "column", flex: 1, paddingTop: 30, justifyContent: size.justify }, children),
    cta
      ? el(
          { ...pad, marginBottom: 28 },
          el(
            { background: C.signal, color: C.paperBright, padding: "22px 30px", fontFamily: F.display, fontSize: 40, letterSpacing: 2, boxShadow: `8px 8px 0 ${C.ink}` },
            `${upper(cta, lang)}  →`
          )
        )
      : null,
    el(
      { ...pad, flexDirection: "column", gap: 10, marginTop: 24 },
      el({ height: 1, background: C.rule }),
      el(
        { justifyContent: "space-between", alignItems: "flex-end", gap: 24 },
        el({ flexDirection: "column", gap: 6, flex: 1 }, mono(source, { fontSize: 17, letterSpacing: 0.5 }), mono(disclaimer, { fontSize: 17, letterSpacing: 0.5 })),
        el({ fontFamily: F.display, fontSize: 34, letterSpacing: 2, color: C.ink }, "BELOWMARK.COM")
      )
    )
  );
}
