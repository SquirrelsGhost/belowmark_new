import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { REPORT_AI } from "@/lib/report/reportConfig";
import { quoteStandsOnPage } from "@/lib/report/reportText";
import { ReportFinding, ReportKind, ReportLanguage, ReportTopic } from "@/types/report.types";

const KINDS = ["residence", "usufruct", "easement", "preemption", "rightsGeneral", "charges", "tenancy", "defects", "contamination", "heritage", "leasehold", "inspection"] as const;

const TOPIC_OF: Record<ReportKind, ReportTopic> = {
  residence: "rights",
  usufruct: "rights",
  easement: "rights",
  preemption: "rights",
  rightsGeneral: "rights",
  charges: "charges",
  tenancy: "tenancy",
  defects: "defects",
  contamination: "contamination",
  heritage: "heritage",
  leasehold: "leasehold",
  inspection: "inspection",
};

const AiFindings = z.object({
  findings: z.array(
    z.object({
      kind: z.enum(KINDS),
      stance: z.enum(["present", "absent", "unclear"]),
      page: z.number().int(),
      quote: z.string(),
      note: z.string(),
    }),
  ),
});

const SYSTEM = `Du liest ein Verkehrswertgutachten (Zwangsversteigerung) bzw. einen türkischen kıymet takdir raporu für einen Kaufinteressenten.
Grundsatz: Nichts wird erfunden. Jede Aussage braucht ein wörtliches Zitat aus genau der Seite, die du angibst.

Aufgabe: Finde die Stellen zu diesen Themen (kind):
- residence: Wohnrecht / Wohnungsrecht / oturma hakkı
- usufruct: Nießbrauch / intifa hakkı
- easement: Grunddienstbarkeiten, Wegerecht, Leitungsrecht, Baulasten, Reallasten, irtifak
- preemption: Vorkaufsrecht / şufa
- rightsGeneral: allgemeine Aussagen zu Abteilung II (Lasten und Beschränkungen) / şerhler
- charges: Abteilung III (Grundschulden, Hypotheken) / ipotek, haciz
- tenancy: Mieter, Mietverträge, Miethöhe, Leerstand, Eigennutzung, Besetzung
- defects: Mängel, Bauschäden, Feuchtigkeit, Schimmel, Instandhaltungs- oder Sanierungsstau
- contamination: Altlasten, Bodenverunreinigung, Schadstoffe
- heritage: Denkmalschutz, Ensembleschutz, sit alanı, tescil
- leasehold: Erbbaurecht, Erbbauzins / üst hakkı
- inspection: ob und wie besichtigt wurde (z. B. keine Innenbesichtigung)

stance: "present" = die Stelle sagt, dass es das gibt; "absent" = die Stelle sagt ausdrücklich, dass es das nicht gibt; "unclear" = die Stelle sagt, dass es offen, unbekannt oder nicht geprüft ist.

Regeln für quote:
- Wörtlich und zusammenhängend aus dem Seitentext kopieren, keine Umformulierung, keine Korrektur von Tippfehlern.
- 1 bis 2 Sätze, höchstens 300 Zeichen. Kürzen nur am Anfang oder Ende mit "…".
- page ist die Nummer aus <page n="…">.
note: ein kurzer Satz auf Deutsch, was die Stelle für einen Bieter bedeutet — nur was im Zitat steht.
Lieber eine Stelle weglassen als eine unsichere angeben. Höchstens 40 Stellen.`;

/** Pages as tagged text, cut at the character budget. */
function pagesPrompt(pages: string[]): string {
  const parts: string[] = [];
  let used = 0;
  pages.forEach((text, index) => {
    if (!text || used > REPORT_AI.maxChars) return;
    const slice = text.slice(0, REPORT_AI.maxChars - used);
    used += slice.length;
    parts.push(`<page n="${index + 1}">\n${slice}\n</page>`);
  });
  return parts.join("\n");
}

export interface AiReading {
  findings: ReportFinding[];
  dropped: number;
}

/**
 * ReportAiService
 *
 * Optional: lets Claude read the page texts as a second reader. Its answer is
 * only kept where the quote is found on the cited page — the same rule as
 * for the fixed reader. Without ANTHROPIC_API_KEY nothing is sent anywhere.
 */
export class ReportAiService {
  static isEnabled = (): boolean => {
    return Boolean(process.env.ANTHROPIC_API_KEY) && process.env.REPORT_AI !== "off";
  };

  static read = async (pages: string[], language: ReportLanguage): Promise<AiReading> => {
    const client = new Anthropic();
    const response = await client.beta.messages.parse({
      model: REPORT_AI.model,
      max_tokens: REPORT_AI.maxTokens,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: REPORT_AI.effort, format: betaZodOutputFormat(AiFindings) },
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Sprache des Gutachtens: ${language === "tr" ? "Türkisch" : "Deutsch"}.\n\n<gutachten>\n${pagesPrompt(pages)}\n</gutachten>`,
        },
      ],
    });
    if (response.stop_reason === "refusal" || !response.parsed_output) return { findings: [], dropped: 0 };

    let dropped = 0;
    const findings: ReportFinding[] = [];
    for (const item of response.parsed_output.findings) {
      const pageText = pages[item.page - 1];
      if (!pageText || !quoteStandsOnPage(item.quote, pageText)) {
        dropped += 1;
        continue;
      }
      findings.push({ topic: TOPIC_OF[item.kind], kind: item.kind, stance: item.stance, quote: item.quote.trim(), page: item.page, origin: "ai", note: item.note.trim() || undefined });
    }
    return { findings, dropped };
  };
}
