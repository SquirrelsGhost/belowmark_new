/**
 * Computes a deterministic hardware fingerprint in the browser (GPU, screen, CPU, timezone).
 * Survives VPN switches, IP changes, and incognito tabs because physical hardware stays the same.
 */

const STORAGE_KEY = "ec_hw_id";

function fnv1aHash(str: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= c;
    h2 = Math.imul(h2, 0x811c9dc5);
  }
  const hex1 = (h1 >>> 0).toString(16).padStart(8, "0");
  const hex2 = (h2 >>> 0).toString(16).padStart(4, "0").slice(0, 4);
  return `HW-${(hex1 + hex2).toUpperCase()}`;
}

function getGpuInfo(): string {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return "no-webgl";
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return gl.getParameter(gl.VERSION) ?? "webgl";
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) ?? "";
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) ?? "";
    return `${vendor}|${renderer}`;
  } catch {
    return "err-webgl";
  }
}

/** Returns the deterministic hardware code of this device (e.g. HW-8A3F91C2B401). */
export function getHardwareFingerprint(): string {
  if (typeof window === "undefined") return "server";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parts = [
      getGpuInfo(),
      `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`,
      String(window.devicePixelRatio || 1),
      String(navigator.hardwareConcurrency || 0),
      String((navigator as Navigator & { deviceMemory?: number }).deviceMemory || 0),
      navigator.platform || "",
      Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    ];
    const computed = fnv1aHash(parts.join("||"));
    if (!saved) {
      try {
        localStorage.setItem(STORAGE_KEY, computed);
      } catch {
        // localStorage might be blocked in private mode
      }
    }
    return computed;
  } catch {
    return "unknown";
  }
}
