#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Startet einen Alert-Lauf (inkl. 1× Verifizierungs-Reminder) auf dem Server,
// oder führt den idempotenten 1× Verifizierungs-Reminder direkt per CLI aus:
//
//   npm run alerts:run
//   node --use-system-ca scripts/run-alerts.mjs --unverified-reminders --dry-run
//   node --use-system-ca scripts/run-alerts.mjs --unverified-reminders
//
// Nach jedem neuen Datenstand (scripts/build-snapshots.mjs) oder per Cron.
// Liest NEXT_PUBLIC_APP_URL und ALERTS_CRON_SECRET aus .env.local bzw. der
// Umgebung. Im Dev-Server ohne SMTP_HOST erscheinen die Mails in dessen Konsole.
// ---------------------------------------------------------------------------

import path from "node:path";
import { fileURLToPath } from "node:url";
import * as dotenv from "dotenv";
import { runUnverifiedReminders } from "./lib/unverifiedReminderRunner.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "..", ".env.local"), quiet: true });

const args = new Set(process.argv.slice(2));
const onlyReminders = args.has("--unverified-reminders");
const dryRun = args.has("--dry-run");

if (onlyReminders) {
  const report = await runUnverifiedReminders({ dryRun });
  if (!report.available) {
    console.error(`Verifizierungs-Reminder nicht ausführbar: ${report.error}`);
    process.exit(1);
  }
  if (report.dryRun) {
    console.log(`[DRY-RUN] ${report.eligible} offene unbestätigte Accounts (2h–14d, ohne bisherigen Reminder):`);
    for (const item of report.preview ?? []) {
      console.log(`  • ${item.email} (${item.locale}/${item.country}, registriert ${new Date(item.createdAt).toISOString()}) → ${item.subject}`);
      console.log(`    Link-Ziel: ${item.verifyBaseUrl}`);
    }
  } else {
    console.log(
      `1× Verifizierungs-Reminder: ${report.sent}/${report.eligible} versendet${report.failed ? ` · ${report.failed} fehlgeschlagen` : ""}${report.recipients.length ? ` (${report.recipients.join(", ")})` : ""}`,
    );
  }
  process.exit(report.failed > 0 ? 1 : 0);
}

const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const secret = process.env.ALERTS_CRON_SECRET ?? "";

const res = await fetch(new URL("/api/alerts/run", base), {
  method: "POST",
  headers: secret ? { Authorization: `Bearer ${secret}` } : {},
}).catch((error) => {
  console.error(`Server unter ${base} nicht erreichbar — läuft "npm run dev"?\n${error.message}`);
  process.exit(1);
});

const body = await res.json().catch(() => null);
if (!res.ok || !body?.success) {
  console.error(`Alert-Lauf fehlgeschlagen (${res.status}): ${body?.error ?? "keine Antwort"}`);
  process.exit(1);
}
const r = body.data;
console.log(
  `${r.checked} Alerts geprüft · ${r.mailed} Mails · ${r.newHits} neue Verfahren · ${r.changeHits} Terminänderungen${r.unverifiedRemindersSent ? ` · ${r.unverifiedRemindersSent} Verifizierungs-Reminder` : ""}${r.failed ? ` · ${r.failed} fehlgeschlagen` : ""}`,
);
