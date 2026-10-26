import "server-only";
import { MarketCode } from "@/lib/constants";
import { hasPermission } from "@/lib/permissions";
import { SessionService } from "@/services/SessionService";

export interface ProUser {
  id: string;
  market: MarketCode;
  isPro: boolean;
}

/** The signed-in user and whether they may brand and share — Pro (paid) or superuser, never a trial. */
export async function getProUser(): Promise<ProUser | null> {
  const user = await SessionService.getCurrentUser();
  if (!user) return null;
  return { id: user.id, market: user.market === "TR" ? "TR" : "DE", isPro: hasPermission(user.permissions, "app:pro") };
}
