// Generator video format F1 "Bedah Portofolio" (channel JASA Nusawebsite).
// Pakai (dari folder mana pun): node templat/F1/buat.mjs <KODE> [--tanpa-render] [--ulang-vo] [--ulang-waktu]
// Masukan: keywords.json (entri KODE) + produksi/<KODE>/naskah.json. Keluaran: produksi/<KODE>/{vo/, waktu.json, proyek/, hasil.mp4, frames/, meta.json}
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ANIM, CSS } from "./anim.mjs";

const T = path.dirname(fileURLToPath(import.meta.url));           // templat/F1
const ROOT = path.resolve(T, "../..");                              // format-jasa
const PY = process.env.JASA_PY || "C:/Users/RIFE/AppData/Local/Programs/Python/Python310/python.exe"; // JASA_PY = python di CI
const HF = ["--yes", "hyperframes@0.8.20"];
const OFF = 0.4;                                                    // VO mulai 0,4 dtk
const args = process.argv.slice(2);
const KODE = args.find((a) => !a.startsWith("--"));
const opt = (n) => args.includes(n);
if (!KODE) { console.error("pakai: node buat.mjs <KODE>"); process.exit(1); }

const kw = JSON.parse(fs.readFileSync(path.join(ROOT, "keywords.json"), "utf8")).find((x) => x.kode === KODE);
if (!kw) throw new Error(`KODE ${KODE} tidak ada di keywords.json`);
if (kw.format !== "F1") console.warn(`PERINGATAN: ${KODE} terdaftar format ${kw.format}, dibuat dengan templat F1`);
const D = path.join(ROOT, "produksi", KODE);
const raw = JSON.parse(fs.readFileSync(path.join(D, "naskah.json"), "utf8"));
const N = Array.isArray(raw) ? { blok: raw } : raw;
const blok = N.blok;

