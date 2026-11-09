// Bundles lessons/*.json into .generated/lessons.json for the Worker.
// Runs automatically before `wrangler dev` / `wrangler deploy` (see "build" in wrangler.jsonc).
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { validateLesson, THEME_BY_WD } from "../src/lesson-schema.js";

const dir = new URL("../lessons/", import.meta.url);
const out = new URL("../.generated/", import.meta.url);
const files = readdirSync(dir).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();

const bundle = [];
const errors = [];
for (const f of files) {
  let L;
  try {
    L = JSON.parse(readFileSync(new URL(f, dir), "utf8"));
  } catch (e) {
    errors.push(`${f}: kein gültiges JSON (${e.message})`);
    continue;
  }
  const date = f.slice(0, 10);
  if (L.date !== date) errors.push(`${f}: "date" ist ${L.date}, erwartet ${date}`);
  const expected = THEME_BY_WD[new Date(date + "T12:00:00Z").getUTCDay()];
  if (L.theme !== expected) errors.push(`${f}: Thema ist ${L.theme}, an diesem Wochentag erwartet ${expected}`);
  const err = validateLesson(L);
  if (err) errors.push(`${f}: ${err}`);
  const body = JSON.stringify(L);
  bundle.push({ date, hash: createHash("sha256").update(body).digest("hex").slice(0, 32), lesson: L });
}

if (errors.length) {
  console.error("Fehler in lessons/:\n- " + errors.join("\n- "));
  process.exit(1);
}
mkdirSync(out, { recursive: true });
writeFileSync(new URL("lessons.json", out), JSON.stringify(bundle));
console.log(`${bundle.length} Lektionen gebündelt (${bundle[0]?.date ?? "–"} bis ${bundle.at(-1)?.date ?? "–"}).`);
