// VO suara tetap Fola lewat konten /api/tts (AI Studio web). Pakai: node tts.mjs <naskah.txt> <keluar.wav>
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const [, , src, wav] = process.argv;
const K = process.env.KONTEN_API_KEY || fs.readFileSync("E:/Rakazo/.konten-api-key", "utf8").trim();
const U = "https://konten.nusawebsite.com";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const teks = fs.readFileSync(src, "utf8").trim();
if (/tanpa (maksa|paksa)|tidak (maksa|paksa)|[—–]|rp\s?\d|harga|biaya|cicilan|kredit/i.test(teks)) { console.error("GERBANG: naskah melanggar larangan brand"); process.exit(1); }
let s = await fetch(U + "/api/tts", { method: "POST", headers: { "x-api-key": K, "content-type": "application/json" }, body: JSON.stringify({ teks, nama: "fmtjasa-" + Date.now(), voice: "Fola", gaya: "", potong: 0 }) }).then((r) => r.json());
const id = s.id; console.log("job", id);
const t0 = Date.now();
while (!s.url && !["gagal", "failed"].includes(s.status)) {
  if (Date.now() - t0 > 30 * 60e3) throw new Error("TTS timeout " + id);
  await sleep(5000); s = await fetch(U + "/api/tts/" + id, { headers: { "x-api-key": K } }).then((r) => r.json());
}
if (!s.url) throw new Error("TTS gagal: " + s.status + " " + (s.error || ""));
if (s.suara && s.suara.toLowerCase() !== "fola") throw new Error("suara salah: " + s.suara);
const url = /^https?:/.test(s.url) ? s.url : "https://imgq.nusawebsite.com" + s.url;
const mentah = wav.replace(/\.wav$/, ".mentah.wav");
fs.writeFileSync(mentah, Buffer.from(await (await fetch(url)).arrayBuffer()));
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", mentah, "-af", "highpass=f=70,afftdn=nr=12:nf=-50:tn=1,agate=threshold=0.003:ratio=3:attack=5:release=120", wav]);
console.log("selesai", execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav], { encoding: "utf8" }).trim(), "dtk →", wav);
