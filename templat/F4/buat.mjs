// Generator video format F4 Checklist. Pakai (dari folder mana pun):
//   node templat/F4/buat.mjs <KODE> [--tanpa-render] [--ulang-vo]
// Membaca keywords.json (entri KODE) + produksi/<KODE>/naskah.json → VO → timing → proyek HyperFrames → check → render → frame → meta.json
import fs from "node:fs";
import path from "node:path";
import { execFileSync, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ANIM, CSS, esc } from "./anim.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, "../..");                 // growth/video/format-jasa
const PY = process.env.JASA_PY || "C:/Users/RIFE/AppData/Local/Programs/Python/Python310/python.exe"; // JASA_PY = python di CI
const OFF = 0.4;                                          // VO mulai 0,4 dtk
const args = process.argv.slice(2), KODE = args.find((a) => !a.startsWith("--"));
const flag = (f) => args.includes(f);
if (!KODE) { console.error("pakai: node buat.mjs <KODE>"); process.exit(1); }

const KW = JSON.parse(fs.readFileSync(path.join(ROOT, "keywords.json"), "utf8"));
const entri = KW.find((k) => k.kode === KODE);
if (!entri) throw new Error("KODE tidak ada di keywords.json: " + KODE);
const PD = path.join(ROOT, "produksi", KODE);
const raw = JSON.parse(fs.readFileSync(path.join(PD, "naskah.json"), "utf8"));
const N = Array.isArray(raw) ? { blok: raw } : raw;
const blok = N.blok;
const log = (...a) => console.log(`[${KODE}]`, ...a);

