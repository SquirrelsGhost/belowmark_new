import "server-only";
import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { extractFacts, extractFindings } from "@/lib/report/extractFindings";
import { normalizeForMatch } from "@/lib/report/reportText";
import { ReportAiService } from "@/services/ReportAiService";
import { ReportPdfService } from "@/services/ReportPdfService";
import { Listing } from "@/types/listing.types";
import { GutachtenReport, ReportFinding, ReportLanguage } from "@/types/report.types";

/**
 * Where analyses live: one JSON per user and proceeding under .data/ (already
 * git-ignored). The PDF itself is never stored — only page numbers and quotes.
 * Kept behind this service so it can move to Postgres without touching the UI.
 */
const STORE_DIR = join(process.cwd(), ".data", "gutachten");

const hash = (value: string | Uint8Array) => createHash("sha256").update(value).digest("hex");

function storePath(userId: string, listingKey: string): string {
  const safeUser = userId.replace(/[^\w-]/g, "");
  return join(STORE_DIR, safeUser, `${hash(listingKey).slice(0, 32)}.json`);
}

/** Same subject, same page, one quote inside the other — the fixed reader's sentence wins, Claude's note is kept. */
function mergeFindings(rules: ReportFinding[], ai: ReportFinding[]): ReportFinding[] {
  const merged = rules.map((finding) => ({ ...finding }));
  for (const candidate of ai) {
    const quote = normalizeForMatch(candidate.quote).replace(/…/g, "");
    const twin = merged.find((finding) => {
      if (finding.kind !== candidate.kind || finding.page !== candidate.page) return false;
      const other = normalizeForMatch(finding.quote).replace(/…/g, "");
      return other.includes(quote) || quote.includes(other);
    });
    if (twin) {
      twin.note = twin.note ?? candidate.note;
      if (twin.stance === "present" && candidate.stance !== "present") twin.stance = candidate.stance;
    } else {
      merged.push(candidate);
    }
  }
  return merged.sort((a, b) => a.page - b.page);
}

export class ReportError extends Error {
  constructor(readonly code: "notPdf" | "tooManyPages" | "noText" | "unreadable") {
    super(code);
  }
}

/**
 * ReportService
 *
 * Turns an uploaded Gutachten into page-referenced findings and keeps the
 * latest analysis per user and proceeding.
 */
export class ReportService {
  static get = async (userId: string, listingKey: string): Promise<GutachtenReport | null> => {
    try {
      const report = JSON.parse(await readFile(storePath(userId, listingKey), "utf8")) as GutachtenReport;
      return report.listingKey === listingKey ? report : null;
    } catch {
      return null;
    }
  };

  static remove = async (userId: string, listingKey: string): Promise<void> => {
    await rm(storePath(userId, listingKey), { force: true });
  };

  static analyze = async (userId: string, listing: Listing, fileName: string, bytes: Uint8Array, maxPages: number): Promise<GutachtenReport> => {
    if (!ReportPdfService.looksLikePdf(bytes)) throw new ReportError("notPdf");
    const id = hash(bytes).slice(0, 16);
    let read;
    try {
      read = await ReportPdfService.readPages(bytes);
    } catch (error) {
      console.error("[ReportService.analyze] pdf", error);
      throw new ReportError("unreadable");
    }
    if (read.pageCount > maxPages) throw new ReportError("tooManyPages");
    const textPageCount = read.pages.filter((page) => page.length > 40).length;
    if (textPageCount === 0) throw new ReportError("noText");

    const language: ReportLanguage = listing.market === "TR" ? "tr" : "de";
    const rules = extractFindings(read.pages, language);
    let ai = { findings: [] as ReportFinding[], dropped: 0 };
    let usedAi = false;
    if (ReportAiService.isEnabled()) {
      try {
        ai = await ReportAiService.read(read.pages, language);
        usedAi = true;
      } catch (error) {
        // The fixed reader's result stands on its own; Claude is a bonus.
        console.error("[ReportService.analyze] ai", error);
      }
    }

    const report: GutachtenReport = {
      id,
      listingKey: listing.key,
      fileName: fileName.slice(0, 160),
      pageCount: read.pageCount,
      textPageCount,
      analyzedAt: new Date().toISOString(),
      language,
      method: usedAi ? "rules+ai" : "rules",
      droppedAiQuotes: ai.dropped,
      findings: mergeFindings(rules, ai.findings),
      facts: extractFacts(read.pages, language),
    };
    const path = storePath(userId, listing.key);
    await mkdir(join(path, ".."), { recursive: true });
    await writeFile(path, JSON.stringify(report), "utf8");
    return report;
  };
}
