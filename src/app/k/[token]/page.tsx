import { Metadata } from "next";
import { connection } from "next/server";
import BidderFileFacts from "@/components/bidderFile/BidderFileFacts";
import BidderFileHearing from "@/components/bidderFile/BidderFileHearing";
import BidderFileMoney from "@/components/bidderFile/BidderFileMoney";
import BidderFileSection from "@/components/bidderFile/BidderFileSection";
import BidderFileSources from "@/components/bidderFile/BidderFileSources";
import ClientShareFinancing from "@/components/clientShare/ClientShareFinancing";
import ClientShareFooter from "@/components/clientShare/ClientShareFooter";
import ClientShareLetterhead from "@/components/clientShare/ClientShareLetterhead";
import ClientShareLimit from "@/components/clientShare/ClientShareLimit";
import ClientShareMessage from "@/components/clientShare/ClientShareMessage";
import ClientShareSheet from "@/components/clientShare/ClientShareSheet";
import ClientShareTitle from "@/components/clientShare/ClientShareTitle";
import ClientShareToolbar from "@/components/clientShare/ClientShareToolbar";
import ClientShareUnavailable from "@/components/clientShare/ClientShareUnavailable";
import ClientShareVerdict from "@/components/clientShare/ClientShareVerdict";
import PageNote from "@/components/ui/PageNote";
import { fill } from "@/lib/appFormat";
import { getFileSources, getHearingLines } from "@/lib/bidding/bidderFile";
import { EMPTY_BID_INPUTS } from "@/lib/bidding/biddingConstants";
import { CLIENT_SHARE_PRINT_PARAM } from "@/lib/clientShare/clientShareConfig";
import { publicSections } from "@/lib/clientShare/publicSections";
import { APP_NAME } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { getAddressLine, getPlaceTitle, getStatusLabel } from "@/lib/listingLabels";
import { getHearingStatus } from "@/lib/listingMath";
import { ClientShareService } from "@/services/ClientShareService";
import { ListingService } from "@/services/ListingService";
import { MetaTagService } from "@/services/MetaTagService";
import { TranslationService } from "@/services/TranslationService";
import { getBiddingTranslation } from "@/translations/bidding/BiddingTranslations";
import { ClientShareTranslations, getClientShareTranslation } from "@/translations/clientShare/ClientShareTranslations";
import { ReportTranslations } from "@/translations/report/ReportTranslations";
import { Locale } from "@/translations/Translations";
import { getVerdictTranslation } from "@/translations/verdict/VerdictTranslations";

// Reads the link from the database on every request (and counts the view).
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

/** Private by design: never indexed, and the token never leaves in a Referer header. */
export async function generateMetadata({ params }: PageProps<"/k/[token]">): Promise<Metadata> {
  await connection();
  const share = await ClientShareService.open((await params).token, false);
  const { MetaTags } = ClientShareTranslations[share?.locale === "tr" ? Locale.TR : Locale.DE];
  return { ...MetaTagService.CreateMetaTags(MetaTags.Public), robots: { index: false, follow: false }, referrer: "no-referrer" };
}

