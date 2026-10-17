// Generator format F3 "Alur Proses" (channel jasa Nusawebsite).
// Pakai: node buat.mjs <KODE> [--tanpa-render] [--ulang-vo] [--ulang-waktu]
// Masukan: ../../keywords.json (entri KODE) + ../../produksi/<KODE>/naskah.json (array {teks, anim, param}).
// Keluaran: produksi/<KODE>/{vo/vo.wav, waktu.json, proyek/, hasil.mp4, frames/, meta.json}. Panduan: PANDUAN.md.
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR, "../..");
const args = process.argv.slice(2);
const KODE = args.find((a) => !a.startsWith("--"));
const opt = (f) => args.includes(f);
if (!KODE) { console.error("pakai: node buat.mjs <KODE>"); process.exit(1); }
const kws = JSON.parse(fs.readFileSync(path.join(ROOT, "keywords.json"), "utf8"));
const entri = kws.find((k) => k.kode === KODE) || (KODE.startsWith("UJI") ? { kode: KODE, keyword: "jasa pembuatan website", format: "F3" } : null);
if (!entri) throw new Error("KODE tidak ada di keywords.json: " + KODE);
const P = path.join(ROOT, "produksi", KODE);
const naskah = JSON.parse(fs.readFileSync(path.join(P, "naskah.json"), "utf8"));
const KW = entri.keyword;

// ---------- 1. GERBANG naskah ----------
const semua = naskah.map((b) => b.teks).join(" ");
const salah = [];
const kalimat1 = naskah[0].teks.split(/(?<=[.!?])\s/)[0];
if (!kalimat1.toLowerCase().includes(KW.toLowerCase())) salah.push(`keyword "${KW}" tidak utuh di kalimat pertama`);
if (kalimat1.includes("?")) salah.push("kalimat pertama berupa pertanyaan (hook wajib pernyataan)");
const LARANG = [[/\b(tanpa|tidak|nggak|gak)\s+(maksa|paksa|memaksa|dipaksa)/i, "tanpa/tidak maksa"], [/[—–]/, "em/en dash"], [/\brp\.?\s?\d|\d+\s?(juta|ribu|rb|jt)\b/i, "angka biaya"], [/\b(harga|biaya|tarif|murah meriah|diskon|cicilan|kredit|pinjam|riba|bunga|gadai|koperasi)\b/i, "harga/riba"], [/\b\d+\s?(hari|minggu|bulan)\b/i, "janji durasi angka"], [/(https?:|www\.|\.com|\.id\b|08\d{6,})/i, "URL/nomor diucapkan"], [/\b\d+\s?%/, "statistik persen"]];
for (const [re, n] of LARANG) if (re.test(semua)) salah.push("larangan: " + n + " → " + semua.match(re)[0]);
const kata = semua.split(/\s+/).length;
if (kata < 100 || kata > 160) salah.push(`jumlah kata ${kata} (target 120-145 = 55-70 dtk suara Fola)`);
for (const [i, b] of naskah.entries()) if (!ANIM_ADA(b.anim)) salah.push(`blok ${i}: anim "${b.anim}" tidak dikenal`);
if (salah.length) { console.error("GERBANG NASKAH GAGAL:\n- " + salah.join("\n- ")); process.exit(1); }
function ANIM_ADA(a) { return ["judul-keyword", "peringatan", "stepper-overview", "tahap", "footage", "contoh-hasil", "cta"].includes(a); }

// ---------- 2. VO (satu job TTS, suara Fola) ----------
const vo = path.join(P, "vo", "vo.wav");
fs.mkdirSync(path.dirname(vo), { recursive: true });
if (!fs.existsSync(vo) || opt("--ulang-vo")) {
  fs.writeFileSync(path.join(P, "vo", "naskah.txt"), naskah.map((b) => b.teks).join("\n\n"));
  execFileSync("node", [path.join(ROOT, "_bahan", "tts.mjs"), path.join(P, "vo", "naskah.txt"), vo], { stdio: "inherit" });
}
// ---------- 3. Timing ----------
const wf = path.join(P, "waktu.json");
if (!fs.existsSync(wf) || opt("--ulang-waktu") || opt("--ulang-vo") || fs.statSync(wf).mtimeMs < fs.statSync(path.join(P, "naskah.json")).mtimeMs) {
  if (process.env.JASA_PY) execFileSync(process.env.JASA_PY, [path.join(DIR, "waktu.py"), vo, path.join(P, "naskah.json"), wf], { stdio: "inherit" }); else execFileSync("py", ["-3.10", path.join(DIR, "waktu.py"), vo, path.join(P, "naskah.json"), wf], { stdio: "inherit" });
}
const W = JSON.parse(fs.readFileSync(wf, "utf8"));
const AUD = 0.3; // audio mulai
const TOTAL = +(W.durasi + AUD + 1.2).toFixed(2);
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const sStart = naskah.map((_, i) => (i === 0 ? 0 : +(W.blok[i].s + AUD - 0.2).toFixed(2)));
const sEnd = naskah.map((_, i) => (i < naskah.length - 1 ? sStart[i + 1] : TOTAL));
// waktu isyarat: item ke-j muncul saat kata kata[j] diucapkan (dalam blok), cadangan dibagi rata
function isyarat(bi, n, kata = [], awal = 1.0, akhir = 1.2) {
  const s = sStart[bi], e = sEnd[bi], ws = W.kata.filter((k) => k.b === bi);
  const out = []; let dari = 0;
  for (let j = 0; j < n; j++) {
    let t = null;
    if (kata[j]) {
      const target = norm(kata[j]);
      const k = ws.findIndex((w, idx) => idx >= dari && w.w.startsWith(target));
      if (k >= 0) { t = ws[k].s + AUD - 0.1; dari = k + 1; }
    }
    if (t === null) t = s + awal + ((e - akhir - (s + awal)) * j) / Math.max(1, n - 1 || 1);
    t = Math.max(t, s + 0.5, out.length ? out[out.length - 1] + 0.25 : 0);
    out.push(+Math.min(t, e - 0.6).toFixed(2));
  }
  return out;
}

