"use server";

import { revalidatePath } from "next/cache";
import { CLIENT_SHARE, CLIENT_SHARE_ROUTES, clientShareHref, isExpiryDays } from "@/lib/clientShare/clientShareConfig";
import { buildPayload, parseSections } from "@/lib/clientShare/clientSharePayload";
import { getProUser } from "@/lib/clientShare/proAccess";
import { ClientShareService } from "@/services/ClientShareService";
import { ListingService } from "@/services/ListingService";
import { VerdictService } from "@/services/VerdictService";
import { ClientShareErrorCode } from "@/types/clientShare.types";

/** Result of a client link action; the UI translates the code. The path is only ever sent once. */
export interface ClientShareActionState {
  ok: boolean;
  error?: ClientShareErrorCode;
  /** Path of the new link (/k/<token>) — the browser puts its own origin in front */
  path?: string;
  printPath?: string;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Raw JSON the browser read from its own storage; anything longer is not one of ours */
const RAW_MAX = 20_000;

const text = (formData: FormData, name: string, max: number): string | null => {
  const value = String(formData.get(name) ?? "").trim();
  return value ? value.slice(0, max) : null;
};
const raw = (formData: FormData, name: string): string => String(formData.get(name) ?? "").slice(0, RAW_MAX);

const withPaths = (token: string): ClientShareActionState => ({ ok: true, path: clientShareHref(token), printPath: clientShareHref(token, true) });

/** Server Action: freezes the broker's figures for one proceeding into a new client link. */
export async function createClientShareAction(_: ClientShareActionState, formData: FormData): Promise<ClientShareActionState> {
  const user = await getProUser();
  if (!user?.isPro) return { ok: false, error: "plan" };

  const sections = parseSections(formData.getAll("sections").map(String));
  const expiryDays = Number(formData.get("expiryDays"));
  const locale = formData.get("locale") === "tr" ? "tr" : "de";
  const listingKey = String(formData.get("listingKey") ?? "");
  if (sections.length === 0) return { ok: false, error: "noSection" };
  if (!isExpiryDays(expiryDays) || !listingKey) return { ok: false, error: "invalid" };

  try {
    const now = Date.now();
    const listing = await ListingService.getByKey(user.market, listingKey);
    if (!listing) return { ok: false, error: "notFound" };
    if ((await ClientShareService.countOpen(user.id, now)) >= CLIENT_SHARE.maxOpenPerOwner) return { ok: false, error: "limit" };

    const { evidence, context } = await VerdictService.getSource(listing, user.id, locale, now);
    const payload = buildPayload({ sections, context, evidence, rawInputs: raw(formData, "bidInputs"), rawAnswers: raw(formData, "answers"), rawBank: raw(formData, "bank") });
    const token = await ClientShareService.create(
      {
        ownerId: user.id,
        market: listing.market,
        listingKey: listing.key,
        locale,
        label: text(formData, "label", CLIENT_SHARE.labelMax),
        message: text(formData, "message", CLIENT_SHARE.messageMax),
        payload,
        expiryDays,
      },
      now,
    );
    revalidatePath(CLIENT_SHARE_ROUTES.manage);
    return withPaths(token);
  } catch (error) {
    console.error("[createClientShareAction]", error);
    return { ok: false, error: "failed" };
  }
}

type ShareIntent = "revoke" | "delete" | "renew";

/** Server Action: revokes, deletes or re-addresses one of the broker's links. */
export async function changeClientShareAction(_: ClientShareActionState, formData: FormData): Promise<ClientShareActionState> {
  const user = await getProUser();
  const shareId = String(formData.get("shareId") ?? "");
  const intent = String(formData.get("intent") ?? "") as ShareIntent;
  if (!user || !UUID.test(shareId)) return { ok: false, error: "failed" };
  // Revoking and deleting stay possible after Pro ended — only a new address needs Pro
  if (intent === "renew" && !user.isPro) return { ok: false, error: "plan" };

  try {
    let result: ClientShareActionState = { ok: true };
    if (intent === "revoke") await ClientShareService.revoke(user.id, shareId);
    else if (intent === "delete") await ClientShareService.remove(user.id, shareId);
    else if (intent === "renew") {
      const token = await ClientShareService.renew(user.id, shareId, Date.now());
      result = token ? withPaths(token) : { ok: false, error: "notFound" };
    } else return { ok: false, error: "invalid" };
    revalidatePath(CLIENT_SHARE_ROUTES.manage);
    return result;
  } catch (error) {
    console.error("[changeClientShareAction]", error);
    return { ok: false, error: "failed" };
  }
}
