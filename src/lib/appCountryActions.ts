"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { countryMarket, isListingCountry } from "@/lib/listingCountry";
import { CountryAccessService } from "@/services/CountryAccessService";
import { SessionService } from "@/services/SessionService";
import { clearSessionResolutionCache } from "@/services/sicherheit/SessionUserService";

/**
 * Switches the signed-in account's active country across the /app workspace
 * in a single server roundtrip.
 */
export async function switchAppCountryAction(country: string, targetHref?: string): Promise<void> {
  if (!isListingCountry(country)) return;
  const user = await SessionService.getCurrentUser();
  if (!user) return;
  const scope = await CountryAccessService.forUser(user);
  if (!scope.countries.includes(country)) return;

  await db
    .update(users)
    .set({
      country,
      market: countryMarket(country),
    })
    .where(eq(users.id, user.id));

  clearSessionResolutionCache();
  revalidatePath("/app", "layout");
  if (targetHref && targetHref.startsWith("/app")) {
    redirect(targetHref);
  }
}
