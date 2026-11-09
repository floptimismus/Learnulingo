// Learnulingo – Cloudflare Worker: JSON API (D1) + passkey accounts.
// Static files in /public are served by Workers Assets; only /api/* reaches this code.
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import BUNDLED_LESSONS from "../.generated/lessons.json"; // built from lessons/*.json
import { generateLesson, THEME_BY_WD, validateLesson } from "./generate.js";

const SESSION_COOKIE = "lu_session";
const SESSION_DAYS = 90;
const CHALLENGE_MINUTES = 5;
const AVATARS = ["🦊", "🦉", "🐙", "🦁", "🐼", "🐢", "🦄", "🐧", "🐝", "🦩", "🐳", "🦔"];

/* ---------------- schema (created on first request) ---------------- */
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
     id TEXT PRIMARY KEY, username TEXT NOT NULL UNIQUE, name TEXT NOT NULL, avatar TEXT NOT NULL,
     is_admin INTEGER NOT NULL DEFAULT 0, player TEXT NOT NULL, review TEXT NOT NULL DEFAULT '{"items":[]}',
     created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS credentials (
     id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     public_key TEXT NOT NULL, counter INTEGER NOT NULL DEFAULT 0, transports TEXT,
     created_at TEXT NOT NULL, last_used_at TEXT)`,
  `CREATE INDEX IF NOT EXISTS credentials_user ON credentials(user_id)`,
  `CREATE TABLE IF NOT EXISTS sessions (
     token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     expires_at INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS challenges (
     id TEXT PRIMARY KEY, challenge TEXT NOT NULL, kind TEXT NOT NULL, data TEXT, expires_at INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS lessons (
     date TEXT PRIMARY KEY, theme TEXT NOT NULL, title TEXT NOT NULL, status TEXT NOT NULL,
     subject_key TEXT, body TEXT NOT NULL, updated_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS lesson_imports (date TEXT PRIMARY KEY, hash TEXT NOT NULL, imported_at TEXT NOT NULL)`,
];
// Lessons from the repo (lessons/*.json) are imported once per content hash: new or changed files in the
// repo reach the database after the next deploy, while edits and deletions made in the editorial desk
// are kept as long as the file in the repo stays the same.
const IMPORT_CHUNK = 40; // stay well below D1's per-request query limit on the free plan
let schemaReady = null;
let importsPending = true;
async function ensureSchema(env) {
  if (!schemaReady) {
    schemaReady = env.DB.batch(SCHEMA.map((s) => env.DB.prepare(s))).catch((e) => { schemaReady = null; throw e; });
  }
  await schemaReady;
  if (importsPending) await importBundledLessons(env);
}
async function importBundledLessons(env) {
  const seen = await env.DB.prepare(`SELECT date, hash FROM lesson_imports`).all();
  const known = new Map(seen.results.map((r) => [r.date, r.hash]));
  const todo = BUNDLED_LESSONS.filter((x) => known.get(x.date) !== x.hash);
  if (!todo.length) { importsPending = false; return; }
  const now = new Date().toISOString();
  const chunk = todo.slice(0, IMPORT_CHUNK);
  const stmts = [];
  for (const x of chunk) {
    stmts.push(lessonInsert(env, x.lesson, now));
    stmts.push(env.DB.prepare(
      `INSERT INTO lesson_imports (date, hash, imported_at) VALUES (?,?,?) ON CONFLICT(date) DO UPDATE SET hash=excluded.hash, imported_at=excluded.imported_at`
    ).bind(x.date, x.hash, now));
  }
  await env.DB.batch(stmts);
  if (todo.length <= IMPORT_CHUNK) importsPending = false;
}
function lessonInsert(env, L, now = new Date().toISOString()) {
  return env.DB.prepare(
    `INSERT INTO lessons (date, theme, title, status, subject_key, body, updated_at) VALUES (?,?,?,?,?,?,?)
     ON CONFLICT(date) DO UPDATE SET theme=excluded.theme, title=excluded.title, status=excluded.status,
       subject_key=excluded.subject_key, body=excluded.body, updated_at=excluded.updated_at`
  ).bind(L.date, L.theme, L.title, L.status || "published", L.subjectKey || "", JSON.stringify(L), now);
}

/* ---------------- small helpers ---------------- */
const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
const fail = (status, error) => json({ error }, status);
class HttpError extends Error { constructor(status, msg) { super(msg); this.status = status; } }

const b64url = (bytes) => {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromB64url = (str) => {
  const s = str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
};
const randomId = (n = 16) => b64url(crypto.getRandomValues(new Uint8Array(n)));
async function sha256(text) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return b64url(new Uint8Array(d));
}
function getCookie(req, name) {
  const c = req.headers.get("cookie") || "";
  for (const part of c.split(/;\s*/)) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i) === name) return decodeURIComponent(part.slice(i + 1));
  }
  return null;
}
async function readJson(req) {
  try { return await req.json(); } catch { throw new HttpError(400, "Ungültige Anfrage."); }
}

/* ---------------- dates (YYYY-MM-DD strings, viewer's local day) ---------------- */
const pad = (n) => String(n).padStart(2, "0");
const isYmd = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
const ymdUTC = (d) => d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate());
const parseYmd = (s) => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d); };
const dayDiff = (a, b) => Math.round((parseYmd(b) - parseYmd(a)) / 864e5);
const addDays = (s, n) => ymdUTC(new Date(parseYmd(s) + n * 864e5));
function isoWeek(s) {
  const t = new Date(parseYmd(s));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = t.getUTCFullYear();
  const w = Math.ceil(((t - Date.UTC(y, 0, 1)) / 864e5 + 1) / 7);
  return y + "-W" + pad(w);
}
/** The client sends its local date; accept it only if it is plausible (time zones span UTC-12..UTC+14). */
function clientToday(s) {
  const utc = ymdUTC(new Date());
  if (!isYmd(s) || Math.abs(dayDiff(utc, s)) > 1) return utc;
  return s;
}

/* ---------------- game rules (same as the original Daily Learn) ---------------- */
const XP = { perCorrect: 10, lenBonus: { 1: 0, 2: 10, 3: 25 }, perfect: { 1: 15, 2: 30, 3: 50 }, review: 5 };
const BADGES = [
  { id: "first", name: "Erste Lektion", test: (p) => (p.activeDays || 0) >= 1 },
  { id: "perfect", name: "Fehlerfrei", test: (p) => (p.perfectCount || 0) >= 1 },
  { id: "streak7", name: "7-Tage-Streak", test: (p) => (p.best || 0) >= 7 },
  { id: "week", name: "Volle Woche", test: (p) => Object.values(p.weekThemes || {}).some((a) => a.length >= 7) },
  { id: "countries10", name: "10 Länder", test: (p) => (p.countries || []).length >= 10 },
  { id: "streak30", name: "30-Tage-Streak", test: (p) => (p.best || 0) >= 30 },
  { id: "long10", name: "10 lange Lektionen", test: (p) => (p.longCount || 0) >= 10 },
  { id: "countries25", name: "25 Länder bereist", test: (p) => (p.countries || []).length >= 25 },
  { id: "xp1000", name: "1000 XP", test: (p) => (p.xp || 0) >= 1000 },
  { id: "streak100", name: "100-Tage-Streak", test: (p) => (p.best || 0) >= 100 },
];
const blankPlayer = () => ({
  xp: 0, streak: 0, best: 0, lastDay: null, freezes: 0, activeDays: 0, weekXp: {}, weekThemes: {},
  completed: {}, badges: [], countries: [], longCount: 0, perfectCount: 0,
});
const trimKeys = (obj, keep) => Object.keys(obj).sort().slice(0, -keep).forEach((k) => delete obj[k]);

/* ---------------- sessions ---------------- */
async function currentUser(req, env) {
  const token = getCookie(req, SESSION_COOKIE);
  if (!token) return null;
  const row = await env.DB.prepare(
    `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?`
  ).bind(await sha256(token), Date.now()).first();
  return row || null;
}
async function startSession(env, userId, url) {
  const token = randomId(32);
  await env.DB.prepare(`INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?,?,?)`)
    .bind(await sha256(token), userId, Date.now() + SESSION_DAYS * 864e5).run();
  const secure = url.protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${secure}`;
}
const clearCookie = `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
async function requireUser(req, env) {
  const u = await currentUser(req, env);
  if (!u) throw new HttpError(401, "Bitte melde dich an.");
  return u;
}
async function requireAdmin(req, env) {
  const u = await requireUser(req, env);
  if (!u.is_admin) throw new HttpError(403, "Nur für die Redaktion.");
  return u;
}

/* ---------------- WebAuthn (passkeys) ---------------- */
function rp(env, url) {
  return {
    rpID: env.RP_ID || url.hostname,
    origin: env.ORIGIN || url.origin,
    rpName: env.APP_NAME || "Learnulingo",
  };
}
async function saveChallenge(env, kind, challenge, data) {
  const id = randomId();
  await env.DB.prepare(`INSERT INTO challenges (id, challenge, kind, data, expires_at) VALUES (?,?,?,?,?)`)
    .bind(id, challenge, kind, JSON.stringify(data || {}), Date.now() + CHALLENGE_MINUTES * 60e3).run();
  // opportunistic cleanup
  await env.DB.prepare(`DELETE FROM challenges WHERE expires_at < ?`).bind(Date.now()).run();
  await env.DB.prepare(`DELETE FROM sessions WHERE expires_at < ?`).bind(Date.now()).run();
  return id;
}
async function takeChallenge(env, id, kind) {
  if (typeof id !== "string") throw new HttpError(400, "Anfrage abgelaufen. Bitte noch einmal versuchen.");
  const row = await env.DB.prepare(`DELETE FROM challenges WHERE id = ? AND kind = ? RETURNING *`).bind(id, kind).first();
  if (!row || row.expires_at < Date.now()) throw new HttpError(400, "Anfrage abgelaufen. Bitte noch einmal versuchen.");
  return { challenge: row.challenge, data: JSON.parse(row.data || "{}") };
}
function cleanProfile(body) {
  const name = String(body.name || "").trim().slice(0, 24);
  const avatar = AVATARS.includes(body.avatar) ? body.avatar : AVATARS[0];
  if (!name) throw new HttpError(400, "Bitte einen Anzeigenamen angeben.");
  return { name, avatar };
}
function cleanUsername(u) {
  const username = String(u || "").trim().toLowerCase();
  if (!/^[a-z0-9_.-]{3,20}$/.test(username))
    throw new HttpError(400, "Benutzername: 3–20 Zeichen, nur a–z, 0–9, Punkt, Minus und Unterstrich.");
  return username;
}

async function registerOptions(req, env, url) {
  const body = await readJson(req);
  const me = await currentUser(req, env);
  let userId, username, displayName, data, exclude = [];
  if (body.addPasskey) {
    // Add another passkey (e.g. a new device) to the logged-in account.
    if (!me) throw new HttpError(401, "Bitte melde dich an.");
    userId = me.id; username = me.username; displayName = me.name;
    const creds = await env.DB.prepare(`SELECT id, transports FROM credentials WHERE user_id = ?`).bind(me.id).all();
    exclude = creds.results.map((c) => ({ id: c.id, transports: c.transports ? JSON.parse(c.transports) : undefined }));
    data = { userId, add: true };
  } else {
    username = cleanUsername(body.username);
    const { name, avatar } = cleanProfile(body);
    const taken = await env.DB.prepare(`SELECT 1 FROM users WHERE username = ?`).bind(username).first();
    if (taken) throw new HttpError(409, "Dieser Benutzername ist schon vergeben.");
    userId = randomId();
    displayName = name;
    data = { userId, username, name, avatar };
  }
  const { rpID, rpName } = rp(env, url);
  const options = await generateRegistrationOptions({
    rpName, rpID, userName: username, userDisplayName: displayName,
    userID: new TextEncoder().encode(userId),
    attestationType: "none",
    excludeCredentials: exclude,
    authenticatorSelection: { residentKey: "required", userVerification: "preferred" },
  });
  const challengeId = await saveChallenge(env, "register", options.challenge, data);
  return json({ challengeId, options });
}

async function registerVerify(req, env, url) {
  const body = await readJson(req);
  const { challenge, data } = await takeChallenge(env, body.challengeId, "register");
  const { rpID, origin } = rp(env, url);
  let v;
  try {
    v = await verifyRegistrationResponse({
      response: body.response, expectedChallenge: challenge, expectedOrigin: origin, expectedRPID: rpID,
      requireUserVerification: false,
    });
  } catch (e) {
    throw new HttpError(400, "Passkey konnte nicht geprüft werden: " + e.message);
  }
  if (!v.verified || !v.registrationInfo) throw new HttpError(400, "Passkey wurde nicht bestätigt.");
  const cred = v.registrationInfo.credential;
  const now = new Date().toISOString();
  const credStmt = env.DB.prepare(
    `INSERT INTO credentials (id, user_id, public_key, counter, transports, created_at) VALUES (?,?,?,?,?,?)`
  ).bind(cred.id, data.userId, b64url(cred.publicKey), cred.counter || 0, JSON.stringify(cred.transports || body.response?.response?.transports || []), now);

  if (data.add) {
    const me = await requireUser(req, env);
    if (me.id !== data.userId) throw new HttpError(403, "Falsches Konto.");
    await credStmt.run();
    return json({ ok: true });
  }
  const count = await env.DB.prepare(`SELECT COUNT(*) AS n FROM users`).first();
  const admins = String(env.ADMIN_USERNAMES || "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
  const isAdmin = count.n === 0 || admins.includes(data.username) ? 1 : 0; // first account runs the editorial desk
  try {
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO users (id, username, name, avatar, is_admin, player, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)`
      ).bind(data.userId, data.username, data.name, data.avatar, isAdmin, JSON.stringify(blankPlayer()), now, now),
      credStmt,
    ]);
  } catch (e) {
    if (/UNIQUE/i.test(e.message)) throw new HttpError(409, "Dieser Benutzername ist schon vergeben.");
    throw e;
  }
  const cookie = await startSession(env, data.userId, url);
  return json({ ok: true }, 200, { "set-cookie": cookie });
}

