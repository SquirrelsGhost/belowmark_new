import { REPORT_RULES, stanceOf } from "@/lib/report/reportRules";
import { quoteAround } from "@/lib/report/reportText";
import { Listing } from "@/types/listing.types";
import { GutachtenReport, ReportKind, RiskCheck, RiskEvidence, RiskItem, RiskKey, RiskLevel } from "@/types/report.types";

/** Order of the traffic light rows. */
export const RISK_KEYS: RiskKey[] = ["residence", "usufruct", "tenancy", "heritage", "leasehold"];

/**
 * How serious a risk is when a source says it exists. Wohnrecht, Nießbrauch
 * and Erbbaurecht can stay with the property after the Zuschlag and take use
 * or value away — red. Tenants and listed status are workable but cost time
 * and money — yellow.
 */
const PRESENT_LEVEL: Record<RiskKey, RiskLevel> = {
  residence: "red",
  usufruct: "red",
  leasehold: "red",
  tenancy: "yellow",
  heritage: "yellow",
};

/**
 * Remarks of the snapshot that come straight from the notice text and speak to
 * a risk. Generic remarks (e.g. "kein belastbarer Vergleich", which names
 * Erbbaurecht only as an example) are deliberately not listed.
 */
const NOTICE_CAVEATS: Partial<Record<string, RiskKey>> = {
  "Mieter oder Besetzung": "tenancy",
  "Sit-Schutzgebiet": "heritage",
};

/** Notice fields that carry the notice's own wording. */
function noticeTexts(listing: Listing): string[] {
  return [listing.title, listing.segmentLabel, listing.market === "TR" ? listing.street : null].filter((text): text is string => Boolean(text));
}

/** What the official notice itself says about a risk — only its own words or remarks read from it. */
function noticeEvidence(listing: Listing, key: RiskKey): RiskEvidence[] {
  const language = listing.market === "TR" ? "tr" : "de";
  const rule = REPORT_RULES[language].kinds.find((candidate) => candidate.kind === key);
  const evidence: RiskEvidence[] = [];
  const seen = new Set<string>();
  if (rule) {
    for (const text of noticeTexts(listing)) {
      const hit = rule.match.exec(text);
      if (!hit) continue;
      const quote = quoteAround(text, hit.index, hit[0].length);
      if (seen.has(quote)) continue;
      seen.add(quote);
      evidence.push({ source: "notice", stance: stanceOf(rule, text, hit, language), quote, page: null, url: listing.officialUrl });
    }
  }
  for (const caveat of listing.caveats) {
    if (NOTICE_CAVEATS[caveat.short] === key) {
      evidence.push({ source: "notice", stance: "present", quote: `${caveat.short}: ${caveat.long}`, page: null, url: listing.officialUrl });
    }
  }
  return evidence;
}

function reportEvidence(report: GutachtenReport | null, key: RiskKey): RiskEvidence[] {
  if (!report) return [];
  const kind: ReportKind = key;
  return report.findings
    .filter((finding) => finding.kind === kind)
    .map((finding) => ({ source: "report" as const, stance: finding.stance, quote: finding.quote, page: finding.page, url: null }));
}

/** Present beats unclear beats absent; without any source the light stays grey. */
function levelOf(key: RiskKey, evidence: RiskEvidence[]): RiskLevel {
  if (evidence.some((item) => item.stance === "present")) return PRESENT_LEVEL[key];
  if (evidence.some((item) => item.stance === "unclear")) return "yellow";
  if (evidence.some((item) => item.stance === "absent")) return "green";
  return "unknown";
}

/** The traffic light for one proceeding, from the notice and — if uploaded — the Gutachten. */
export function buildRiskCheck(listing: Listing, report: GutachtenReport | null): RiskCheck {
  const items: RiskItem[] = RISK_KEYS.map((key) => {
    const evidence = [...noticeEvidence(listing, key), ...reportEvidence(report, key)];
    const stances = new Set(evidence.map((item) => item.stance));
    return { key, level: levelOf(key, evidence), conflicting: stances.has("present") && stances.has("absent"), evidence };
  });
  return { items, withReport: report !== null };
}