// ---------- gerbang naskah ----------
const semua = blok.map((b) => b.teks).join("\n\n");
const cekH = semua.split(new RegExp(kw.keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")).join(" ");  // keyword boleh memuat "murah"
const salah = [];
if (/\b(tanpa|tidak|nggak|gak)\s+(maksa|paksa|memaksa|dipaksa)/i.test(semua)) salah.push('kata "tanpa/tidak maksa|paksa"');
if (/[—–]/.test(semua)) salah.push("em/en dash");
if (/\brp\.?\s?\d|\bharga\b|\bbiaya\b|\btarif\b|\bmurah\b|\bdiskon\b|\bjuta\b|\bribu\b/i.test(cekH)) salah.push("harga/biaya");
if (/\b(cicilan|kredit|pinjam|pinjaman|bunga|riba|gadai|koperasi)\b/i.test(semua)) salah.push("topik riba");
if (/https?:|www\.|\.com\b|\b0\d{8,}/i.test(semua)) salah.push("URL/nomor diucapkan");
if (/\d+\s?%|\bpersen\b/i.test(semua)) salah.push("statistik persen (rawan karangan)");
const kal1 = blok[0].teks.split(/(?<=[.!?])\s/)[0];
if (kal1.includes("?")) salah.push("hook kalimat pertama berupa pertanyaan");
if (!blok[0].teks.toLowerCase().includes(kw.keyword.toLowerCase())) salah.push(`keyword "${kw.keyword}" tidak utuh di blok pertama`);
for (const [i, b] of blok.entries()) if (!ANIM[b.anim]) salah.push(`blok ${i + 1}: anim "${b.anim}" tidak dikenal`);
const nk = semua.split(/\s+/).length;
if (salah.length) { console.error("GERBANG NASKAH GAGAL:\n- " + salah.join("\n- ")); process.exit(1); }
if (nk < 115 || nk > 185) console.warn(`PERINGATAN: ${nk} kata (target 130-170 untuk 55-70 dtk)`);

// ---------- (a) VO satu job ----------
const voDir = path.join(D, "vo"), wav = path.join(voDir, "vo.wav");
fs.mkdirSync(voDir, { recursive: true });
fs.writeFileSync(path.join(D, "naskah.txt"), semua + "\n");
const hash = crypto.createHash("md5").update(semua).digest("hex");
const hashF = path.join(voDir, "naskah.md5");
if (fs.existsSync(wav) && fs.existsSync(hashF) && fs.readFileSync(hashF, "utf8") !== hash && !opt("--ulang-vo"))
  throw new Error("naskah berubah sejak VO dibuat; jalankan dengan --ulang-vo");
if (!fs.existsSync(wav) || opt("--ulang-vo")) {
  console.log("TTS (Fola, satu job)…");
  execFileSync("node", [path.join(ROOT, "_bahan/tts.mjs"), path.join(D, "naskah.txt"), wav], { stdio: "inherit" });
  fs.writeFileSync(hashF, hash);
  try { fs.unlinkSync(path.join(D, "waktu.json")); } catch {}
}

// ---------- (b) timing per blok ----------
const wJ = path.join(D, "waktu.json");
if (!fs.existsSync(wJ) || opt("--ulang-waktu") || opt("--ulang-vo")) {
  const bj = path.join(D, "blok.json");
  fs.writeFileSync(bj, JSON.stringify(blok.map((b) => b.teks)));
  execFileSync(PY, [path.join(T, "waktu.py"), wav, bj, wJ], { stdio: "inherit" });
}
const W = JSON.parse(fs.readFileSync(wJ, "utf8"));
const norm = (s) => s.toLowerCase().replace(/[^0-9a-z]/g, "");

// ---------- (c) proyek HyperFrames ----------
const P = path.join(D, "proyek"), A = path.join(P, "assets");
fs.mkdirSync(A, { recursive: true });
for (const f of fs.readdirSync(path.join(T, "assets"))) fs.copyFileSync(path.join(T, "assets", f), path.join(A, f));
fs.copyFileSync(wav, path.join(A, "vo.wav"));
const FT = JSON.parse(fs.readFileSync(path.join(T, "footage.json"), "utf8"));
const SRC = path.join(ROOT, "_bahan/dentalcare-yt004.mp4");
function klip(nama, dur) {
  const k = FT.klip[nama];
  if (!k) throw new Error(`klip footage "${nama}" tidak ada; pilihan: ${Object.keys(FT.klip).join(", ")}`);
  const cache = path.join(T, "footage", nama + ".mp4");
  if (!fs.existsSync(cache)) {
    fs.mkdirSync(path.dirname(cache), { recursive: true });
    execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(k.mulai), "-t", String(k.durasi), "-i", SRC, "-vf", `crop=${FT.crop},fps=30`, "-an", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", cache]);
  }
  const need = dur + 0.3;
  if (need <= k.durasi) { const o = `klip-${nama}.mp4`; fs.copyFileSync(cache, path.join(A, o)); return "assets/" + o; }
  const fak = need / k.durasi, o = `klip-${nama}-${need.toFixed(1)}.mp4`;
  if (fak > 1.7) console.warn(`PERINGATAN: klip ${nama} diperlambat ${fak.toFixed(2)}x (blok terlalu panjang untuk klip ini)`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", cache, "-vf", `setpts=${fak.toFixed(4)}*PTS,fps=30`, "-an", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", path.join(A, o)]);
  return "assets/" + o;
}

const total = +(W.durasi + OFF + 1.2).toFixed(2);
const scenes = blok.map((b, i) => {
  const t0 = i === 0 ? 0 : W.blok[i].mulai + OFF;
  const t1 = i === blok.length - 1 ? total : W.blok[i + 1].mulai + OFF;
  return { b, i, t0, t1 };
});
let html = "", js = "";
for (const s of scenes) {
  const kataB = W.kata.filter((k) => k.b === s.i);
  const dur = s.t1 - s.t0;
  const jepit = (t) => Math.min(s.t1 - 0.7, Math.max(s.t0 + 0.15, t));
  const c = {
    id: "s" + (s.i + 1), t0: s.t0, t1: s.t1, dur, keyword: kw.keyword, klip,
    kata(str) {
      for (const tok of String(str || "").split(/\s+/).map(norm).filter((x) => x.length >= 3)) {
        const h = kataB.find((k) => norm(k.w) === tok) || (tok.length >= 4 && kataB.find((k) => norm(k.w).length >= 4 && (norm(k.w).startsWith(tok) || tok.startsWith(norm(k.w)))));
        if (h) return h.t + OFF;
      }
      return null;
    },
    at(str, frac) { const t = this.kata(str); return jepit(t ?? s.t0 + frac * dur); },
    kataKe(i, fb) { return kataB[i] ? kataB[i].t + OFF : fb; },
  };
  const r = ANIM[s.b.anim](s.b.param || {}, c);
  html += `\n<!-- blok ${s.i + 1} ${s.b.anim} ${s.t0.toFixed(2)}-${s.t1.toFixed(2)} -->\n` + r.html;
  js += `\n// blok ${s.i + 1} ${s.b.anim}\n` + r.js;
}

const index = `<!doctype html>
<html lang="id"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1920, height=1080" />
<title>${KODE} F1 ${kw.keyword}</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
@font-face{font-family:"Spartan";src:url("assets/spartan.woff2") format("woff2");font-weight:100 900}
@font-face{font-family:"InterF";src:url("assets/inter.woff2") format("woff2");font-weight:100 900}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1920px;height:1080px;overflow:hidden;background:#FFFFFF}
body{font-family:"InterF",sans-serif;color:#0F172A}
#root{position:relative;width:100%;height:100%;overflow:hidden;background:#FFFFFF}
.full{position:absolute;inset:0}
.bgb{background:radial-gradient(ellipse at 30% 20%,#FFFFFF 0%,#FFF8F3 60%,#FFF1E8 100%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(15,23,42,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,.05) 1px,transparent 1px);background-size:80px 80px;-webkit-mask-image:radial-gradient(ellipse at 50% 50%,#000 25%,transparent 80%);mask-image:radial-gradient(ellipse at 50% 50%,#000 25%,transparent 80%)}
.blob{position:absolute;border-radius:50%}
.b1{width:1000px;height:1000px;left:-360px;top:-420px;background:radial-gradient(circle,rgba(255,128,64,.16) 0%,rgba(255,128,64,0) 66%)}
.b2{width:1100px;height:1100px;left:1180px;top:420px;background:radial-gradient(circle,rgba(255,128,64,.12) 0%,rgba(255,128,64,0) 66%)}
.logo{position:absolute;top:52px;right:72px;height:44px;width:auto;z-index:50}
${CSS}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="1920" data-height="1080">
<div id="bg" class="clip full" data-start="0" data-duration="${total}" data-track-index="0">
  <div class="full bgb"></div><div id="bl1" class="blob b1"></div><div id="bl2" class="blob b2"></div><div class="grid"></div>
  <img class="logo" src="assets/logo.png" alt="Nusawebsite" />
</div>
<audio id="vo" src="assets/vo.wav" data-start="${OFF}" data-duration="${W.durasi.toFixed(2)}" data-track-index="9" data-volume="1"></audio>
${html}
</div>
<script>
const tl = gsap.timeline({ paused: true });
tl.to("#bl1",{x:120,y:80,duration:${total},ease:"sine.inOut"},0);
tl.to("#bl2",{x:-140,y:-60,duration:${total},ease:"sine.inOut"},0);
${js}
window.__timelines = window.__timelines || {};
window.__timelines["main"] = tl;
</script></body></html>
`;
fs.writeFileSync(path.join(P, "index.html"), index);
fs.writeFileSync(path.join(P, "hyperframes.json"), JSON.stringify({ $schema: "https://hyperframes.heygen.com/schema/hyperframes.json", registry: "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry", paths: { blocks: "compositions", components: "compositions/components", assets: "assets" }, media: { autoProxy: true }, authoringSkill: "general-video" }, null, 1));
fs.writeFileSync(path.join(P, "package.json"), JSON.stringify({ name: KODE.toLowerCase() + "-f1", private: true, type: "module" }, null, 1));
console.log(`proyek ${P} (${blok.length} blok, ${total} dtk, waktu: ${W.sumber.slice(0, 40)})`);

// ---------- (d) check ----------
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const ck = spawnSync(npx, [...HF, "check"], { cwd: P, encoding: "utf8", shell: true });
const ckOut = (ck.stdout || "") + (ck.stderr || "");
fs.writeFileSync(path.join(D, "check.log"), ckOut);
const err = (ckOut.match(/(\d+)\s+error/i) || [])[1];
console.log("check:", err ? `${err} error` : "lihat check.log", "| exit", ck.status);

// ---------- (g) meta ----------
const Kap = (s) => s.replace(/\b\w/g, (m) => m.toUpperCase());
const M = N.meta || {};
let judul = M.judul || `${Kap(kw.keyword)}: Bedah Aplikasi Custom yang Kami Bangun`;
if (judul.length > 70) judul = `${Kap(kw.keyword)}: Bedah Portofolio Aplikasi`;
if (judul.length > 70) judul = Kap(kw.keyword).slice(0, 70);
const bab = scenes.filter((s) => s.b.bab).map((s) => `${Math.floor(s.t0 / 60)}:${String(Math.floor(s.t0 % 60)).padStart(2, "0")} ${s.b.bab}`);
const deskripsi = [
  `${Kap(kw.keyword)} dari Nusawebsite: ${M.ringkas || "kami bedah contoh aplikasi custom yang benar-benar kami bangun, fitur per fitur, supaya Anda bisa menilai hasil kerja kami sebelum memilih."}`,
  M.paragraf || "Setiap bisnis punya alur kerja sendiri. Aplikasi custom dirancang mengikuti alur itu, mulai dari konsultasi kebutuhan, mockup tampilan yang disetujui dulu, sampai rilis dan pendampingan.",
  bab.length >= 3 && bab[0].startsWith("0:00") ? "Isi video:\n" + bab.join("\n") : "",
  `Konsultasi gratis untuk aplikasi bisnis Anda: {{LINK_WA}}`,
  "Nusawebsite, software house di Jogja untuk aplikasi web dan mobile custom.",
].filter(Boolean).join("\n\n");
const tag = [...new Set([kw.keyword, ...(M.tag || []), "jasa pembuatan aplikasi", "aplikasi custom", "software house", "jasa aplikasi bisnis", "pembuatan aplikasi web", "software house jogja", "nusawebsite", "aplikasi bisnis"])].slice(0, 12);

// ---------- (e) render ----------
const out = path.join(D, "hasil.mp4");
if (!opt("--tanpa-render")) {
  const t0 = Date.now();
  console.log("render (antre maks 3 slot)…");
  // render ke hasil-polos.mp4, lalu watermark WA kanan bawah (sama dgn video DentalCare, owner 17 Okt) → hasil.mp4
  const polos = path.join(D, "hasil-polos.mp4");
  execFileSync("bash", [path.join(ROOT, "_bahan/render-antre.sh"), "npx", ...HF, "render", "--quiet", "-o", polos.replace(/\\/g, "/"), "."], { cwd: P, stdio: "inherit" });
  execFileSync("node", [path.join(ROOT, "_bahan/watermark.mjs"), D], { stdio: "inherit" });
  console.log(`render ${((Date.now() - t0) / 1000).toFixed(0)} dtk → ${out}`);
  // ---------- (f) frame cek ----------
  const F = path.join(D, "frames");
  fs.rmSync(F, { recursive: true, force: true }); fs.mkdirSync(F);
  const pilih = [0, 1, 2, 3, 4, 5].map((k) => scenes[Math.min(scenes.length - 1, Math.round(k * (scenes.length - 1) / 5))]);
  const ts = [...new Set(pilih.map((s) => +(s.t0 + Math.min(s.t1 - s.t0 - 0.5, (s.t1 - s.t0) * 0.75)).toFixed(1)))];
  const fs_ = ts.map((t) => { const o = path.join(F, `f-${t}.png`); execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(t), "-i", out, "-frames:v", "1", o]); return o; });
  while (fs_.length < 6) fs_.push(fs_[fs_.length - 1]);
  execFileSync("ffmpeg", ["-v", "error", "-y", ...fs_.flatMap((x) => ["-i", x]), "-filter_complex", "[0][1][2]hstack=3[a];[3][4][5]hstack=3[b];[a][b]vstack,scale=1920:-1", "-frames:v", "1", path.join(F, "_grid.jpg")]);
}
const durasi = fs.existsSync(out) ? +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out], { encoding: "utf8" }).trim() : total;
fs.writeFileSync(path.join(D, "meta.json"), JSON.stringify({ kode: KODE, keyword: kw.keyword, format: "F1", judul, deskripsi, tag, durasi: +durasi.toFixed(2), kata: nk, waktu: W.sumber.split(" ")[0] }, null, 1));
console.log("SELESAI", KODE, judul, durasi.toFixed(1), "dtk");
