# Lektionen

Eine Datei pro Tag: `YYYY-MM-DD.json`. Format und Schreibregeln stehen in `GEN_SPEC` in
[`src/lesson-schema.js`](../src/lesson-schema.js). Das Thema hängt am Wochentag:

| Mo | Di | Mi | Do | Fr | Sa | So |
|---|---|---|---|---|---|---|
| literature | geography | history | architecture | art | pop | news |

`npm run lessons` prüft alle Dateien. Dieselbe Prüfung läuft vor jedem Deploy; schlägt sie fehl,
bricht der Deploy ab.

Nach dem Deploy übernimmt die App neue oder geänderte Dateien in die Datenbank. Änderungen und
Löschungen aus der Redaktion bleiben erhalten, solange die Datei im Repo unverändert bleibt.

Neue Lektionen schreibt ein wöchentlicher geplanter Auftrag in Claude (sonntags früh) und pusht sie
auf `main`.