async function loginOptions(req, env, url) {
  const { rpID } = rp(env, url);
  const options = await generateAuthenticationOptions({ rpID, allowCredentials: [], userVerification: "preferred" });
  const challengeId = await saveChallenge(env, "login", options.challenge, {});
  return json({ challengeId, options });
}

async function loginVerify(req, env, url) {
  const body = await readJson(req);
  const { challenge } = await takeChallenge(env, body.challengeId, "login");
  const credId = body.response && body.response.id;
  const row = credId && await env.DB.prepare(`SELECT * FROM credentials WHERE id = ?`).bind(credId).first();
  if (!row) throw new HttpError(400, "Diesen Passkey kennen wir nicht. Erstelle zuerst ein Konto.");
  const { rpID, origin } = rp(env, url);
  let v;
  try {
    v = await verifyAuthenticationResponse({
      response: body.response, expectedChallenge: challenge, expectedOrigin: origin, expectedRPID: rpID,
      credential: { id: row.id, publicKey: fromB64url(row.public_key), counter: row.counter, transports: row.transports ? JSON.parse(row.transports) : undefined },
      requireUserVerification: false,
    });
  } catch (e) {
    throw new HttpError(400, "Anmeldung fehlgeschlagen: " + e.message);
  }
  if (!v.verified) throw new HttpError(400, "Anmeldung fehlgeschlagen.");
  await env.DB.prepare(`UPDATE credentials SET counter = ?, last_used_at = ? WHERE id = ?`)
    .bind(v.authenticationInfo.newCounter, new Date().toISOString(), row.id).run();
  const cookie = await startSession(env, row.user_id, url);
  return json({ ok: true }, 200, { "set-cookie": cookie });
}