// ---------- 4. Susun HTML ----------
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const br = (s) => esc(s).replace(/\\n|\n/g, "<br />");
const tl = []; // baris timeline
const A = (sel, from, to, t) => tl.push(`tl.fromTo(${JSON.stringify(sel)}, ${JSON.stringify(from)}, ${JSON.stringify(to)}, ${(+t).toFixed(2)});`);
const E = "power3.out", BK = "back.out(2)";
const vids = []; let vTrack = 3;
function video(id, klip, t, dur, box) {
  dur = Math.min(dur, 7.8);
  vids.push(`<video id="${id}" class="vid" src="assets/${klip}.mp4" muted playsinline data-start="${t.toFixed(2)}" data-duration="${dur.toFixed(2)}" data-track-index="${vTrack}" style="left:${box.l}px;top:${box.t}px;width:${box.w}px;height:${box.h}px;"></video>`);
  vTrack = vTrack === 3 ? 4 : 3;
  A("#" + id, { opacity: 0 }, { opacity: 1, duration: 0.35 }, t);
}
// rangkaian klip dalam satu kotak sepanjang [t, t+dur]
function klipBeruntun(pref, klips, t, dur, box) {
  const n = Math.max(1, Math.ceil(dur / 7.5)), list = [];
  for (let k = 0; k < n; k++) list.push(klips[k % klips.length]);
  const per = dur / n;
  list.forEach((k, i) => video(`${pref}v${i}`, k, t + i * per, per + (i < n - 1 ? 0.05 : 0), box));
}
const CEK = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
const SILANG = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
const IKON = [
  `<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>`,
  `<path d="M4 6h16M4 12h10M4 18h7"/>`,
  `<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14c2.4.2 4 1.8 4.5 4.5"/>`,
  `<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>`,
  `<path d="M12 2l3 6.5 7 .8-5.2 4.7 1.5 7L12 17.3 5.7 21l1.5-7L2 9.3l7-.8z"/>`,
];
const ikon = (i, c = "#E8590C") => `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${IKON[i % IKON.length]}</svg>`;

const tahapIdx = naskah.map((b, i) => (b.anim === "tahap" ? i : -1)).filter((i) => i >= 0);
const stepperLabel = (naskah.find((b) => b.anim === "stepper-overview")?.param?.tahap) || tahapIdx.map((i) => (naskah[i].param.judul || "").replace(/\\n|\n/g, " "));
const sec = [];

