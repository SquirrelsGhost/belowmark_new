import { bankFileHref } from "@/lib/bankFile/bankFileConstants";
import { bidderFileHref } from "@/lib/bidding/bidContext";
import { DEADLINE_ANCHOR } from "@/lib/deadlines/deadlineConstants";
import { VERDICT_ANCHORS } from "@/lib/verdict/verdictConstants";
import { DeadlineStepText } from "@/translations/deadlines/IDeadlineTranslation";
import { DeadlineChecklistStep } from "@/types/deadline.types";
import { Listing } from "@/types/listing.types";

/** The official e-auction portal; bidding needs an e-Devlet login there. */
const ESATIS_URL = "https://esatis.uyap.gov.tr/";

/** Where each preparation step is done — the existing belowmark tools. */
function hrefFor(id: string, listing: Listing): string | null {
  switch (id) {
    case "gutachten":
      return `#${VERDICT_ANCHORS.report}`;
    case "inspection":
      return `#${VERDICT_ANCHORS.questions}`;
    case "limit":
      return `#${VERDICT_ANCHORS.limit}`;
    case "bank":
      return bankFileHref(listing.key);
    case "deposit":
      return `#${DEADLINE_ANCHOR}`;
    case "papers":
      return listing.market === "TR" ? ESATIS_URL : bidderFileHref(listing.key);
    default:
      return null;
  }
}

/** The preparation list of one proceeding; the Gutachten step is ticked once a report was read. */
export function deadlineSteps(listing: Listing, texts: DeadlineStepText[], hasReport: boolean): DeadlineChecklistStep[] {
  return texts.map((text) => ({ id: text.id, label: text.Label, hint: text.Hint, href: hrefFor(text.id, listing), autoDone: text.id === "gutachten" && hasReport }));
}