async function logout(req, env) {
  const token = getCookie(req, SESSION_COOKIE);
  if (token) await env.DB.prepare(`DELETE FROM sessions WHERE token_hash = ?`).bind(await sha256(token)).run();
  return json({ ok: true }, 200, { "set-cookie": clearCookie });
}

/* ---------------- me / profile ---------------- */
function publicMe(u, passkeys) {
  return {
    user: { id: u.id, username: u.username, name: u.name, avatar: u.avatar, isAdmin: !!u.is_admin, passkeys },
    player: Object.assign(blankPlayer(), JSON.parse(u.player)),
    review: JSON.parse(u.review || '{"items":[]}'),
  };
}
async function getMe(req, env) {
  const u = await currentUser(req, env);
  if (!u) return json({ user: null });
  const n = await env.DB.prepare(`SELECT COUNT(*) AS n FROM credentials WHERE user_id = ?`).bind(u.id).first();
  return json(publicMe(u, n.n));
}
async function updateMe(req, env) {
  const u = await requireUser(req, env);
  const { name, avatar } = cleanProfile(await readJson(req));
  await env.DB.prepare(`UPDATE users SET name = ?, avatar = ?, updated_at = ? WHERE id = ?`)
    .bind(name, avatar, new Date().toISOString(), u.id).run();
  return json({ ok: true });
}
async function deleteMe(req, env) {
  const u = await requireUser(req, env);
  await env.DB.batch([
    env.DB.prepare(`DELETE FROM sessions WHERE user_id = ?`).bind(u.id),
    env.DB.prepare(`DELETE FROM credentials WHERE user_id = ?`).bind(u.id),
    env.DB.prepare(`DELETE FROM users WHERE id = ?`).bind(u.id),
  ]);
  return json({ ok: true }, 200, { "set-cookie": clearCookie });
}

