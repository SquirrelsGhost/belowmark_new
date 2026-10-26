import "server-only";
import { revalidatePath } from "next/cache";
import { MarketCode } from "@/lib/constants";
import { SessionService } from "@/services/SessionService";
import { Permission } from "@/types/permissions.types";
import { TeamActionState, TeamErrorCode } from "@/types/team.types";

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** The signed-in person as the team actions need them. */
export interface TeamActor {
  id: string;
  name: string;
  email: string;
  market: MarketCode;
  locale: "de" | "tr";
  permissions: Permission[];
}

export async function currentActor(): Promise<TeamActor | null> {
  const user = await SessionService.getCurrentUser();
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    market: user.market === "TR" ? "TR" : "DE",
    locale: user.locale === "tr" ? "tr" : "de",
    permissions: user.permissions,
  };
}

export const field = (formData: FormData, name: string): string => {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
};

export const uuidField = (formData: FormData, name: string): string | null => {
  const value = field(formData, name);
  return UUID.test(value) ? value : null;
};

export const fail = (error: TeamErrorCode): TeamActionState => ({ ok: false, error });

export const failed = (scope: string, error: unknown): TeamActionState => {
  console.error(`[${scope}]`, error);
  return { ok: false, error: "failed" };
};

/** Team content shows up in the shell, the team pages and the Aktenblatt — refresh the whole app area. */
export const refreshTeamViews = (): void => revalidatePath("/app", "layout");
