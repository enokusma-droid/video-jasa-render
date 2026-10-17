// Pustaka animasi F2 "Cerita Masalah -> Solusi". Tiap jenis = fungsi (param, ctx) -> { html, luar?, js }.
// ctx = { id, t (mulai absolut dtk), d (durasi dtk), kw (keyword) }. Semua tween memakai timeline `tl` (GSAP, paused).
export const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const arr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
export const judulKw = (kw) => kw.split(" ").map((w, i) => (i > 0 && /^(dan|di|untuk|yang|&)$/i.test(w) ? w.toLowerCase() : /^(ios)$/i.test(w) ? "iOS" : /^(pt|pos)$/i.test(w) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1))).join(" ");

// sorot: kata/frasa di teks dibungkus oranye gelap
export function hl(teks, sorot) {
  let h = esc(teks);
  for (const s of arr(sorot)) if (s) h = h.replace(new RegExp(esc(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), (m) => `<span class="or">${m}</span>`);
  return h;
}

// ikon garis (viewBox 24). Nama dipakai di param `ikon` / `niche`.
export const IKON = {
  toko: "M3 9l1.5-5h15L21 9M3 9h18v2a3 3 0 01-6 0 3 3 0 01-6 0 3 3 0 01-6 0V9zM5 13v8h14v-8M10 21v-5h4v5",
  sekolah: "M22 10L12 5 2 10l10 5 10-5zM6 12v5c3 2.5 9 2.5 12 0v-5M22 10v6",
  hotel: "M2 4v16M2 8h18a2 2 0 012 2v10M2 17h20M6 8v9M9.5 12.5h7",
  kantor: "M6 22V3h12v19M2 22h20M10 7h1M13 7h1M10 11h1M13 11h1M10 15h1M13 15h1M10 22v-3h4v3",
  desa: "M3 11l9-8 9 8M5 9.5V21h14V9.5M10 21v-6h4v6",
  gudang: "M3 21V8l9-5 9 5v13M7 21v-9h10v9M7 15h10M7 18h10",
  restoran: "M7 2v20M4 2v6a3 3 0 006 0V2M17 2c-2 2-3 5-3 8h3v12",
  bengkel: "M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z",
  online: "M3 3h2l2.4 12.2a2 2 0 002 1.8h8.2a2 2 0 002-1.6L21 8H6M9 21h.01M18 21h.01",
  klinik: "M4 4h16v16H4zM12 8v8M8 12h8",
  aplikasi: "M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zM11 18h2",
  website: "M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2c3 3.5 3 16.5 0 20M12 2c-3 3.5-3 16.5 0 20",
  excel: "M4 4h16v16H4zM4 9h16M4 14h16M9 4v16M14 4v16",
  chat: "M21 12a8 8 0 01-11.6 7.1L3 21l1.9-6.4A8 8 0 1121 12z",
  kertas: "M14 3H6v18h12V7l-4-4zM14 3v4h4M9 12h6M9 16h6",
  buku: "M4 4h6a3 3 0 013 3v13a2 2 0 00-2-2H4zM20 4h-6a3 3 0 00-3 3v13a2 2 0 012-2h7z",
  telepon: "M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z",
  jam: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2",
  kalender: "M4 5h16v16H4zM4 10h16M8 3v4M16 3v4",
  stok: "M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8",
  grafik: "M3 3v18h18M7 15l4-4 3 3 5-6",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c1-4 4-6 8-6s7 2 8 6",
  tim: "M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5M17.5 11a2.5 2.5 0 100-5M17 14c2.4.2 4 1.8 4.5 4.5",
  lampu: "M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z",
  kunci: "M5 11h14v10H5zM8 11V7a4 4 0 018 0v4",
  cari: "M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5",
  laporan: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  sinkron: "M21 12a9 9 0 01-15.5 6.2L3 16M3 12a9 9 0 0115.5-6.2L21 8M21 3v5h-5M3 21v-5h5",
  peringatan: "M12 3l10 18H2L12 3zM12 10v4M12 17.5h.01",
  x: "M6 6l12 12M18 6L6 18",
  cek: "M5 12.5l4.5 4.5L19 7.5",
  panah: "M5 12h14M13 6l6 6-6 6",
  bintang: "M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z",
};
export const svg = (nama, size = 40, warna = "#E8590C", tebal = 2.4, extra = "") =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${warna}" stroke-width="${tebal}" stroke-linecap="round" stroke-linejoin="round" ${extra}><path d="${IKON[nama] || IKON.lampu}" pathLength="1"/></svg>`;

// jeda antar item agar muncul mengikuti ucapan (tersebar di ~75% durasi blok)
const langkah = (d, n, awal = 0.5, maks = 1.6) => Math.min(maks, Math.max(0.25, (d * 0.75 - awal) / Math.max(1, n)));
const E = "power3.out";
let seed = 7;
const acak = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

// tema dashboard generik (angka UI = data contoh, bukan klaim)
export const TEMA = {
  stok: { app: "Sistem Stok", menu: ["Dashboard", "Produk", "Stok Masuk", "Stok Keluar", "Gudang", "Laporan"], kpi: [["Produk aktif", 248, ""], ["Stok menipis", 12, ""], ["Pesanan hari ini", 37, ""]], kol: ["Produk", "Gudang", "Sisa", "Status"], baris: [["Beras 5 kg", "Utama", "120", "Aman"], ["Minyak 2 L", "Utama", "18", "Menipis"], ["Gula 1 kg", "Cabang", "96", "Aman"], ["Tepung 1 kg", "Cabang", "64", "Aman"]] },
  kasir: { app: "Aplikasi Kasir", menu: ["Dashboard", "Kasir", "Produk", "Pelanggan", "Shift", "Laporan"], kpi: [["Transaksi hari ini", 126, ""], ["Item terjual", 412, ""], ["Kasir aktif", 3, ""]], kol: ["No. Struk", "Kasir", "Item", "Status"], baris: [["TRX-0126", "Kasir 1", "5", "Lunas"], ["TRX-0125", "Kasir 2", "2", "Lunas"], ["TRX-0124", "Kasir 1", "8", "Lunas"], ["TRX-0123", "Kasir 3", "3", "Lunas"]] },
  website: { app: "Panel Website", menu: ["Dashboard", "Halaman", "Artikel", "Formulir", "Media", "Statistik"], kpi: [["Pengunjung hari ini", 1204, ""], ["Formulir masuk", 18, ""], ["Halaman aktif", 24, ""]], kol: ["Halaman", "Kunjungan", "Durasi", "Status"], baris: [["Beranda", "540", "1:42", "Tayang"], ["Layanan", "312", "2:05", "Tayang"], ["Kontak", "188", "0:58", "Tayang"], ["Blog", "164", "3:11", "Tayang"]] },
  booking: { app: "Sistem Reservasi", menu: ["Dashboard", "Reservasi", "Kamar", "Tamu", "Check-in", "Laporan"], kpi: [["Booking hari ini", 42, ""], ["Kamar terisi", 31, ""], ["Check-in", 12, ""]], kol: ["Tamu", "Kamar", "Malam", "Status"], baris: [["Rina S.", "Deluxe 204", "2", "Check-in"], ["Budi A.", "Superior 112", "1", "Dipesan"], ["Sari W.", "Suite 301", "3", "Dipesan"], ["Dewi L.", "Deluxe 207", "2", "Check-in"]] },
  sekolah: { app: "Sistem Sekolah", menu: ["Dashboard", "Siswa", "Kelas", "Absensi", "Nilai", "Pengumuman"], kpi: [["Siswa aktif", 640, ""], ["Hadir hari ini", 612, ""], ["Tugas masuk", 85, ""]], kol: ["Siswa", "Kelas", "Absensi", "Status"], baris: [["Ayu P.", "8A", "Hadir", "Aktif"], ["Rizky M.", "8B", "Hadir", "Aktif"], ["Nadia F.", "9A", "Izin", "Aktif"], ["Fajar K.", "7C", "Hadir", "Aktif"]] },
  kantor: { app: "Sistem Operasional", menu: ["Dashboard", "Proyek", "Tugas", "Tim", "Dokumen", "Laporan"], kpi: [["Proyek aktif", 14, ""], ["Tugas selesai", 92, ""], ["Anggota tim", 26, ""]], kol: ["Tugas", "PIC", "Tenggat", "Status"], baris: [["Rekap mingguan", "Sinta", "Jumat", "Proses"], ["Survei lokasi", "Andi", "Kamis", "Selesai"], ["Revisi desain", "Mega", "Senin", "Proses"], ["Laporan bulanan", "Yoga", "Rabu", "Selesai"]] },
  desa: { app: "Sistem Desa", menu: ["Dashboard", "Data Warga", "Surat", "Pengaduan", "Berita", "Laporan"], kpi: [["Warga terdata", 3412, ""], ["Surat diproses", 27, ""], ["Pengaduan baru", 5, ""]], kol: ["Layanan", "Pemohon", "Tanggal", "Status"], baris: [["Surat domisili", "Wati", "Senin", "Selesai"], ["Surat usaha", "Joko", "Selasa", "Proses"], ["Pengantar KTP", "Lina", "Selasa", "Selesai"], ["Surat pindah", "Hadi", "Rabu", "Proses"]] },
  pesanan: { app: "Toko Online", menu: ["Dashboard", "Pesanan", "Produk", "Pelanggan", "Pengiriman", "Laporan"], kpi: [["Pesanan baru", 58, ""], ["Dikirim hari ini", 41, ""], ["Produk aktif", 320, ""]], kol: ["Pesanan", "Pelanggan", "Item", "Status"], baris: [["ORD-2041", "Maya", "3", "Dikemas"], ["ORD-2040", "Rudi", "1", "Dikirim"], ["ORD-2039", "Tia", "2", "Dikirim"], ["ORD-2038", "Eka", "4", "Selesai"]] },
};
const warnaStatus = (s) => (/menipis|proses|dipesan|dikemas|izin/i.test(s) ? ["#FEF3C7", "#B45309"] : ["#DCFCE7", "#15803D"]);

function browser(id, tema, x, y, w, h) {
  const T = TEMA[tema] || TEMA.kantor;
  const sideW = Math.round(w * 0.2);
  return `<div class="br" id="${id}-br" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;">
    <div class="bar"><i></i><i></i><i></i><span class="url">app.bisnisanda.id</span></div>
    <div class="side" style="width:${sideW}px;"><div class="sapp">${esc(T.app)}</div>${T.menu.map((m, i) => `<div class="smenu ${i === 0 ? "on" : ""}" id="${id}-m${i}">${esc(m)}</div>`).join("")}</div>
    <div class="main" style="left:${sideW}px;">
      <div class="kpis">${T.kpi.map((k, i) => `<div class="kpi" id="${id}-k${i}"><div class="kl">${esc(k[0])}</div><div class="kv" id="${id}-kv${i}">0</div></div>`).join("")}</div>
      <div class="chart" id="${id}-ch">${[42, 58, 50, 72, 64, 86, 78].map((v, i) => `<i id="${id}-bar${i}" style="height:${v}%"></i>`).join("")}</div>
      <div class="tbl"><div class="tr th">${T.kol.map((c) => `<span>${esc(c)}</span>`).join("")}</div>${T.baris.map((r, i) => { const [bg, fg] = warnaStatus(r[3]); return `<div class="tr" id="${id}-r${i}">${r.slice(0, 3).map((c) => `<span>${esc(c)}</span>`).join("")}<span><b style="background:${bg};color:${fg}">${esc(r[3])}</b></span></div>`; }).join("")}</div>
    </div></div>`;
}
function browserJs(id, tema, t, d) {
  const T = TEMA[tema] || TEMA.kantor;
  let j = `tl.fromTo("#${id}-br",{opacity:0,y:60,scale:0.96},{opacity:1,y:0,scale:1,duration:0.7,ease:"${E}"},${t + 0.2});\n`;
  T.kpi.forEach((k, i) => {
    j += `tl.fromTo("#${id}-k${i}",{opacity:0,y:30},{opacity:1,y:0,duration:0.45,ease:"${E}"},${t + 0.7 + i * 0.25});\n`;
    j += `(function(){const o={v:0},el=document.querySelector("#${id}-kv${i}");tl.to(o,{v:${k[1]},duration:1.4,ease:"power2.out",onUpdate:()=>{el.textContent=Math.round(o.v).toLocaleString("id-ID")}},${t + 0.8 + i * 0.25});})();\n`;
  });
  for (let i = 0; i < 7; i++) j += `tl.fromTo("#${id}-bar${i}",{scaleY:0},{scaleY:1,duration:0.5,ease:"back.out(1.6)"},${t + 1.4 + i * 0.12});\n`;
  T.baris.forEach((_, i) => (j += `tl.fromTo("#${id}-r${i}",{opacity:0,x:40},{opacity:1,x:0,duration:0.4,ease:"${E}"},${t + Math.min(d * 0.55, 2.2) + i * 0.3});\n`));
  j += `tl.fromTo("#${id}-m2",{backgroundColor:"rgba(232,89,12,0)"},{backgroundColor:"rgba(232,89,12,0.12)",duration:0.3,yoyo:true,repeat:1},${t + Math.min(d * 0.7, 3.2)});\n`;
  return j;
}

function teksKiri(id, p, t, { top = 300, lebar = 760 } = {}) {
  const html = `<div class="kiri" style="top:${top}px;width:${lebar}px;">
    ${p.kicker ? `<div class="kick" id="${id}-kk">${esc(p.kicker)}</div>` : ""}
    <div class="h2 H" id="${id}-h">${hl(p.judul || "", p.sorot)}</div>
    <span class="ul" id="${id}-ul"></span>
    ${p.sub ? `<div class="sub" id="${id}-sb">${hl(p.sub, p.sorot_sub)}</div>` : ""}</div>`;
  let js = "";
  if (p.kicker) js += `tl.fromTo("#${id}-kk",{opacity:0,y:20},{opacity:1,y:0,duration:0.45,ease:"${E}"},${t + 0.1});\n`;
  js += `tl.fromTo("#${id}-h",{opacity:0,y:50},{opacity:1,y:0,duration:0.65,ease:"${E}"},${t + 0.2});\n`;
  js += `tl.fromTo("#${id}-ul",{scaleX:0},{scaleX:1,duration:0.5,ease:"power2.out"},${t + 0.55});\n`;
  if (p.sub) js += `tl.fromTo("#${id}-sb",{opacity:0,y:24},{opacity:1,y:0,duration:0.5,ease:"${E}"},${t + 0.8});\n`;
  return { html, js };
}

export const ANIM = {
  // 1. Hook pernyataan: judul besar mask-reveal per baris + ikon melayang
  hook(p, { id, t, d, kw }) {
    const baris = arr(p.baris).length ? arr(p.baris) : [judulKw(kw)];
    const ikon = arr(p.ikon).length ? arr(p.ikon) : ["excel", "chat", "kertas"];
    const pos = [[260, 250], [1560, 230], [300, 760], [1580, 740]];
    const html = `<div class="center">
      ${p.kicker ? `<div class="kick" id="${id}-kk">${esc(p.kicker)}</div>` : ""}
      ${baris.map((b, i) => `<div class="t1 H ${i === baris.length - 1 && baris.length > 1 ? "or" : ""}"><span class="mk"><span id="${id}-b${i}">${hl(b, p.sorot)}</span></span></div>`).join("")}
      ${p.sub ? `<div class="q" id="${id}-sb">${hl(p.sub, p.sorot_sub)}</div>` : ""}
    </div>${ikon.slice(0, 4).map((k, i) => `<div class="fic" id="${id}-i${i}" style="left:${pos[i][0]}px;top:${pos[i][1]}px;">${svg(k, 56)}</div>`).join("")}`;
    let js = p.kicker ? `tl.fromTo("#${id}-kk",{opacity:0,y:20},{opacity:1,y:0,duration:0.45,ease:"${E}"},${t + 0.1});\n` : "";
    baris.forEach((_, i) => (js += `tl.fromTo("#${id}-b${i}",{yPercent:115},{yPercent:0,duration:0.7,ease:"power4.out"},${t + 0.2 + i * 0.28});\n`));
    if (p.sub) js += `tl.fromTo("#${id}-sb",{opacity:0,y:24},{opacity:1,y:0,duration:0.55,ease:"${E}"},${t + Math.min(d * 0.45, 2.4)});\n`;
    ikon.slice(0, 4).forEach((_, i) => {
      js += `tl.fromTo("#${id}-i${i}",{opacity:0,scale:0.4,rotation:-20},{opacity:1,scale:1,rotation:0,duration:0.6,ease:"back.out(2)"},${t + 0.6 + i * 0.2});\n`;
      js += `tl.to("#${id}-i${i}",{y:${i % 2 ? 18 : -18},duration:${(d - 1).toFixed(2)},ease:"sine.inOut"},${t + 1.2});\n`;
    });
    return { html, js };
  },

  // 2. Tokoh niche: ilustrasi ikon besar digambar + chip label
  tokoh(p, { id, t, d }) {
    const n = p.niche || "toko";
    const chip = arr(p.chip).slice(0, 3);
    const tx = teksKiri(id, { kicker: p.kicker ?? "ILUSTRASI CERITA", judul: p.judul, sorot: p.sorot, sub: p.sub }, t, { top: 330, lebar: 700 });
    const html = `<div class="ilus" id="${id}-il"><div class="ring" id="${id}-rg"></div><div class="ilico" id="${id}-ic">${svg(n, 300, "#E8590C", 1.6, `id="${id}-sv"`)}</div>
      ${chip.map((c, i) => `<div class="chipf" id="${id}-c${i}" style="${["left:-40px;top:90px", "right:-60px;top:250px", "left:20px;bottom:40px"][i]}">${svg(c.ikon || "user", 30)}<span>${esc(c.teks || c)}</span></div>`).join("")}</div>
      <div style="position:absolute;left:1000px;top:0;">${tx.html}</div>`;
    let js = tx.js;
    js += `tl.fromTo("#${id}-rg",{scale:0.3,opacity:0},{scale:1,opacity:1,duration:0.8,ease:"back.out(1.4)"},${t + 0.1});\n`;
    js += `tl.fromTo("#${id}-sv path",{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:1.4,ease:"power2.inOut"},${t + 0.3});\n`;
    js += `tl.to("#${id}-ic",{y:-14,duration:${(d - 1.5).toFixed(2)},ease:"sine.inOut"},${t + 1.5});\n`;
    chip.forEach((_, i) => (js += `tl.fromTo("#${id}-c${i}",{opacity:0,scale:0.6},{opacity:1,scale:1,duration:0.5,ease:"back.out(2)"},${t + 1 + i * langkah(d, chip.length, 1)});\n`));
    return { html, js };
  },

  // 3. Kartu alat manual (Excel, chat, kertas, buku, telepon) + coret merah
  alat_manual(p, { id, t, d }) {
    const it = arr(p.item).length ? arr(p.item) : [{ ikon: "excel", judul: "Excel", sub: "dicatat manual" }, { ikon: "chat", judul: "Chat", sub: "pesan tercecer" }, { ikon: "kertas", judul: "Kertas", sub: "ditulis tangan" }];
    const w = it.length > 3 ? 360 : 440, gap = 40, x0 = (1920 - (it.length * w + (it.length - 1) * gap)) / 2;
    const html = `<div class="ttop H" id="${id}-h">${hl(p.judul || "", p.sorot)}</div>
      ${it.map((c, i) => `<div class="card alat" id="${id}-c${i}" style="left:${x0 + i * (w + gap)}px;width:${w}px;"><div class="aico">${svg(c.ikon, 64)}</div><div class="aj H">${esc(c.judul)}</div><div class="as">${esc(c.sub || "")}</div><span class="coret" id="${id}-x${i}"></span></div>`).join("")}
      ${p.bawah ? `<div class="bawah" id="${id}-bw">${hl(p.bawah, p.sorot_bawah)}</div>` : ""}`;
    let js = `tl.fromTo("#${id}-h",{opacity:0,y:40},{opacity:1,y:0,duration:0.6,ease:"${E}"},${t + 0.1});\n`;
    const st = langkah(d, it.length + 1, 0.5, 1.4);
    it.forEach((_, i) => {
      const r = (i % 2 ? 1 : -1) * (2 + i);
      js += `tl.fromTo("#${id}-c${i}",{opacity:0,y:120,rotation:${r * 3}},{opacity:1,y:0,rotation:${r},duration:0.7,ease:"back.out(1.5)"},${t + 0.5 + i * st});\n`;
    });
    if (p.coret !== false) it.forEach((_, i) => (js += `tl.fromTo("#${id}-x${i}",{scaleX:0},{scaleX:1,duration:0.35,ease:"power2.out"},${t + 0.5 + it.length * st + i * 0.15});\n`));
    if (p.bawah) js += `tl.fromTo("#${id}-bw",{opacity:0,y:20},{opacity:1,y:0,duration:0.5,ease:"${E}"},${t + 0.6 + it.length * st});\n`;
    return { html, js };
  },

  // 4. Daftar masalah dengan ikon X merah, getar kecil
  masalah(p, { id, t, d }) {
    const it = arr(p.item);
    const tx = teksKiri(id, { kicker: p.kicker ?? "MASALAHNYA", judul: p.judul, sorot: p.sorot, sub: p.sub }, t, { top: 300, lebar: 720 });
    const html = tx.html + `<div class="list" style="left:1000px;top:${540 - it.length * 75}px;">${it.map((x, i) => `<div class="card li" id="${id}-l${i}"><div class="lx">${svg("x", 34, "#fff", 3)}</div><span>${esc(x)}</span></div>`).join("")}</div>`;
    let js = tx.js;
    const st = langkah(d, it.length, 0.7);
    it.forEach((_, i) => {
      js += `tl.fromTo("#${id}-l${i}",{opacity:0,x:80},{opacity:1,x:0,duration:0.5,ease:"${E}"},${t + 0.7 + i * st});\n`;
      js += `tl.fromTo("#${id}-l${i} .lx",{rotation:0},{rotation:12,duration:0.08,yoyo:true,repeat:3,ease:"sine.inOut"},${t + 1.1 + i * st});\n`;
    });
    return { html, js };
  },

  // 5. Waktu terbuang: jam berputar + kalender berganti
  waktu(p, { id, t, d }) {
    const hari = arr(p.hari).length ? arr(p.hari) : ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
    const tx = teksKiri(id, { kicker: p.kicker ?? "WAKTU TERBUANG", judul: p.judul, sorot: p.sorot, sub: p.sub }, t, { top: 320, lebar: 660 });
    const html = `<div class="jam" id="${id}-jm"><div class="muka">${Array.from({ length: 12 }, (_, i) => `<i style="transform:rotate(${i * 30}deg) translateY(-200px)"></i>`).join("")}<div class="jp" id="${id}-jp"></div><div class="jk" id="${id}-jk"></div><b></b></div></div>
      <div class="card kal" id="${id}-kl"><div class="kh">${svg("kalender", 30, "#fff")}<span>JADWAL</span></div>${hari.map((h, i) => `<div class="kd" id="${id}-d${i}">${esc(h)}</div>`).join("")}</div>
      <div style="position:absolute;left:1040px;top:0;">${tx.html}</div>`;
    let js = tx.js;
    js += `tl.fromTo("#${id}-jm",{opacity:0,scale:0.7},{opacity:1,scale:1,duration:0.7,ease:"back.out(1.5)"},${t + 0.1});\n`;
    js += `tl.fromTo("#${id}-jp",{rotation:0},{rotation:${Math.round(d) * 360},duration:${(d - 0.6).toFixed(2)},ease:"none"},${t + 0.4});\n`;
    js += `tl.fromTo("#${id}-jk",{rotation:0},{rotation:${Math.round(d) * 30},duration:${(d - 0.6).toFixed(2)},ease:"none"},${t + 0.4});\n`;
    js += `tl.fromTo("#${id}-kl",{opacity:0,y:60},{opacity:1,y:0,duration:0.6,ease:"${E}"},${t + 0.6});\n`;
    const st = langkah(d, hari.length, 1);
    hari.forEach((_, i) => (js += `tl.fromTo("#${id}-d${i}",{opacity:0,x:-30},{opacity:1,x:0,duration:0.35,ease:"${E}"},${t + 1 + i * st});tl.to("#${id}-d${i}",{color:"#B91C1C",textDecoration:"line-through",duration:0.2},${t + 1.3 + i * st});\n`));
    return { html, js };
  },

  // 6. Data tercecer: kertas beterbangan dari tengah
  tercecer(p, { id, t, d }) {
    const lbl = arr(p.label).length ? arr(p.label) : ["Nota", "Stok", "Pesanan", "Rekap", "Pelanggan", "Catatan", "Invoice", "Jadwal", "Laporan", "Kontak"];
    seed = 11;
    // grid 5x2 + jitter: berserakan tapi teks tidak saling menimpa
    const pos = lbl.slice(0, 10).map((_, i) => [(i % 5) * 330 - 660 + Math.round(acak() * 50 - 25), (i < 5 ? -70 : 190) + Math.round(acak() * 36 - 18), Math.round(acak() * 24 - 12)]);
    const html = `<div class="center" style="justify-content:flex-start;padding-top:120px;"><div class="h2 H" id="${id}-h" style="text-align:center;">${hl(p.judul || "", p.sorot)}</div>${p.sub ? `<div class="sub" id="${id}-sb" style="text-align:center;width:1200px;">${hl(p.sub, p.sorot_sub)}</div>` : ""}</div>
      ${lbl.slice(0, 10).map((l, i) => `<div class="kertas" id="${id}-k${i}">${svg(["kertas", "excel", "chat", "buku"][i % 4], 34)}<span>${esc(l)}</span><i></i><i></i></div>`).join("")}`;
    let js = `tl.fromTo("#${id}-h",{opacity:0,y:40},{opacity:1,y:0,duration:0.6,ease:"${E}"},${t + 0.1});\n`;
    if (p.sub) js += `tl.fromTo("#${id}-sb",{opacity:0,y:20},{opacity:1,y:0,duration:0.5,ease:"${E}"},${t + Math.min(d * 0.5, 2.5)});\n`;
    pos.forEach(([x, y, r], i) => {
      js += `tl.fromTo("#${id}-k${i}",{x:0,y:200,rotation:0,scale:0.3,opacity:0},{x:${x},y:${y},rotation:${r},scale:1,opacity:1,duration:1.1,ease:"power3.out"},${t + 0.4 + i * 0.12});\n`;
      js += `tl.to("#${id}-k${i}",{y:${y + (i % 2 ? 16 : -16)},rotation:${r + (i % 2 ? 6 : -6)},duration:${Math.max(1, d - 1.8).toFixed(2)},ease:"sine.inOut"},${t + 1.6 + i * 0.12});\n`;
    });
    return { html, js };
  },

  // 7. Titik balik: garis dari cara lama (abu) ke cara baru (oranye)
  titik_balik(p, { id, t, d }) {
    const html = `<div class="center"><div class="kick" id="${id}-kk">${esc(p.kicker ?? "TITIK BALIK")}</div>
      <div class="h1 H" id="${id}-h">${hl(p.judul || "", p.sorot)}</div>
      <div class="jalur"><div class="jt lama" id="${id}-a"><i></i><span>${esc(p.kiri || "Cara lama")}</span></div><div class="jl"><b id="${id}-ln"></b></div><div class="jt baru" id="${id}-b"><i>${svg("cek", 30, "#fff", 3.2)}</i><span>${esc(p.kanan || "Aplikasi custom")}</span></div></div>
      ${p.sub ? `<div class="q" id="${id}-sb">${hl(p.sub, p.sorot_sub)}</div>` : ""}</div>`;
    let js = `tl.fromTo("#${id}-kk",{opacity:0,scale:1.25},{opacity:1,scale:1,duration:0.6,ease:"${E}"},${t + 0.1});\n`;
    js += `tl.fromTo("#${id}-h",{opacity:0,scale:0.9},{opacity:1,scale:1,duration:0.6,ease:"${E}"},${t + 0.3});\n`;
    js += `tl.fromTo("#${id}-a",{opacity:0,x:-40},{opacity:1,x:0,duration:0.5,ease:"${E}"},${t + 0.9});\n`;
    js += `tl.fromTo("#${id}-ln",{scaleX:0},{scaleX:1,duration:${Math.min(1.6, d * 0.3).toFixed(2)},ease:"power2.inOut"},${t + 1.3});\n`;
    js += `tl.fromTo("#${id}-b",{opacity:0,scale:0.5},{opacity:1,scale:1,duration:0.6,ease:"back.out(2)"},${t + 1.3 + Math.min(1.6, d * 0.3)});\n`;
    if (p.sub) js += `tl.fromTo("#${id}-sb",{opacity:0,y:20},{opacity:1,y:0,duration:0.5,ease:"${E}"},${t + 2 + Math.min(1.6, d * 0.3)});\n`;
    return { html, js };
  },

  // 8. Perbandingan aplikasi jadi vs custom
  banding(p, { id, t, d }) {
    const L = p.kiri || { judul: "Aplikasi jadi", item: ["Bisnis menyesuaikan aplikasi", "Fitur tidak terpakai", "Alur kerja dipaksa berubah"] };
    const R = p.kanan || { judul: "Aplikasi custom", item: ["Aplikasi mengikuti bisnis", "Fitur sesuai kebutuhan", "Bisa berkembang bertahap"] };
    const html = `<div class="ttop H" id="${id}-h">${hl(p.judul || "", p.sorot)}</div>
      <div class="card bd kiriB" id="${id}-L"><div class="bj H" id="${id}-Lj">${esc(L.judul)}</div>${arr(L.item).map((x, i) => `<div class="bi" id="${id}-Li${i}"><b class="mn">${svg("x", 24, "#94A3B8", 3)}</b>${esc(x)}</div>`).join("")}</div>
      <div class="vs" id="${id}-vs">VS</div>
      <div class="card bd kananB" id="${id}-R"><div class="bj H or">${esc(R.judul)}</div>${arr(R.item).map((x, i) => `<div class="bi" id="${id}-Ri${i}"><b class="ok">${svg("cek", 24, "#fff", 3.2)}</b>${esc(x)}</div>`).join("")}</div>`;
    let js = `tl.fromTo("#${id}-h",{opacity:0,y:40},{opacity:1,y:0,duration:0.6,ease:"${E}"},${t + 0.1});\n`;
    js += `tl.fromTo("#${id}-L",{opacity:0,x:-80},{opacity:1,x:0,duration:0.6,ease:"${E}"},${t + 0.4});\n`;
    const nL = arr(L.item).length, nR = arr(R.item).length, half = d / 2;
    arr(L.item).forEach((_, i) => (js += `tl.fromTo("#${id}-Li${i}",{opacity:0,y:20},{opacity:1,y:0,duration:0.35,ease:"${E}"},${t + 0.8 + i * langkah(half, nL, 0.8, 1)});\n`));
    js += `tl.to("#${id}-L",{opacity:0.55,scale:0.97,duration:0.5},${t + half});\n`;
    js += `tl.fromTo("#${id}-Lj",{textDecorationColor:"rgba(185,28,28,0)"},{textDecorationColor:"rgba(185,28,28,1)",duration:0.3},${t + half});\n`;
    js += `tl.fromTo("#${id}-vs",{opacity:0,scale:0},{opacity:1,scale:1,duration:0.5,ease:"back.out(2.5)"},${t + half - 0.3});\n`;
    js += `tl.fromTo("#${id}-R",{opacity:0,x:80},{opacity:1,x:0,duration:0.6,ease:"${E}"},${t + half});\n`;
    arr(R.item).forEach((_, i) => (js += `tl.fromTo("#${id}-Ri${i}",{opacity:0,y:20},{opacity:1,y:0,duration:0.35,ease:"${E}"},${t + half + 0.4 + i * langkah(half, nR, 0.4, 1)});\n`));
    return { html, js };
  },

  // 9. Mockup dashboard generik bertema niche (KPI menghitung, grafik tumbuh, tabel masuk)
  dashboard(p, { id, t, d }) {
    const tema = p.tema || "kantor";
    const tx = teksKiri(id, { kicker: p.kicker ?? "CONTOH TAMPILAN", judul: p.judul, sorot: p.sorot, sub: p.sub }, t, { top: 330, lebar: 560 });
    const html = tx.html + browser(id, tema, 720, 170, 1110, 740) + `<div class="badge" id="${id}-bg" style="left:760px;top:860px;"><i></i>${esc(p.label || "Ilustrasi aplikasi custom")}</div>`;
    let js = tx.js + browserJs(id, tema, t, d) + `tl.fromTo("#${id}-bg",{opacity:0,scale:0.7},{opacity:1,scale:1,duration:0.45,ease:"back.out(2)"},${t + Math.min(d * 0.6, 3)});\n`;
    return { html, js };
  },

  // 10. Mockup HP: daftar masuk + notifikasi
  hp(p, { id, t, d }) {
    const T = TEMA[p.tema || "kantor"] || TEMA.kantor;
    const tx = teksKiri(id, { kicker: p.kicker ?? "DARI GENGGAMAN", judul: p.judul, sorot: p.sorot, sub: p.sub }, t, { top: 330, lebar: 820 });
    const html = tx.html + `<div class="phone" id="${id}-ph" style="left:1240px;top:110px;width:400px;height:820px;"><div class="scr">
      <div class="ph-h">${esc(T.app)}</div>
      <div class="ph-k"><div><small>${esc(T.kpi[0][0])}</small><b id="${id}-pv">0</b></div>${svg("grafik", 44, "#fff", 2.6)}</div>
      ${T.baris.map((r, i) => { const [bg, fg] = warnaStatus(r[3]); return `<div class="ph-r" id="${id}-r${i}"><span>${esc(r[0])}<small>${esc(r[1])}</small></span><b style="background:${bg};color:${fg}">${esc(r[3])}</b></div>`; }).join("")}
    </div></div><div class="toast" id="${id}-ts">${svg("cek", 28, "#fff", 3)}<span>${esc(p.notif || "Data tersimpan otomatis")}</span></div>`;
    let js = tx.js + `tl.fromTo("#${id}-ph",{opacity:0,y:120,rotation:6},{opacity:1,y:0,rotation:0,duration:0.8,ease:"${E}"},${t + 0.2});\n`;
    js += `(function(){const o={v:0},el=document.querySelector("#${id}-pv");tl.to(o,{v:${T.kpi[0][1]},duration:1.4,ease:"power2.out",onUpdate:()=>{el.textContent=Math.round(o.v).toLocaleString("id-ID")}},${t + 0.8});})();\n`;
    T.baris.forEach((_, i) => (js += `tl.fromTo("#${id}-r${i}",{opacity:0,x:50},{opacity:1,x:0,duration:0.4,ease:"${E}"},${t + 1 + i * langkah(d, T.baris.length + 1, 1, 0.8)});\n`));
    js += `tl.fromTo("#${id}-ts",{opacity:0,y:-40,scale:0.8},{opacity:1,y:0,scale:1,duration:0.5,ease:"back.out(2)"},${t + Math.min(d * 0.7, 3.5)});\n`;
    return { html, js };
  },

  // 11. Footage portofolio DentalCare (contoh aplikasi buatan kami)
  portofolio(p, { id, t, d }) {
    const klip = arr(p.klip).length ? arr(p.klip) : ["dash", "odon"];
    const html = `<div class="ex-t" id="${id}-kk">${esc(p.kicker ?? "CONTOH APLIKASI BUATAN KAMI")}</div><div class="ex-h H" id="${id}-h">${hl(p.judul || "DentalCare, sistem klinik gigi", p.sorot)}</div>
      <div class="br" id="${id}-br" style="left:140px;top:330px;width:1290px;height:578px;"><div class="bar"><i></i><i></i><i></i><span class="url">DentalCare</span></div></div>
      <div class="phone" id="${id}-ph" style="left:1500px;top:300px;width:290px;height:600px;"><div class="scr"><img class="pimg" src="assets/ui-dentalcare-hp.png" alt="" /></div></div>
      <div class="badge" id="${id}-bg" style="left:180px;top:940px;"><i></i>Portofolio Nusawebsite</div>`;
    const per = (d - 0.4) / klip.length;
    const luar = klip.map((k, i) => `<video id="${id}-v${i}" class="vid" src="assets/${k}.mp4" muted playsinline data-start="${(t + 0.3 + i * per).toFixed(2)}" data-duration="${Math.min(7, per).toFixed(2)}" data-track-index="${3 + i}" style="left:140px;top:370px;width:1290px;height:538px;"></video>`).join("\n");
    let js = `tl.fromTo("#${id}-kk",{opacity:0,y:20},{opacity:1,y:0,duration:0.45,ease:"${E}"},${t + 0.1});\n`;
    js += `tl.fromTo("#${id}-h",{opacity:0,y:30},{opacity:1,y:0,duration:0.55,ease:"${E}"},${t + 0.2});\n`;
    js += `tl.fromTo("#${id}-br",{opacity:0,scale:0.94},{opacity:1,scale:1,duration:0.5,ease:"${E}"},${t});\n`;
    js += `tl.fromTo("#${id}-ph",{opacity:0,y:90},{opacity:1,y:0,duration:0.6,ease:"${E}"},${t + 0.8});\n`;
    js += `tl.fromTo("#${id}-bg",{opacity:0,scale:0.7},{opacity:1,scale:1,duration:0.45,ease:"back.out(2)"},${t + 1.2});\n`;
    return { html, luar, js };
  },

  // 12. Hasil: daftar centang hijau + bar kemajuan
  centang(p, { id, t, d }) {
    const it = arr(p.item);
    const tx = teksKiri(id, { kicker: p.kicker ?? "HASILNYA", judul: p.judul, sorot: p.sorot, sub: p.sub }, t, { top: 320, lebar: 760 });
    const html = tx.html + `<div class="card ck" id="${id}-cd" style="left:1020px;top:${520 - it.length * 62}px;"><div class="ckh">${esc(p.label || "SETELAH PAKAI APLIKASI")}</div>${it.map((x, i) => `<div class="cr" id="${id}-c${i}"><b>${svg("cek", 26, "#fff", 3.2)}</b><span>${esc(x)}</span></div>`).join("")}<div class="pg"><i id="${id}-pg"></i></div></div>`;
    let js = tx.js + `tl.fromTo("#${id}-cd",{opacity:0,y:60},{opacity:1,y:0,duration:0.6,ease:"${E}"},${t + 0.3});\n`;
    const st = langkah(d, it.length, 0.8);
    it.forEach((_, i) => (js += `tl.fromTo("#${id}-c${i}",{opacity:0,x:40},{opacity:1,x:0,duration:0.4,ease:"${E}"},${t + 0.8 + i * st});tl.fromTo("#${id}-c${i} b",{scale:0},{scale:1,duration:0.4,ease:"back.out(3)"},${t + 0.95 + i * st});\n`));
    js += `tl.fromTo("#${id}-pg",{scaleX:0},{scaleX:1,duration:${(it.length * st).toFixed(2)},ease:"none"},${t + 0.8});\n`;
    return { html, js };
  },

  // 13. Chip niche: bidang usaha lain yang bisa dibuatkan
  chip_niche(p, { id, t, d }) {
    const it = arr(p.item).length ? arr(p.item) : [{ ikon: "toko", teks: "Toko" }, { ikon: "gudang", teks: "Gudang" }, { ikon: "sekolah", teks: "Sekolah" }, { ikon: "hotel", teks: "Hotel" }, { ikon: "kantor", teks: "Kantor" }, { ikon: "desa", teks: "Desa" }];
    const html = `<div class="center" style="justify-content:flex-start;padding-top:250px;"><div class="h1 H" id="${id}-h">${hl(p.judul || "", p.sorot)}</div>${p.sub ? `<div class="q" id="${id}-sb">${hl(p.sub, p.sorot_sub)}</div>` : ""}
      <div class="chips">${it.map((c, i) => `<div class="cp" id="${id}-c${i}">${svg(c.ikon, 40)}<span>${esc(c.teks)}</span></div>`).join("")}</div></div>`;
    let js = `tl.fromTo("#${id}-h",{opacity:0,y:40},{opacity:1,y:0,duration:0.6,ease:"${E}"},${t + 0.1});\n`;
    if (p.sub) js += `tl.fromTo("#${id}-sb",{opacity:0,y:20},{opacity:1,y:0,duration:0.5,ease:"${E}"},${t + 0.5});\n`;
    const st = langkah(d, it.length, 0.9, 0.6);
    it.forEach((_, i) => (js += `tl.fromTo("#${id}-c${i}",{opacity:0,scale:0.5,y:40},{opacity:1,scale:1,y:0,duration:0.5,ease:"back.out(2)"},${t + 0.9 + i * st});\n`));
    return { html, js };
  },

  // 14. Pernyataan besar kata demi kata
  kutipan(p, { id, t, d }) {
    const kata = String(p.teks || "").split(/\s+/);
    const sor = arr(p.sorot).join(" ").toLowerCase().split(/\s+/).filter(Boolean);
    const html = `<div class="center"><div class="kick" id="${id}-kk">${esc(p.kicker || "")}</div><div class="kt H">${kata.map((k, i) => `<span class="kw ${sor.includes(k.toLowerCase().replace(/[.,!]/g, "")) ? "or" : ""}" id="${id}-w${i}">${esc(k)}</span>`).join(" ")}</div>${p.sub ? `<div class="q" id="${id}-sb">${hl(p.sub, p.sorot_sub)}</div>` : ""}</div>`;
    let js = p.kicker ? `tl.fromTo("#${id}-kk",{opacity:0},{opacity:1,duration:0.4},${t + 0.1});\n` : "";
    const st = langkah(d, kata.length, 0.2, 0.35);
    kata.forEach((_, i) => (js += `tl.fromTo("#${id}-w${i}",{opacity:0,y:40,filter:"blur(8px)"},{opacity:1,y:0,filter:"blur(0px)",duration:0.45,ease:"${E}"},${t + 0.2 + i * st});\n`));
    if (p.sub) js += `tl.fromTo("#${id}-sb",{opacity:0,y:20},{opacity:1,y:0,duration:0.5,ease:"${E}"},${t + 0.3 + kata.length * st});\n`;
    return { html, js };
  },

  // 15. CTA konsultasi gratis
  cta(p, { id, t, d }) {
    const mini = arr(p.mini).length ? arr(p.mini) : ["Konsultasi", "Rancang alur", "Mockup", "Pengembangan", "Pendampingan"];
    const html = `<div class="center"><div class="kick" id="${id}-kk">${esc(p.kicker ?? "LANGKAH PERTAMA")}</div>
      <div class="cta-t H" id="${id}-h">${hl(p.judul || "Konsultasi Gratis", p.sorot ?? "Gratis")}</div>
      <div class="cta-s" id="${id}-sb">${esc(p.sub || "Ceritakan alur kerja bisnis Anda")}</div>
      <div class="pill" id="${id}-pl">${esc(p.tombol || "Link ada di deskripsi")}</div>
      <div class="mini" id="${id}-mn">${mini.map((m) => `<div><b>${svg("cek", 18, "#fff", 3.4)}</b>${esc(m)}</div>`).join("")}</div></div>`;
    let js = `tl.fromTo("#${id}-kk",{opacity:0,y:20},{opacity:1,y:0,duration:0.5,ease:"${E}"},${t + 0.1});\n`;
    js += `tl.fromTo("#${id}-h",{opacity:0,y:50},{opacity:1,y:0,duration:0.7,ease:"${E}"},${t + 0.3});\n`;
    js += `tl.fromTo("#${id}-sb",{opacity:0,y:30},{opacity:1,y:0,duration:0.6,ease:"${E}"},${t + 0.9});\n`;
    js += `tl.fromTo("#${id}-pl",{opacity:0,scale:0.7},{opacity:1,scale:1,duration:0.55,ease:"back.out(2)"},${t + Math.min(d * 0.45, 2.6)});\n`;
    js += `tl.fromTo("#${id}-pl",{scale:1},{scale:1.06,duration:0.5,yoyo:true,repeat:3,ease:"sine.inOut"},${t + Math.min(d * 0.45, 2.6) + 0.7});\n`;
    js += `tl.fromTo("#${id}-mn",{opacity:0,y:30},{opacity:1,y:0,duration:0.6,ease:"${E}"},${t + Math.min(d * 0.6, 3.4)});\n`;
    return { html, js };
  },
};

export const CSS = `
@font-face { font-family: "Spartan"; src: url("assets/spartan.woff2") format("woff2"); font-weight: 100 900; }
@font-face { font-family: "InterL"; src: url("assets/inter.woff2") format("woff2"); font-weight: 100 900; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #FFFFFF; font-family: "InterL", sans-serif; color: #0F172A; }
#root { position: relative; width: 100%; height: 100%; overflow: hidden; background: #FFFFFF; }
.full { position: absolute; inset: 0; }
.bg-base { background: radial-gradient(ellipse at 30% 20%, #FFFFFF 0%, #FFF8F3 60%, #FFF1E8 100%); }
.grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px); background-size: 80px 80px; -webkit-mask-image: radial-gradient(ellipse at 50% 50%, #000 25%, transparent 80%); mask-image: radial-gradient(ellipse at 50% 50%, #000 25%, transparent 80%); }
.blob { position: absolute; border-radius: 50%; }
.b1 { width: 1000px; height: 1000px; left: -360px; top: -420px; background: radial-gradient(circle, rgba(255,128,64,0.16) 0%, rgba(255,128,64,0) 66%); }
.b2 { width: 1100px; height: 1100px; left: 1180px; top: 420px; background: radial-gradient(circle, rgba(255,128,64,0.12) 0%, rgba(255,128,64,0) 66%); }
.logo { position: absolute; top: 52px; right: 72px; height: 44px; width: auto; z-index: 50; }
.kwtag { position: absolute; top: 60px; left: 72px; font-size: 22px; font-weight: 700; letter-spacing: 0.22em; color: #D9480F; display: flex; align-items: center; gap: 14px; z-index: 50; }
.kwtag::before { content: ""; width: 34px; height: 3px; background: #FF8040; display: block; }
.H { font-family: "Spartan", sans-serif; font-weight: 800; letter-spacing: -0.02em; }
.or { color: #E8590C; }
.center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.kick { font-size: 30px; font-weight: 700; letter-spacing: 0.32em; color: #D9480F; }
.t1 { font-size: 118px; line-height: 1.06; margin-top: 14px; max-width: 1700px; }
.mk { display: inline-block; overflow: hidden; vertical-align: top; padding: 0 0.04em 0.08em; }
.mk > span { display: inline-block; }
.q { font-size: 46px; font-weight: 600; color: #334155; margin-top: 34px; max-width: 1400px; line-height: 1.3; }
.q .or, .sub .or { font-weight: 800; }
.fic { position: absolute; width: 112px; height: 112px; border-radius: 30px; background: #FFFFFF; box-shadow: 0 20px 50px rgba(15,23,42,0.12); display: flex; align-items: center; justify-content: center; }
.kiri { position: absolute; left: 140px; }
.h1 { font-size: 92px; line-height: 1.05; max-width: 1600px; }
.h2 { font-size: 76px; line-height: 1.06; }
.ul { display: block; width: 170px; height: 10px; border-radius: 5px; background: #FF8040; margin-top: 30px; transform-origin: left center; }
.sub { font-size: 36px; line-height: 1.4; color: #475569; margin-top: 28px; }
.ttop { position: absolute; left: 0; right: 0; top: 190px; text-align: center; font-size: 72px; line-height: 1.08; padding: 0 160px; }
.card { position: absolute; background: #FFFFFF; border-radius: 28px; box-shadow: 0 30px 80px rgba(15,23,42,0.12), 0 2px 0 rgba(15,23,42,0.04); }
.alat { top: 420px; height: 330px; padding: 44px 40px; }
.aico { width: 110px; height: 110px; border-radius: 28px; background: #FFF1E8; display: flex; align-items: center; justify-content: center; }
.aj { font-size: 52px; margin-top: 30px; }
.as { font-size: 30px; color: #64748B; margin-top: 10px; }
.coret { position: absolute; left: 30px; right: 30px; top: 222px; height: 8px; border-radius: 4px; background: #DC2626; transform-origin: left center; transform: rotate(-4deg); }
.bawah { position: absolute; left: 0; right: 0; top: 830px; text-align: center; font-size: 40px; font-weight: 700; color: #334155; }
.list { position: absolute; width: 760px; }
.li { position: relative; display: flex; align-items: center; gap: 28px; padding: 30px 36px; margin-bottom: 26px; font-size: 40px; font-weight: 700; }
.lx { width: 64px; height: 64px; border-radius: 50%; background: #DC2626; display: flex; align-items: center; justify-content: center; flex: none; }
.jam { position: absolute; left: 180px; top: 220px; width: 520px; height: 520px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 30px 80px rgba(15,23,42,0.14); border: 14px solid #0F172A; }
.muka { position: absolute; inset: 0; }
.muka i { position: absolute; left: 50%; top: 50%; width: 8px; height: 26px; margin: -13px 0 0 -4px; background: #CBD5E1; border-radius: 4px; display: block; }
.jp { position: absolute; left: 50%; top: 50%; width: 10px; height: 200px; margin-left: -5px; margin-top: -190px; background: #E8590C; border-radius: 5px; transform-origin: 50% 190px; }
.jk { position: absolute; left: 50%; top: 50%; width: 16px; height: 130px; margin-left: -8px; margin-top: -120px; background: #0F172A; border-radius: 8px; transform-origin: 50% 120px; }
.muka b { position: absolute; left: 50%; top: 50%; width: 40px; height: 40px; margin: -20px; border-radius: 50%; background: #0F172A; }
.kal { left: 560px; top: 600px; width: 340px; padding: 0 0 20px; overflow: hidden; }
.kh { background: #E8590C; color: #fff; display: flex; align-items: center; gap: 14px; padding: 20px 28px; font-weight: 800; letter-spacing: 0.2em; font-size: 24px; }
.kd { font-size: 30px; font-weight: 700; padding: 10px 28px; color: #334155; }
.kertas { position: absolute; left: 860px; top: 520px; width: 210px; height: 150px; background: #fff; border-radius: 18px; box-shadow: 0 24px 50px rgba(15,23,42,0.16); padding: 22px; display: flex; flex-direction: column; gap: 10px; }
.kertas span { font-size: 28px; font-weight: 800; }
.kertas i { display: block; height: 10px; border-radius: 5px; background: #E2E8F0; width: 80%; }
.jalur { display: flex; align-items: center; margin-top: 80px; gap: 0; }
.jt { display: flex; flex-direction: column; align-items: center; gap: 18px; width: 340px; font-size: 36px; font-weight: 800; }
.jt i { width: 96px; height: 96px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.jt.lama i { background: #CBD5E1; } .jt.lama span { color: #64748B; }
.jt.baru i { background: #E8590C; box-shadow: 0 18px 40px rgba(232,89,12,0.4); } .jt.baru span { color: #D9480F; }
.jl { width: 520px; height: 10px; background: #E2E8F0; border-radius: 5px; margin-top: -60px; overflow: hidden; }
.jl b { display: block; height: 100%; background: linear-gradient(90deg, #CBD5E1, #E8590C); transform-origin: left center; }
.bd { top: 380px; width: 700px; padding: 48px 50px; }
.kiriB { left: 160px; } .kananB { left: 1060px; border: 4px solid #FF8040; }
.bj { font-size: 54px; margin-bottom: 18px; text-decoration: line-through; text-decoration-thickness: 6px; text-decoration-color: rgba(185,28,28,0); }
.kananB .bj { text-decoration: none; }
.bi { display: flex; align-items: center; gap: 20px; font-size: 34px; font-weight: 600; margin-top: 24px; color: #334155; }
.bi b { width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex: none; }
.bi .mn { background: #F1F5F9; } .bi .ok { background: #16A34A; }
.vs { position: absolute; left: 905px; top: 560px; width: 110px; height: 110px; border-radius: 50%; background: #0F172A; color: #fff; font-family: "Spartan"; font-weight: 800; font-size: 40px; display: flex; align-items: center; justify-content: center; z-index: 5; }
.br { position: absolute; border-radius: 22px; background: #fff; overflow: hidden; box-shadow: 0 34px 90px rgba(15,23,42,0.20); }
.br .bar { position: absolute; left: 0; top: 0; right: 0; height: 40px; background: #F1F5F9; display: flex; align-items: center; gap: 8px; padding-left: 18px; z-index: 2; }
.br .bar i { width: 12px; height: 12px; border-radius: 50%; background: #CBD5E1; display: block; }
.br .url { margin-left: 18px; font-size: 16px; color: #64748B; background: #fff; border-radius: 8px; padding: 4px 16px; }
.side { position: absolute; left: 0; top: 40px; bottom: 0; background: #0F172A; padding: 24px 16px; }
.sapp { color: #fff; font-family: "Spartan"; font-weight: 800; font-size: 24px; margin-bottom: 24px; padding-left: 10px; }
.smenu { color: #94A3B8; font-size: 19px; font-weight: 600; padding: 12px 14px; border-radius: 10px; margin-bottom: 4px; }
.smenu.on { background: #C2410C; color: #fff; }
.main { position: absolute; top: 40px; right: 0; bottom: 0; padding: 28px 30px; background: #F8FAFC; }
.kpis { display: flex; gap: 18px; }
.kpi { flex: 1; background: #fff; border-radius: 16px; padding: 18px 20px; box-shadow: 0 6px 18px rgba(15,23,42,0.06); }
.kl { font-size: 17px; color: #64748B; font-weight: 600; }
.kv { font-family: "Spartan"; font-weight: 800; font-size: 46px; margin-top: 6px; }
.chart { height: 210px; margin-top: 20px; background: #fff; border-radius: 16px; padding: 20px 26px 16px; display: flex; align-items: flex-end; gap: 22px; box-shadow: 0 6px 18px rgba(15,23,42,0.06); }
.chart i { flex: 1; display: block; border-radius: 8px 8px 3px 3px; background: linear-gradient(180deg, #FF8040, #FFD3BD); transform-origin: bottom center; }
.tbl { margin-top: 20px; background: #fff; border-radius: 16px; padding: 10px 22px; box-shadow: 0 6px 18px rgba(15,23,42,0.06); }
.tr { display: grid; grid-template-columns: 1.6fr 1.2fr 0.8fr 1fr; padding: 12px 0; font-size: 18px; border-bottom: 1px solid #F1F5F9; align-items: center; }
.tr.th { font-size: 14px; color: #64748B; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.tr b { font-size: 15px; padding: 4px 12px; border-radius: 999px; }
.badge { position: absolute; padding: 18px 30px; border-radius: 999px; background: #0F172A; color: #fff; font-size: 28px; font-weight: 700; display: flex; align-items: center; gap: 14px; box-shadow: 0 18px 40px rgba(15,23,42,0.25); z-index: 6; }
.badge i { width: 16px; height: 16px; border-radius: 50%; background: #22C55E; display: block; }
.phone { position: absolute; border-radius: 52px; background: #0F172A; padding: 14px; box-shadow: 0 30px 70px rgba(15,23,42,0.25); }
.phone .scr { width: 100%; height: 100%; border-radius: 40px; background: #F8FAFC; overflow: hidden; position: relative; }
.pimg { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
.ph-h { background: #fff; padding: 46px 28px 22px; font-family: "Spartan"; font-weight: 800; font-size: 30px; }
.ph-k { margin: 20px; border-radius: 22px; background: linear-gradient(135deg, #E8590C, #FF8040); color: #fff; padding: 24px; display: flex; justify-content: space-between; align-items: center; }
.ph-k small { font-size: 17px; opacity: 0.9; display: block; } .ph-k b { font-family: "Spartan"; font-size: 54px; }
.ph-r { margin: 0 20px 14px; background: #fff; border-radius: 16px; padding: 16px 18px; display: flex; justify-content: space-between; align-items: center; font-size: 21px; font-weight: 700; box-shadow: 0 4px 12px rgba(15,23,42,0.05); }
.ph-r small { display: block; font-size: 15px; color: #64748B; font-weight: 600; margin-top: 2px; }
.ph-r b { font-size: 14px; padding: 5px 12px; border-radius: 999px; }
.toast { position: absolute; right: 700px; top: 790px; white-space: nowrap; display: flex; align-items: center; gap: 14px; background: #16A34A; color: #fff; font-size: 26px; font-weight: 700; padding: 18px 28px; border-radius: 20px; box-shadow: 0 20px 40px rgba(22,163,74,0.35); z-index: 6; }
.vid { position: absolute; object-fit: cover; }
.ex-t { position: absolute; left: 140px; top: 150px; font-size: 30px; font-weight: 700; letter-spacing: 0.24em; color: #D9480F; }
.ex-h { position: absolute; left: 140px; top: 196px; font-size: 64px; }
.ck { width: 760px; padding: 40px 44px 34px; }
.ckh { font-size: 22px; font-weight: 800; letter-spacing: 0.2em; color: #64748B; margin-bottom: 10px; }
.cr { display: flex; align-items: center; gap: 22px; font-size: 38px; font-weight: 700; margin-top: 26px; }
.cr b { width: 54px; height: 54px; border-radius: 50%; background: #16A34A; display: flex; align-items: center; justify-content: center; flex: none; }
.pg { height: 12px; border-radius: 6px; background: #F1F5F9; margin-top: 34px; overflow: hidden; }
.pg i { display: block; height: 100%; background: linear-gradient(90deg, #FF8040, #16A34A); transform-origin: left center; }
.chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 24px; margin-top: 70px; max-width: 1500px; }
.cp { display: flex; align-items: center; gap: 16px; background: #fff; border-radius: 999px; padding: 22px 38px; font-size: 38px; font-weight: 800; box-shadow: 0 16px 40px rgba(15,23,42,0.10); }
.kt { font-size: 96px; line-height: 1.12; max-width: 1600px; margin-top: 20px; }
.kw { display: inline-block; }
.ilus { position: absolute; left: 220px; top: 210px; width: 640px; height: 640px; }
.ring { position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(circle, #FFF1E8 0%, #FFE3D1 70%); border: 4px dashed #FFB38A; }
.ilico { position: absolute; left: 170px; top: 170px; width: 300px; height: 300px; }
.chipf { position: absolute; display: flex; align-items: center; gap: 12px; background: #fff; border-radius: 999px; padding: 16px 26px; font-size: 28px; font-weight: 800; box-shadow: 0 16px 40px rgba(15,23,42,0.12); white-space: nowrap; }
.cta-t { font-size: 130px; line-height: 1; margin-top: 20px; }
.cta-s { font-size: 44px; color: #475569; margin-top: 26px; font-weight: 600; }
.pill { margin-top: 50px; padding: 30px 64px; border-radius: 999px; background: #E8590C; color: #fff; font-size: 44px; font-weight: 800; box-shadow: 0 24px 50px rgba(255,128,64,0.40); }
.mini { display: flex; gap: 26px; margin-top: 64px; }
.mini div { display: flex; align-items: center; gap: 10px; font-size: 26px; font-weight: 700; color: #334155; }
.mini b { width: 34px; height: 34px; border-radius: 50%; background: #16A34A; display: flex; align-items: center; justify-content: center; }
`;
