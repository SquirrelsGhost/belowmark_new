import { Metadata } from "next";
import BrandForm from "@/components/app/clientShare/BrandForm";
import BrandLogoForm from "@/components/app/clientShare/BrandLogoForm";
import BrandPreview from "@/components/app/clientShare/BrandPreview";
import BrandSection from "@/components/app/clientShare/BrandSection";
import ClientShareLocked from "@/components/app/clientShare/ClientShareLocked";
import ClientSharePrivacy from "@/components/app/clientShare/ClientSharePrivacy";
import ShareActionButton from "@/components/app/clientShare/ShareActionButton";
import ShareCard from "@/components/app/clientShare/ShareCard";
import ShareList from "@/components/app/clientShare/ShareList";
import AppMain from "@/components/app/shell/AppMain";
import AppPageHeader from "@/components/app/shell/AppPageHeader";
import WatchlistEmpty from "@/components/app/watchlist/WatchlistEmpty";
import PageStack from "@/components/ui/PageStack";
import { APP_MAIN_ID, listingHref } from "@/lib/appConstants";
import { fill } from "@/lib/appFormat";
import { getAppPageContext } from "@/lib/appPage";
import { CLIENT_SHARE, CLIENT_SHARE_ROUTES } from "@/lib/clientShare/clientShareConfig";
import { getProUser } from "@/lib/clientShare/proAccess";
import { formatDate } from "@/lib/format";
import { getPlaceTitle } from "@/lib/listingLabels";
import { BrokerBrandService } from "@/services/BrokerBrandService";
import { ClientShareService } from "@/services/ClientShareService";
import { ListingService } from "@/services/ListingService";
import { MetaTagService } from "@/services/MetaTagService";
import { TranslationService } from "@/services/TranslationService";
import { ClientShareTranslations, getClientShareTranslation } from "@/translations/clientShare/ClientShareTranslations";
import { ClientShareView } from "@/types/clientShare.types";

// Reads the session cookie on every request.
// instant = false opts it out of prerender validation — rendering is still server-side.
// See: https://nextjs.org/docs/messages/blocking-prerender-runtime
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const { MetaTags } = ClientShareTranslations[await TranslationService.GetUserLocale()];
  return { ...MetaTagService.CreateMetaTags(MetaTags.Manage), robots: { index: false, follow: false } };
}

export default async function ClientSharesPage() {
  const { viewer, locale } = await getAppPageContext(CLIENT_SHARE_ROUTES.manage);
  const labels = getClientShareTranslation(locale);
  const { Manage, Brand, Links, Privacy, Public } = labels;
  const isPro = (await getProUser())?.isPro ?? false;
  const [brand, shares] = await Promise.all([BrokerBrandService.get(viewer.id), ClientShareService.list(viewer.id, viewer.now)]);
  const listings = await Promise.all(shares.map((share) => ListingService.getByKey(share.market, share.listingKey)));
  const date = (value: Date) => formatDate(value.toISOString(), locale);
  const open = shares.filter((share) => share.status === "active").length;
  const meta = (share: ClientShareView) =>
    [
      fill(Links.Created, { date: date(share.createdAt) }),
      share.status === "active" ? fill(Links.Expires, { date: date(share.expiresAt) }) : Links.Ended,
      share.viewCount === 1 ? Links.ViewsOne : fill(Links.Views, { count: share.viewCount }),
      share.lastViewedAt ? fill(Links.LastViewed, { date: date(share.lastViewedAt) }) : Links.NeverViewed,
      fill(Links.Language, { language: labels.Form.Languages[share.locale] }),
    ].join(" · ");

  return (
    <AppMain id={APP_MAIN_ID}>
      <AppPageHeader eyebrow={Manage.Eyebrow} title={Manage.Title} lead={Manage.Lead} />
      <PageStack variant="col12Top">
        {isPro ? (
          <BrandSection title={Brand.Title} lead={Brand.Lead}>
            <PageStack variant="col6">
              <BrandForm brand={brand} labels={labels} />
              <BrandLogoForm hasBrand={brand !== null} logoSrc={brand?.logoSrc ?? null} labels={labels} />
            </PageStack>
            <BrandPreview title={Brand.Preview} brand={brand} kicker={brand ? fill(Public.PreparedBy, { name: brand.displayName }) : Public.Kicker} sheetTitle={Public.Title} object="…" />
          </BrandSection>
        ) : (
          <ClientShareLocked title={Manage.Locked.Title} body={Manage.Locked.Body} cta={Manage.Locked.Cta} />
        )}

        {shares.length === 0 ? (
          isPro && <WatchlistEmpty title={Links.Empty.Title} body={Links.Empty.Body} cta={Links.Empty.Cta} />
        ) : (
          <ShareList title={Links.Title} usage={fill(Links.Usage, { count: open, max: CLIENT_SHARE.maxOpenPerOwner })} note={Links.Purge}>
            {shares.map((share, index) => (
              <ShareCard
                key={share.id}
                object={listings[index] ? getPlaceTitle(listings[index]) : share.listingKey}
                fileNo={listings[index]?.fileNo ?? ""}
                label={share.label}
                status={share.status}
                statusLabel={Links.Status[share.status]}
                meta={meta(share)}
                sections={share.sections.map((section) => labels.Form.SectionNames[section]).join(" · ")}
                listingHref={listingHref(share.listingKey)}
                listingLabel={Links.OpenListing}
              >
                {share.status === "active" && isPro && <ShareActionButton shareId={share.id} intent="renew" label={Links.Renew} errorLabel={Links.Error} created={labels.Created} renewedTitle={Links.RenewDone} />}
                {share.status === "active" && <ShareActionButton shareId={share.id} intent="revoke" label={Links.Revoke} errorLabel={Links.Error} />}
                <ShareActionButton shareId={share.id} intent="delete" label={Links.Delete} errorLabel={Links.Error} />
              </ShareCard>
            ))}
          </ShareList>
        )}

        <ClientSharePrivacy title={Privacy.Title} items={Privacy.Items} />
      </PageStack>
    </AppMain>
  );
}
