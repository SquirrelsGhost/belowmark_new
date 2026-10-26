import { getBidContext } from "@/lib/bidding/bidContext";
import { LocaleOption } from "@/lib/constants";
import { buildVerdictEvidence } from "@/lib/verdict/verdictEvidence";
import { VerdictNames } from "@/lib/verdict/verdictText";
import { ReportService } from "@/services/ReportService";
import { getBiddingTranslation } from "@/translations/bidding/BiddingTranslations";
import { ReportTranslations } from "@/translations/report/ReportTranslations";
import { Locale } from "@/translations/Translations";
import { BidContext } from "@/types/bidding.types";
import { Listing } from "@/types/listing.types";
import { VerdictEvidence } from "@/types/verdict.types";

/** What the browser needs to rebuild the verdict with the bidder's own figures. */
export interface VerdictInput {
  evidence: VerdictEvidence;
  context: BidContext | null;
  names: VerdictNames;
}

export class VerdictService {
  /** Notice, the user's Gutachten analysis and the risk check for one proceeding, as plain data. */
  static getSource = async (listing: Listing, userId: string, locale: LocaleOption, now: number): Promise<VerdictInput> => {
    const report = await ReportService.get(userId, listing.key);
    return {
      evidence: buildVerdictEvidence(listing, report, now),
      context: getBidContext(listing),
      names: {
        risks: ReportTranslations[locale === "tr" ? Locale.TR : Locale.DE].Risk.Names,
        criteria: getBiddingTranslation(locale).Limit.Result.Criteria,
      },
    };
  };
}
