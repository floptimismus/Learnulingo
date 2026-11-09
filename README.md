# Learnulingo

Jeden Tag eine kurze Lektion Allgemeinbildung: Lernkarten, Quiz, XP, Streaks, Abzeichen und eine
öffentliche **Streak-Liste mit allen Konten**. Die App ist aus dem „Daily Learn“-Artifact entstanden und
läuft jetzt eigenständig auf **Cloudflare Workers** (statische Dateien + API) mit einer **D1**-Datenbank.

- **Konten mit Passkeys** – kein Passwort. Registrieren und Anmelden per Face ID, Fingerabdruck oder
  Geräte-PIN (WebAuthn). Weitere Passkeys für andere Geräte lassen sich im Profil hinzufügen.
- **Streak-Liste** – alle Konten, sortierbar nach aktuellem Streak, Rekord-Streak oder Wochen-XP.
  Für alle sichtbar, auch ohne Anmeldung.
- **Fortschritt wird auf dem Server berechnet** (XP, Streak, Streak-Freezes, Abzeichen, Fehler-Wiederholung).
- **Redaktion** – das erste Konto, das sich registriert, wird Redaktion: Lektionen ansehen, als JSON bearbeiten
  oder anlegen, veröffentlichen/zurückziehen, löschen und (optional) mit Claude erzeugen.
- **Lektionen liegen im Repo** (`lessons/YYYY-MM-DD.json`, siehe `lessons/README.md`). Nach jedem Deploy
  übernimmt die App neue oder geänderte Dateien in die Datenbank. Die 8 Lektionen aus dem Artifact sind dabei.
- **Wöchentlicher Nachschub:** Ein geplanter Auftrag in Claude schreibt jeden Sonntag früh die Lektionen
  für Sonntag bis Samstag und pusht sie auf `main`; Cloudflare deployt dann automatisch.

## Aufbau

```
public/            Frontend (index.html, app.js, styles.css, Icon, Manifest)
src/index.js       Worker: API, Passkeys (@simplewebauthn/server), Sessions, Scoring, Cron
src/generate.js    Optional: Lektionen mit der Claude API erzeugen
lessons/           Eine JSON-Datei pro Tag (wird vor jedem Deploy geprüft und gebündelt)
scripts/           build-lessons.mjs: Lektionen prüfen und bündeln
wrangler.jsonc     Cloudflare-Konfiguration (Assets, D1, Cron)
```

Die Tabellen legt der Worker beim ersten Request selbst an – es gibt keinen separaten Migrationsschritt.

## Veröffentlichen auf Cloudflare

### Variante A: per Git (empfohlen)

1. Im Cloudflare-Dashboard **Workers & Pages → Create → Import a repository** wählen, dieses Repo verbinden
   und als Production-Branch **`main`** wählen (dorthin pusht der wöchentliche Auftrag).
2. Build-Einstellungen: Build command leer lassen, Deploy command `npx wrangler deploy`.
3. Deployen. Wrangler legt die D1-Datenbank `learnulingo` beim ersten Deploy automatisch an.
4. Seite öffnen und **sofort das eigene Konto anlegen** – das erste Konto bekommt die Redaktionsrechte.

Jeder Push auf den Hauptbranch deployt danach automatisch.

### Variante B: von der Kommandozeile

```bash
npm install
npx wrangler login
npm run deploy
```

Falls deine Wrangler-Version die D1-Datenbank nicht automatisch anlegt:

```bash
npx wrangler d1 create learnulingo
# die ausgegebene database_id in wrangler.jsonc unter d1_databases eintragen, dann:
npm run deploy
```

### Eigene Domain

Passkeys sind an die Domain gebunden. Leg die endgültige Domain (z. B. `learnulingo.de`, unter
**Settings → Domains & Routes** des Workers) **fest, bevor** sich Leute registrieren – Passkeys, die auf
`*.workers.dev` erstellt wurden, funktionieren auf einer anderen Domain nicht. Optional kannst du die Werte
fest vorgeben (sonst werden sie aus der aufgerufenen URL abgeleitet):

```jsonc
"vars": { "APP_NAME": "Learnulingo", "RP_ID": "learnulingo.de", "ORIGIN": "https://learnulingo.de" }
```

## Optional: Lektionen über die Claude API erzeugen (kostenpflichtig)

Nicht nötig, wenn der wöchentliche Auftrag die Lektionen ins Repo schreibt.

```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

Dann:
- erzeugt der Cron-Trigger (täglich 03:17 UTC) die Lektion für heute/morgen, falls sie fehlt,
- funktioniert in der Redaktion der Knopf „Mit Claude erzeugen“.

Verwendet wird `claude-opus-5-5` (änderbar über die Variable `CLAUDE_MODEL`). Sonntags-Rückblicke nutzen die
Websuche der Claude API. Ohne den Schlüssel funktioniert alles andere ganz normal; Lektionen lassen sich dann
in der Redaktion als JSON anlegen.

Weitere Redaktions-Konten: Variable `ADMIN_USERNAMES` (kommagetrennte Benutzernamen) setzen; diese
bekommen beim Registrieren Redaktionsrechte.

## Lokal entwickeln

```bash
npm install
npm run dev        # http://localhost:8787
```

Passkeys funktionieren nur über HTTPS oder `localhost` – nicht über eine IP-Adresse wie `127.0.0.1`.

## API (Kurzüberblick)

| Methode | Pfad | Zweck |
|---|---|---|
| GET | `/api/me` | eigenes Konto, Fortschritt, Wiederholungsliste |
| PUT / DELETE | `/api/me` | Name/Avatar ändern / Konto löschen |
| POST | `/api/auth/register/options`, `/verify` | Konto mit Passkey anlegen (oder mit `addPasskey: true` weiteren Passkey hinzufügen) |
| POST | `/api/auth/login/options`, `/verify` | Mit Passkey anmelden |
| POST | `/api/auth/logout` | Abmelden |
| GET | `/api/lessons`, `/api/lessons/:date` | Lektionsliste / eine Lektion |
| GET | `/api/leaderboard` | Streak-Liste aller Konten |
| POST | `/api/progress/finish` | Lektion abschließen (Server rechnet XP & Streak) |
| PUT / DELETE | `/api/admin/lessons/:date` | Lektion speichern / löschen (Redaktion) |
| POST | `/api/admin/lessons/:date/status` | veröffentlichen / zurückziehen |
| POST | `/api/admin/generate` | Lektion mit Claude erzeugen |
| GET | `/api/admin/users` | Kontenübersicht |
