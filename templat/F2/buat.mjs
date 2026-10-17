// Generator video format F2 "Cerita Masalah -> Solusi" (channel JASA Nusawebsite).
// Pakai (dari folder mana pun): node templat/F2/buat.mjs <KODE> [--tanpa-render] [--ulang-tts] [--ulang-waktu]
// Masukan : keywords.json (entri KODE) + produksi/<KODE>/naskah.json  (lihat PANDUAN.md)
// Keluaran: produksi/<KODE>/{vo/vo.wav, waktu.json, proyek/, hasil.mp4, frames/, meta.json}
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ANIM, CSS, esc, judulKw } from "./anim.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, "../..");
const args = process.argv.slice(2);
const KODE = args.find((a) => !a.startsWith("--"));
const opt = (f) => args.includes(f);
if (!KODE) { console.error("pakai: node buat.mjs <KODE>"); process.exit(1); }

const daftar = JSON.parse(fs.readFileSync(path.join(ROOT, "keywords.json"), "utf8"));
const entri = daftar.find((x) => x.kode === KODE);
if (!entri) throw new Error("KODE tidak ada di keywords.json: " + KODE);
const kw = entri.keyword;
const P = path.join(ROOT, "produksi", KODE);
const raw = JSON.parse(fs.readFileSync(path.join(P, "naskah.json"), "utf8"));
const N = Array.isArray(raw) ? { blok: raw } : raw;
const blok = N.blok;

// ---------- gerbang bahasa & struktur ----------
const salah = [];
const semuaTeks = blok.map((b) => b.teks).join(" ");
const layar = JSON.stringify(blok.map((b) => b.param || {}));
const LARANG = [[/tanpa\s+(maksa|paksa)|tidak\s+(maksa|paksa)|(tanpa|tidak)\s+memaksa/i, "frasa maksa/paksa"], [/[—–]/, "em/en dash"], [/\brp\s?\d|\bharga\b|\bbiaya\b|\bmurah\b.*\d|juta|ribu rupiah/i, "harga/biaya"], [/cicilan|kredit|pinjam|riba|bunga\b|gadai|koperasi/i, "topik riba"], [/https?:|www\.|\.com\b|\b08\d{6,}/i, "URL/nomor diucapkan"], [/\d+\s?%/, "statistik persen"]];
for (const [re, n] of LARANG) { if (re.test(semuaTeks)) salah.push("VO: " + n); if (n !== "URL/nomor diucapkan" && n !== "harga/biaya" && re.test(layar)) salah.push("layar: " + n); }
if (/\bharga\b|\bbiaya\b|\brp\s?\d/i.test(layar)) salah.push("layar: harga/biaya");
const k1 = blok[0].teks.split(/(?<=[.!?])\s/)[0];
if (!k1.toLowerCase().includes(kw.toLowerCase())) salah.push(`keyword "${kw}" tidak utuh di kalimat pertama`);
if (k1.trim().endsWith("?")) salah.push("kalimat pertama berupa pertanyaan (hook harus pernyataan)");
for (const [i, b] of blok.entries()) if (!ANIM[b.anim]) salah.push(`blok ${i + 1}: anim "${b.anim}" tidak dikenal (${Object.keys(ANIM).join(", ")})`);
if (blok.at(-1).anim !== "cta") salah.push("blok terakhir harus anim cta");
const nk = semuaTeks.split(/\s+/).length;
if (nk < 110 || nk > 195) salah.push(`jumlah kata ${nk} (target 130-170)`);
if (salah.length) { console.error("GERBANG GAGAL:\n- " + salah.join("\n- ")); process.exit(1); }
console.log(`${KODE} | ${kw} | ${blok.length} blok | ${nk} kata`);

const sh = (cmd, a, o = {}) => execFileSync(cmd, a, { stdio: "inherit", ...o });
const dur = (f) => +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }).trim();

// ---------- (a) TTS satu job ----------
fs.mkdirSync(path.join(P, "vo"), { recursive: true });
const naskahTxt = blok.map((b) => b.teks.trim()).join("\n\n");
const wav = path.join(P, "vo", "vo.wav");
const lamaTxt = fs.existsSync(path.join(P, "naskah.txt")) ? fs.readFileSync(path.join(P, "naskah.txt"), "utf8") : "";
if (fs.existsSync(wav) && lamaTxt !== naskahTxt && !opt("--ulang-tts")) console.warn("PERINGATAN: naskah berubah sejak VO dibuat; pakai --ulang-tts bila teks VO ikut berubah");
fs.writeFileSync(path.join(P, "naskah.txt"), naskahTxt);
if (!fs.existsSync(wav) || opt("--ulang-tts")) sh("node", [path.join(ROOT, "_bahan", "tts.mjs"), path.join(P, "naskah.txt"), wav]);
else console.log("VO ada, dilewati");