naskah.forEach((b, i) => {
  const p = b.param || {}, s = sStart[i], e = sEnd[i], id = "s" + i, D = e - s;
  let h = "";
  if (b.anim === "judul-keyword") {
    const kw = p.judul || KW;
    const sor = p.sorot && kw.toLowerCase().includes(p.sorot.toLowerCase()) ? p.sorot : kw.split(" ").slice(-2).join(" ");
    const iSor = kw.toLowerCase().lastIndexOf(sor.toLowerCase());
    const l1 = kw.slice(0, iSor).trim(), l2 = kw.slice(iSor).trim();
    const fs1 = Math.min(120, Math.floor(1640 / (Math.max(l1.length, l2.length) * 0.56)));
    const cap = (x) => x.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bIos\b/g, "iOS").replace(/\bPt\b/g, "PT").replace(/\bPos\b/g, "POS").replace(/\bDi\b/g, "di");
    h = `<div class="center"><div class="kick" id="${id}k">${esc(p.kicker || "SEBELUM MEMILIH")}</div>
      ${l1 ? `<div class="t1 H" style="font-size:${fs1}px"><span class="mk"><span id="${id}w1">${esc(cap(l1))}</span></span></div>` : ""}
      <div class="t1 H or" style="font-size:${fs1}px"><span class="mk"><span id="${id}w2">${esc(cap(l2))}</span></span></div>
      <div class="q" id="${id}q">${br(p.sub || "")}</div></div>`;
    A(`#${id}k`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, s + 0.2);
    if (l1) A(`#${id}w1`, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "power4.out" }, s + 0.35);
    A(`#${id}w2`, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "power4.out" }, s + 0.6);
    const [tq] = isyarat(i, 1, [p.kata_sub], 2.2);
    if (p.sub) A(`#${id}q`, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: E }, tq);
    tl.push(`tl.to("#${id} .center", {scale: 1.04, duration: ${(D).toFixed(2)}, ease: "none"}, ${s.toFixed(2)});`);
  } else if (b.anim === "peringatan") {
    const it = p.item || [];
    h = `<div class="warn-l"><div class="warn-ic" id="${id}ic"><svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3L2 20h20z"/><path d="M12 10v4M12 17h.01"/></svg></div>
      <div class="st H" id="${id}t" style="margin-top:40px;">${br(p.judul || "Hati-hati")}</div><span class="ul" id="${id}u"></span><div class="sd" id="${id}d">${br(p.desk || "")}</div></div>
      <div class="right">${it.map((x, j) => `<div class="card wr" id="${id}r${j}" style="top:${60 + j * 170}px;"><div class="wx">${SILANG}</div><span>${esc(x)}</span></div>`).join("")}</div>`;
    A(`#${id}ic`, { opacity: 0, scale: 0.4, rotation: -20 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2.4)" }, s + 0.1);
    tl.push(`tl.to("#${id}ic", {rotation: 6, duration: 0.08, yoyo: true, repeat: 5, ease: "sine.inOut"}, ${(s + 0.8).toFixed(2)});`);
    A(`#${id}t`, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: E }, s + 0.3);
    A(`#${id}u`, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.out" }, s + 0.6);
    A(`#${id}d`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, s + 0.8);
    isyarat(i, it.length, p.kata, 1.0).forEach((t, j) => A(`#${id}r${j}`, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 0.5, ease: E }, t));
  } else if (b.anim === "stepper-overview") {
    const lb = p.tahap || stepperLabel; const n = lb.length;
    h = `<div class="center" style="justify-content:flex-start;padding-top:${p.judul ? 300 : 360}px;"><div class="kick" id="${id}k">${esc(p.kicker || "ALUR KERJA")}</div>${p.judul ? `<div class="H" id="${id}j" style="font-size:84px;margin-top:20px;">${br(p.judul)}</div>` : ""}</div>
      <div class="bigstep">${lb.map((x, j) => `<div class="bs" id="${id}b${j}" style="width:${n > 5 ? 250 : 270}px"><div class="c">${j + 1}</div><div class="l">${esc(x)}</div></div>`).join(`<i class="bsl" ></i>`)}</div>`;
    A(`#${id}k`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, s + 0.1);
    if (p.judul) A(`#${id}j`, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: E }, s + 0.25);
    isyarat(i, n, p.kata || lb.map((x) => x.split(/[ &]/)[0]), 0.6, 1.0).forEach((t, j) => A(`#${id}b${j}`, { opacity: 0, y: 60, scale: 0.7 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.7)" }, t));
  } else if (b.anim === "tahap") {
    const no = tahapIdx.indexOf(i) + 1;
    const pj = Math.max(...String(p.judul).split(/\\n|\n/).map((x) => x.length));
    h = `<div class="left"><div class="num" id="${id}n">${String(no).padStart(2, "0")}</div><div class="st H" id="${id}t" style="font-size:${pj > 15 ? 70 : 86}px">${br(p.judul)}</div><span class="ul" id="${id}u"></span><div class="sd" id="${id}ds">${br(p.desk || "")}</div></div>
      <div class="right">${visual(p, i, id, s, e)}</div>`;
    A(`#${id}n`, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.6, ease: E }, s + 0.1);
    A(`#${id}t`, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: E }, s + 0.3);
    A(`#${id}u`, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.out" }, s + 0.6);
    A(`#${id}ds`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, s + 0.8);
  } else if (b.anim === "footage") {
    const box = { l: 160, t: 196, w: 1600, h: 655 };
    h = `<div class="br" id="${id}br" style="left:${box.l}px;top:${box.t - 40}px;width:${box.w}px;height:${box.h + 40}px;"><div class="bar"><i></i><i></i><i></i></div></div>
      <div class="capbar" id="${id}c"><b>${esc(p.label || "Contoh aplikasi buatan kami")}</b><span>${br(p.caption || "")}</span></div>`;
    A(`#${id}br`, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.5, ease: E }, s);
    klipBeruntun(id, p.klip || ["dash"], s + 0.2, D - 0.3, box);
    A(`#${id}c`, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, s + 0.6);
  } else if (b.anim === "contoh-hasil") {
    const box = { l: 140, t: 360, w: 1290, h: 538 };
    h = `<div class="ex-t" id="${id}k">${esc(p.kicker || "CONTOH HASIL")}</div><div class="ex-h H" id="${id}h">${br(p.judul || "Aplikasi klinik gigi buatan Nusawebsite")}</div>
      <div class="br" id="${id}br" style="left:140px;top:320px;width:1290px;height:578px;"><div class="bar"><i></i><i></i><i></i></div></div>
      <div class="phone" id="${id}p" style="left:1500px;top:280px;width:270px;height:560px;"><div class="scr"><img class="pimg" src="assets/ui-dentalcare-hp.png" alt="" /></div></div>`;
    A(`#${id}k`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, s + 0.1);
    A(`#${id}h`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: E }, s + 0.2);
    A(`#${id}br`, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.5, ease: E }, s);
    A(`#${id}p`, { opacity: 0, y: 90 }, { opacity: 1, y: 0, duration: 0.6, ease: E }, s + 0.8);
    const kl = p.klip || ["odon", "invoice"]; const per = (D - 0.3) / kl.length;
    kl.forEach((k, j) => video(`${id}v${j}`, k, s + 0.2 + j * per, per + 0.05, box));
  } else if (b.anim === "cta") {
    const mini = p.mini || stepperLabel;
    const [j1, j2] = String(p.judul || "Konsultasi|Gratis").split("|");
    h = `<div class="center"><div class="kick" id="${id}k">${esc(p.kicker || "LANGKAH PERTAMA")}</div>
      <div class="cta-t H" id="${id}t" style="margin-top:20px;">${esc(j1)} <span class="or">${esc(j2 || "")}</span></div>
      <div class="cta-s" id="${id}s">${br(p.sub || "Ceritakan kebutuhan bisnis Anda")}</div><div class="pill" id="${id}p">Link ada di deskripsi</div>
      <div class="mini" id="${id}m">${mini.map((x) => `<div><b>${CEK.replace(/24/g, "18")}</b>${esc(x)}</div>`).join("")}</div></div>`;
    A(`#${id}k`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, s + 0.1);
    A(`#${id}t`, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.7, ease: E }, s + 0.3);
    A(`#${id}s`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: E }, s + 0.9);
    const [tp] = isyarat(i, 1, [p.kata_link || "link"], 1.6);
    A(`#${id}p`, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.55, ease: BK }, tp);
    A(`#${id}m`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: E }, tp + 0.6);
    tl.push(`tl.to("#${id}p", {scale: 1.06, duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut"}, ${(tp + 0.8).toFixed(2)});`);
  }
  // keluar halus (kecuali scene terakhir)
  if (i < naskah.length - 1) tl.push(`tl.to("#${id} > *", {opacity: 0, duration: 0.25, ease: "power2.in"}, ${(e - 0.28).toFixed(2)});`, `tl.set("#${id} > *", {opacity: 0}, ${e.toFixed(2)});`);
  sec.push(`<section id="${id}" class="clip full" data-start="${s.toFixed(2)}" data-duration="${D.toFixed(2)}" data-track-index="2">${h}</section>`);
});

