/**
 * Text helpers for Gutachten pages: clean up what the PDF gives, cut it into
 * sentences, and check that a quote really stands on a page.
 */

/** Longest quote kept; longer sentences are cut around the match. */
export const QUOTE_MAX = 320;
const QUOTE_CONTEXT = 140;

/** Joins words split at line ends ("Wohnungs-\nrecht") and collapses whitespace. */
export function cleanPageText(raw: string): string {
  return raw
    .replace(/(\p{L})-\s*\n\s*(\p{Ll})/gu, "$1$2")
    .replace(/[­​]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Sentences of a cleaned page. Abbreviations like "Abt." or "Nr." do not end a sentence. */
export function splitSentences(text: string): string[] {
  // A colon followed by a figure ("Wertermittlungsstichtag: 12.03.2024") keeps label and value together.
  const parts = text.split(/(?<=[.!?;])\s+(?=[\p{Lu}0-9„"(§])|(?<=:)\s+(?=[\p{Lu}„"(§])/u);
  const sentences: string[] = [];
  for (const part of parts) {
    const previous = sentences[sentences.length - 1];
    if (previous && /\b(abt|nr|ca|rd|bzw|vgl|ggf|evtl|tlw|zzgl|inkl|abs|z\.b|u\.a|d\.h|gem|lfd|st|str|flst|bl|no|s)\.$/iu.test(previous)) {
      sentences[sentences.length - 1] = `${previous} ${part}`;
    } else {
      sentences.push(part);
    }
  }
  return sentences.map((sentence) => sentence.trim()).filter((sentence) => sentence.length >= 12);
}

/** The sentence as quote — cut around `index` with "…" when it is too long. */
export function quoteAround(sentence: string, index: number, length: number): string {
  if (sentence.length <= QUOTE_MAX) return sentence;
  const start = Math.max(0, index - QUOTE_CONTEXT);
  const end = Math.min(sentence.length, index + length + QUOTE_CONTEXT);
  return `${start > 0 ? "…" : ""}${sentence.slice(start, end).trim()}${end < sentence.length ? "…" : ""}`;
}

/** Lower case, no hyphenation, single spaces, unified quotes — for comparing quotes with pages. */
export function normalizeForMatch(text: string): string {
  return cleanPageText(text)
    .toLowerCase()
    .replace(/[„“”"«»]/g, '"')
    .replace(/[‚‘’']/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

/** True when every "…"-separated piece of the quote stands on the page, in order. */
export function quoteStandsOnPage(quote: string, pageText: string): boolean {
  const page = normalizeForMatch(pageText);
  const pieces = normalizeForMatch(quote)
    .split("…")
    .map((piece) => piece.trim())
    .filter(Boolean);
  if (pieces.length === 0 || pieces.join("").length < 12) return false;
  let from = 0;
  for (const piece of pieces) {
    const at = page.indexOf(piece, from);
    if (at === -1) return false;
    from = at + piece.length;
  }
  return true;
}