// ---------- (b) timing per blok ----------
const wj = path.join(P, "waktu.json");
const tj = path.join(P, "naskah-teks.json");
fs.writeFileSync(tj, JSON.stringify(blok.map((b) => b.teks)));
let W = fs.existsSync(wj) ? JSON.parse(fs.readFileSync(wj, "utf8")) : null;
if (!W || W.blok.length !== blok.length || opt("--ulang-waktu") || opt("--ulang-tts")) {
  if (process.env.JASA_PY) sh(process.env.JASA_PY, [path.join(DIR, "waktu.py"), wav, tj, wj]); else sh("py", ["-3.10", path.join(DIR, "waktu.py"), wav, tj, wj]);
  W = JSON.parse(fs.readFileSync(wj, "utf8"));
}

// ---------- (c) bangun proyek HyperFrames ----------
const OFF = 0.4, EKOR = 2.2;
const total = +(OFF + W.durasi + EKOR).toFixed(2);
const pr = path.join(P, "proyek");
fs.mkdirSync(path.join(pr, "assets"), { recursive: true });
fs.mkdirSync(path.join(pr, "vo"), { recursive: true });
for (const f of fs.readdirSync(path.join(DIR, "aset"))) fs.copyFileSync(path.join(DIR, "aset", f), path.join(pr, "assets", f));
fs.copyFileSync(wav, path.join(pr, "vo", "vo.wav"));

let secs = "", luar = "", js = "";
const waktuBlok = blok.map((b, i) => {
  const t = i === 0 ? 0 : +(OFF + W.blok[i].mulai).toFixed(2);
  const akhir = i === blok.length - 1 ? total : +(OFF + W.blok[i + 1].mulai).toFixed(2);
  return { t, d: +(akhir - t).toFixed(2) };
});
blok.forEach((b, i) => {
  const { t, d } = waktuBlok[i];
  const id = "b" + (i + 1);
  const r = ANIM[b.anim](b.param || {}, { id, t, d, kw });
  secs += `\n      <!-- ${id} ${b.anim}: ${esc(b.teks.slice(0, 70))} -->\n      <section id="${id}" class="clip full" data-start="${t}" data-duration="${d}" data-track-index="${2 + (i % 2) * 0}">\n        <div class="isi" id="${id}-isi" style="position:absolute;inset:0;">${r.html}</div>\n      </section>`;
  if (r.luar) luar += "\n      " + r.luar;
  js += `\n      // ${id} ${b.anim}\n${r.js}`;
  // napas kamera pelan + keluar halus
  js += `tl.fromTo("#${id}-isi",{scale:1},{scale:1.025,duration:${d},ease:"none"},${t});\n`;
  if (i < blok.length - 1) js += `tl.to("#${id}-isi",{opacity:0,duration:0.28,ease:"power2.in"},${(t + d - 0.3).toFixed(2)});tl.set("#${id}-isi",{opacity:0},${(t + d).toFixed(2)});\n`;
});

