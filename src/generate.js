// Lesson generation with Claude (optional – needs the ANTHROPIC_API_KEY secret).
import Anthropic from "@anthropic-ai/sdk";

import { THEMES, GEN_SPEC, validateLesson } from "./lesson-schema.js";
export { THEMES, THEME_BY_WD, validateLesson } from "./lesson-schema.js";

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
