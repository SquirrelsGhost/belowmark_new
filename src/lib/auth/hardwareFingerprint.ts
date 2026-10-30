/**
 * Computes a deterministic hardware fingerprint in the browser (GPU, screen, CPU, timezone).
 * Survives VPN switches, IP changes, and incognito tabs because physical hardware stays the same.
 */

const STORAGE_KEY = "ec_hw_id";
const HARDWARE_FP_REGEX = /^HW-[0-9a-f]{32}$/;

function fnv1aHash(str: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  let h3 = 0x9e3779b9;
  let h4 = 0x85ebca6b;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193);
    h2 = Math.imul(h2 ^ c, 0x811c9dc5);
    h3 = Math.imul(h3 ^ c, 0xc2b2ae35);
    h4 = Math.imul(h4 ^ c, 0x27d4eb2f);
  }
  const hex = [h1, h2, h3, h4].map((h) => (h >>> 0).toString(16).padStart(8, "0")).join("");
  return `HW-${hex}`;
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

/** Returns the deterministic hardware code of this device (`HW-[0-9a-f]{32}`). */
export function getHardwareFingerprint(): string {
  if (typeof window === "undefined") return "server";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && HARDWARE_FP_REGEX.test(saved)) return saved;
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
    try {
      localStorage.setItem(STORAGE_KEY, computed);
    } catch {
      // localStorage might be blocked in private mode
    }
    return computed;
  } catch {
    return "unknown";
  }
}