const html = `<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>${esc(KODE)} F2 ${esc(kw)}</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>${CSS}</style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="1920" data-height="1080">
      <div id="bg" class="clip full" data-start="0" data-duration="${total}" data-track-index="0">
        <div class="full bg-base"></div>
        <div id="blob1" class="blob b1"></div>
        <div id="blob2" class="blob b2"></div>
        <div class="grid"></div>
        <img class="logo" src="assets/logo-nusawebsite.png" alt="Nusawebsite" />
        <div class="kwtag">${esc(kw.toUpperCase())}</div>
      </div>
      <audio id="vo" src="vo/vo.wav" data-start="${OFF}" data-duration="${W.durasi.toFixed(2)}" data-track-index="9" data-volume="1"></audio>${secs}${luar}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      tl.fromTo("#blob1", { x: 0, y: 0 }, { x: 140, y: 80, duration: ${total}, ease: "sine.inOut" }, 0);
      tl.fromTo("#blob2", { x: 0, y: 0 }, { x: -160, y: -60, duration: ${total}, ease: "sine.inOut" }, 0);
${js}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;
fs.writeFileSync(path.join(pr, "index.html"), html);
fs.writeFileSync(path.join(pr, "hyperframes.json"), JSON.stringify({ $schema: "https://hyperframes.heygen.com/schema/hyperframes.json", registry: "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry", paths: { blocks: "compositions", components: "compositions/components", assets: "assets" }, media: { autoProxy: true }, authoringSkill: "general-video" }, null, 2));
fs.writeFileSync(path.join(pr, "meta.json"), JSON.stringify({ id: "main", name: KODE.toLowerCase() + "-f2" }));
console.log("proyek dibangun:", total, "dtk, metode waktu", W.metode);

// ---------- (d) check ----------
const ck = spawnSync("hyperframes", ["check", pr], { encoding: "utf8", shell: true });
const ckOut = (ck.stdout || "") + (ck.stderr || "");
fs.writeFileSync(path.join(P, "check.log"), ckOut);
const err = ckOut.match(/(\d+)\s+error/i);
console.log("check:", err ? err[0] : "lihat check.log", ck.status === 0 ? "(status 0)" : `(status ${ck.status})`);
if (ck.status !== 0 && err && +err[1] > 0) { console.error(ckOut.slice(-3000)); process.exit(1); }
if (opt("--tanpa-render")) process.exit(0);

// ---------- (e) render (antre maks 3 serentak) ----------
const out = path.join(P, "hasil.mp4");
const t0 = Date.now();
// render ke hasil-polos.mp4, lalu watermark WA kanan bawah (sama dgn video DentalCare, owner 17 Okt) → hasil.mp4
sh("bash", [path.join(ROOT, "_bahan", "render-antre.sh"), "hyperframes", "render", pr, "-o", path.join(P, "hasil-polos.mp4"), "--quiet"]);
sh("node", [path.join(ROOT, "_bahan", "watermark.mjs"), P]);
const detikRender = Math.round((Date.now() - t0) / 1000);
const D = dur(out);
console.log("render selesai", D.toFixed(1), "dtk video,", detikRender, "dtk kerja");

// ---------- (f) frame cek ----------
const fr = path.join(P, "frames");
fs.mkdirSync(fr, { recursive: true });
const pilih = [0, 1, 2, 3, 4, 5].map((k) => Math.round((k * (blok.length - 1)) / 5));
const fl = [];
pilih.forEach((bi, k) => {
  const { t, d } = waktuBlok[bi];
  const ts = Math.min(D - 0.2, t + d * 0.8);
  const f = path.join(fr, `f${k + 1}-b${bi + 1}.png`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", ts.toFixed(2), "-i", out, "-frames:v", "1", f]);
  fl.push(f);
});
execFileSync("ffmpeg", ["-v", "error", "-y", ...fl.flatMap((f) => ["-i", f]), "-filter_complex", fl.map((_, i) => `[${i}:v]scale=640:360[s${i}]`).join(";") + ";" + "[s0][s1][s2]hstack=3[a];[s3][s4][s5]hstack=3[b];[a][b]vstack", path.join(fr, "_grid.jpg")]);

// ---------- (g) meta YouTube ----------
const K = judulKw(kw);
const ekor = ["Kisah Bisnis yang Akhirnya Rapi", "Dari Data Berantakan ke Sistem Rapi", "Cerita Usaha yang Berubah Total", "Saat Excel Tidak Cukup Lagi"];
let judul = N.judul || `${K}: ${ekor[parseInt(KODE.replace(/\D/g, "")) % ekor.length]}`;
if (judul.length > 70) judul = `${K}: ${ekor[3]}`.slice(0, 70);
const ringkas = N.ringkasan || blok.slice(1, 4).map((b) => b.teks.trim()).join(" ");
const desk = N.deskripsi || `${K} untuk bisnis yang masih repot dengan Excel, chat, dan catatan manual. ${ringkas}\n\nNusawebsite membuat aplikasi custom yang mengikuti alur kerja bisnis Anda: konsultasi, rancang alur, mockup disetujui, pengembangan, lalu pendampingan.\n\nKonsultasi gratis: {{LINK_WA}}\n\n#${kw.replace(/\s+/g, "")} #aplikasicustom #nusawebsite`;
const tag = N.tag || [...new Set([kw, `${kw} terpercaya`, `${kw} custom`, "aplikasi custom", "jasa pembuatan aplikasi", "software house", "aplikasi bisnis", "sistem informasi bisnis", "digitalisasi usaha", "nusawebsite"])].slice(0, 12);
const meta = { kode: KODE, keyword: kw, format: "F2", judul, deskripsi: desk, tag, durasi: +D.toFixed(2), blok: blok.length, metode_waktu: W.metode, render_dtk: detikRender, dibuat: new Date().toISOString() };
fs.writeFileSync(path.join(P, "meta.json"), JSON.stringify(meta, null, 1));
console.log("SELESAI", out, "\nLIHAT frame:", path.join(fr, "_grid.jpg"));
