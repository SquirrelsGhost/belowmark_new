#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Startet einen Erinnerungs-Lauf auf dem laufenden Server.
//
//   npm run termine:run
//
// Einmal täglich morgens per Cron (Aufgabenplanung), gleicher Schlüssel wie die Alerts.
// Liest NEXT_PUBLIC_APP_URL und ALERTS_CRON_SECRET aus .env.local bzw. der
// Umgebung. Im Dev-Server ohne SMTP_HOST erscheinen die Mails in dessen Konsole.
// ---------------------------------------------------------------------------

import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local", quiet: true });

const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const secret = process.env.ALERTS_CRON_SECRET ?? "";

const res = await fetch(new URL("/api/termine/run", base), {
  method: "POST",
  headers: secret ? { Authorization: `Bearer ${secret}` } : {},
}).catch((error) => {
  console.error(`Server unter ${base} nicht erreichbar — läuft "npm run dev"?\n${error.message}`);
  process.exit(1);
});

const body = await res.json().catch(() => null);
if (!res.ok || !body?.success) {
  console.error(`Erinnerungs-Lauf fehlgeschlagen (${res.status}): ${body?.error ?? "keine Antwort"}`);
  process.exit(1);
}
const r = body.data;
console.log(`${r.follows} begleitete Verfahren · ${r.mailed} Mails · ${r.reminders} Erinnerungen${r.failed ? ` · ${r.failed} fehlgeschlagen` : ""}`);
