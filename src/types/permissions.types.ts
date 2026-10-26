/**
 * Pure Resource-Based / Capability-Based Permissions (Zero-Trust Standard).
 * No rigid role enums: every access check uses `<domain>:<action>` or `<domain>:*`.
 */
export const PERMISSIONS = [
  // Universal Superuser / Admin
  "*",

  // App & Proceedings Domain
  "app:*",
  "app:access",
  "app:investor",
  "app:pro",

  // Reports & AI Gutachten Domain
  "gutachten:*",
  "gutachten:analyze",

  // Watchlist & Search Alerts Domain
  "watchlist:*",
  "alerts:*",

  // Admin / Cockpit Domain
  "cockpit:*",
] as const;

export type Permission = (typeof PERMISSIONS)[number];
