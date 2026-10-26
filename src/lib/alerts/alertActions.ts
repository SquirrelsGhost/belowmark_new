"use server";

import { revalidatePath } from "next/cache";
import { ALERT_ROUTES, ALERTS } from "@/lib/alerts/alertConfig";
import { toStoredFilters } from "@/lib/alerts/alertMatch";
import { parseFilters } from "@/lib/listingFilters";
import { AlertService } from "@/services/AlertService";
import { ListingService } from "@/services/ListingService";
import { SessionService } from "@/services/SessionService";
import { AlertErrorCode } from "@/translations/alerts/IAlertsTranslation";

/** Result of an alert action; the UI translates the code. */
export interface AlertActionState {
  ok: boolean;
  error?: AlertErrorCode;
  saved?: boolean;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function currentUser() {
  const user = await SessionService.getCurrentUser();
  return user ? { id: user.id, market: user.market === "TR" ? ("TR" as const) : ("DE" as const) } : null;
}

/** Server Action: saves the submitted search filters as an alert. */
export async function createAlertAction(_: AlertActionState, formData: FormData): Promise<AlertActionState> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "failed" };

  const name = String(formData.get("name") ?? "").trim().slice(0, ALERTS.nameMaxLength);
  const notifyNew = formData.get("notifyNew") === "1";
  const notifyChanges = formData.get("notifyChanges") === "1";
  if (!name || (!notifyNew && !notifyChanges)) return { ok: false, error: "invalid" };

  const params = Object.fromEntries([...formData.entries()].filter(([, value]) => typeof value === "string")) as Record<string, string>;
  const filters = parseFilters(params);
  try {
    if ((await AlertService.countForUser(user.id)) >= ALERTS.maxPerUser) return { ok: false, error: "limit" };
    // The region name comes from the data, not from the form
    const region = filters.region ? (await ListingService.search(user.market, { ...filters, page: 1 }, Date.now())).regions.find((facet) => facet.code === filters.region) : undefined;
    await AlertService.create(
      { userId: user.id, market: user.market, name, filters: toStoredFilters(filters, region?.name ?? null), notifyNew, notifyChanges },
      Date.now(),
    );
  } catch (error) {
    console.error("[createAlertAction]", error);
    return { ok: false, error: "failed" };
  }
  revalidatePath(ALERT_ROUTES.manage);
  return { ok: true, saved: true };
}

/** Server Action: pauses or resumes one of the user's alerts. */
export async function setAlertActiveAction(_: AlertActionState, formData: FormData): Promise<AlertActionState> {
  const user = await currentUser();
  const alertId = String(formData.get("alertId") ?? "");
  if (!user || !UUID.test(alertId)) return { ok: false, error: "failed" };
  try {
    await AlertService.setActive(user.id, alertId, formData.get("active") === "1");
  } catch (error) {
    console.error("[setAlertActiveAction]", error);
    return { ok: false, error: "failed" };
  }
  revalidatePath(ALERT_ROUTES.manage);
  return { ok: true };
}

/** Server Action: deletes one of the user's alerts with everything it remembered. */
export async function deleteAlertAction(_: AlertActionState, formData: FormData): Promise<AlertActionState> {
  const user = await currentUser();
  const alertId = String(formData.get("alertId") ?? "");
  if (!user || !UUID.test(alertId)) return { ok: false, error: "failed" };
  try {
    await AlertService.remove(user.id, alertId);
  } catch (error) {
    console.error("[deleteAlertAction]", error);
    return { ok: false, error: "failed" };
  }
  revalidatePath(ALERT_ROUTES.manage);
  return { ok: true };
}
