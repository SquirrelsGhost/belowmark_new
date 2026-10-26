import { PERMISSIONS, type Permission } from "@/types/permissions.types";

const VALID_PERMISSIONS = new Set<string>(PERMISSIONS);

/** Hierarchy inside the app domain: higher plan capabilities include lower ones. */
const APP_IMPLICATIONS: Partial<Record<Permission, readonly Permission[]>> = {
  "app:*": ["app:pro", "app:investor", "app:access", "gutachten:*", "gutachten:analyze", "watchlist:*", "alerts:*"],
  "app:pro": ["app:investor", "app:access", "gutachten:*", "gutachten:analyze", "watchlist:*", "alerts:*"],
  "app:investor": ["app:access", "gutachten:*", "gutachten:analyze", "watchlist:*", "alerts:*"],
};

export function isValidPermission(value: unknown): value is Permission {
  return typeof value === "string" && VALID_PERMISSIONS.has(value);
}

export function sanitizePermissions(list: unknown): Permission[] {
  if (!Array.isArray(list)) return [];
  const unique = new Set<Permission>();
  for (const item of list) {
    if (isValidPermission(item)) unique.add(item);
  }
  return [...unique];
}

/**
 * Edge- and server-compatible wildcard matcher (`*`, `<domain>:*`, and domain hierarchy).
 */
export function hasPermission(
  userPermissions: readonly (Permission | string)[] | undefined | null,
  required: Permission,
): boolean {
  if (!userPermissions || userPermissions.length === 0) return false;

  return userPermissions.some((perm) => {
    if (perm === "*" || perm === required) return true;

    if (perm.endsWith(":*")) {
      const namespace = perm.slice(0, -1); // e.g. "app:" or "cockpit:"
      if (required.startsWith(namespace)) return true;
    }

    const implied = APP_IMPLICATIONS[perm as Permission];
    if (implied && implied.includes(required)) return true;

    return false;
  });
}

export interface UserCapabilitySource {
  permissions?: readonly string[] | null;
  plan?: string | null;
  trialEndsAt?: Date | string | null;
  bannedAt?: Date | string | null;
  /** Holds a seat in a team whose owner has Pro (TeamSeatService) */
  teamSeat?: boolean;
}

/**
 * Computes all currently effective capabilities of a user from:
 * 1. Explicitly granted permissions (`user.permissions`, e.g. `*` or `app:investor`)
 * 2. Active paid plan (`user.plan`: `"pro"` | `"investor"`)
 * 3. Running trial (`user.trialEndsAt > now`)
 * 4. A team seat (`user.teamSeat`): full access, never Pro itself
 * If the account is banned (`bannedAt`), all permissions immediately become empty (`[]`).
 */
export function effectiveUserPermissions(user: UserCapabilitySource | null | undefined, now = Date.now()): Permission[] {
  if (!user || user.bannedAt) return [];

  const set = new Set<Permission>(["app:access", "watchlist:*", "alerts:*"]);
  for (const p of sanitizePermissions(user.permissions ?? [])) {
    set.add(p);
  }

  if (user.plan === "pro") {
    set.add("app:pro");
    set.add("app:investor");
    set.add("gutachten:*");
  } else if (user.plan === "investor") {
    set.add("app:investor");
    set.add("gutachten:*");
  }

  const trialEndMs =
    user.trialEndsAt instanceof Date
      ? user.trialEndsAt.getTime()
      : typeof user.trialEndsAt === "string"
        ? new Date(user.trialEndsAt).getTime()
        : null;

  if (trialEndMs !== null && Number.isFinite(trialEndMs) && trialEndMs > now) {
    set.add("app:investor");
    set.add("gutachten:*");
  }

  if (user.teamSeat) {
    set.add("app:investor");
    set.add("gutachten:*");
  }

  return [...set];
}

export function hasFullAppAccess(permissions: readonly (Permission | string)[] | undefined | null): boolean {
  return hasPermission(permissions, "app:investor");
}
