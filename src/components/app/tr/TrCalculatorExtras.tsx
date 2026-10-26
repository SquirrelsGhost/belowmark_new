import TrCurrencyConverter from "@/components/app/tr/TrCurrencyConverter";
import TrPanel from "@/components/app/tr/TrPanel";
import TrPanelNote from "@/components/app/tr/TrPanelNote";
import { fill } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { formatRate } from "@/lib/tr/trFormat";
import { TranslationService } from "@/services/TranslationService";
import { TrIndicatorService } from "@/services/TrIndicatorService";
import { TrMarketTranslations } from "@/translations/trMarket/TrMarketTranslations";

interface TrCalculatorExtrasProps {
  locale: LocaleOption;
  now: number;
  initialLira: number;
}

/** Currency converter under the İcra calculator — only with a current central bank rate. */
export default async function TrCalculatorExtras({ locale, now, initialLira }: TrCalculatorExtrasProps) {
  const [{ Converter, Euro }, { euro, euroDate }] = await Promise.all([TranslationService.GetUserLocale().then((userLocale) => TrMarketTranslations[userLocale]), TrIndicatorService.get(now)]);

  if (!euro) {
    const last = euroDate ? fill(Euro.LastRate, { date: formatDate(euroDate, locale) }) : "";
    return (
      <div className="mt-10">
        <TrPanel title={Converter.Title}>
          <TrPanelNote text={fill(Converter.Unavailable, { last })} tone="caution" />
        </TrPanel>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <TrCurrencyConverter
        title={Converter.Title}
        subtitle={Converter.Subtitle}
        liraLabel={Converter.Lira}
        euroLabel={Converter.Euro}
        rate={euro.eur.buying}
        rateLine={`${fill(Euro.Rate, { rate: formatRate(euro.eur.buying, locale), date: formatDate(euro.meta.date, locale) })}. ${Euro.Note}`}
        locale={locale}
        initialLira={initialLira}
      />
    </div>
  );
}
