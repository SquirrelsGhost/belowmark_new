import { MarketCode } from "@/lib/constants";
import { BankFileInputs, DepositMethod, PropertyUse } from "@/types/bankFile.types";

/**
 * Constants of the bank file. Kept apart from the bidding constants so this
 * feature can change on its own.
 */

/** Route of the printable bank file — outside /app so the app chrome is not printed. */
export const BANK_FILE_ROUTE = "/bankmappe";

/** URL flag that opens the print dialog right away. */
export const BANK_FILE_PRINT_PARAM = "drucken";

export const bankFileHref = (key: string, autoPrint = false): string =>
  `${BANK_FILE_ROUTE}/${encodeURIComponent(key)}${autoPrint ? `?${BANK_FILE_PRINT_PARAM}=1` : ""}`;

/** localStorage key, one per proceeding. */
export const BANK_FILE_STORAGE = "belowmark:bankmappe:";

export const bankFileKey = (listingId: string) => `${BANK_FILE_STORAGE}${listingId}`;

/** Every field starts empty — no bid, no rate, no name is put in the bidder's mouth. */
export const EMPTY_BANK_FILE_INPUTS: BankFileInputs = {
  plannedBid: null,
  fixedYears: null,
  depositMethod: null,
  use: null,
  applicant: "",
};

/** The ways a deposit can be provided, per market. Cash is excluded in Germany (§ 69 Abs. 1 ZVG). */
export const DEPOSIT_METHODS: Record<MarketCode, DepositMethod[]> = {
  DE: ["cheque", "guarantee", "transfer"],
  TR: ["portal"],
};

/** Methods where the money itself lies with the court and counts as paid (§ 107 Abs. 3 ZVG). */
export const CASH_DEPOSIT_METHODS: DepositMethod[] = ["cheque", "transfer", "portal"];

export const PROPERTY_USES: PropertyUse[] = ["own", "rent", "resale"];

export const APPLICANT_MAX = 120;

/** Statute pages the file cites. */
export const BANK_FILE_LAWS = {
  zvg: "https://www.gesetze-im-internet.de/zvg/",
  zvg68: "https://www.gesetze-im-internet.de/zvg/__68.html",
  zvg69: "https://www.gesetze-im-internet.de/zvg/__69.html",
  zvg49: "https://www.gesetze-im-internet.de/zvg/__49.html",
  zvg107: "https://www.gesetze-im-internet.de/zvg/__107.html",
  zvg118: "https://www.gesetze-im-internet.de/zvg/__118.html",
  zvg130: "https://www.gesetze-im-internet.de/zvg/__130.html",
  grestg: "https://www.gesetze-im-internet.de/grestg_1983/",
  gewo34i: "https://www.gesetze-im-internet.de/gewo/__34i.html",
  iik: "https://www.mevzuat.gov.tr/mevzuatmetin/1.3.2004.pdf",
  esatis: "https://esatis.uyap.gov.tr/",
} as const;

/** Unit shown inside money inputs. */
export const CURRENCY_SUFFIX: Record<MarketCode, string> = { DE: "€", TR: "₺" };
