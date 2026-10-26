import "server-only";
import { getBidContext } from "@/lib/bidding/bidContext";
import { listingHref } from "@/lib/appConstants";
import { getPlaceTitle, getStatusLabel } from "@/lib/listingLabels";
import { getHearingStatus, getNextDate } from "@/lib/listingMath";
import { buildVerdictEvidence } from "@/lib/verdict/verdictEvidence";
import { AppViewer } from "@/services/AppSessionService";
import { ListingService } from "@/services/ListingService";
import { ReportService } from "@/services/ReportService";
import { WatchlistService } from "@/services/WatchlistService";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { PortfolioSource } from "@/types/portfolio.types";

export interface PortfolioData {
  sources: PortfolioSource[];
  /** Saved keys the current snapshot no longer carries */
  missing: string[];
}

/**
 * PortfolioService
 *
 * Everything the server knows about the saved proceedings — notice, the user's
 * Gutachten analysis — as plain data. The bidder's own figures (bid limit,
 * answers, Zuschlag) live in the browser and are applied there.
 */
export class PortfolioService {
  static getSources = async (viewer: AppViewer, app: IAppTranslation): Promise<PortfolioData> => {
    const entries = await WatchlistService.list(viewer.id);
    const listings = await ListingService.getMany(viewer.market, entries.map((entry) => entry.listingId));
    const notes = new Map(entries.map((entry) => [entry.listingId, entry.note]));
    const found = new Set(listings.map((listing) => listing.key));

    const sources = await Promise.all(
      listings.map(async (listing): Promise<PortfolioSource> => {
        const status = getHearingStatus(listing, viewer.now);
        const report = await ReportService.get(viewer.id, listing.key);
        return {
          key: listing.key,
          market: listing.market,
          title: `${getPlaceTitle(listing)} · ${app.Segments[listing.segment]}`,
          subtitle: `${listing.authority} · ${listing.fileNo}`,
          href: listingHref(listing.key),
          segment: app.Segments[listing.segment],
          hearingState: status.state,
          statusLabel: getStatusLabel(status, app.Row),
          hearingAt: getNextDate(listing, viewer.now),
          appraisedValue: listing.appraisedValue,
          context: getBidContext(listing),
          evidence: buildVerdictEvidence(listing, report, viewer.now),
          note: notes.get(listing.key) ?? null,
        };
      }),
    );
    sources.sort((a, b) => (a.hearingAt ?? "").localeCompare(b.hearingAt ?? ""));
    return { sources, missing: entries.map((entry) => entry.listingId).filter((key) => !found.has(key)) };
  };
}
