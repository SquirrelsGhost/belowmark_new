# Team-Konten und gemeinsame Merklisten

Mehrere Personen bewerten dieselben Verfahren auf einer gemeinsamen Liste: ein Status je Objekt (Prüfen, Besichtigen, Bieten, Verworfen), Notizen aller Mitglieder, Rollen, Einladung per Mail.

## Wo
- `/app/team` – eigene Teams, Einladungen an mich, Team anlegen (nur mit Pro)
- `/app/team/<id>` – Team-Liste mit Statusfilter; `?ansicht=mitglieder` – Mitglieder, Einladungen, Umbenennen, Verlassen, Löschen
- Aktenblatt `/app/objekt/<key>#team` – „Im Team bewerten“: Status und Notizen je Team
- `/einladung?token=…` – Link aus der Einladungsmail: annehmen (mit dem eingeladenen Konto) oder ohne Konto ablehnen

## Regeln
- Rollen: Inhaber (genau einer, übergibt oder löscht), Admin (lädt Mitglieder/Leser ein, entfernt sie), Mitglied (Liste, Status, Notizen), Leser (nur lesen).
- Tarif: Ein Team arbeitet, solange der Inhaber die Fähigkeit `app:pro` hat (Plan „pro“ oder `*`). Sonst ruht es: alles lesbar, nichts änderbar; eigene Notizen löschen und Team verlassen gehen immer.
- Pro wird nicht online verkauft: Inhaber von Hand freischalten (`users.plan = 'pro'`, `plan_ends_at` leer oder Enddatum).
- Plätze: 5 inklusive Inhaber, offene Einladungen zählen mit (`TEAMS.maxSeats` in `src/lib/team/teamConfig.ts`). Höchstens 3 eigene Teams, 500 Objekte je Liste, 20 Einladungsmails je Team und Tag.
- Beträge sieht jedes Mitglied nach seinem eigenen Tarif (Plätze schalten heute keinen Vollzugang frei).
- Ein Team gehört zu einem Markt (DE oder TR); annehmen geht nur mit einem Konto im selben Markt.

## Datenschutz
- Eingeladene Adressen: nur bis Annahme, Ablehnung, Rückzug oder Ablauf (7 Tage); Token nur als Hash gespeichert; genau eine Mail, keine Erinnerung.
- Verlassen oder entfernt werden: eigene Notizen im Team werden gelöscht, Name verschwindet aus „gesetzt von“; der Status bleibt ohne Namen.
- Konto löschen: eigene Teams gehen an das dienstälteste Admin/Mitglied/Leser, ein Team ohne andere Mitglieder wird gelöscht; Notizen und Mitgliedschaften gehen mit dem Konto.
- Export unter /konto enthält Mitgliedschaften, eigene Notizen und gesetzte Status.
- Für die Datenschutzerklärung noch nachzutragen: Team-Funktion (Zweck, Sichtbarkeit von Name und E-Mail unter Mitgliedern, Einladungsadressen Art. 6 Abs. 1 lit. f DSGVO, Löschfristen oben).

## Technik
- Tabellen `teams`, `team_members`, `team_invites`, `team_listings`, `team_notes` – Migration `drizzle/0007_teams.sql` (Journal angehängt). Läuft beim nächsten Start von `npm run dev` automatisch.
- Code: `src/lib/team/*`, `src/services/team/*`, `src/components/app/team/*`, `src/translations/team/*`, `src/types/team.types.ts`.
- Geänderte gemeinsame Dateien: `src/db/schema.ts` (angehängt), `src/app/app/layout.tsx` (Menüpunkt Team), `src/app/app/objekt/[key]/page.tsx` (eine Zeile), `src/services/AccountDataService.ts` (Export + Löschung).

## Plätze mit Vollzugang (seit 26.10.2026)

Jedes Mitglied eines arbeitenden Teams (Inhaber hat Pro) bekommt Vollzugang wie mit dem Investor-Tarif, auch ohne eigenen Tarif: Beträge, Gutachten-Auswertung, volle Alert- und Termin-Mails. Pro selbst wird nicht weitergegeben, Mitglieder können also keine eigenen Teams oder Kundenlinks anlegen.

- Geprüft wird bei jeder Anfrage (`src/services/team/TeamSeatService.ts`). Verlassen, Entfernen oder ein ausgelaufener Pro-Tarif des Inhabers beenden den Zugang sofort.
- Eingebunden in `SessionUserService` (nur wenn das Konto keinen eigenen Vollzugang hat), `AlertRunService` und `DeadlineTimelineService`; `effectiveUserPermissions` kennt dafür `teamSeat`.
- Das Konto-Menü zeigt „Vollzugang über Ihr Team“; ein Mitglied sieht keinen Test-Countdown.
- /konto zeigt beim Tarif weiter „kein Tarif“, wenn das Mitglied selbst nichts gebucht hat.
