import { CLIENT_SHARE } from "@/lib/clientShare/clientShareConfig";

/** Checks for what a broker types into the letterhead. Pure, so the form and the server agree. */

const HEX = /^#[0-9a-f]{6}$/i;

const channel = (value: number): number => {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

/** WCAG 2 contrast of a "#rrggbb" colour against white. */
export function contrastWithWhite(hex: string): number {
  const n = Number.parseInt(hex.slice(1), 16);
  const luminance = 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
  return 1.05 / (luminance + 0.05);
}

export type AccentCheck = "ok" | "invalid" | "tooLight";

export function checkAccent(value: string): AccentCheck {
  if (!HEX.test(value)) return "invalid";
  return contrastWithWhite(value) >= CLIENT_SHARE.minAccentContrast ? "ok" : "tooLight";
}

/** http(s) links only; a bare domain gets https:// in front. null = not a usable link. */
export function normalizeUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!url.hostname.includes(".") || url.username || url.password) return null;
    const text = url.toString();
    return text.length <= CLIENT_SHARE.urlMax ? text : null;
  } catch {
    return null;
  }
}

export type LogoMime = "image/png" | "image/jpeg" | "image/webp";

/** The file type by its first bytes — the name and the browser's type are not trusted. */
export function sniffLogo(bytes: Uint8Array): LogoMime | null {
  const at = (offset: number, ...values: number[]) => values.every((value, index) => bytes[offset + index] === value);
  if (at(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (at(0, 0xff, 0xd8, 0xff)) return "image/jpeg";
  if (at(0, 0x52, 0x49, 0x46, 0x46) && at(8, 0x57, 0x45, 0x42, 0x50)) return "image/webp";
  return null;
}

export const LOGO_MIMES: LogoMime[] = ["image/png", "image/jpeg", "image/webp"];
