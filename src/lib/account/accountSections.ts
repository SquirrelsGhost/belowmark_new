import { AUTH_ROUTES } from "@/lib/auth/authConfig";
import { AccountSectionKey } from "@/translations/account/IAccountTranslation";

/** The four parts of /konto, in navigation order. */
export const ACCOUNT_SECTIONS: readonly AccountSectionKey[] = ["uebersicht", "tarif", "sicherheit", "daten"] as const;

/** Query parameter that picks the part: /konto?bereich=tarif */
export const ACCOUNT_SECTION_PARAM = "bereich";

export const DEFAULT_ACCOUNT_SECTION: AccountSectionKey = "uebersicht";

/** Status notices that belong to a part other than the overview. */
const STATUS_SECTIONS: Record<string, AccountSectionKey> = { password_changed: "sicherheit", password_reset: "sicherheit" };

export const accountSectionHref = (section: AccountSectionKey): string =>
  section === DEFAULT_ACCOUNT_SECTION ? AUTH_ROUTES.account : `${AUTH_ROUTES.account}?${ACCOUNT_SECTION_PARAM}=${section}`;

/** The part to show: asked for in the URL, else where a payment or status notice belongs, else the overview. */
export function resolveAccountSection(requested: unknown, hasPaymentNotice: boolean, status: unknown): AccountSectionKey {
  if (typeof requested === "string" && (ACCOUNT_SECTIONS as readonly string[]).includes(requested)) return requested as AccountSectionKey;
  if (hasPaymentNotice) return "tarif";
  if (typeof status === "string" && status in STATUS_SECTIONS) return STATUS_SECTIONS[status];
  return DEFAULT_ACCOUNT_SECTION;
}
