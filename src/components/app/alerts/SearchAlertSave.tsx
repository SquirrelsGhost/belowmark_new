import SaveAlertForm from "@/components/app/alerts/SaveAlertForm";
import { alertFormParams, alertSummary } from "@/lib/alerts/alertSummary";
import { toStoredFilters } from "@/lib/alerts/alertMatch";
import { LocaleOption, MarketCode } from "@/lib/constants";
import { TranslationService } from "@/services/TranslationService";
import { AlertsTranslations } from "@/translations/alerts/AlertsTranslations";
import { IAppTranslation } from "@/translations/app/IAppTranslation";
import { ListingFilters, RegionFacet } from "@/types/listing.types";

interface SearchAlertSaveProps {
  filters: ListingFilters;
  regions: RegionFacet[];
  market: MarketCode;
  segments: IAppTranslation["Segments"];
  locale: LocaleOption;
}

/** The save-as-alert form of the search page, with its strings and a suggested name. */
export default async function SearchAlertSave({ filters, regions, market, segments, locale }: SearchAlertSaveProps) {
  const { Save, Summary } = AlertsTranslations[await TranslationService.GetUserLocale()];
  const regionName = regions.find((region) => region.code === filters.region)?.name ?? null;
  const parts = alertSummary(toStoredFilters(filters, regionName), market, segments, Summary, locale);
  return <SaveAlertForm params={alertFormParams(filters)} defaultName={parts.join(" · ")} summary={parts.join(" · ")} labels={Save} />;
}
