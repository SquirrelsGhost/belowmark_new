import { ClientSharePayload } from "@/types/clientShare.types";

/** Parts of the public page in reading order: the verdict first, sources last. */
export type PublicSection = "verdict" | "hearing" | "facts" | "money" | "limit" | "financing" | "sources";

/** Which parts the page shows, each with its printed number ("01", "02" …). */
export function publicSections(payload: ClientSharePayload): Record<PublicSection, string | null> {
  const wants = (section: "verdict" | "limit" | "financing") => payload.sections.includes(section);
  const order: [PublicSection, boolean][] = [
    ["verdict", wants("verdict") && payload.evidence !== null],
    ["hearing", true],
    ["facts", true],
    ["money", true],
    ["limit", wants("limit") && payload.context !== null],
    ["financing", wants("financing") && payload.context !== null && payload.bank !== null],
    ["sources", true],
  ];
  let next = 0;
  const numbers = {} as Record<PublicSection, string | null>;
  for (const [section, isShown] of order) numbers[section] = isShown ? String(++next).padStart(2, "0") : null;
  return numbers;
}
