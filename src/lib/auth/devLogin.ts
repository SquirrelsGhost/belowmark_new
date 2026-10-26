import "server-only";
import { headers } from "next/headers";
import DEV_ACCOUNTS from "@/lib/auth/devAccounts.json";

export type DevAccount = (typeof DEV_ACCOUNTS.accounts)[number];
export const DEV_PASSWORD = DEV_ACCOUNTS.password;
export const DEV_ACCOUNT_LIST: readonly DevAccount[] = DEV_ACCOUNTS.accounts;

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

/**
 * Quick logins exist only under `next dev`. NODE_ENV is inlined at build time,
 * so in a production build this is the constant `false` and the UI is
 * compiled away. AUTH_DEV_LOGIN=off switches it off locally, too.
 */
export function isDevLoginEnabled(): boolean {
  return process.env.NODE_ENV === "development" && process.env.AUTH_DEV_LOGIN !== "off";
}

/** Second lock: even in development, only requests addressed to this machine. */
export async function isLocalRequest(): Promise<boolean> {
  const host = (await headers()).get("host") ?? "";
  const hostname = host.startsWith("[") ? host.slice(0, host.indexOf("]") + 1) : host.split(":")[0];
  return LOCAL_HOSTS.has(hostname.toLowerCase());
}

export function findDevAccount(key: unknown): DevAccount | undefined {
  return DEV_ACCOUNT_LIST.find((account) => account.key === key);
}