// visual kanan untuk tahap
function visual(p, i, id, s, e) {
  const it = p.item || [];
  const T = isyarat(i, Math.max(it.length, 1), p.kata, 1.4);
  const kartu = (sel, t) => A(sel, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.7, ease: E }, t);
  switch (p.visual) {
    case "catatan": {
      kartu(`#${id}c`, s + 0.4);
      if (p.bubble) A(`#${id}bb`, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: BK }, s + 0.9);
      it.forEach((x, j) => A(`#${id}r${j}`, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.5, ease: E }, T[j]));
      return `<div class="card note" id="${id}c"><h4>${esc(p.label || "CATATAN KONSULTASI")}</h4>${it.map((x, j) => `<div class="row" id="${id}r${j}"><div class="ck">${ikon(j)}</div><span>${esc(x)}</span></div>`).join("")}</div>${p.bubble ? `<div class="bub" id="${id}bb" style="left:440px;top:40px;">${esc(p.bubble)}</div>` : ""}`;
    }
    case "alur": {
      const al = p.alur || ["Input", "Proses", "Laporan"], on = p.on || it, off = p.off || [];
      al.forEach((_, j) => { A(`#${id}f${j}`, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, s + 0.6 + j * 0.6); if (j) A(`#${id}a${j}`, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, ease: E }, s + 0.3 + j * 0.6); });
      const tc = isyarat(i, on.length, p.kata, 2.4);
      on.forEach((_, j) => A(`#${id}c${j}`, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.4, ease: BK }, tc[j]));
      const tOff = tc[tc.length - 1] + 0.4;
      off.forEach((_, j) => A(`#${id}o${j}`, { opacity: 0, scale: 0.7 }, { opacity: 0.45, scale: 1, duration: 0.4, ease: BK }, tOff + j * 0.25));
      if (p.catatan) A(`#${id}m`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, tOff + 0.6);
      const ARR = `<path d="M2 9h56M50 2l10 7-10 7" fill="none" stroke="#FF8040" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
      return al.map((x, j) => `${j ? `<svg class="ar" id="${id}a${j}" style="left:${j * 310 - 48}px;" viewBox="0 0 70 18">${ARR}</svg>` : ""}<div class="fl" id="${id}f${j}" style="left:${30 + j * 310}px;">${esc(x)}</div>`).join("") +
        `<div class="chips">${on.map((x, j) => `<div class="chip on" id="${id}c${j}">${esc(x)}</div>`).join("")}${off.map((x, j) => `<div class="chip off" id="${id}o${j}">${esc(x)}</div>`).join("")}</div>${p.catatan ? `<div class="mvp" id="${id}m"><i></i>${esc(p.catatan)}</div>` : ""}`;
    }
    case "wireframe": {
      const web = p.mode === "web";
      kartu(`#${id}d`, s + 0.4);
      const ks = web ? [[24, 64, 512, 60, 1], [24, 140, 512, 150, 0], [24, 310, 160, 60, 0], [200, 310, 160, 60, 0], [376, 310, 160, 60, 0]] : [[24, 64, 120, 290, 0], [170, 64, 360, 44, 1], [170, 126, 170, 100, 0], [358, 126, 172, 100, 0], [170, 244, 360, 110, 0]];
      ks.forEach((_, j) => A(`#${id}k${j}`, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power2.out" }, s + 0.8 + j * 0.25));
      let hp = "";
      if (!web) {
        A(`#${id}p`, { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 0.6, ease: E }, s + 0.7);
        const ps = [[20, 40, 150, 30, 1], [20, 100, 222, 150, 0], [20, 272, 222, 26, 0], [20, 314, 170, 26, 0], [20, 440, 222, 58, 1]];
        ps.forEach((_, j) => A(`#${id}q${j}`, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power2.out" }, s + 1.2 + j * 0.25));
        hp = `<div class="phone" id="${id}p" style="left:520px;top:40px;width:290px;height:580px;"><div class="scr">${ps.map(([l, t, w, h, o], j) => `<span class="sk${o ? " o" : ""}" id="${id}q${j}" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px;"></span>`).join("")}</div></div>`;
      }
      const [ts] = isyarat(i, 1, [p.kata_stempel || "setuju"], 2.6);
      A(`#${id}s`, { opacity: 0, scale: 1.8, rotation: -14 }, { opacity: 1, scale: 1, rotation: -8, duration: 0.45, ease: "power4.out" }, ts);
      return `<div class="card desk" id="${id}d" style="${web ? "left:110px;width:600px;height:420px;top:100px;" : ""}"><div class="bar"><i></i><i></i><i></i></div>${ks.map(([l, t, w, h, o], j) => `<span class="sk${o ? " o" : ""}" id="${id}k${j}" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px;"></span>`).join("")}</div>${hp}<div class="stamp" id="${id}s">${esc(p.stempel || "DISETUJUI ✓")}</div>`;
    }
    case "kode": {
      kartu(`#${id}c`, s + 0.4);
      const L = [["62%", "#FF8040", 0], ["84%", "#334155", 40], ["70%", "#38BDF8", 40], ["52%", "#334155", 80], ["76%", "#A78BFA", 80], ["44%", "#334155", 40], ["66%", "#FF8040", 0], ["80%", "#334155", 40], ["58%", "#38BDF8", 40]];
      L.forEach((_, j) => A(`#${id}l${j}`, { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: "power2.out" }, s + 0.8 + j * 0.25));
      A(`#${id}t`, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.6, ease: E }, s + 1.8);
      const tt = isyarat(i, it.length, p.kata, 2.3);
      it.forEach((_, j) => A(`#${id}r${j}`, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.4, ease: E }, tt[j]));
      return `<div class="card code" id="${id}c"><div class="dots"><i style="background:#F87171"></i><i style="background:#FBBF24"></i><i style="background:#4ADE80"></i></div>${L.map(([w, c, m], j) => `<span class="ln" id="${id}l${j}" style="width:${w};background:${c};margin-left:${m}px;"></span>`).join("")}</div>
        <div class="card test" id="${id}t"><h4>${esc(p.label || "HASIL UJI")}</h4>${it.map((x, j) => `<div class="tr" id="${id}r${j}"><div class="tk">${CEK}</div>${esc(x)}</div>`).join("")}</div>`;
    }
    case "rilis":
    case "ui": {
      // footage asli di bingkai browser (+ HP opsional) + label/badge mengikuti ucapan
      const hp = p.hp !== false && p.visual === "rilis";
      const box = hp ? { l: 960, t: 270, w: 820, h: 342 } : { l: 960, t: 250, w: 860, h: 360 };
      A(`#${id}br`, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, s + 0.1);
      klipBeruntun(id, p.klip || ["dash"], s + 0.3, e - s - 0.6, box);
      if (hp) A(`#${id}p`, { opacity: 0, y: 90 }, { opacity: 1, y: 0, duration: 0.6, ease: E }, s + 0.9);
      it.forEach((_, j) => A(`#${id}b${j}`, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.45, ease: BK }, T[j]));
      // koordinat absolut: kolom kanan dimulai di x=980,y=170 → badge relatif .right
      return `<div class="br" id="${id}br" style="left:${box.l - 980}px;top:${box.t - 40 - 170}px;width:${box.w}px;height:${box.h + 40}px;"><div class="bar"><i></i><i></i><i></i></div></div>
        ${hp ? `<div class="phone" id="${id}p" style="left:590px;top:180px;width:240px;height:500px;"><div class="scr"><img class="pimg" src="assets/ui-dentalcare-hp.png" alt="" /></div></div>` : ""}
        ${hp ? it.map((x, j) => `<div class="badge" id="${id}b${j}" style="left:20px;top:${520 + j * 100}px;${j % 2 ? "background:#D9480F;" : ""}"><i></i>${esc(x)}</div>`).join("")
          : `<div class="badges">${it.map((x, j) => `<div class="badge" id="${id}b${j}" style="${j % 2 ? "background:#D9480F;" : ""}"><i></i>${esc(x)}</div>`).join("")}</div>`}`;
    }
    case "chat": {
      kartu(`#${id}c`, s + 0.3);
      it.forEach((_, j) => A(`#${id}m${j}`, { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: BK }, T[j]));
      return `<div class="card chat" id="${id}c"><div class="ch-h"><span class="av"></span><span class="av" style="background:#0F172A"></span><b>${esc(p.label || "Grup proyek")}</b><em>online</em></div>${it.map((x, j) => `<div class="msg ${j % 2 ? "me" : ""}" id="${id}m${j}">${esc(x)}</div>`).join("")}</div>`;
    }
    case "uptime": {
      kartu(`#${id}c`, s + 0.3);
      tl.push(`tl.fromTo("#${id}g", {strokeDashoffset: 1400}, {strokeDashoffset: 0, duration: ${Math.min(3, e - s - 1.5).toFixed(2)}, ease: "power1.inOut"}, ${(s + 0.8).toFixed(2)});`);
      A(`#${id}on`, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.45, ease: BK }, s + 1.2);
      tl.push(`tl.to("#${id}dot", {scale: 1.6, opacity: 0.4, duration: 0.6, yoyo: true, repeat: ${Math.max(1, Math.floor((e - s) / 1.2))}, ease: "sine.inOut"}, ${(s + 1.4).toFixed(2)});`);
      it.forEach((_, j) => A(`#${id}r${j}`, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.45, ease: E }, T[j]));
      return `<div class="card upt" id="${id}c"><h4>${esc(p.label || "PEMANTAUAN WEBSITE")}</h4><div class="upt-on" id="${id}on"><i id="${id}dot"></i>Online</div>
        <svg class="gr" viewBox="0 0 640 200"><path id="${id}g" d="M0 150 L60 140 L120 146 L180 120 L240 128 L300 96 L360 104 L420 72 L480 80 L540 50 L640 40" fill="none" stroke="#E8590C" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1400"/></svg>
        ${it.map((x, j) => `<div class="tr" id="${id}r${j}"><div class="tk">${CEK}</div>${esc(x)}</div>`).join("")}</div>`;
    }
    case "seo": {
      kartu(`#${id}c`, s + 0.3);
      A(`#${id}q`, { width: 0 }, { width: 520, duration: 0.8, ease: "power2.out" }, s + 0.6);
      A(`#${id}res`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, s + 1.4);
      it.forEach((_, j) => A(`#${id}r${j}`, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.45, ease: E }, T[j]));
      return `<div class="card seo" id="${id}c"><div class="sbar"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><span class="sq" id="${id}q">${esc(p.cari || KW)}</span></div>
        <div class="res" id="${id}res"><small>${esc(p.domain || "bisnisanda.com")}</small><b>${esc(p.judul_hasil || "Website bisnis Anda")}</b><span class="sk" style="position:relative;display:block;width:90%;height:16px;margin-top:14px;"></span><span class="sk" style="position:relative;display:block;width:70%;height:16px;margin-top:10px;"></span></div>
        ${it.map((x, j) => `<div class="tr" id="${id}r${j}"><div class="tk">${CEK}</div>${esc(x)}</div>`).join("")}</div>`;
    }
    case "serah": {
      kartu(`#${id}c`, s + 0.3);
      it.forEach((_, j) => { A(`#${id}r${j}`, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.45, ease: E }, T[j]); A(`#${id}k${j}`, { scale: 0 }, { scale: 1, duration: 0.35, ease: BK }, T[j] + 0.3); });
      return `<div class="card note" id="${id}c"><h4>${esc(p.label || "SERAH TERIMA")}</h4>${it.map((x, j) => `<div class="row" id="${id}r${j}"><div class="ck">${ikon(j + 3)}</div><span style="flex:1">${esc(x)}</span><div class="tk" id="${id}k${j}">${CEK}</div></div>`).join("")}</div>`;
    }
    case "halaman": {
      // halaman website tersusun per bagian, label bagian muncul saat disebut
      A(`#${id}d`, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6, ease: E }, s + 0.3);
      const B = [[20, 56, 560, 46, "#0F172A"], [20, 118, 560, 170, "#FFD3BD"], [20, 304, 176, 110, "#E2E8F0"], [212, 304, 176, 110, "#E2E8F0"], [404, 304, 176, 110, "#E2E8F0"], [20, 430, 560, 50, "#334155"]];
      const tb = isyarat(i, Math.min(it.length, B.length) || 4, p.kata, 1.0);
      B.forEach((_, j) => A(`#${id}k${j}`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45, ease: E }, tb[Math.min(j, tb.length - 1)] - (j >= tb.length ? -0.2 * (j - tb.length + 1) : 0)));
      it.forEach((_, j) => A(`#${id}t${j}`, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.4, ease: E }, tb[j] + 0.15));
      const tagTop = [56, 180, 340, 450];
      return `<div class="card desk" id="${id}d" style="left:0;top:80px;width:600px;height:500px;"><div class="bar"><i></i><i></i><i></i></div>${B.map(([l, t, w, h, c], j) => `<span class="blk" id="${id}k${j}" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px;background:${c};"></span>`).join("")}</div>
        ${it.slice(0, 4).map((x, j) => `<div class="tag" id="${id}t${j}" style="left:640px;top:${80 + tagTop[j]}px;">${esc(x)}</div>`).join("")}`;
    }
    default: throw new Error("visual tahap tidak dikenal: " + p.visual);
  }
}

// rail tahap
let rail = "";
if (tahapIdx.length) {
  const n = tahapIdx.length, r0 = sStart[tahapIdx[0]], r1 = sEnd[tahapIdx[n - 1]];
  rail = `<div id="railwrap" class="clip" data-start="${r0.toFixed(2)}" data-duration="${(r1 - r0).toFixed(2)}" data-track-index="8" style="position:absolute;inset:0;"><div id="rail">${Array.from({ length: n }, (_, j) => `<div class="rd" id="rd${j}">${j + 1}</div>${j < n - 1 ? `<div class="rl"><i id="rl${j}"></i></div>` : ""}`).join("")}<div class="rail-lbl">ALUR PROYEK</div></div></div>`;
  A("#rail", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: E }, r0 + 0.05);
  tahapIdx.forEach((bi, j) => {
    const t = sStart[bi];
    tl.push(`tl.to("#rd${j}", {backgroundColor: "#D9480F", borderColor: "#D9480F", color: "#FFFFFF", scale: 1.15, duration: 0.35, ease: "back.out(2)"}, ${(t + 0.15).toFixed(2)});`);
    if (j > 0) { A(`#rl${j - 1}`, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power2.out" }, t - 0.1); tl.push(`tl.to("#rd${j - 1}", {scale: 1, duration: 0.3}, ${(t + 0.1).toFixed(2)});`); }
  });
}

