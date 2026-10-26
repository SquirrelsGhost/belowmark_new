import { AUTH_ROUTES } from "@/lib/auth/authConfig";

/**
 * Accepts only same-site paths for the `next` parameter, so a link like
 * /login?next=https://evil.example cannot bounce users off-site after login.
 */
export function safeRedirect(target: unknown, fallback: string = AUTH_ROUTES.afterLogin): string {
  if (typeof target !== "string" || target.length === 0 || target.length > 512) return fallback;
  if (!target.startsWith("/") || target.startsWith("//") || target.startsWith("/\\")) return fallback;
  // Control characters and backslashes can be re-interpreted by browsers.
  if (/[\u0000-\u001f\\]/.test(target)) return fallback;
  // Never send people back into the auth flow itself.
  const path = target.split(/[?#]/)[0];
  const authPaths: string[] = [AUTH_ROUTES.login, AUTH_ROUTES.signup, AUTH_ROUTES.resetPassword, AUTH_ROUTES.verifyEmail];
  if (authPaths.includes(path)) return fallback;
  return target;
}
