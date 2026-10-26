import ClientShareTeaser from "@/components/app/clientShare/ClientShareTeaser";
import { getProUser } from "@/lib/clientShare/proAccess";
import { LocaleOption } from "@/lib/constants";
import { BrokerBrandService } from "@/services/BrokerBrandService";
import { getClientShareTranslation } from "@/translations/clientShare/ClientShareTranslations";

interface ClientShareAreaProps {
  listingKey: string;
  locale: LocaleOption;
  /** Free plan: nothing here — the Aktenblatt already shows what full access adds */
  isLocked: boolean;
}

/** Loads Pro access and the letterhead, so the Aktenblatt needs one line for the client-link block. */
export default async function ClientShareArea({ listingKey, locale, isLocked }: ClientShareAreaProps) {
  if (isLocked) return null;
  const user = await getProUser();
  if (!user) return null;
  const brand = user.isPro ? await BrokerBrandService.get(user.id) : null;
  return <ClientShareTeaser listingKey={listingKey} locale={locale} isPro={user.isPro} hasBrand={brand !== null} labels={getClientShareTranslation(locale)} />;
}