const css = fs.readFileSync(path.join(DIR, "gaya.css"), "utf8");
const html = `<!doctype html>
<html lang="id"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1920, height=1080" />
<title>${esc(KODE)} ${esc(KW)}</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>${css}</style></head>
<body><div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="1920" data-height="1080">
<div id="bg" class="clip full" data-start="0" data-duration="${TOTAL}" data-track-index="0"><div class="full bg-base"></div><div id="blob1" class="blob b1"></div><div id="blob2" class="blob b2"></div><div class="grid"></div><img class="logo" src="assets/logo-nusawebsite.png" alt="Nusawebsite" /></div>
<audio id="vo" src="assets/vo.wav" data-start="${AUD}" data-duration="${W.durasi.toFixed(2)}" data-track-index="9" data-volume="1"></audio>
${rail}
${sec.join("\n")}
${vids.join("\n")}
</div>
<script>
const tl = gsap.timeline({ paused: true });
tl.fromTo("#blob1", { x: 0, y: 0 }, { x: 140, y: 80, duration: ${TOTAL}, ease: "sine.inOut" }, 0);
tl.fromTo("#blob2", { x: 0, y: 0 }, { x: -160, y: -60, duration: ${TOTAL}, ease: "sine.inOut" }, 0);
${tl.join("\n")}
window.__timelines["main"] = tl;
</script></body></html>`;

