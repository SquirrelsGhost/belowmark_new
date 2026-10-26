import { formatArea } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { ExposeBase, ExposeBaseFact } from "@/types/expose.types";
import { Listing, OfficialPortalDetails } from "@/types/listing.types";
import { GutachtenReport, ReportFactKey } from "@/types/report.types";

/** Parser leftovers of the TR notices that are no real "nitelik" (e.g. "niteliğindeki taşınmaz"). */
const NITELIK_NOISE = /niteli|taşınmaz|sayılı|yüzölçüm|alanlı/i;
const ZONING_MAX = 240;
const WHOLE_SHARE = "1/1";

/** Gutachten facts the exposé may quote, mapped to its own keys. */
const REPORT_FACTS: Partial<Record<ReportFactKey, ExposeBaseFact["key"]>> = {
  livingArea: "livingArea",
  plotArea: "plotArea",
  yearBuilt: "yearBuilt",
};

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

function noticeFacts(listing: Listing, portal: OfficialPortalDetails | null, locale: LocaleOption): ExposeBaseFact[] {
  const facts: ExposeBaseFact[] = [];
  const area = (value: number | null | undefined, key: ExposeBaseFact["key"], source: ExposeBaseFact["source"]) => {
    if (value) facts.push({ key, value: formatArea(value, locale), source });
  };
  if (listing.market === "DE") {
    area(portal?.livingAreaM2, "livingArea", "portal");
    area(portal?.landAreaM2, "plotArea", "portal");
    return facts;
  }
  const tr = listing.tr;
  if (!tr) return facts;
  area(tr.landAreaM2, "plotArea", "notice");
  // The parser often writes the parcel area into both fields; an equal value says nothing about the building
  if (tr.buildingAreaM2 !== tr.landAreaM2) area(tr.buildingAreaM2, "buildingArea", "notice");
  if (tr.ada && tr.parsel) facts.push({ key: "parcel", value: `${tr.ada} / ${tr.parsel}`, source: "notice" });
  if (tr.nitelik && !NITELIK_NOISE.test(tr.nitelik)) facts.push({ key: "nitelik", value: tr.nitelik, source: "notice" });
  if (tr.zoning) facts.push({ key: "zoning", value: clip(tr.zoning, ZONING_MAX), source: "notice" });
  if (tr.ownershipShare) facts.push({ key: "share", value: tr.ownershipShare, source: "notice" });
  return facts;
}

function reportFacts(report: GutachtenReport | null): ExposeBaseFact[] {
  if (!report) return [];
  return report.facts.flatMap((fact) => {
    const key = REPORT_FACTS[fact.key];
    return key ? [{ key, value: fact.value, source: "report" as const, page: fact.page }] : [];
  });
}

/** The facts belowmark can source before the seller types anything — notice first, then the Gutachten. */
export function buildExposeBase(listing: Listing, portal: OfficialPortalDetails | null, report: GutachtenReport | null, locale: LocaleOption): ExposeBase {
  const tr = listing.tr;
  const share = tr?.ownershipShare ?? null;
  const mentionsShare = Boolean(tr?.excerpt && /hisse/i.test(tr.excerpt) && !/tam hisse/i.test(tr.excerpt));
  return {
    listingKey: listing.key,
    market: listing.market,
    place: listing.place ?? listing.region ?? listing.authority,
    region: listing.region,
    street: listing.market === "DE" ? listing.street : null,
    postcode: listing.postcode,
    mahalle: tr?.mahalle ?? null,
    segmentLabel: listing.segmentLabel,
    facts: [...noticeFacts(listing, portal, locale), ...reportFacts(report)],
    reportDate: report?.facts.find((fact) => fact.key === "valuationDate")?.value ?? null,
    isShare: share !== null && share !== WHOLE_SHARE,
    shareUnclear: share === null && mentionsShare,
  };
}
