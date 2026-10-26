import "server-only";
import { headers } from "next/headers";

export interface RequestInfo {
  ip: string;
  userAgent: string | null;
}

const USER_AGENT_MAX = 255;

/**
 * Client IP and user agent of the current request.
 *
 * The IP is only used as a rate-limit key. Behind a reverse proxy (nginx,
 * Vercel) the first `x-forwarded-for` entry is the client — make sure the
 * proxy overwrites that header instead of appending to a client-sent one.
 */
export async function getRequestInfo(): Promise<RequestInfo> {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || list.get("x-real-ip") || "unknown";
  const userAgent = list.get("user-agent")?.slice(0, USER_AGENT_MAX) ?? null;
  return { ip, userAgent };
}