const PR = path.join(P, "proyek");
fs.mkdirSync(path.join(PR, "assets"), { recursive: true });
for (const f of fs.readdirSync(path.join(DIR, "aset"))) fs.copyFileSync(path.join(DIR, "aset", f), path.join(PR, "assets", f));
fs.copyFileSync(vo, path.join(PR, "assets", "vo.wav"));
fs.writeFileSync(path.join(PR, "index.html"), html);
fs.writeFileSync(path.join(PR, "hyperframes.json"), JSON.stringify({ $schema: "https://hyperframes.heygen.com/schema/hyperframes.json", paths: { assets: "assets" }, media: { autoProxy: true }, authoringSkill: "general-video" }, null, 2));
console.log("proyek", PR, TOTAL, "dtk,", naskah.length, "scene, waktu:", W.metode);

// ---------- 5. meta.json ----------
const cap = (x) => x.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bIos\b/g, "iOS").replace(/\bPt\b/g, "PT").replace(/\bPos\b/g, "POS").replace(/\bDi\b/g, "di");
const nT = tahapIdx.length;
let judul = naskah[0].param?.judul_yt || `${cap(KW)}: ${nT} Tahap Kerja dari Konsultasi sampai Rilis`;
if (judul.length > 70) judul = `${cap(KW)}: ${nT} Tahap Kerjanya`;
if (judul.length > 70) judul = cap(KW).slice(0, 70);
const daftar = tahapIdx.map((bi, j) => `${j + 1}. ${String(naskah[bi].param.judul).replace(/\\n|\n/g, " ")}`).join("\n");
const desk = `${naskah[0].teks}\n\nDi video ini kami tunjukkan alur kerja ${KW} di Nusawebsite, tahap demi tahap:\n${daftar}\n\nContoh hasil: aplikasi klinik gigi DentalCare buatan Nusawebsite.\n\nKonsultasi gratis kebutuhan aplikasi atau website bisnis Anda: {{LINK_WA}}\n\n#${KW.replace(/\s+/g, "")} #softwarehouse #nusawebsite`;
const tagSet = new Set([KW, ...(p0tags()), "software house", "jasa pembuatan aplikasi", "aplikasi custom", "nusawebsite", "alur pembuatan aplikasi", "konsultasi aplikasi"]);
function p0tags() { const w = KW.split(" "); const t = []; if (w.length > 3) t.push(w.slice(0, 3).join(" ")); if (/website|web/.test(KW)) t.push("jasa pembuatan website", "website bisnis"); if (/company profile/.test(KW)) t.push("website company profile"); if (/android|ios|mobile/.test(KW)) t.push("aplikasi android", "aplikasi mobile"); return t; }
const tags = [...tagSet].slice(0, 12);
const meta = { kode: KODE, keyword: KW, format: "F3", judul, deskripsi: desk, tag: tags, durasi: TOTAL, timing: W.metode };
fs.writeFileSync(path.join(P, "meta.json"), JSON.stringify(meta, null, 1));

