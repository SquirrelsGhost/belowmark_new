import { BankFileInputs } from "@/types/bankFile.types";
import { BidContext, BidInputs } from "@/types/bidding.types";
import { MarketCode } from "@/lib/constants";
import { VerdictAnswers, VerdictEvidence } from "@/types/verdict.types";

/** Parts of a client link; the broker picks which ones the client sees. */
export type ClientShareSection = "verdict" | "limit" | "financing";

/** Bank file inputs without the applicant's name — the link never needs it. */
export type SharedBankInputs = Omit<BankFileInputs, "applicant">;

/**
 * What a client link shows, frozen when it is made: the broker's own figures
 * and answers, the notice facts the bid limit rests on, and the evidence of
 * the verdict (notice, Gutachten quotes, risk check). Later edits on the
 * Aktenblatt do not change a link that is already out.
 */
export interface ClientSharePayload {
  version: 1;
  sections: ClientShareSection[];
  context: BidContext | null;
  evidence: VerdictEvidence | null;
  bidInputs: BidInputs | null;
  answers: VerdictAnswers | null;
  bank: SharedBankInputs | null;
}

export type ClientShareStatus = "active" | "expired" | "revoked";

/** One link as the broker sees it in the list — never with the token. */
export interface ClientShareView {
  id: string;
  market: MarketCode;
  listingKey: string;
  locale: "de" | "tr";
  label: string | null;
  sections: ClientShareSection[];
  status: ClientShareStatus;
  createdAt: Date;
  expiresAt: Date;
  viewCount: number;
  lastViewedAt: Date | null;
}

/** The broker's letterhead as pages use it. */
export interface BrokerBrandView {
  displayName: string;
  contactLine: string | null;
  website: string | null;
  imprintUrl: string | null;
  accentColor: string | null;
  /** data: URL of the logo, null without one */
  logoSrc: string | null;
}

/** A link opened by its token: what the public page renders. */
export interface ResolvedClientShare {
  id: string;
  market: MarketCode;
  listingKey: string;
  locale: "de" | "tr";
  message: string | null;
  payload: ClientSharePayload;
  createdAt: Date;
  expiresAt: Date;
  brand: BrokerBrandView | null;
  /** Request time the link was opened at */
  openedAt: number;
}

/** Error codes of the client link actions; the UI turns them into words. */
export type ClientShareErrorCode =
  | "plan"
  | "invalid"
  | "notFound"
  | "noSection"
  | "limit"
  | "nameRequired"
  | "colorInvalid"
  | "colorTooLight"
  | "urlInvalid"
  | "logoType"
  | "logoSize"
  | "failed";
