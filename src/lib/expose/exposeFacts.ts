import { formatArea } from "@/lib/appFormat";
import { LocaleOption } from "@/lib/constants";
import { FACT_ORDER } from "@/lib/expose/exposeConstants";
import { ExposeBase, ExposeFactKey, ExposeFactLine, ExposeInputs } from "@/types/expose.types";

/** Digits only — "ca. 120 m²" and "120 m²" say the same, "118 m²" does not. */
const digits = (value: string) => value.replace(/\D/g, "");
const differs = (a: string, b: string) => (digits(a) && digits(b) ? digits(a) !== digits(b) : a !== b);

/** What the seller entered for a fact, formatted like the notice formats it. */
function ownValue(key: ExposeFactKey, inputs: ExposeInputs, base: ExposeBase, locale: LocaleOption): string | null {
  const area = (value: number | null) => (value === null ? null : formatArea(value, locale));
  switch (key) {
    case "livingArea":
      return base.market === "DE" ? area(inputs.livingArea) : null;
    case "buildingArea":
      return base.market === "TR" ? area(inputs.livingArea) : null;
    case "plotArea":
      return area(inputs.plotArea);
    case "rooms":
      return inputs.rooms === null ? null : String(inputs.rooms).replace(".", ",");
    case "yearBuilt":
      return inputs.yearBuilt === null ? null : String(Math.round(inputs.yearBuilt));
    default:
      return null;
  }
}

/**
 * One line per fact: the seller's value wins, else the notice, else the Gutachten.
 * A differing value of another source is kept next to it — never dropped.
 */
export function resolveFact(key: ExposeFactKey, base: ExposeBase, inputs: ExposeInputs, locale: LocaleOption): ExposeFactLine {
  const sourced = base.facts.filter((fact) => fact.key === key);
  const own = ownValue(key, inputs, base, locale);
  const candidates = [...(own === null ? [] : [{ value: own, source: "own" as const, page: undefined }]), ...sourced];
  const [first, ...rest] = candidates;
  if (!first) return { key, value: null, source: null };
  const other = rest.find((fact) => differs(fact.value, first.value));
  return {
    key,
    value: first.value,
    source: first.source,
    page: first.page,
    ...(other && { otherValue: other.value, otherSource: other.source, otherPage: other.page }),
  };
}

export const resolveFacts = (base: ExposeBase, inputs: ExposeInputs, locale: LocaleOption): ExposeFactLine[] =>
  FACT_ORDER[base.market].map((key) => resolveFact(key, base, inputs, locale));

/** The address line the seller chose to print: street only on request, never more than the notice says. */
export function exposeAddress(base: ExposeBase, inputs: ExposeInputs): string {
  if (base.market === "TR") return [base.mahalle, base.place, base.region].filter(Boolean).join(" · ");
  const town = [base.postcode, base.place].filter(Boolean).join(" ");
  return [inputs.addressMode === "exact" ? base.street : null, town].filter(Boolean).join(", ");
}

/** Any Gutachten figure ended up in the printed facts. */
export const usesReport = (lines: ExposeFactLine[]): boolean => lines.some((line) => line.source === "report" || line.otherSource === "report");
