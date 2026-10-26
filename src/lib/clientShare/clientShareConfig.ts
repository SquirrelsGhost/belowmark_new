import { ClientShareSection } from "@/types/clientShare.types";

/** Constants of the client links ("Kundenlinks") and the broker letterhead. */

export const CLIENT_SHARE_ROUTES = {
  /** Broker's page: letterhead and all links */
  manage: "/app/kunden",
  /** Public page of one link, followed by the token */
  public: "/k",
} as const;

export const clientShareHref = (token: string, autoPrint = false): string =>
  `${CLIENT_SHARE_ROUTES.public}/${encodeURIComponent(token)}${autoPrint ? `?${CLIENT_SHARE_PRINT_PARAM}=1` : ""}`;

/** URL flag that opens the print dialog on the public page (PDF for the client). */
export const CLIENT_SHARE_PRINT_PARAM = "drucken";

export const CLIENT_SHARE_SECTIONS: ClientShareSection[] = ["verdict", "limit", "financing"];

export const CLIENT_SHARE = {
  /** Days a link stays readable; the broker picks one, there is no "forever" */
  expiryDays: [7, 30, 90] as const,
  defaultExpiryDays: 30,
  /** Links per account that are not yet expired or revoked */
  maxOpenPerOwner: 200,
  labelMax: 80,
  messageMax: 1200,
  /** Bytes of randomness in a token (base64url, 43 characters) */
  tokenBytes: 32,
  /** Expired or revoked links are deleted this many days after they stopped working */
  purgeAfterDays: 30,
  /** Raw logo size; PNG, JPEG or WebP only — SVG can carry script */
  logoMaxBytes: 300_000,
  displayNameMax: 120,
  contactMax: 200,
  urlMax: 200,
  /** Minimum contrast of the accent colour against white text (WCAG AA large text) */
  minAccentContrast: 3,
} as const;

export type ExpiryDays = (typeof CLIENT_SHARE.expiryDays)[number];

export const isExpiryDays = (value: number): value is ExpiryDays => (CLIENT_SHARE.expiryDays as readonly number[]).includes(value);