// ---------- 6. check + render + frame ----------
const ck = spawnSync("hyperframes", ["check", PR, "--json"], { encoding: "utf8", shell: true, maxBuffer: 64e6 });
fs.writeFileSync(path.join(P, "check.json"), ck.stdout || "");
try { const j = JSON.parse(ck.stdout); console.log("check:", j.ok ?? j.passed ?? "?", "error", (j.errors || j.summary?.errors || []).length ?? j.summary?.errors); } catch { console.log("check selesai (lihat check.json), kode", ck.status); }
if (opt("--tanpa-render")) process.exit(0);
const out = path.join(P, "hasil.mp4");
// render ke hasil-polos.mp4, lalu watermark WA kanan bawah (sama dgn video DentalCare, owner 17 Okt) → hasil.mp4
const polos = path.join(P, "hasil-polos.mp4");
const rd = spawnSync("bash", [path.join(ROOT, "_bahan", "render-antre.sh"), "hyperframes", "render", PR, "-o", polos, "-q", "standard", "-w", "3", "--quiet"], { stdio: "inherit" });
if (rd.status !== 0 || !fs.existsSync(polos)) throw new Error("render gagal");
execFileSync("node", [path.join(ROOT, "_bahan", "watermark.mjs"), P], { stdio: "inherit" });
const FR = path.join(P, "frames"); fs.mkdirSync(FR, { recursive: true });
const ts = [0.35, 0.15, 0.3, 0.48, 0.66, 0.84].map((f, k) => (k === 0 ? 2.5 : TOTAL * f));
const fr = ts.map((t, k) => { const f = path.join(FR, `f${k}-${t.toFixed(1)}.jpg`); execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", t.toFixed(2), "-i", out, "-frames:v", "1", "-vf", "scale=960:-1", f]); return f; });
execFileSync("ffmpeg", ["-v", "error", "-y", ...fr.flatMap((f) => ["-i", f]), "-filter_complex", "[0][1][2]hstack=3[a];[3][4][5]hstack=3[b];[a][b]vstack", path.join(FR, "_grid.jpg")]);
meta.durasi = +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out], { encoding: "utf8" }).trim();
fs.writeFileSync(path.join(P, "meta.json"), JSON.stringify(meta, null, 1));
console.log("SELESAI", out, meta.durasi, "dtk → cek", path.join(FR, "_grid.jpg"));
