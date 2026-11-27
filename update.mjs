// Booska Cycle Clock · archive robot · @Booskapro · © All rights reserved
// Runs every 10 minutes in GitHub Actions. It never deletes data:
//  - weekly.json   : weekly candles (closes) – new weeks are appended, old weeks are never removed
//  - events.json   : halvings, tops, bottoms (suspected → confirmed; revisions kept)
//  - history.csv   : one row per UTC day (today's row is updated until the day ends)
//  - status.json   : last run
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const D = (f) => path.join(ROOT, f);
const readJSON = (f, d) => { try { return JSON.parse(fs.readFileSync(D(f), "utf8")); } catch { return d; } };
const now = Date.now();

const weekly = readJSON("weekly.json", []);
const events = readJSON("events.json", { version: 1, events: [] });
const status = readJSON("status.json", {});
const before = JSON.stringify(events.events);

// load the exact same engine the website uses
const ctx = { console, fetch, AbortController, setTimeout, clearTimeout, URLSearchParams, WEEKLY: weekly, EVENTS: events };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "core.js"), "utf8") +
  ";globalThis.__={S,buildModel,detectEvents,historyRow,fetchBlock,fetchPrice,putWeek,weeksFromDaily,syncFromEvents,iso,isoT,monday}", ctx);
const X = ctx.__, S = X.S;

async function get(u) { const r = await fetch(u, { headers: { "User-Agent": "booska-cycle-clock" } }); if (!r.ok) throw new Error(u + " " + r.status); return r.headers.get("content-type")?.includes("json") ? r.json() : r.text(); }

// 1) block + price
const okB = await X.fetchBlock();
const okP = await X.fetchPrice();
if (!okB) { console.error("no block source reachable – nothing written"); process.exit(0); }

// 2) daily candles (intraday high/low + close). Coinbase works from GitHub's US runners; Kraken as backup.
let candles = [];
try {
  const j = await get("https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=86400");
  candles = j.map(k => ({ t: k[0] * 1000, h: +k[2], l: +k[1], c: +k[4] })).sort((a, b) => a.t - b.t);
} catch (e) {
  try {
    const j = await get("https://api.kraken.com/0/public/OHLC?pair=XBTUSD&interval=1440");
    const k = Object.values(j.result).find(Array.isArray);
    candles = k.map(r => ({ t: r[0] * 1000, h: +r[2], l: +r[3], c: +r[4] }));
  } catch (e2) { console.error("no candle source", e2.message); }
}
// only closed days for the weekly closes; today's partial day is covered by the live price
const closedDays = candles.filter(c => c.t + 864e5 <= now);
if (closedDays.length) for (const w of X.weeksFromDaily(closedDays.map(c => [c.t, c.c]))) X.putWeek(w);
if (!okP && candles.length) { S.price = candles[candles.length - 1].c; }

// 3) exact halving block time from the blockchain
async function halvingTime(n) {
  try { const h = await get(`https://mempool.space/api/block-height/${n * 210000}`); const b = await get(`https://mempool.space/api/block/${String(h).trim()}`); return b.timestamp * 1000; }
  catch { return null; }
}
const ht = {};
for (let n = 1; n <= Math.floor(S.block / 210000); n++) {
  const e = S.events.find(x => x.type === "halving" && x.n === n);
  if (!e || e.src !== "blockchain") { const t = await halvingTime(n); if (t) { ht[n] = t; if (e) { e.t = X.isoT(t); e.src = "blockchain"; } } }
}
X.syncFromEvents();

// 4) detect events with the shared rules
const changes = X.detectEvents(closedDays.concat(candles.filter(c => c.t + 864e5 > now)), { block: S.block, price: S.price, now, halvingTime: n => ht[n] || null });

// 5) refine the hour of new / revised tops & bottoms (Coinbase hourly candles)
for (const e of S.events) {
  if ((e.type === "top" || e.type === "bottom") && e.precision === "day" && e.updatedAt && Date.parse(e.updatedAt) >= now - 60000) {
    try {
      const d0 = Date.parse(e.t + "T00:00:00Z"), d1 = d0 + 864e5;
      const j = await get(`https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=3600&start=${new Date(d0).toISOString()}&end=${new Date(d1).toISOString()}`);
      const pick = e.type === "top" ? j.reduce((a, b) => (+b[2] > +a[2] ? b : a)) : j.reduce((a, b) => (+b[1] < +a[1] ? b : a));
      e.t = X.isoT(pick[0] * 1000); e.precision = "hour";
    } catch {}
  }
}

// 6) model + today's history row
X.buildModel();
const row = X.historyRow();
const hpath = D("history.csv");
let lines = fs.existsSync(hpath) ? fs.readFileSync(hpath, "utf8").trim().split("\n") : [];
const cols = Object.keys(row);
if (!lines.length) lines = [cols.join(",")];
const header = lines[0].split(",");
for (const c of cols) if (!header.includes(c)) header.push(c); // new columns are added, never removed
lines[0] = header.join(",");
const csvRow = header.map(c => (row[c] ?? "")).join(",");
const idx = lines.findIndex((l, i) => i > 0 && l.startsWith(row.date + ","));
const rowIsNew = idx < 0;
if (rowIsNew) lines.push(csvRow); else lines[idx] = csvRow;

// 7) write – events immediately; otherwise at most once an hour (keeps the repository small)
const eventsChanged = JSON.stringify(S.events) !== before;
const due = rowIsNew || !status.lastWrite || now - Date.parse(status.lastWrite) > 55 * 60000;
if (eventsChanged || due) {
  events.events = S.events; events.updated = X.isoT(now);
  fs.writeFileSync(D("events.json"), JSON.stringify(events, null, 1));
  const out = S.weekly.map(w => [X.iso(w.t), +w.o.toFixed(2), +w.h.toFixed(2), +w.l.toFixed(2), +w.c.toFixed(2)].map(v => typeof v === "number" && v >= 10 ? Math.round(v) : v));
  fs.writeFileSync(D("weekly.json"), JSON.stringify(out));
  fs.writeFileSync(hpath, lines.join("\n") + "\n");
  fs.writeFileSync(D("status.json"), JSON.stringify({ lastWrite: X.isoT(now), lastRun: X.isoT(now), block: S.block, price: Math.round(S.price), sources: { block: S.srcB, price: S.srcP }, changes }, null, 1));
  console.log("written", { eventsChanged, rowIsNew, changes });
} else console.log("no write needed", row.block, row.price);
