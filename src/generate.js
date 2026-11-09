// Lesson generation with Claude (optional – needs the ANTHROPIC_API_KEY secret).
import Anthropic from "@anthropic-ai/sdk";

export const THEMES = {
  literature: { wd: 1, name: "Literatur" },
  geography: { wd: 2, name: "Geografie" },
  history: { wd: 3, name: "Politische Geschichte" },
  architecture: { wd: 4, name: "Architektur" },
  art: { wd: 5, name: "Kunst" },
  pop: { wd: 6, name: "Popkultur" },
  news: { wd: 0, name: "Wochenrückblick" },
};
export const THEME_BY_WD = {};
for (const k in THEMES) THEME_BY_WD[THEMES[k].wd] = k;

const GEN_SPEC = `Du schreibst eine Tageslektion für Learnulingo, eine gamifizierte Allgemeinbildungs-App auf Deutsch. Ton: anschaulich, klar, nicht kindisch. Prüfe jede Tatsache sorgfältig; lieber weglassen als raten.
Antworte NUR mit einem JSON-Objekt, ohne Markdown-Codeblock:
{"date":"YYYY-MM-DD","theme":"<literature|geography|history|architecture|art|pop|news>","subjectKey":"kurzer-eindeutiger-slug (bei Geografie der Ländername auf Deutsch)","title":"Thema der Lektion","subtitle":"ein Satz","status":"published",
 "cards":[12 Karten],"questions":[12 Fragen],"takeaways":["genau 3 Sätze"],"sources":[{"title":"…","url":"https://…"}]}
Karten: {"tier":1|2|3,"kicker":"kurzes Label","title":"…","body":"2–4 kurze Sätze; Absätze mit Leerzeile; Liste mit Zeilen, die mit '- ' beginnen","img":{"svg":"<svg viewBox=…>…</svg>","caption":"…","credit":"Illustration","href":"https://commons.wikimedia.org/…"}(optional),"links":[{"title":"…","url":"…"}](optional)}
Je 4 Karten mit tier 1, 2 und 3 in dieser Reihenfolge. tier 1 = das Wichtigste (Kurz-Lektion), tier 2 vertieft, tier 3 geht am tiefsten. Kurz zeigt tier 1, Mittel tier 1–2, Lang alles.
Fragen: je 4 mit tier 1, 2, 3; gemischte Typen, jede mit "id" (q1…q12), "prompt", "explain" (ein Satz):
 mc: {"type":"mc","options":["…","…","…","…"],"answer":<Index>}
 tf: {"type":"tf","answer":true|false}
 image: {"type":"image","svg":"<svg…>","options":[…],"answer":<Index>} (Bild-Erkennung, z. B. Stil oder Flagge)
 match: {"type":"match","pairs":[["links","rechts"],…3–4 Paare]}
 order: {"type":"order","items":["frühestes",…,"spätestes"]} (korrekte Reihenfolge, 4 Einträge)
Fragen beziehen sich nur auf Inhalte der Karten gleicher oder niedrigerer Stufe.
SVG-Illustrationen: einfache, flache Zeichnungen (viewBox ca. 0 0 320 200), keine Texte, keine Skripte, keine externen Bilder. Für Farben die Klassen nutzen: a=Akzent, b=Tinte, c=gedämpft, d=Fläche, e=Linie (z. B. class="a"); Konturen: sa, sb, sc mit stroke-width. Echte Farben (z. B. Flaggen) dürfen als fill-Hexwerte stehen.
Themen: Montag Literatur, Dienstag Geografie (ein Land: Flagge, Hauptstadt, Lage, Sprache, Einwohner, Sehenswürdigkeiten, Fun Facts), Mittwoch politische Geschichte (Ursachen, Schlüsselfiguren, Ausgang, Nachwirkung), Donnerstag Architektur (Stil erkennen, Beispiele), Freitag Kunst, Samstag Popkultur, Sonntag Wochenrückblick (nur mit aktuellen Quellen, neutral, mit Links).`;

export function validateLesson(L) {
  if (!L || typeof L !== "object") return "Kein Objekt.";
  if (!THEMES[L.theme]) return "Unbekanntes Thema: " + L.theme;
  if (!L.title || typeof L.title !== "string") return "Es fehlt ein Titel.";
  if (!Array.isArray(L.cards) || !L.cards.length) return "Es fehlen Karten.";
  if (!Array.isArray(L.questions) || !L.questions.length) return "Es fehlen Fragen.";
  for (const q of L.questions) {
    if (!q.id || !q.type || !q.prompt) return "Jede Frage braucht id, type und prompt.";
    if ((q.type === "mc" || q.type === "image") && (!Array.isArray(q.options) || typeof q.answer !== "number" || q.answer >= q.options.length))
      return `Frage ${q.id}: options/answer prüfen.`;
    if (q.type === "tf" && typeof q.answer !== "boolean") return `Frage ${q.id}: answer muss true/false sein.`;
    if (q.type === "match" && (!Array.isArray(q.pairs) || q.pairs.length < 2)) return `Frage ${q.id}: pairs prüfen.`;
    if (q.type === "order" && (!Array.isArray(q.items) || q.items.length < 2)) return `Frage ${q.id}: items prüfen.`;
  }
  return null;
}

function extractJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("Die Antwort enthielt kein JSON.");
  return JSON.parse(text.slice(start, end + 1));
}

export async function generateLesson(env, { date, theme, done }) {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const prompt =
    GEN_SPEC +
    `\n\nDatum: ${date}. Thema: ${theme} (${THEMES[theme].name}).\n` +
    `Bereits behandelt, NICHT wiederholen: ${done.join("; ") || "noch nichts"}.\n` +
    (theme === "news"
      ? "Recherchiere mit der Websuche die wichtigsten Nachrichten der vergangenen sieben Tage und belege sie mit Quellen."
      : "Wähle ein neues, lohnendes Thema.");

  const messages = [{ role: "user", content: prompt }];
  const tools = theme === "news" ? [{ type: "web_search_20260209", name: "web_search", max_uses: 8 }] : undefined;

  let message;
  for (let turn = 0; turn < 4; turn++) {
    const stream = client.beta.messages.stream({
      model: env.CLAUDE_MODEL || "claude-opus-5-5",
      max_tokens: 64000,
      thinking: { type: "adaptive" },
      output_config: { effort: "high" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      ...(tools ? { tools } : {}),
      messages,
    });
    message = await stream.finalMessage();
    if (message.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content: message.content }); // let server tools continue
  }
  if (message.stop_reason === "refusal") throw new Error("Claude hat die Anfrage abgelehnt.");
  if (message.stop_reason === "max_tokens") throw new Error("Die Antwort war zu lang und wurde abgeschnitten.");

  const text = message.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  const L = extractJson(text);
  L.date = date;
  L.theme = theme;
  L.status = L.status === "draft" ? "draft" : "published";
  const err = validateLesson(L);
  if (err) throw new Error(err);
  return L;
}
