// Renders the printed exposé from the seller's inputs (localStorage) and photos (IndexedDB)
"use client";

import { ReactNode, useMemo } from "react";
import BidderFileSection from "@/components/bidderFile/BidderFileSection";
import ExposeContact from "@/components/expose/ExposeContact";
import ExposeCover from "@/components/expose/ExposeCover";
import ExposeEnergy from "@/components/expose/ExposeEnergy";
import ExposeFactsTable from "@/components/expose/ExposeFactsTable";
import ExposeGallery from "@/components/expose/ExposeGallery";
import ExposeOrigin from "@/components/expose/ExposeOrigin";
import ExposePriceBlock from "@/components/expose/ExposePriceBlock";
import ExposeText from "@/components/expose/ExposeText";
import { useExpose } from "@/hooks/useExpose";
import { useExposePhotos } from "@/hooks/useExposePhotos";
import { fill, formatMoney } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { COVER_FACTS } from "@/lib/expose/exposeConstants";
import { exposeAddress, resolveFacts } from "@/lib/expose/exposeFacts";
import { formatPercent } from "@/lib/format";
import { IExposeTranslation } from "@/translations/expose/IExposeTranslation";
import { ExposeBase } from "@/types/expose.types";

interface ExposeDocumentProps {
  base: ExposeBase;
  locale: LocaleOption;
  printedAt: string;
  labels: IExposeTranslation;
}

/** The exposé itself — the only part that is printed. */
export default function ExposeDocument({ base, locale, printedAt, labels }: ExposeDocumentProps) {
  const { inputs } = useExpose(base.listingKey);
  const { photos } = useExposePhotos(base.listingKey);
  const { Sheet, Facts } = labels;
  const market = base.market;
  const money = (amount: number) => formatMoney(amount, market, locale);
  const lines = useMemo(() => resolveFacts(base, inputs, locale), [base, inputs, locale]);
  const fact = (key: (typeof lines)[number]["key"]) => lines.find((line) => line.key === key)?.value ?? null;
  const address = exposeAddress(base, inputs) || Sheet.AddressOnRequest;
  const isAgent = inputs.sellerRole === "agent";
  const commission = !isAgent
    ? { text: inputs.sellerRole === "private" ? Sheet.CommissionNone : Sheet.CommissionMissing, missing: inputs.sellerRole === null }
    : inputs.commissionPct === null
      ? { text: Sheet.CommissionMissing, missing: true }
      : { text: inputs.commissionPct === 0 ? Sheet.CommissionNone : fill(Sheet.CommissionBuyer, { pct: formatPercent(inputs.commissionPct, locale).replace(/\s?%/, "") }), missing: false };
  const extra = [
    { label: Sheet.Condition, value: inputs.condition ? Facts.Conditions[inputs.condition] : null },
    {
      label: Sheet.Occupancy,
      value: inputs.occupancy
        ? [Facts.Occupancies[inputs.occupancy], inputs.occupancy === "rented" && inputs.netRent !== null ? fill(Sheet.Rent, { amount: money(inputs.netRent) }) : null].filter(Boolean).join(" · ")
        : null,
    },
    { label: Sheet.AvailableFrom, value: inputs.availableFrom.trim() || null },
    { label: Sheet.Heating, value: inputs.heating.trim() || null },
  ];

  const sections: { key: string; title: string; body: ReactNode }[] = [
    { key: "facts", title: Sheet.Sections.facts, body: <ExposeFactsTable lines={lines} extra={extra} reportDate={base.reportDate} labels={Facts} /> },
    { key: "description", title: Sheet.Sections.description, body: <ExposeText text={inputs.description} missing={Sheet.TextMissing} /> },
    ...(inputs.location.trim() ? [{ key: "location", title: Sheet.Sections.location, body: <ExposeText text={inputs.location} /> }] : []),
    ...(inputs.features.trim() ? [{ key: "features", title: Sheet.Sections.features, body: <ExposeText text={inputs.features} asList /> }] : []),
    { key: "energy", title: Sheet.Sections.energy, body: <ExposeEnergy inputs={inputs} market={market} yearBuilt={fact("yearBuilt")} locale={locale} labels={labels.Energy} /> },
    ...(photos.length > 1 ? [{ key: "photos", title: Sheet.Sections.photos, body: <ExposeGallery photos={photos.slice(1)} /> }] : []),
    { key: "contact", title: Sheet.Sections.contact, body: <ExposeContact inputs={inputs} market={market} labels={labels.Contact} /> },
    {
      key: "origin",
      title: Sheet.Sections.origin,
      body: <ExposeOrigin lead={labels.Origin.Lead} disclaimer={labels.Origin.Disclaimer[market]} madeWith={Sheet.MadeWith} printedAt={fill(Sheet.PrintedAt, { date: printedAt })} />,
    },
  ];

  return (
    <>
      <ExposeCover
        kicker={[Sheet.Kicker[market], base.segmentLabel].filter(Boolean).join(" · ")}
        headline={inputs.headline.trim() || null}
        headlineMissing={Sheet.HeadlineMissing}
        address={address}
        photo={photos[0] ?? null}
        noPhoto={Sheet.NoPhoto}
        notice={base.isShare ? fill(Sheet.ShareNote, { share: fact("share") ?? "" }) : undefined}
      >
        <ExposePriceBlock
          label={Sheet.PriceTypes[inputs.priceType ?? "none"]}
          price={inputs.askingPrice ? money(inputs.askingPrice) : null}
          missing={Sheet.PriceMissing}
          commission={commission.text}
          commissionMissing={commission.missing}
          keyFacts={COVER_FACTS[market].map((key) => ({ label: Facts.Labels[key], value: fact(key) }))}
          factMissing={Facts.Missing}
        />
      </ExposeCover>
      {sections.map((section, index) => (
        <BidderFileSection key={section.key} number={String(index + 1).padStart(2, "0")} title={section.title}>
          {section.body}
        </BidderFileSection>
      ))}
    </>
  );
}