export default async function ClientSharePage({ params, searchParams }: PageProps<"/k/[token]">) {
  await connection();
  const share = await ClientShareService.open((await params).token, true);
  const listing = share ? await ListingService.getByKey(share.market, share.listingKey) : null;
  const locale = share?.locale ?? "de";
  const labels = getClientShareTranslation(locale);
  const P = labels.Public;

  if (!share || !listing) {
    return (
      <ClientShareSheet lang={locale} accent={null}>
        <ClientShareUnavailable title={P.Unavailable.Title} body={P.Unavailable.Body} />
      </ClientShareSheet>
    );
  }

  const t = TranslationService.GetTranslations(locale === "tr" ? Locale.TR : Locale.DE);
  const bidding = getBiddingTranslation(locale);
  const verdictLabels = getVerdictTranslation(locale);
  const { payload, brand, openedAt: now } = share;
  const L = t.App.Listing;
  const market = listing.market;
  const meta = await ListingService.getMeta(market);
  const hearing = getHearingLines(listing, getHearingStatus(listing, now), locale, t.App.Row);
  const numbers = publicSections(payload);
  const name = brand?.displayName ?? APP_NAME;
  const date = (value: Date | string) => formatDate(typeof value === "string" ? value : value.toISOString(), locale);
  const inputs = payload.bidInputs ?? EMPTY_BID_INPUTS;
  const autoPrint = (await searchParams)[CLIENT_SHARE_PRINT_PARAM] === "1";

  return (
    <ClientShareSheet lang={locale} accent={brand?.accentColor ?? null} toolbar={<ClientShareToolbar printLabel={P.Print} printHint={P.PrintHint} autoPrint={autoPrint} />}>
      <ClientShareLetterhead
        brand={brand}
        dates={[fill(P.AssessedAt, { date: date(share.createdAt) }), fill(P.DataAsOf, { date: date(meta.generatedAt) }), fill(P.ValidUntil, { date: date(share.expiresAt) })]}
      />
      <ClientShareTitle
        kicker={brand ? fill(P.PreparedBy, { name }) : P.Kicker}
        title={P.Title}
        fileNo={listing.fileNo}
        object={getPlaceTitle(listing)}
        subtitle={[listing.authority, t.App.Segments[listing.segment], getAddressLine(listing)].filter(Boolean).join(" · ")}
      />
      {share.message && <ClientShareMessage title={fill(P.MessageFrom, { name })} message={share.message} />}
      {numbers.verdict && payload.evidence && (
        <BidderFileSection number={numbers.verdict} title={P.Sections.verdict}>
          <ClientShareVerdict
            payload={payload}
            evidence={payload.evidence}
            labels={verdictLabels}
            names={{ risks: ReportTranslations[locale === "tr" ? Locale.TR : Locale.DE].Risk.Names, criteria: bidding.Limit.Result.Criteria }}
            locale={locale}
          />
        </BidderFileSection>
      )}
      <BidderFileSection number={numbers.hearing ?? ""} title={P.Sections.hearing}>
        <BidderFileHearing when={hearing.when} status={getStatusLabel(getHearingStatus(listing, now), t.App.Row)} rounds={hearing.rounds} notes={bidding.File.HearingNotes[market]} />
      </BidderFileSection>
      <BidderFileSection number={numbers.facts ?? ""} title={P.Sections.facts}>
        <BidderFileFacts listing={listing} labels={L} locale={locale} />
      </BidderFileSection>
      <BidderFileSection number={numbers.money ?? ""} title={P.Sections.money}>
        <BidderFileMoney listing={listing} labels={L} locale={locale} />
      </BidderFileSection>
      {numbers.limit && payload.context && (
        <BidderFileSection number={numbers.limit} title={P.Sections.limit}>
          {payload.bidInputs ? <ClientShareLimit context={payload.context} inputs={inputs} labels={bidding.Limit} locale={locale} /> : <PageNote variant="hatched" text={P.NoInputs} />}
        </BidderFileSection>
      )}
      {numbers.financing && payload.context && payload.bank && (
        <BidderFileSection number={numbers.financing} title={P.Sections.financing}>
          <ClientShareFinancing context={payload.context} inputs={inputs} bank={payload.bank} labels={P} costLabels={bidding.Limit.Costs} locale={locale} />
        </BidderFileSection>
      )}
      <BidderFileSection number={numbers.sources ?? ""} title={P.Sections.sources}>
        <BidderFileSources links={getFileSources(listing, bidding.File.SourceNames)} disclaimer={bidding.File.Disclaimer} />
      </BidderFileSection>
      <ClientShareFooter
        responsible={fill(P.Footer.Responsible, { name })}
        disclaimer={P.Footer.Disclaimer}
        privacy={P.Footer.Privacy}
        madeWith={P.Footer.MadeWith}
        imprintLabel={P.Footer.Imprint}
        imprintUrl={brand?.imprintUrl ?? null}
      />
    </ClientShareSheet>
  );
}