// ---------- GERBANG naskah ----------
const LARANG = [/tanpa\s+(maksa|paksa)/i, /tidak\s+(maksa|paksa)/i, /[—–]/, /\brp\.?\s?\d/i, /\bharga\b/i, /\bbiaya\b/i, /\bmurah\b/i, /\b(cicilan|kredit|pinjam\w*|riba|gadai|koperasi)\b/i, /https?:|www\.|\.com\b/i, /\b0\d{8,}\b|\+62/];
const semuaTeks = JSON.stringify(N);
const kwBoleh = entri.keyword.toLowerCase();           // keyword boleh memuat "murah"
const salah = [];
for (const re of LARANG) {
  const m = semuaTeks.replace(new RegExp(kwBoleh.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "").match(re);
  if (m) salah.push(`larangan: "${m[0]}"`);
}
const kal1 = blok[0].teks.split(/(?<=[.!])\s/)[0];
if (!kal1.toLowerCase().includes(kwBoleh)) salah.push(`keyword "${entri.keyword}" tidak utuh di kalimat pertama`);
if (kal1.includes("?")) salah.push("kalimat pertama berupa pertanyaan (hook harus pernyataan)");
for (const [i, b] of blok.entries()) if (!ANIM[b.anim]) salah.push(`blok ${i}: anim "${b.anim}" tidak dikenal (${Object.keys(ANIM).join(", ")})`);
if (blok[blok.length - 1].anim !== "cta") salah.push("blok terakhir harus anim cta");
const kata = blok.map((b) => b.teks).join(" ").split(/\s+/).length;
if (kata < 110 || kata > 185) salah.push(`jumlah kata ${kata} (target 130-170)`);
if (salah.length) { console.error(`[${KODE}] GERBANG GAGAL:\n - ` + salah.join("\n - ")); process.exit(2); }
log("gerbang lolos,", kata, "kata,", blok.length, "blok");

// ---------- VO ----------
const voDir = path.join(PD, "vo"); fs.mkdirSync(voDir, { recursive: true });
const wav = path.join(voDir, "vo.wav");
const teksVO = blok.map((b) => b.teks).join("\n\n");
fs.writeFileSync(path.join(voDir, "naskah.txt"), teksVO);
if (!fs.existsSync(wav) || flag("--ulang-vo")) {
  log("TTS...");
  execFileSync("node", [path.join(ROOT, "_bahan/tts.mjs"), path.join(voDir, "naskah.txt"), wav], { stdio: "inherit" });
}
const timingF = path.join(PD, "timing.json");
if (!fs.existsSync(timingF) || fs.statSync(timingF).mtimeMs < fs.statSync(wav).mtimeMs || flag("--ulang-timing")) {
  fs.writeFileSync(path.join(PD, "_blok.json"), JSON.stringify(blok.map((b) => ({ teks: b.teks }))));
  execFileSync(PY, [path.join(DIR, "timing.py"), wav, path.join(PD, "_blok.json"), timingF], { stdio: "inherit" });
}
const T = JSON.parse(fs.readFileSync(timingF, "utf8"));
const VOD = T.durasi, TOTAL = +(VOD + OFF + 1.4).toFixed(2);

// ---------- proyek ----------
const PJ = path.join(PD, "proyek"), AS = path.join(PJ, "assets");
fs.rmSync(PJ, { recursive: true, force: true });
fs.mkdirSync(path.join(PJ, "vo"), { recursive: true }); fs.mkdirSync(AS, { recursive: true });
fs.copyFileSync(wav, path.join(PJ, "vo/vo.wav"));
for (const f of ["inter.woff2", "spartan.woff2", "logo-nusawebsite.png", "ui-dentalcare.png", "ui-dentalcare-hp.png"]) fs.copyFileSync(path.join(DIR, "aset", f), path.join(AS, f));
const klipDipakai = new Set();
const klip = (k) => { if (!fs.existsSync(path.join(DIR, "aset", k + ".mp4"))) throw new Error("klip tidak ada: " + k); klipDipakai.add(k); };

const poinTotal = blok.filter((b) => b.anim === "angka-poin").length || 5;
let poinN = 0;
const scenes = [], vids = [], js = [];
const starts = blok.map((b, i) => (i === 0 ? 0 : +(T.blok[i].start + OFF - 0.15).toFixed(2)));
blok.forEach((b, i) => {
  const s = starts[i], t1 = i + 1 < blok.length ? starts[i + 1] : TOTAL;
  const t0 = i === 0 ? OFF : +(T.blok[i].start + OFF).toFixed(2);
  if (b.anim === "angka-poin") poinN++;
  const ctx = { s, t0, t1, dur: +(t1 - s).toFixed(2), idx: i, poin: { n: poinN, total: poinTotal }, klip };
  const p = "s" + i;
  const r = ANIM[b.anim](p, { ...(b.param || {}), ...(b.anim === "angka-poin" && !b.param?.n ? { n: String(poinN).padStart(2, "0") } : {}) }, ctx);
  scenes.push(`<section id="${p}" class="clip full" data-start="${s}" data-duration="${ctx.dur}" data-track-index="${1 + (i % 2)}"><div class="sc" id="${p}sc">${r.html}</div></section>`);
  vids.push(...(r.vids || []));
  js.push(`// ${i} ${b.anim}: ${b.teks.slice(0, 60).replace(/\n/g, " ")}`, ...r.js.filter(Boolean));
  if (i + 1 < blok.length) js.push(`tl.to("#${p}sc${(r.vids || []).length ? `, .${p}vv` : ""}",{opacity:0,y:-30,duration:0.28,ease:"power2.in"},${(t1 - 0.3).toFixed(2)});tl.set("#${p}sc${(r.vids || []).length ? `, .${p}vv` : ""}",{opacity:0},${t1.toFixed(2)});`);
});
for (const k of klipDipakai) fs.copyFileSync(path.join(DIR, "aset", k + ".mp4"), path.join(AS, k + ".mp4"));

// bar progres poin
const iPoin = blok.map((b, i) => (b.anim === "angka-poin" ? i : -1)).filter((i) => i >= 0);
let pbar = "";
if (iPoin.length) {
  const iAkhir = blok.findIndex((b, i) => i > iPoin[iPoin.length - 1] && (b.anim === "rekap" || b.anim === "cta"));
  const ps = starts[iPoin[0]], pe = iAkhir > 0 ? starts[iAkhir] : TOTAL;
  pbar = `<div id="pbarw" class="clip" data-start="${ps}" data-duration="${(pe - ps).toFixed(2)}" data-track-index="8" style="position:absolute;inset:0;"><div id="pbar">${iPoin.map((_, k) => `<div class="sg"><i id="pg${k}"></i></div>`).join("")}<div class="pl">CHECKLIST</div></div></div>`;
  js.push(`tl.fromTo("#pbar",{opacity:0,y:20},{opacity:1,y:0,duration:0.5},${(ps + 0.1).toFixed(2)});`);
  iPoin.forEach((ib, k) => js.push(`tl.to("#pg${k}",{scaleX:1,duration:0.6,ease:"power2.out"},${(starts[ib] + 0.3).toFixed(2)});`));
}

const html = `<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>${esc(KODE)} F4 ${esc(entri.keyword)}</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>${CSS}</style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="1920" data-height="1080">
      <div id="bg" class="clip full" data-start="0" data-duration="${TOTAL}" data-track-index="0">
        <div class="full bg-base"></div><div id="blob1" class="blob b1"></div><div id="blob2" class="blob b2"></div><div class="grid"></div>
        <img class="logo" src="assets/logo-nusawebsite.png" alt="Nusawebsite" />
        <div class="kwc" id="kwc"><i></i>${esc(entri.keyword)}</div>
      </div>
      <audio id="vo" src="vo/vo.wav" data-start="${OFF}" data-duration="${VOD.toFixed(2)}" data-track-index="9" data-volume="1"></audio>
      ${pbar}
      ${scenes.join("\n      ")}
      ${vids.join("\n      ")}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      tl.fromTo("#blob1", { x: 0, y: 0 }, { x: 140, y: 80, duration: ${TOTAL}, ease: "sine.inOut" }, 0);
      tl.fromTo("#blob2", { x: 0, y: 0 }, { x: -160, y: -60, duration: ${TOTAL}, ease: "sine.inOut" }, 0);
      tl.fromTo("#kwc", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5 }, 0.2);
      ${js.join("\n      ")}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;
fs.writeFileSync(path.join(PJ, "index.html"), html);
fs.writeFileSync(path.join(PJ, "hyperframes.json"), JSON.stringify({ $schema: "https://hyperframes.heygen.com/schema/hyperframes.json", paths: { blocks: "compositions", components: "compositions/components", assets: "assets" }, media: { autoProxy: true }, authoringSkill: "general-video" }, null, 2));
log("proyek ditulis,", blok.length, "scene, durasi", TOTAL, "dtk, timing", T.metode, T.cocok);

// ---------- check ----------
let chk = "";
try { chk = (process.argv.includes("--tanpa-render") && !process.env.CI) ? "check dilewati di PC (--tanpa-render); dijalankan di CI" : execSync(`hyperframes check "${PJ}"`, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], windowsHide: true }); }
catch (e) { chk = (e.stdout || "") + (e.stderr || ""); }
fs.writeFileSync(path.join(PD, "check.log"), chk);
const err = (chk.match(/(\d+)\s+error/i) || [])[1];
log("check:", err ? err + " error" : "selesai", "(check.log)");
if (err && +err > 0) { console.error(chk.split("\n").filter((l) => /error/i.test(l)).slice(0, 15).join("\n")); process.exit(3); }

// ---------- meta ----------
const judulKW = entri.keyword.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bIos\b/, "iOS").replace(/\bPt\b/, "PT");
let judul = N.judul || `${judulKW}: ${poinTotal} Hal yang Wajib Dicek Sebelum Memilih`;
if (judul.length > 70) judul = judul.slice(0, 70).replace(/\s+\S*$/, "");
const meta = {
  kode: KODE, keyword: entri.keyword, format: "F4", hook_pola: N.hook_pola || null, judul,
  deskripsi: N.deskripsi || `${(entri.keyword.charAt(0).toUpperCase() + entri.keyword.slice(1)).replace(/ios/i, "iOS").replace(/^Pt/, "PT")} perlu dipilih dengan teliti. Video ini membahas ${poinTotal} hal yang perlu Anda cek sebelum memulai proyek bersama Nusawebsite.\n\nKonsultasi gratis kebutuhan aplikasi dan website bisnis Anda: {{LINK_WA}}`,
  tag: N.tag || [entri.keyword, "nusawebsite", "software house", "jasa pembuatan aplikasi", "aplikasi custom", "jasa pembuatan website", "tips memilih software house", "aplikasi bisnis"],
  durasi: TOTAL, kata, timing: T.metode, dibuat: new Date().toISOString(),
};
fs.writeFileSync(path.join(PD, "meta.json"), JSON.stringify(meta, null, 1));
if (flag("--tanpa-render")) { log("selesai tanpa render"); process.exit(0); }

// ---------- render (antre maks 3 serentak) ----------
// render ke hasil-polos.mp4 lalu watermark WA kanan bawah (sama dgn video DentalCare, owner 17 Okt) → hasil.mp4.
// Area kanan bawah ±460x180 px dikosongkan dari elemen penting (lihat CSS anim.mjs).
const out = path.join(PD, "hasil.mp4"), polos = path.join(PD, "hasil-polos.mp4");
log("render...");
fs.rmSync(polos, { force: true }); fs.rmSync(out, { force: true });
execFileSync("bash", [path.join(ROOT, "_bahan/render-antre.sh"), "hyperframes", "render", PJ, "-o", polos, "--quiet"], { stdio: "inherit" });
execFileSync("node", [path.join(ROOT, "_bahan/watermark.mjs"), PD], { stdio: "inherit" });
if (!fs.existsSync(out)) throw new Error("render tidak menghasilkan hasil.mp4");
const d = +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out], { encoding: "utf8" }).trim();
meta.durasi_file = d; fs.writeFileSync(path.join(PD, "meta.json"), JSON.stringify(meta, null, 1));

// ---------- frame cek ----------
const FD = path.join(PD, "frames"); fs.mkdirSync(FD, { recursive: true });
const titik = [Math.min(2.2, d * 0.04), ...[0.2, 0.38, 0.56, 0.74, 0.93].map((x) => x * d)];
titik.forEach((t, i) => execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", t.toFixed(2), "-i", out, "-frames:v", "1", path.join(FD, `f${i + 1}-${t.toFixed(1)}.png`)]));
const fr = fs.readdirSync(FD).filter((f) => /^f\d/.test(f)).sort().map((f) => path.join(FD, f));
execFileSync("ffmpeg", ["-v", "error", "-y", ...fr.flatMap((f) => ["-i", f]), "-filter_complex", "[0][1][2]hstack=3[a];[3][4][5]hstack=3[b];[a][b]vstack,scale=1920:-1", path.join(FD, "_grid.jpg")]);
log("SELESAI", out, d.toFixed(1), "dtk; cek", path.join(FD, "_grid.jpg"));
