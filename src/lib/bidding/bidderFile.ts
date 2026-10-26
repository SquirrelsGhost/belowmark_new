import { fill, formatHearing } from "@/lib/appFormat";
import { COST_SOURCES, TR_AUCTION_PORTAL } from "@/lib/bidding/biddingConstants";
import { LocaleOption } from "@/lib/constants";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { IBiddingTranslation } from "@/translations/bidding/IBiddingTranslation";
import { HearingStatus, Listing } from "@/types/listing.types";

/** The hearing as the file prints it: the decisive date (or round span) and every round. */
export function getHearingLines(listing: Listing, status: HearingStatus, locale: LocaleOption, Row: IAppTranslation["Row"]): { when: string; rounds: string[] } {
  const market = listing.market;
  const iso = status.round?.start ?? listing.hearingAt;
  const when =
    status.round && status.round.end !== status.round.start
      ? `${formatHearing(status.round.start, market, locale)} – ${formatHearing(status.round.end, market, locale)}`
      : iso
        ? formatHearing(iso, market, locale)
        : Row.Unknown;
  const rounds = listing.rounds.map((round) => `${fill(Row.Round, { round: round.round })} · ${formatHearing(round.start, market, locale)} – ${formatHearing(round.end, market, locale)}`);
  return { when, rounds };
}

/** Every source the file rests on, official notice first. */
export function getFileSources(listing: Listing, names: IBiddingTranslation["File"]["SourceNames"]): { label: string; url: string }[] {
  const links = [{ label: names.notice, url: listing.officialUrl }];
  if (listing.documentUrl) links.push({ label: names.document, url: listing.documentUrl });
  if (listing.geoportalUrl) links.push({ label: listing.geoportalName ?? names.geoportal, url: listing.geoportalUrl });
  if (listing.market === "TR") return [...links, { label: names.esatis, url: TR_AUCTION_PORTAL.url }];
  return [...links, { label: names.zvg, url: COST_SOURCES.zvg }, { label: names.gkg, url: COST_SOURCES.gkg }, { label: names.gnotkg, url: COST_SOURCES.gnotkg }];
}
