#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Belowmark Instagram Interactive Session Login
//
// 1. Öffnet ein sichtbares Edge-Fenster für den einmaligen @belowmark_com Login
// 2. Speichert die frische Playwright-Session lokal im Profil-Ordner
// 3. Führt anschließend direkt --sync-only zur Live-Verifikation aus
// ---------------------------------------------------------------------------

import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOCIAL_SESSION_MODULE_URL =
  process.env.SOCIAL_SESSION_MODULE_URL ||
  "file:///C:/Users/emrea/Desktop/1_Projekte_und_Apps/workspace/pycie/backend/services/socialSessionManager.js";

const account = process.argv[2] || "belowmark_com";
const { startInteractiveLogin, PLATFORMS } = await import(SOCIAL_SESSION_MODULE_URL);

console.log(`[Belowmark Login] Öffne sichtbares Browser-Fenster für @${account}...`);
await startInteractiveLogin(PLATFORMS.INSTAGRAM, { account });

console.log(`[Belowmark Login] Prüfe frische Session per Live-Metriken-Sync (--sync-only)...`);
execFileSync(process.execPath, ["--use-system-ca", "scripts/instagram-publish.mjs", "--sync-only"], {
  cwd: ROOT,
  stdio: "inherit",
});

console.log(`[Belowmark Login] ✅ @${account} ist erfolgreich angemeldet und einsatzbereit!`);
