import { parseBankFileInputs } from "@/lib/bankFile/bankFileStorage";
import { hasAnyInput, parseInputs } from "@/lib/bidding/biddingStorage";
import { CLIENT_SHARE_SECTIONS } from "@/lib/clientShare/clientShareConfig";
import { parseVerdictAnswers } from "@/lib/verdict/verdictAnswers";
import { BidContext } from "@/types/bidding.types";
import { ClientSharePayload, ClientShareSection, SharedBankInputs } from "@/types/clientShare.types";
import { VerdictEvidence } from "@/types/verdict.types";

/**
 * Builds the frozen copy of a link from what the browser sent (the broker's
 * stored figures, as raw JSON strings) and what the server knows (notice,
 * Gutachten evidence). Every browser value goes through the same parsers as
 * on the Aktenblatt, so nothing malformed or extra is ever stored.
 */

export function parseSections(values: string[]): ClientShareSection[] {
  return CLIENT_SHARE_SECTIONS.filter((section) => values.includes(section));
}

interface PayloadSource {
  sections: ClientShareSection[];
  context: BidContext | null;
  evidence: VerdictEvidence | null;
  rawInputs: string;
  rawAnswers: string;
  rawBank: string;
}

export function buildPayload({ sections, context, evidence, rawInputs, rawAnswers, rawBank }: PayloadSource): ClientSharePayload {
  const wants = (section: ClientShareSection) => sections.includes(section);
  const bidInputs = parseInputs(rawInputs);
  const { applicant: _applicant, ...bank } = parseBankFileInputs(rawBank);
  void _applicant;
  const needsInputs = wants("verdict") || wants("limit") || wants("financing");
  return {
    version: 1,
    sections,
    context,
    evidence: wants("verdict") ? evidence : null,
    bidInputs: needsInputs && hasAnyInput(bidInputs) ? bidInputs : null,
    answers: wants("verdict") ? parseVerdictAnswers(rawAnswers) : null,
    bank: wants("financing") ? (bank satisfies SharedBankInputs) : null,
  };
}

/** Reads a stored payload back; an unknown version shows nothing rather than something wrong. */
export function readPayload(value: unknown): ClientSharePayload | null {
  if (!value || typeof value !== "object") return null;
  const payload = value as ClientSharePayload;
  if (payload.version !== 1 || !Array.isArray(payload.sections)) return null;
  return { ...payload, sections: parseSections(payload.sections) };
}
