# Anmeldung (Login, Registrierung, Konto)

## Einrichten

```bash
npm install          # holt nodemailer dazu
npm run db:push      # legt users-Spalten, sessions, auth_tokens, rate_limits, watchlist an
npm run dev
```

Ohne `SMTP_HOST` in `.env.local` erscheinen alle Mails mit ihrem Link in der
Konsole von `npm run dev`, so lässt sich jeder Ablauf lokal durchklicken. In
Produktion wird ohne SMTP keine Registrierung und kein Reset angenommen, statt
einen Link zu versprechen, der nie ankommt. Variablen: siehe `.env.example`.

## Schnell-Login (nur lokal)

```bash
npm run db:seed:dev  # legt dev-de, -tr, -free, -full und -admin @belowmark.local an (nur mit Postgres)
npm run dev          # /login zeigt dann den Kasten „Schnell-Login“
```

Ein Klick meldet als Testkonto an, ohne Passwort und ohne Mail, und leitet auf
`/app` (oder `?next=`). Konten: DE und TR mit laufendem Test, Free mit
abgelaufenem Test, Full mit gebuchtem Plan „investor“, Admin mit Rolle „admin“.
Ohne Postgres läuft die App auf PGlite; dann legen die Buttons die Konten
selbst an und das Seed-Script ist nicht nötig. Passwort für das normale Formular: `belowmark-dev-login`.
Fehlt ein Konto, legt der Klick es selbst an; das Seed-Script setzt Passwort,
Bestätigung und Testzeitraum zurück. Konten stehen in
`src/lib/auth/devAccounts.json`.

Absicherung: Der Kasten und die Server Action greifen nur bei
`NODE_ENV=development` (in `next build` fest `false`) und nur für Anfragen an
localhost/127.0.0.1; sonst 404. Das Seed-Script verweigert Produktion und
nicht-lokale Datenbanken. Abschalten mit `AUTH_DEV_LOGIN=off` in `.env.local`.

## Zugang (Plan und Rolle)

`users.plan` (null, "investor", "pro") kommt später von Stripe, `users.role`
ist "user" oder "admin" (Konstanten in `authConfig.ts`). Vollzugang
(`CurrentUser.hasFullAccess`, in Postgres berechnet) = Admin oder gebuchter
Plan oder laufender Test. Bei Plan oder Admin gibt es keinen Test-Countdown.
Ein eigener Admin-Bereich existiert noch nicht. Migration:
`drizzle/0001_user_plan_role.sql` (wird beim Start automatisch angewendet).

## Seiten

| Route | Zweck |
| --- | --- |
| `/login` | Anmelden, „Angemeldet bleiben“ (30 Tage, sonst Browsersitzung), `?next=` für die Rückkehr |
| `/signup` | Konto anlegen: E-Mail, Passwort, Markt (DE/TR, vorbelegt nach Standort), AGB |
| `/email-bestaetigen?token=` | Bestätigen per Knopfdruck, startet 14 Tage Test, meldet an |
| `/passwort-vergessen` | Reset-Link anfordern (1 Stunde gültig, einmalig) |
| `/passwort-neu?token=` | Neues Passwort, alle anderen Geräte werden abgemeldet |
| `/konto` | Angaben, Passwort ändern, Abmelden, überall abmelden |

## Sicherheit

- Passwörter: scrypt (N=2^15), gleiches Format wie im alten immo, alte Hashes bleiben gültig und werden beim Login hochgestuft.
- Mindestens 10 Zeichen, Stärkeprüfung (gleicher Algorithmus im Browser und auf dem Server), Abgleich mit Have I Been Pwned per k-Anonymität (nur 5 Zeichen des SHA-1 verlassen den Server; bei Ausfall wird nicht blockiert).
- Sitzungen serverseitig in Postgres, im Cookie nur ein Zufallstoken (HttpOnly, SameSite=Lax, in Produktion `__Host-` + Secure), gespeichert nur als SHA-256.
- Links in Mails: zufällig, nur gehasht gespeichert, einmalig, mit Ablauf; Links werden aus `NEXT_PUBLIC_APP_URL` gebaut, nie aus dem Host-Header.
- Keine Konto-Aufzählung: Registrierung und Reset antworten immer gleich, fehlgeschlagene Logins dauern mit und ohne Konto gleich lang.
- Rate-Limits in Postgres: 20 Logins/15 Min je IP, 5 Fehlversuche/15 Min je Konto, 5 Registrierungen/Stunde je IP, max. 3 Mails/Stunde je Adresse.
- `?next=` nur für Pfade auf der eigenen Seite.

Aktueller Benutzer im Code: `SessionService.getCurrentUser()`; geschützte Seiten leiten selbst auf `/login?next=…` um.