/* ---------------- lessons ---------------- */
async function lessonIndex(req, env) {
  const u = await currentUser(req, env);
  const rows = await env.DB.prepare(
    `SELECT date, theme, title, status, subject_key AS subjectKey FROM lessons ${u && u.is_admin ? "" : "WHERE status != 'draft' AND date <= ?"} ORDER BY date DESC`
  ).bind(...(u && u.is_admin ? [] : [addDays(ymdUTC(new Date()), 1)])).all();
  return json({ lessons: rows.results });
}
async function getLesson(req, env, date) {
  if (!isYmd(date)) throw new HttpError(400, "Ungültiges Datum.");
  const u = await currentUser(req, env);
  const row = await env.DB.prepare(`SELECT body, status FROM lessons WHERE date = ?`).bind(date).first();
  const admin = u && u.is_admin;
  // Non-editors only see published lessons up to "today" in the earliest time zone.
  if (!row || (!admin && (row.status === "draft" || date > addDays(ymdUTC(new Date()), 1))))
    throw new HttpError(404, "Diese Lektion gibt es (noch) nicht.");
  return new Response(row.body, { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
}

/* ---------------- progress (server-side scoring, like Daily Learn's finish()) ---------------- */
async function finishLesson(req, env) {
  const u = await requireUser(req, env);
  const body = await readJson(req);
  const t = clientToday(body.today);
  const w = isoWeek(t);
  const mode = ["daily", "archive", "review"].includes(body.mode) ? body.mode : "archive";
  const len = [1, 2, 3].includes(body.len) ? body.len : 1;
  const p = Object.assign(blankPlayer(), JSON.parse(u.player));
  const review = JSON.parse(u.review || '{"items":[]}');
  review.items = Array.isArray(review.items) ? review.items : [];

  let L = null, total, correct;
  if (mode === "review") {
    const keys = Array.isArray(body.reviewKeys) ? body.reviewKeys.slice(0, 8) : [];
    const known = keys.filter((k) => review.items.some((x) => x.key === k));
    total = known.length;
    const right = new Set((Array.isArray(body.reviewCorrect) ? body.reviewCorrect : []).filter((k) => known.includes(k)));
    correct = right.size;
    review.items = review.items.filter((x) => !right.has(x.key));
  } else {
    if (!isYmd(body.date)) throw new HttpError(400, "Ungültiges Datum.");
    const row = await env.DB.prepare(`SELECT body, status FROM lessons WHERE date = ?`).bind(body.date).first();
    if (!row || row.status === "draft" || body.date > t) throw new HttpError(404, "Diese Lektion gibt es nicht.");
    L = JSON.parse(row.body);
    const qs = (L.questions || []).filter((q) => (q.tier || 1) <= len);
    const ids = new Set(qs.map((q) => q.id));
    const wrong = [...new Set((Array.isArray(body.wrong) ? body.wrong : []).filter((id) => ids.has(id)))];
    total = qs.length;
    correct = total - wrong.length;
    for (const id of wrong) {
      const q = qs.find((x) => x.id === id);
      const key = L.date + ":" + id;
      if (q && !review.items.some((x) => x.key === key)) review.items.unshift({ key, theme: L.theme, q });
    }
    review.items = review.items.slice(0, 60);
  }

  const perfect = correct === total && total > 0;
  let xp;
  if (mode === "review") xp = correct * XP.review;
  else xp = correct * XP.perCorrect + XP.lenBonus[len] + (perfect ? XP.perfect[len] : 0);

  let streakUp = false, milestone = null, freezeUsed = 0, gotFreeze = false;
  const newBadges = [];
  p.xp = (p.xp || 0) + xp;
  p.weekXp[w] = (p.weekXp[w] || 0) + xp;
  trimKeys(p.weekXp, 8);
  if (mode === "daily" && L && L.date === t && !p.completed[t]) {
    if (!p.lastDay) p.streak = 1;
    else {
      const gap = dayDiff(p.lastDay, t) - 1;
      if (gap <= 0) p.streak = (p.streak || 0) + 1;
      else if (gap <= (p.freezes || 0)) { p.freezes -= gap; freezeUsed = gap; p.streak = (p.streak || 0) + 1; }
      else p.streak = 1;
    }
    p.lastDay = t;
    p.best = Math.max(p.best || 0, p.streak);
    p.activeDays = (p.activeDays || 0) + 1;
    if (p.activeDays % 7 === 0 && (p.freezes || 0) < 2) { p.freezes = (p.freezes || 0) + 1; gotFreeze = true; }
    p.completed[t] = { len, score: correct, total };
    trimKeys(p.completed, 120);
    const th = p.weekThemes[w] || [];
    if (!th.includes(L.theme)) th.push(L.theme);
    p.weekThemes[w] = th;
    trimKeys(p.weekThemes, 8);
    streakUp = true;
    milestone = [7, 30, 100, 365].find((m) => p.streak === m) || null;
  }
  if (L && L.theme === "geography" && L.subjectKey && !p.countries.includes(L.subjectKey)) p.countries.push(L.subjectKey);
  if (mode !== "review" && len === 3) p.longCount = (p.longCount || 0) + 1;
  if (mode !== "review" && perfect) p.perfectCount = (p.perfectCount || 0) + 1;
  for (const b of BADGES) if (!p.badges.includes(b.id) && b.test(p)) { p.badges.push(b.id); newBadges.push(b.name); }

  await env.DB.prepare(`UPDATE users SET player = ?, review = ?, updated_at = ? WHERE id = ?`)
    .bind(JSON.stringify(p), JSON.stringify(review), new Date().toISOString(), u.id).run();
  return json({ player: p, review, xp, correct, total, perfect, streakUp, streak: p.streak, milestone, freezeUsed, gotFreeze, newBadges });
}

/* ---------------- streak list / leaderboard (all accounts, public) ---------------- */
async function leaderboard(req, env) {
  const rows = await env.DB.prepare(`SELECT id, name, avatar, player FROM users`).all();
  const players = rows.results.map((r) => {
    const p = JSON.parse(r.player);
    return {
      id: r.id, name: r.name, avatar: r.avatar,
      xp: p.xp || 0, streak: p.streak || 0, best: p.best || 0, lastDay: p.lastDay || null,
      freezes: p.freezes || 0, weekXp: p.weekXp || {}, activeDays: p.activeDays || 0,
    };
  });
  return json({ players });
}

/* ---------------- editorial desk (admin) ---------------- */
async function saveLesson(req, env, date) {
  await requireAdmin(req, env);
  if (!isYmd(date)) throw new HttpError(400, "Ungültiges Datum.");
  const L = await readJson(req);
  const err = validateLesson(L);
  if (err) throw new HttpError(400, err);
  L.date = date;
  L.status = L.status === "draft" ? "draft" : "published";
  await lessonInsert(env, L).run();
  return json({ ok: true });
}
async function setLessonStatus(req, env, date) {
  await requireAdmin(req, env);
  const { status } = await readJson(req);
  const row = await env.DB.prepare(`SELECT body FROM lessons WHERE date = ?`).bind(date).first();
  if (!row) throw new HttpError(404, "Lektion nicht gefunden.");
  const L = JSON.parse(row.body);
  L.status = status === "draft" ? "draft" : "published";
  await lessonInsert(env, L).run();
  return json({ ok: true });
}
async function deleteLesson(req, env, date) {
  await requireAdmin(req, env);
  await env.DB.prepare(`DELETE FROM lessons WHERE date = ?`).bind(date).run();
  return json({ ok: true });
}
async function generateForDate(env, date) {
  const theme = THEME_BY_WD[new Date(parseYmd(date)).getUTCDay()];
  const prev = await env.DB.prepare(`SELECT date, title, subject_key FROM lessons WHERE theme = ? AND date != ? ORDER BY date`)
    .bind(theme, date).all();
  const done = prev.results.map((x) => `${x.subject_key || x.title} (${x.title})`);
  const L = await generateLesson(env, { date, theme, done });
  await lessonInsert(env, L).run();
  return L;
}
async function adminGenerate(req, env) {
  await requireAdmin(req, env);
  if (!env.ANTHROPIC_API_KEY) throw new HttpError(400, "Für das Erzeugen fehlt das Secret ANTHROPIC_API_KEY (siehe README).");
  const { date } = await readJson(req);
  if (!isYmd(date)) throw new HttpError(400, "Bitte ein Datum wählen.");
  const L = await generateForDate(env, date);
  return json({ ok: true, title: L.title });
}
async function adminUsers(req, env) {
  await requireAdmin(req, env);
  const rows = await env.DB.prepare(
    `SELECT u.id, u.username, u.name, u.avatar, u.is_admin AS isAdmin, u.created_at AS createdAt,
            (SELECT COUNT(*) FROM credentials c WHERE c.user_id = u.id) AS passkeys
     FROM users u ORDER BY u.created_at`).all();
  return json({ users: rows.results });
}

/* ---------------- status (public; shows whether a deploy and its lessons arrived) ---------------- */
async function status(env) {
  const db = await env.DB.prepare(`SELECT COUNT(*) AS n, MAX(date) AS latest FROM lessons WHERE status != 'draft'`).first();
  return json({
    ok: true,
    bundled: { count: BUNDLED_LESSONS.length, latest: BUNDLED_LESSONS.length ? BUNDLED_LESSONS[BUNDLED_LESSONS.length - 1].date : null },
    database: { count: db.n, latest: db.latest },
  });
}

/* ---------------- router ---------------- */
async function handleApi(req, env, url) {
  await ensureSchema(env);
  const path = url.pathname.replace(/\/+$/, "");
  const m = req.method;

  // Basic CSRF protection: state-changing requests must come from our own origin.
  if (m !== "GET" && m !== "HEAD") {
    const origin = req.headers.get("origin");
    if (origin && origin !== url.origin && origin !== env.ORIGIN) return fail(403, "Fremde Herkunft.");
  }

  if (path === "/api/me" && m === "GET") return getMe(req, env);
  if (path === "/api/me" && m === "PUT") return updateMe(req, env);
  if (path === "/api/me" && m === "DELETE") return deleteMe(req, env);
  if (path === "/api/auth/register/options" && m === "POST") return registerOptions(req, env, url);
  if (path === "/api/auth/register/verify" && m === "POST") return registerVerify(req, env, url);
  if (path === "/api/auth/login/options" && m === "POST") return loginOptions(req, env, url);
  if (path === "/api/auth/login/verify" && m === "POST") return loginVerify(req, env, url);
  if (path === "/api/auth/logout" && m === "POST") return logout(req, env);
  if (path === "/api/lessons" && m === "GET") return lessonIndex(req, env);
  if (path === "/api/leaderboard" && m === "GET") return leaderboard(req, env);
  if (path === "/api/status" && m === "GET") return status(env);
  if (path === "/api/progress/finish" && m === "POST") return finishLesson(req, env);
  if (path === "/api/admin/generate" && m === "POST") return adminGenerate(req, env);
  if (path === "/api/admin/users" && m === "GET") return adminUsers(req, env);

  let mm = path.match(/^\/api\/lessons\/(\d{4}-\d{2}-\d{2})$/);
  if (mm && m === "GET") return getLesson(req, env, mm[1]);
  mm = path.match(/^\/api\/admin\/lessons\/(\d{4}-\d{2}-\d{2})(\/status)?$/);
  if (mm && !mm[2] && m === "PUT") return saveLesson(req, env, mm[1]);
  if (mm && !mm[2] && m === "DELETE") return deleteLesson(req, env, mm[1]);
  if (mm && mm[2] && m === "POST") return setLessonStatus(req, env, mm[1]);

  return fail(404, "Nicht gefunden.");
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(req);
    try {
      return await handleApi(req, env, url);
    } catch (e) {
      if (e instanceof HttpError) return fail(e.status, e.message);
      console.error(e);
      return fail(500, "Serverfehler: " + (e && e.message ? e.message : "unbekannt"));
    }
  },

  // Daily cron: make sure tomorrow's lesson exists (needs ANTHROPIC_API_KEY).
  async scheduled(event, env, ctx) {
    if (!env.ANTHROPIC_API_KEY) return;
    await ensureSchema(env);
    const today = ymdUTC(new Date());
    for (const date of [today, addDays(today, 1)]) {
      const exists = await env.DB.prepare(`SELECT 1 FROM lessons WHERE date = ?`).bind(date).first();
      if (exists) continue;
      try {
        const L = await generateForDate(env, date);
        console.log(`Generated lesson for ${date}: ${L.title}`);
      } catch (e) {
        console.error(`Lesson generation for ${date} failed`, e);
      }
    }
  },
};
