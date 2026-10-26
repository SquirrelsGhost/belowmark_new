import { REPORT_RULES, stanceOf } from "@/lib/report/reportRules";
import { quoteAround, splitSentences } from "@/lib/report/reportText";
import { ReportFact, ReportFinding, ReportLanguage } from "@/types/report.types";

/** At most this many passages per subject, so a 60-page Gutachten stays readable. */
const MAX_PER_KIND = 6;

/**
 * Reads cleaned page texts with the fixed rules. Every finding is a sentence
 * that stands on the page as printed — nothing is paraphrased here.
 */
export function extractFindings(pages: string[], language: ReportLanguage): ReportFinding[] {
  const { kinds } = REPORT_RULES[language];
  const findings: ReportFinding[] = [];
  const perKind = new Map<string, number>();
  const seen = new Set<string>();

  pages.forEach((text, index) => {
    for (const sentence of splitSentences(text)) {
      for (const rule of kinds) {
        const hit = rule.match.exec(sentence);
        if (!hit) continue;
        const count = perKind.get(rule.kind) ?? 0;
        if (count >= MAX_PER_KIND) continue;
        const stance = stanceOf(rule, sentence, hit, language);
        const quote = quoteAround(sentence, hit.index, hit[0].length);
        const dedupe = `${rule.kind}|${quote}`;
        if (seen.has(dedupe)) continue;
        seen.add(dedupe);
        perKind.set(rule.kind, count + 1);
        findings.push({ topic: rule.topic, kind: rule.kind, stance, quote, page: index + 1, origin: "rules" });
      }
    }
  });
  return findings;
}

/** Key figures as printed; the first page that states a figure wins. */
export function extractFacts(pages: string[], language: ReportLanguage): ReportFact[] {
  const { facts } = REPORT_RULES[language];
  const found: ReportFact[] = [];
  for (const rule of facts) {
    for (let index = 0; index < pages.length; index += 1) {
      const sentence = splitSentences(pages[index]).find((candidate) => rule.match.test(candidate));
      const hit = sentence ? rule.match.exec(sentence) : null;
      if (!sentence || !hit) continue;
      found.push({ key: rule.key, value: hit[1].replace(/\s+/g, " ").trim(), quote: quoteAround(sentence, hit.index, hit[0].length), page: index + 1 });
      break;
    }
  }
  return found;
}
