import { MarketCode } from "../../lib/constants";
import { ExposeLaw } from "../../lib/expose/exposeConstants";
import { IMetaTags } from "../../services/MetaTagService";
import {
  ExposeCertType,
  ExposeCheckId,
  ExposeCheckState,
  ExposeCondition,
  ExposeFactKey,
  ExposeFactSource,
  ExposeOccupancy,
  ExposePriceType,
  ExposeSellerRole,
} from "../../types/expose.types";

/** A check of the screen panel: what to do, and on which rule it rests. `law` names a link in EXPOSE_LAWS. */
export interface ExposeCheckText {
  title: string;
  text: string;
  basis: string;
  law?: ExposeLaw;
}

/** A labelled input of the seller's form. */
export interface ExposeFieldText {
  label: string;
  hint: string;
}

/**
 * Strings of the resale exposé. Own namespace (like bidding and bankFile) so the
 * shared app dictionary stays untouched. Placeholders in braces are filled with `fill()`.
 * Legal texts exist per market in both languages.
 */
export interface IExposeTranslation {
  MetaTags: { Expose: IMetaTags };

  Teaser: {
    Eyebrow: string;
    Title: string;
    Lead: string;
    Button: string;
    ButtonHint: string;
  };

  Sheet: {
    Print: string;
    PrintHint: string;
    Back: string;
    Locked: string;
    Kicker: Record<MarketCode, string>;
    HeadlineMissing: string;
    AddressOnRequest: string;
    ShareNote: string;
    PriceMissing: string;
    PriceTypes: Record<ExposePriceType | "none", string>;
    CommissionNone: string;
    CommissionBuyer: string;
    CommissionMissing: string;
    NoPhoto: string;
    MadeWith: string;
    PrintedAt: string;
    Sections: Record<"facts" | "description" | "location" | "features" | "energy" | "photos" | "contact" | "origin", string>;
    TextMissing: string;
    Condition: string;
    Occupancy: string;
    AvailableFrom: string;
    Heating: string;
    Rent: string;
  };

  Facts: {
    Labels: Record<ExposeFactKey, string>;
    Sources: Record<ExposeFactSource, string>;
    ReportPage: string;
    ReportDate: string;
    Other: string;
    Missing: string;
    Conditions: Record<ExposeCondition, string>;
    Occupancies: Record<ExposeOccupancy, string>;
  };

  Energy: {
    Lead: Record<MarketCode, string>;
    Labels: Record<"certType" | "value" | "carrier" | "efficiencyClass" | "certIssued" | "yearBuilt", string>;
    CertTypes: Record<ExposeCertType, string>;
    NoCert: Record<MarketCode, string>;
    Missing: string;
    Unit: string;
  };

  Contact: {
    Labels: Record<"name" | "company" | "phone" | "email", string>;
    License: Record<MarketCode, string>;
    Roles: Record<ExposeSellerRole, string>;
    Missing: string;
    NotStated: string;
  };

  Origin: { Lead: string; Disclaimer: Record<MarketCode, string> };

  Form: {
    Title: string;
    Lead: string;
    StorageHint: string;
    Reset: string;
    Empty: string;
    Groups: Record<"offer" | "object" | "energy" | "texts" | "contact", string>;
    Fields: Record<
      | "headline"
      | "askingPrice"
      | "commissionPct"
      | "livingArea"
      | "plotArea"
      | "rooms"
      | "yearBuilt"
      | "netRent"
      | "availableFrom"
      | "heating"
      | "energyValue"
      | "energyCarrier"
      | "certIssued"
      | "description"
      | "location"
      | "features"
      | "contactName"
      | "contactCompany"
      | "contactPhone"
      | "contactEmail"
      | "licenseNo",
      ExposeFieldText
    >;
    LivingAreaLabel: Record<MarketCode, string>;
    Choices: Record<"priceType" | "sellerRole" | "condition" | "occupancy" | "certType" | "efficiencyClass" | "registered" | "addressMode", string>;
    Registered: Record<MarketCode, { yes: string; no: string }>;
    AddressModes: Record<"exact" | "place", string>;
    Counter: string;
  };

  Photos: {
    Title: string;
    Lead: string;
    Rights: string;
    Add: string;
    Remove: string;
    MakeTitle: string;
    TitlePhoto: string;
    Caption: string;
    Limit: string;
    Error: string;
    Busy: string;
    Empty: string;
  };

  Checks: {
    Title: string;
    Lead: string;
    States: Record<ExposeCheckState, string>;
    Items: Record<MarketCode, Partial<Record<ExposeCheckId, ExposeCheckText>>>;
    Summary: string;
  };

  Internal: {
    Title: string;
    Lead: string;
    NoHolding: string;
    Won: string;
    NotWon: string;
    Gap: string;
    Speculation: Record<MarketCode, string>;
    NoDate: string;
  };
}
