// Pustaka animasi F4 Checklist. Tiap fungsi: (p, param, ctx) → { html, vids: [<video> top-level], js: [baris timeline] }
// ctx = { t0 (VO kalimat mulai), t1 (scene selesai), s (scene mulai), dur, idx, poin: {n,total}, klip(nama) }
export const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const E = '"power3.out"', B = '"back.out(1.8)"';
const r2 = (x) => +x.toFixed(2);
const fs = (len, max, min, k) => Math.round(Math.max(min, Math.min(max, max - (len - 18) * k)));

// ikon garis 24x24
const IK = {
  peringatan: '<path d="M12 3.5 22 20.5H2z"/><path d="M12 10v4.5M12 17.5h.01"/>',
  silang: '<circle cx="12" cy="12" r="9.5"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7"/>',
  stop: '<path d="M8 2.5h8l5.5 5.5v8L16 21.5H8L2.5 16V8z"/><path d="M8.5 12h7"/>',
  cek: '<circle cx="12" cy="12" r="9.5"/><path d="M7.5 12.5l3 3 6-6.5"/>',
  kode: '<path d="M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15"/>',
  data: '<ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v13c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-13M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/>',
  kunci: '<circle cx="8" cy="15" r="4.5"/><path d="M11.2 11.8 20 3M16.5 6.5l2.5 2.5M14 9l2 2"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  hp: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  laptop: '<rect x="4" y="4.5" width="16" height="11" rx="1.5"/><path d="M2 19.5h20"/>',
  toko: '<path d="M3.5 9.5 5 4h14l1.5 5.5M3.5 9.5h17v1a3 3 0 01-5.7 1.3 3 3 0 01-5.6 0A3 3 0 013.5 10.5zM5 13v7.5h14V13M10 20.5v-5h4v5"/>',
  klinik: '<rect x="3.5" y="4.5" width="17" height="16" rx="2"/><path d="M12 8.5v8M8 12.5h8"/>',
  gudang: '<path d="M2.5 9 12 3.5 21.5 9v11.5h-19z"/><path d="M6.5 20.5v-8h11v8M6.5 15.5h11"/>',
  sekolah: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c2 2 10 2 12 0v-5M22 9v6"/>',
  hotel: '<path d="M3.5 20.5v-15h17v15M3.5 13.5h17M7.5 9.5h.01M12 9.5h.01M16.5 9.5h.01M10 20.5v-3.5h4v3.5"/>',
  grafik: '<path d="M3.5 20.5h17M6.5 16.5v-5M11 16.5V7.5M15.5 16.5v-7M20 16.5V4.5"/>',
  jam: '<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5.5l3.5 2"/>',
  orang: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14c2.4.2 4 1.8 4.5 4.5"/>',
  dokumen: '<path d="M6 2.5h8.5L19 7v14.5H6z"/><path d="M14 2.5V7h5M9 12h7M9 15.5h7M9 19h4"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4 5.3 5.3"/>',
  roket: '<path d="M12 2.5c4 2.5 5.5 6.5 5 11l-2.5 3h-5L7 13.5c-.5-4.5 1-8.5 5-11z"/><circle cx="12" cy="9.5" r="1.8"/><path d="M9.5 16.5 8 21l4-2 4 2-1.5-4.5"/>',
  bintang: '<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.3l1.1-6.2L3 9.7l6.2-.9z"/>',
  globe: '<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.8 3 2.8 16 0 19M12 2.5c-2.8 3-2.8 16 0 19"/>',
  keranjang: '<path d="M3 4h2.5l2.2 11h11l2-7.5H7"/><circle cx="9" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/>',
  rumah: '<path d="M3.5 11 12 3.5l8.5 7.5"/><path d="M5.5 9.5v11h13v-11M10 20.5v-6h4v6"/>',
  kalender: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 2.5v5M16 2.5v5"/>',
  bendera: '<path d="M5 21.5V3.5M5 4.5h12l-2.5 4 2.5 4H5"/>',
  wa: '<path d="M4 20.5l1.3-4A8.5 8.5 0 1112 20.5a8.4 8.4 0 01-4-1z"/><path d="M9 9c0 3 2.5 6 6 6"/>',
  palet: '<path d="M12 3a9 9 0 100 18c1.2 0 1.5-.8 1.5-1.5 0-1.4-1.3-1.6-1.3-3s1-1.8 2.3-1.8H17a4 4 0 004-4C21 6.3 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10.5" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/>',
  perisai: '<path d="M12 2.5 20 5.5v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10v-6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  kacamata: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/>',
  tangan: '<path d="M7 11V5.5a1.5 1.5 0 013 0V10M10 9.5V4a1.5 1.5 0 013 0v6M13 10V5.5a1.5 1.5 0 013 0V12M16 9.5a1.5 1.5 0 013 0V14a7 7 0 01-7 7h-1a6 6 0 01-5-2.7L3.5 15a1.6 1.6 0 012.6-1.9L7 14.5"/>',
};
export const ikonNama = Object.keys(IK);
export const ikon = (n, sz = 40, col = "#D9480F", w = 2) =>
  `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${IK[n] || IK.cek}</svg>`;

// teks → kata bermasker (animasi naik per kata). sorot = string kata yang diwarnai oranye
function kata(p, teks, sorot = "") {
  const so = new Set(String(sorot).toLowerCase().split(/\s+/).filter(Boolean));
  return String(teks).split(/\s+/).map((w, i) => {
    const bersih = w.toLowerCase().replace(/[^a-z0-9]/g, "");
    return `<span class="mk"><span class="w ${p}w${so.has(bersih) ? " or" : ""}">${esc(w)}</span></span>`;
  }).join(" ");
}
const sebar = (ctx, n, a = 0.5, b = 0.9) => {
  const t0 = ctx.t0 + a, t1 = Math.max(t0 + 0.3 * n, ctx.t1 - b);
  return Array.from({ length: n }, (_, i) => r2(n === 1 ? t0 : t0 + ((t1 - t0) * i) / (n - 1) * 0.85));
};
const masuk = (sel, t, from = "opacity:0,y:40", ease = E, d = 0.6) => `tl.fromTo("${sel}",{${from}},{opacity:1,x:0,y:0,scale:1,rotation:0,duration:${d},ease:${ease}},${r2(t)});`;
const kataJs = (p, t, stg = 0.07) => `tl.fromTo(".${p}w",{yPercent:115},{yPercent:0,duration:0.6,stagger:${stg},ease:"power4.out"},${r2(t)});`;
const kick = (p, t) => (t ? `<div class="kick" id="${p}k">${esc(t)}</div>` : "");

export const ANIM = {
  "hook-peringatan"(p, a, c) {
    const ik = a.ikon || "peringatan", len = String(a.judul).length, size = fs(len, 128, 78, 0.9);
    const tape = ["peringatan", "stop", "silang"].includes(ik);
    return {
      html: `<div class="center">
        <div class="hk-ic" id="${p}ic"><div class="ring" id="${p}rg"></div>${ikon(ik, 150, "#FFFFFF", 2.2)}</div>
        ${a.kicker ? `<div class="kick" id="${p}k" style="margin-top:40px">${esc(a.kicker)}</div>` : ""}
        <div class="hk-t H" style="font-size:${size}px">${kata(p, a.judul, a.sorot)}</div>
        <span class="ulc" id="${p}u"></span></div>
        ${tape ? `<div class="tape" id="${p}tp"><div class="tape-in" id="${p}ti"></div></div>` : ""}`,
      js: [
        masuk(`#${p}ic`, c.s + 0.05, "opacity:0,scale:0.3,rotation:-25", '"back.out(2.2)"', 0.55),
        `tl.fromTo("#${p}ic",{rotation:0},{rotation:8,duration:0.09,yoyo:true,repeat:5,ease:"sine.inOut"},${r2(c.s + 0.65)});`,
        `tl.fromTo("#${p}rg",{scale:1,opacity:0.6},{scale:1.9,opacity:0,duration:1.1,repeat:${Math.max(0, Math.floor((c.dur - 0.9) / 1.1) - 1)},ease:"power2.out"},${r2(c.s + 0.5)});`,
        a.kicker ? masuk(`#${p}k`, c.s + 0.2, "opacity:0,y:20") : "",
        kataJs(p, c.s + 0.25, 0.06),
        `tl.fromTo("#${p}u",{scaleX:0},{scaleX:1,duration:0.6,ease:"power2.out"},${r2(c.s + 1.1)});`,
        tape ? `tl.fromTo("#${p}tp",{yPercent:120},{yPercent:0,duration:0.5,ease:${E}},${r2(c.s + 0.4)});tl.fromTo("#${p}ti",{x:0},{x:-680,duration:${r2(c.dur)},ease:"none"},${r2(c.s)});` : "",
      ],
    };
  },

  "teks-besar"(p, a, c) {
    const size = fs(String(a.teks).length, 120, 70, 0.8);
    return {
      html: `<div class="center">${a.ikon ? `<div class="tb-ic" id="${p}ic">${ikon(a.ikon, 110, "#D9480F", 1.8)}</div>` : ""}
        ${kick(p, a.kicker)}<div class="hk-t H" style="font-size:${size}px">${kata(p, a.teks, a.sorot)}</div>
        ${a.sub ? `<div class="sub" id="${p}sb">${esc(a.sub)}</div>` : ""}</div>`,
      js: [a.ikon ? masuk(`#${p}ic`, c.s + 0.05, "opacity:0,scale:0.4", B) : "", a.kicker ? masuk(`#${p}k`, c.s + 0.1, "opacity:0,y:20") : "",
        kataJs(p, c.s + 0.2), a.sub ? masuk(`#${p}sb`, c.t0 + 1.2, "opacity:0,y:24") : ""],
    };
  },

  "angka-poin"(p, a, c) {
    const size = fs(String(a.judul).length, 112, 76, 1.1);
    return {
      html: `<div class="ap-bg" id="${p}bg"></div>
        <div class="ap-n H" id="${p}n"><span class="ap-o">${esc(a.n)}</span><span class="ap-f" id="${p}nf">${esc(a.n)}</span></div>
        <div class="ap-r"><div class="ap-lbl" id="${p}l">POIN ${esc(a.n)} DARI ${c.poin.total}</div>
          <div class="ap-t H" style="font-size:${size}px">${kata(p, a.judul, a.sorot)}</div>
          <span class="ul" id="${p}u"></span>
          ${a.sub ? `<div class="sub l" id="${p}sb">${esc(a.sub)}</div>` : ""}</div>`,
      js: [
        `tl.fromTo("#${p}bg",{scale:0.4,opacity:0,rotation:-40},{scale:1,opacity:1,rotation:0,duration:0.9,ease:${E}},${r2(c.s)});`,
        `tl.to("#${p}bg",{rotation:30,duration:${r2(c.dur)},ease:"none"},${r2(c.s + 0.9)});`,
        masuk(`#${p}n`, c.s + 0.05, "opacity:0,x:-120,scale:0.8", '"power4.out"', 0.7),
        `tl.fromTo("#${p}nf",{clipPath:"inset(100% 0 0 0)"},{clipPath:"inset(0% 0 0 0)",duration:0.9,ease:"power2.inOut"},${r2(c.s + 0.5)});`,
        masuk(`#${p}l`, c.s + 0.2, "opacity:0,y:16"),
        kataJs(p, c.s + 0.3),
        `tl.fromTo("#${p}u",{scaleX:0},{scaleX:1,duration:0.5,ease:"power2.out"},${r2(c.s + 0.9)});`,
        a.sub ? masuk(`#${p}sb`, c.t0 + 1.3, "opacity:0,y:24") : "",
      ],
    };
  },

  "judul-poin"(p, a, c) {
    const size = fs(String(a.judul).length, 140, 84, 1.1);
    return {
      html: `<div class="center">${kick(p, a.kicker)}<div class="hk-t H" style="font-size:${size}px">${kata(p, a.judul, a.sorot)}</div>
        ${a.sub ? `<div class="sub" id="${p}sb">${esc(a.sub)}</div>` : ""}<span class="ulc" id="${p}u"></span></div>`,
      js: [a.kicker ? masuk(`#${p}k`, c.s + 0.1, "opacity:0,y:20") : "", kataJs(p, c.s + 0.15, 0.09),
        `tl.fromTo("#${p}u",{scaleX:0},{scaleX:1,duration:0.6,ease:"power2.out"},${r2(c.s + 0.9)});`,
        a.sub ? masuk(`#${p}sb`, c.t0 + 1.2, "opacity:0,y:24") : ""],
    };
  },

  "bukti-footage"(p, a, c) {
    const kl = [].concat(a.klip || "dash");
    const dua = a.perangkat === "keduanya";
    const W = dua ? 1300 : 1560, X = dua ? 120 : 180, Y = a.judul ? 250 : 190, H = Math.round((W * 756) / 1812);
    const vids = [], js = [];
    const span = c.t1 - (c.s + 0.3), per = span / kl.length;
    kl.forEach((k, i) => {
      const st = r2(c.s + 0.3 + per * i), du = r2(Math.min(6.9, per));
      c.klip(k);
      vids.push(`<video id="${p}v${i}" class="vid ${p}vv" src="assets/${k}.mp4" muted playsinline data-start="${st}" data-duration="${du}" data-track-index="${3 + (i % 2)}" style="left:${X}px;top:${Y + 44}px;width:${W}px;height:${H}px;"></video>`);
    });
    js.push(masuk(`#${p}br, .${p}vv`, c.s + 0.05, "opacity:0,y:70", E, 0.7));
    if (a.judul) js.push(masuk(`#${p}k`, c.s + 0.1, "opacity:0,y:20"), masuk(`#${p}j`, c.s + 0.2, "opacity:0,y:30"));
    js.push(masuk(`#${p}tag`, c.t0 + 0.9, "opacity:0,scale:0.7", B, 0.5));
    if (dua) js.push(masuk(`#${p}hp`, c.t0 + 0.7, "opacity:0,y:120,rotation:6", '"power4.out"', 0.8));
    if (a.sorot_titik) js.push(`tl.fromTo("#${p}dot",{scale:0,opacity:0},{scale:1,opacity:1,duration:0.4,ease:${B}},${r2(c.t0 + 1.6)});tl.fromTo("#${p}dot",{boxShadow:"0 0 0 0 rgba(255,128,64,0.6)"},{boxShadow:"0 0 0 40px rgba(255,128,64,0)",duration:1,repeat:3},${r2(c.t0 + 2)});`);
    const dot = a.sorot_titik ? `<div class="dot" id="${p}dot" style="left:${X + W * a.sorot_titik[0] - 22}px;top:${Y + 44 + H * a.sorot_titik[1] - 22}px"></div>` : "";
    return {
      html: `${a.judul ? `<div class="bf-h"><div class="kick l" id="${p}k">${esc(a.kicker || "BUKTI NYATA")}</div><div class="bf-j H" id="${p}j">${esc(a.judul)}</div></div>` : ""}
        <div class="br" id="${p}br" style="left:${X}px;top:${Y}px;width:${W}px;height:${H + 44}px;"><div class="bar"><i></i><i></i><i></i><span>${esc(a.bar || "demo DentalCare")}</span></div></div>
        ${dua ? `<div class="phone" id="${p}hp" style="left:${X + W + 70}px;top:${Y + 40}px;width:300px;height:620px;"><div class="scr"><img class="pimg" src="assets/ui-dentalcare-hp.png" alt=""/></div></div>` : ""}
        <div class="tag" id="${p}tag" style="left:${X}px;top:${Y + H + 44 + 34}px">${ikon("cek", 34, "#16A34A", 2.4)}<span>${esc(a.label || "Contoh dari portofolio kami:")}${/dentalcare/i.test(a.label || "") ? "" : " <b>DentalCare</b>"}</span></div>${dot}`,
      vids, js, front: dot ? `#${p}dot` : null,
    };
  },

  "wireframe-disetujui"(p, a, c) {
    const sk = [[30, 70, 160, 540], [220, 70, 810, 56], [220, 150, 390, 150], [640, 150, 390, 150], [220, 330, 810, 280]];
    const pk = [[22, 50, 200, 34], [22, 110, 256, 190], [22, 330, 256, 30], [22, 380, 190, 30], [22, 470, 256, 64]];
    const t = sebar(c, 3, 0.3, 1.0);
    return {
      html: `${a.judul ? `<div class="top-j H" id="${p}j">${esc(a.judul)}</div>` : ""}
        <div class="card desk" id="${p}d"><div class="bar2"><i></i><i></i><i></i></div>
          ${sk.map((s, i) => `<span class="sk ${i === 1 ? "o" : ""} ${p}sk" style="left:${s[0]}px;top:${s[1]}px;width:${s[2]}px;height:${s[3]}px"></span>`).join("")}
          <img class="real" id="${p}real" src="assets/ui-dentalcare.png" alt=""/></div>
        <div class="phone" id="${p}ph" style="left:1300px;top:260px;width:320px;height:640px;"><div class="scr">
          ${pk.map((s, i) => `<span class="sk ${i === 4 ? "o" : ""} ${p}pk" style="left:${s[0]}px;top:${s[1]}px;width:${s[2]}px;height:${s[3]}px"></span>`).join("")}
          <img class="real" id="${p}realh" src="assets/ui-dentalcare-hp.png" alt=""/></div></div>
        <div class="stamp" id="${p}st">${ikon("cek", 64, "#16A34A", 2.6)}<span>${esc(a.stempel || "DISETUJUI")}</span></div>
        <div class="wf-l" id="${p}l1">Mockup</div><div class="wf-l b" id="${p}l2">Layar asli</div>`,
      js: [a.judul ? masuk(`#${p}j`, c.s + 0.1, "opacity:0,y:30") : "",
        masuk(`#${p}d`, c.s + 0.05, "opacity:0,y:60"), masuk(`#${p}ph`, c.s + 0.25, "opacity:0,y:100"),
        `tl.fromTo(".${p}sk",{scaleX:0},{scaleX:1,duration:0.45,stagger:0.18,ease:"power2.out"},${r2(c.s + 0.4)});`,
        `tl.fromTo(".${p}pk",{scaleX:0},{scaleX:1,duration:0.45,stagger:0.18,ease:"power2.out"},${r2(c.s + 0.6)});`,
        masuk(`#${p}l1`, c.s + 0.7, "opacity:0,x:-30"),
        `tl.fromTo("#${p}real, #${p}realh",{clipPath:"inset(0 100% 0 0)"},{clipPath:"inset(0 0% 0 0)",duration:0.9,ease:"power2.inOut"},${t[1]});`,
        `tl.to("#${p}l1",{opacity:0,duration:0.3},${t[1]});`, masuk(`#${p}l2`, t[1] + 0.3, "opacity:0,x:-30"),
        `tl.fromTo("#${p}st",{opacity:0,scale:2.2,rotation:-18},{opacity:1,scale:1,rotation:-8,duration:0.45,ease:"power4.out"},${t[2]});`,
        `tl.fromTo("#${p}d",{x:0},{x:-10,duration:0.06,yoyo:true,repeat:3},${r2(t[2] + 0.4)});`],
    };
  },

  kepemilikan(p, a, c) {
    const it = (a.item || [{ ikon: "kode", judul: "Kode sumber", sub: "repositori proyek" }, { ikon: "data", judul: "Data bisnis", sub: "database dan cadangan" }, { ikon: "dokumen", judul: "Dokumen", sub: "panduan dan akses" }]).slice(0, 3);
    const t = sebar(c, it.length + 1, 0.4, 1.0), W = 500, gap = 60, x0 = (1920 - (it.length * W + (it.length - 1) * gap)) / 2;
    return {
      html: `${a.judul ? `<div class="top-j H" id="${p}j">${esc(a.judul)}</div>` : ""}
        ${it.map((x, i) => `<div class="card own" id="${p}c${i}" style="left:${x0 + i * (W + gap)}px"><div class="own-ic">${ikon(x.ikon, 96, "#D9480F", 1.8)}</div><b>${esc(x.judul)}</b><em>${esc(x.sub || "")}</em><div class="own-ok" id="${p}o${i}">${ikon("cek", 46, "#16A34A", 2.6)}</div></div>`).join("")}
        <div class="badge" id="${p}bd">${ikon("kunci", 54, "#FFFFFF", 2.2)}<span>${esc(a.badge || "Atas nama Anda")}</span></div>`,
      js: [a.judul ? masuk(`#${p}j`, c.s + 0.1, "opacity:0,y:30") : "",
        ...it.map((_, i) => masuk(`#${p}c${i}`, t[i], "opacity:0,y:90,rotation:-4", '"back.out(1.4)"', 0.7)),
        ...it.map((_, i) => masuk(`#${p}o${i}`, t[i] + 0.6, "opacity:0,scale:0", B, 0.4)),
        masuk(`#${p}bd`, t[it.length], "opacity:0,y:60,scale:0.8", B, 0.6),
        `tl.fromTo("#${p}bd",{scale:1},{scale:1.06,duration:0.35,yoyo:true,repeat:1,ease:"sine.inOut"},${r2(t[it.length] + 0.7)});`],
    };
  },

  alur(p, a, c) {
    const L = (a.langkah || ["Rilis", "Penyesuaian", "Perbaikan", "Pelatihan"]).slice(0, 5), n = L.length;
    const span = 1500, x0 = 210, step = n > 1 ? span / (n - 1) : 0, t = sebar(c, n, 0.4, 0.9);
    return {
      html: `${a.judul ? `<div class="top-j H" id="${p}j">${esc(a.judul)}</div>` : ""}
        <div class="al-line"><i id="${p}ln"></i></div><div class="al-dot" id="${p}tr"></div>
        ${L.map((s, i) => `<div class="al-n" id="${p}n${i}" style="left:${x0 + i * step - 85}px"><div class="al-c">${a.ikon?.[i] ? ikon(a.ikon[i], 72, "#FFFFFF", 2) : i + 1}</div><div class="al-l">${esc(s)}</div></div>`).join("")}`,
      js: [a.judul ? masuk(`#${p}j`, c.s + 0.1, "opacity:0,y:30") : "",
        `tl.fromTo("#${p}ln",{scaleX:0},{scaleX:1,duration:${r2(Math.max(0.5, t[n - 1] - t[0]))},ease:"none"},${t[0]});`,
        `tl.fromTo("#${p}tr",{x:0,opacity:1},{x:${span},duration:${r2(Math.max(0.5, t[n - 1] - t[0]))},ease:"none"},${t[0]});`,
        ...L.map((_, i) => masuk(`#${p}n${i}`, t[i] - 0.1, "opacity:0,y:60,scale:0.6", '"back.out(2)"', 0.55))],
    };
  },

  "papan-progres"(p, a, c) {
    const K = a.kolom || [{ judul: "Selesai", item: ["Rancangan alur", "Mockup tampilan"] }, { judul: "Dikerjakan", item: ["Modul laporan"] }, { judul: "Berikutnya", item: ["Uji pengguna", "Rilis"] }];
    const warna = ["#16A34A", "#D9480F", "#64748B"];
    const all = []; K.forEach((k, i) => k.item.forEach((x, j) => all.push([i, j])));
    const t = sebar(c, all.length + 1, 0.4, 1.0);
    return {
      html: `${a.judul ? `<div class="top-j H" id="${p}j">${esc(a.judul)}</div>` : ""}
        ${K.map((k, i) => `<div class="col" id="${p}k${i}" style="left:${150 + i * 560}px"><h4 style="color:${warna[i]}"><i style="background:${warna[i]}"></i>${esc(k.judul)}</h4>
          ${k.item.map((x, j) => `<div class="kc" id="${p}i${i}_${j}"><span style="background:${warna[i]}"></span>${esc(x)}</div>`).join("")}</div>`).join("")}
        <div class="pg"><div class="pg-l">Progres proyek</div><div class="pg-b"><i id="${p}pb"></i></div></div>`,
      js: [a.judul ? masuk(`#${p}j`, c.s + 0.1, "opacity:0,y:30") : "",
        ...K.map((_, i) => masuk(`#${p}k${i}`, c.s + 0.1 + i * 0.15, "opacity:0,y:50")),
        ...all.map(([i, j], q) => masuk(`#${p}i${i}_${j}`, t[q], "opacity:0,x:40,scale:0.9", B, 0.45)),
        `tl.fromTo("#${p}pb",{scaleX:0},{scaleX:${a.persen ?? 0.65},duration:${r2(Math.max(1, t[all.length] - t[0]))},ease:"power1.inOut"},${t[0]});`],
    };
  },

  "benar-salah"(p, a, c) {
    const t = sebar(c, 2, 0.3, 1.2);
    return {
      html: `${a.judul ? `<div class="top-j H" id="${p}j">${esc(a.judul)}</div>` : ""}
        <div class="bs-p bad" id="${p}a"><div class="bs-ic" id="${p}ia">${ikon("silang", 120, "#DC2626", 2)}</div><div class="bs-lb">${esc(a.label_salah || "HINDARI")}</div><div class="bs-t H">${esc(a.salah)}</div></div>
        <div class="bs-p good" id="${p}b"><div class="bs-ic" id="${p}ib">${ikon("cek", 120, "#16A34A", 2)}</div><div class="bs-lb">${esc(a.label_benar || "PILIH")}</div><div class="bs-t H">${esc(a.benar)}</div></div>
        <div class="bs-vs" id="${p}vs">VS</div>`,
      js: [a.judul ? masuk(`#${p}j`, c.s + 0.1, "opacity:0,y:30") : "",
        masuk(`#${p}a`, t[0] - 0.2, "opacity:0,x:-140", E, 0.6), masuk(`#${p}ia`, t[0] + 0.3, "opacity:0,scale:0,rotation:-90", B, 0.5),
        masuk(`#${p}vs`, t[1] - 0.4, "opacity:0,scale:0", B, 0.4),
        masuk(`#${p}b`, t[1] - 0.2, "opacity:0,x:140", E, 0.6), masuk(`#${p}ib`, t[1] + 0.3, "opacity:0,scale:0,rotation:90", B, 0.5),
        `tl.to("#${p}a",{opacity:0.45,scale:0.96,duration:0.5},${r2(t[1] + 0.6)});`],
    };
  },

  "red-flag"(p, a, c) {
    const it = (a.item || []).slice(0, 4), t = sebar(c, it.length, 0.6, 0.9);
    return {
      html: `<div class="rf-flag" id="${p}f">${ikon("bendera", 300, "#DC2626", 1.6)}</div>
        <div class="rf-r"><div class="kick l rd" id="${p}k">${esc(a.kicker || "TANDA BAHAYA")}</div><div class="rf-j H" id="${p}j">${esc(a.judul)}</div>
        ${it.map((x, i) => `<div class="rf-i" id="${p}i${i}">${ikon("silang", 52, "#DC2626", 2.2)}<span>${esc(x)}</span></div>`).join("")}</div>`,
      js: [masuk(`#${p}f`, c.s + 0.05, "opacity:0,scale:0.5,rotation:-20", B, 0.7),
        `tl.fromTo("#${p}f svg",{skewY:0},{skewY:-5,duration:0.5,yoyo:true,repeat:${Math.max(1, Math.floor(c.dur / 0.5) - 2)},ease:"sine.inOut"},${r2(c.s + 0.7)});`,
        masuk(`#${p}k`, c.s + 0.15, "opacity:0,y:20"), masuk(`#${p}j`, c.s + 0.25, "opacity:0,y:30"),
        ...it.map((_, i) => masuk(`#${p}i${i}`, t[i], "opacity:0,x:60", E, 0.5))],
    };
  },

  "centang-besar"(p, a, c) {
    const size = fs(String(a.teks).length, 104, 70, 0.9);
    return {
      html: `<div class="center"><svg class="cb" viewBox="0 0 200 200"><circle id="${p}cc" cx="100" cy="100" r="88" fill="#16A34A"/><path id="${p}cp" d="M58 104 l28 28 l58 -62" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="150" stroke-dashoffset="150"/></svg>
        <div class="hk-t H" style="font-size:${size}px;margin-top:40px">${kata(p, a.teks, a.sorot)}</div>${a.sub ? `<div class="sub" id="${p}sb">${esc(a.sub)}</div>` : ""}</div>`,
      js: [`tl.fromTo("#${p}cc",{scale:0,transformOrigin:"50% 50%"},{scale:1,duration:0.5,ease:${B}},${r2(c.s + 0.1)});`,
        `tl.fromTo("#${p}cp",{strokeDashoffset:150},{strokeDashoffset:0,duration:0.5,ease:"power2.out"},${r2(c.s + 0.5)});`,
        kataJs(p, c.s + 0.6), a.sub ? masuk(`#${p}sb`, c.t0 + 1.3, "opacity:0,y:24") : ""],
    };
  },

  rekap(p, a, c) {
    const it = (a.item || []).slice(0, 6), t = sebar(c, it.length, 0.7, 0.6);
    const dua = it.length > 3, rows = dua ? Math.ceil(it.length / 2) : it.length;
    return {
      html: `<div class="kick" id="${p}k" style="position:absolute;top:150px;left:0;right:0;text-align:center">${esc(a.kicker || "CHECKLIST")}</div>
        <div class="top-j H c" id="${p}j" style="top:200px">${esc(a.judul || "Sebelum memilih, pastikan")}</div>
        <div class="rk ${dua ? "dua" : ""}" style="grid-template-rows:repeat(${rows},1fr)">${it.map((x, i) => `<div class="rk-i" id="${p}i${i}"><div class="rk-b"><svg viewBox="0 0 52 52"><path id="${p}c${i}" d="M13 27 l9 9 l18 -19" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="50" stroke-dashoffset="50"/></svg></div><span>${esc(x)}</span></div>`).join("")}</div>`,
      js: [masuk(`#${p}k`, c.s + 0.05, "opacity:0,y:20"), masuk(`#${p}j`, c.s + 0.15, "opacity:0,y:30"),
        ...it.map((_, i) => masuk(`#${p}i${i}`, c.s + 0.3 + i * 0.1, "opacity:0,y:30", E, 0.45)),
        ...it.flatMap((_, i) => [`tl.to("#${p}i${i} .rk-b",{backgroundColor:"#16A34A",borderColor:"#16A34A",scale:1.12,duration:0.25,ease:${B}},${t[i]});`,
          `tl.to("#${p}i${i} .rk-b",{scale:1,duration:0.2},${r2(t[i] + 0.25)});`,
          `tl.fromTo("#${p}c${i}",{strokeDashoffset:50},{strokeDashoffset:0,duration:0.35,ease:"power2.out"},${r2(t[i] + 0.05)});`,
          `tl.to("#${p}i${i} span",{color:"#0F172A",duration:0.3},${t[i]});`])],
    };
  },

  "ikon-grid"(p, a, c) {
    const it = (a.item || []).slice(0, 6), n = it.length, cols = n <= 3 ? n : n === 4 ? 4 : 3, rowsN = Math.ceil(n / cols);
    const W = 380, H = 300, gx = 50, gy = 50, x0 = (1920 - (cols * W + (cols - 1) * gx)) / 2, y0 = a.judul ? 330 : 260;
    const t = sebar(c, n, 0.4, 1.0);
    return {
      html: `${a.judul ? `<div class="top-j H c" id="${p}j">${esc(a.judul)}</div>` : ""}
        ${it.map((x, i) => `<div class="card tile" id="${p}t${i}" style="left:${x0 + (i % cols) * (W + gx)}px;top:${y0 + Math.floor(i / cols) * (H + gy) + (rowsN === 1 ? 80 : 0)}px"><div class="tile-ic">${ikon(x.ikon, 90, "#D9480F", 1.8)}</div><b>${esc(x.label)}</b></div>`).join("")}`,
      js: [a.judul ? masuk(`#${p}j`, c.s + 0.1, "opacity:0,y:30") : "",
        ...it.map((_, i) => masuk(`#${p}t${i}`, t[i], "opacity:0,y:70,scale:0.7", '"back.out(1.7)"', 0.55))],
    };
  },

  cta(p, a, c) {
    return {
      html: `<div class="center">
        <div class="kick" id="${p}k">${esc(a.kicker || "LANGKAH PERTAMA")}</div>
        <div class="cta-t H">${kata(p, a.judul || "Konsultasi gratis", a.sorot || "gratis")}</div>
        <div class="sub" id="${p}sb">${esc(a.sub || "Ceritakan kebutuhan bisnis Anda")}</div>
        <div class="btn" id="${p}bt">${ikon("wa", 48, "#FFFFFF", 2.2)}<span>${esc(a.tombol || "Konsultasi gratis")}</span></div>
        <div class="pil" id="${p}pl">${esc(a.pil || "Link ada di deskripsi")}</div>
        <div class="arrow" id="${p}ar"><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#D9480F" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v15M5.5 12.5 12 19l6.5-6.5"/></svg></div></div>`,
      js: [masuk(`#${p}k`, c.s + 0.1, "opacity:0,y:20"), kataJs(p, c.s + 0.25, 0.1), masuk(`#${p}sb`, c.s + 0.9, "opacity:0,y:30"),
        masuk(`#${p}bt`, c.t0 + 1.4, "opacity:0,scale:0.6", B, 0.55),
        `tl.fromTo("#${p}bt",{boxShadow:"0 0 0 0 rgba(232,89,12,0.5)"},{boxShadow:"0 0 0 36px rgba(232,89,12,0)",duration:1.1,repeat:4,ease:"power2.out"},${r2(c.t0 + 2)});`,
        masuk(`#${p}pl`, c.t0 + 2.2, "opacity:0,y:20"),
        masuk(`#${p}ar`, c.t0 + 2.4, "opacity:0,y:-20"), `tl.to("#${p}ar",{y:16,duration:0.45,yoyo:true,repeat:7,ease:"sine.inOut"},${r2(c.t0 + 3)});`],
    };
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
.logo { position: absolute; top: 52px; right: 72px; height: 48px; width: auto; z-index: 50; }
.kwc { position: absolute; top: 60px; left: 80px; z-index: 50; display: flex; align-items: center; gap: 16px; font-weight: 800; font-size: 24px; letter-spacing: 0.22em; color: #D9480F; text-transform: uppercase; }
.kwc i { width: 44px; height: 4px; border-radius: 2px; background: #FF8040; display: block; }
.H { font-family: "Spartan", sans-serif; font-weight: 800; letter-spacing: -0.02em; }
.or { color: #E8590C; }
.center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 0 140px; }
.kick { font-size: 30px; font-weight: 800; letter-spacing: 0.3em; color: #D9480F; }
.kick.l { text-align: left; } .kick.rd { color: #DC2626; }
.hk-t { line-height: 1.06; margin-top: 26px; max-width: 1640px; }
.mk { display: inline-block; overflow: hidden; vertical-align: top; padding: 0 0.03em 0.08em; }
.mk > span { display: inline-block; }
.sub { font-size: 44px; font-weight: 600; color: #475569; margin-top: 34px; line-height: 1.35; max-width: 1400px; }
.sub.l { text-align: left; font-size: 40px; max-width: 1000px; }
.ulc { display: block; width: 220px; height: 12px; border-radius: 6px; background: #FF8040; margin-top: 44px; transform-origin: center; }
.ul { display: block; width: 200px; height: 12px; border-radius: 6px; background: #FF8040; margin-top: 34px; transform-origin: left center; }
.hk-ic { width: 260px; height: 260px; border-radius: 50%; background: linear-gradient(135deg, #FF8040, #D9480F); display: flex; align-items: center; justify-content: center; position: relative; box-shadow: 0 30px 70px rgba(217,72,15,0.35); }
.hk-ic svg { position: relative; }
.ring { position: absolute; inset: 0; border-radius: 50%; border: 8px solid #FF8040; }
.tb-ic { width: 190px; height: 190px; border-radius: 48px; background: #FFF1E8; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
.tape { position: absolute; left: 0; right: 480px; bottom: 0; height: 74px; overflow: hidden; background: #0F172A; }
.tape-in { position: absolute; left: 0; top: 0; bottom: 0; width: 4000px; background: repeating-linear-gradient(-45deg, #FF8040 0 40px, #0F172A 40px 80px); }
/* angka poin */
.ap-bg { position: absolute; left: 30px; top: 170px; width: 760px; height: 760px; border-radius: 50%; border: 3px dashed rgba(255,128,64,0.35); background: radial-gradient(circle, rgba(255,128,64,0.10) 0%, rgba(255,128,64,0) 65%); }
.ap-n { position: absolute; left: 110px; top: 250px; font-size: 520px; line-height: 0.85; }
.ap-n span { display: block; }
.ap-o { color: transparent; -webkit-text-stroke: 6px #FF8040; }
.ap-f { position: absolute; left: 0; top: 0; color: #E8590C; }
.ap-r { position: absolute; left: 820px; top: 0; bottom: 0; width: 1000px; display: flex; flex-direction: column; justify-content: center; }
.ap-lbl { font-size: 28px; font-weight: 800; letter-spacing: 0.26em; color: #64748B; margin-bottom: 18px; }
.ap-t { line-height: 1.04; }
/* footage */
.br { position: absolute; border-radius: 26px; background: #fff; overflow: hidden; box-shadow: 0 40px 100px rgba(15,23,42,0.22); }
.br .bar { position: absolute; left: 0; top: 0; right: 0; height: 44px; background: #F1F5F9; display: flex; align-items: center; gap: 9px; padding-left: 20px; }
.br .bar i { width: 13px; height: 13px; border-radius: 50%; background: #CBD5E1; display: block; }
.br .bar span { margin-left: 18px; font-size: 18px; color: #64748B; font-weight: 600; }
.vid { position: absolute; object-fit: cover; border-radius: 0 0 26px 26px; }
.phone { position: absolute; border-radius: 52px; background: #0F172A; padding: 14px; box-shadow: 0 40px 90px rgba(15,23,42,0.3); }
.phone .scr { width: 100%; height: 100%; border-radius: 40px; background: #fff; overflow: hidden; position: relative; }
.pimg { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
.tag { position: absolute; display: flex; align-items: center; gap: 14px; padding: 18px 30px; background: #fff; border-radius: 20px; font-size: 32px; font-weight: 600; box-shadow: 0 16px 40px rgba(15,23,42,0.12); }
.tag b { color: #D9480F; }
.bf-h { position: absolute; left: 180px; top: 120px; }
.bf-j { font-size: 64px; margin-top: 10px; }
.dot { position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(255,128,64,0.85); border: 5px solid #fff; z-index: 20; }
/* umum */
.top-j { position: absolute; left: 150px; top: 150px; font-size: 76px; line-height: 1.05; max-width: 1500px; }
.top-j.c { left: 0; right: 0; text-align: center; max-width: none; padding: 0 140px; }
.card { position: absolute; background: #FFFFFF; border-radius: 32px; box-shadow: 0 34px 90px rgba(15,23,42,0.13), 0 2px 0 rgba(15,23,42,0.04); }
/* wireframe */
.desk { left: 150px; top: 290px; width: 1060px; height: 640px; overflow: hidden; }
.bar2 { height: 50px; background: #F1F5F9; display: flex; align-items: center; gap: 10px; padding-left: 22px; }
.bar2 i { width: 14px; height: 14px; border-radius: 50%; background: #CBD5E1; display: block; }
.sk { position: absolute; border-radius: 14px; background: #E2E8F0; transform-origin: left center; }
.sk.o { background: #FFD3BD; }
.real { position: absolute; left: 0; top: 50px; width: 100%; height: calc(100% - 50px); object-fit: cover; object-position: top left; }
.phone .real { top: 0; height: 100%; object-position: top; }
.stamp { position: absolute; left: 1050px; top: 640px; display: flex; align-items: center; gap: 18px; padding: 26px 46px; border: 7px solid #16A34A; border-radius: 26px; background: rgba(255,255,255,0.95); color: #16A34A; font-family: "Spartan", sans-serif; font-weight: 800; font-size: 64px; letter-spacing: 0.06em; z-index: 10; }
.wf-l { position: absolute; left: 180px; top: 850px; padding: 12px 26px; border-radius: 999px; background: #0F172A; font-size: 30px; font-weight: 800; color: #FFFFFF; letter-spacing: 0.1em; z-index: 6; }
.wf-l.b { background: #16A34A; }
/* kepemilikan */
.own { top: 320px; width: 500px; height: 440px; padding: 50px; display: flex; flex-direction: column; align-items: flex-start; }
.own-ic { width: 150px; height: 150px; border-radius: 40px; background: #FFF1E8; display: flex; align-items: center; justify-content: center; margin-bottom: 40px; }
.own b { font-family: "Spartan", sans-serif; font-size: 52px; line-height: 1.05; }
.own em { font-style: normal; font-size: 32px; color: #64748B; margin-top: 14px; }
.own-ok { position: absolute; right: 36px; top: 36px; }
.badge { position: absolute; left: 50%; top: 830px; transform: translateX(-50%); display: flex; align-items: center; gap: 22px; padding: 24px 50px; border-radius: 999px; background: #0F172A; color: #fff; font-size: 46px; font-weight: 800; white-space: nowrap; }
/* alur */
.al-line { position: absolute; left: 210px; top: 560px; width: 1500px; height: 12px; border-radius: 6px; background: #E2E8F0; overflow: hidden; }
.al-line i { position: absolute; inset: 0; background: #FF8040; display: block; transform-origin: left center; }
.al-dot { position: absolute; left: 190px; top: 546px; width: 40px; height: 40px; border-radius: 50%; background: #fff; border: 8px solid #D9480F; z-index: 5; }
.al-n { position: absolute; top: 470px; width: 170px; display: flex; flex-direction: column; align-items: center; z-index: 6; }
.al-c { width: 170px; height: 170px; border-radius: 50%; background: #E8590C; color: #fff; font-family: "Spartan", sans-serif; font-weight: 800; font-size: 84px; display: flex; align-items: center; justify-content: center; box-shadow: 0 20px 50px rgba(232,89,12,0.35); border: 8px solid #fff; }
.al-l { margin-top: 30px; width: 300px; text-align: center; font-size: 40px; font-weight: 800; line-height: 1.15; }
/* papan */
.col { position: absolute; top: 300px; width: 520px; height: 560px; border-radius: 30px; background: rgba(241,245,249,0.85); padding: 34px; }
.col h4 { display: flex; align-items: center; gap: 14px; font-size: 32px; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 26px; }
.col h4 i { width: 18px; height: 18px; border-radius: 50%; display: block; }
.kc { display: flex; align-items: center; gap: 18px; background: #fff; border-radius: 20px; padding: 26px 26px; font-size: 36px; font-weight: 700; margin-top: 18px; box-shadow: 0 10px 30px rgba(15,23,42,0.08); }
.kc span { width: 16px; height: 46px; border-radius: 8px; display: block; flex: none; }
.pg { position: absolute; left: 150px; top: 900px; width: 1220px; display: flex; align-items: center; gap: 30px; }
.pg-l { font-size: 30px; font-weight: 800; color: #475569; white-space: nowrap; }
.pg-b { flex: 1; height: 22px; border-radius: 11px; background: #E2E8F0; overflow: hidden; position: relative; }
.pg-b i { position: absolute; inset: 0; background: linear-gradient(90deg, #FF8040, #D9480F); display: block; transform-origin: left center; }
/* benar salah */
.bs-p { position: absolute; top: 280px; width: 760px; height: 590px; border-radius: 36px; padding: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.bs-p.bad { left: 150px; background: #FEF2F2; border: 4px solid #FECACA; }
.bs-p.good { left: 1010px; background: #F0FDF4; border: 4px solid #BBF7D0; }
.bs-lb { font-size: 30px; font-weight: 800; letter-spacing: 0.3em; margin-top: 30px; }
.bad .bs-lb { color: #DC2626; } .good .bs-lb { color: #16A34A; }
.bs-t { font-size: 58px; line-height: 1.1; margin-top: 22px; }
.bs-vs { position: absolute; left: 910px; top: 550px; width: 100px; height: 100px; border-radius: 50%; background: #0F172A; color: #fff; font-family: "Spartan", sans-serif; font-weight: 800; font-size: 38px; display: flex; align-items: center; justify-content: center; z-index: 5; }
/* red flag */
.rf-flag { position: absolute; left: 150px; top: 330px; width: 460px; height: 460px; border-radius: 50%; background: #FEF2F2; display: flex; align-items: center; justify-content: center; }
.rf-r { position: absolute; left: 720px; top: 0; bottom: 0; width: 1080px; display: flex; flex-direction: column; justify-content: center; }
.rf-j { font-size: 78px; line-height: 1.05; margin: 16px 0 26px; }
.rf-i { display: flex; align-items: center; gap: 24px; font-size: 44px; font-weight: 700; margin-top: 22px; }
/* centang besar */
.cb { width: 340px; height: 340px; }
/* rekap */
.rk { position: absolute; left: 200px; right: 200px; top: 340px; bottom: 200px; display: grid; gap: 22px; }
.rk.dua { grid-template-columns: 1fr 1fr; column-gap: 60px; }
.rk-i { display: flex; align-items: center; gap: 30px; background: #fff; border-radius: 26px; padding: 0 40px; box-shadow: 0 16px 44px rgba(15,23,42,0.09); }
.rk-b { width: 76px; height: 76px; border-radius: 20px; border: 5px solid #CBD5E1; flex: none; display: flex; align-items: center; justify-content: center; }
.rk-b svg { width: 60px; height: 60px; }
.rk-i span { font-size: 48px; font-weight: 800; color: #94A3B8; font-family: "Spartan", sans-serif; }
/* ikon grid */
.tile { width: 380px; height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 26px; }
.tile-ic { width: 140px; height: 140px; border-radius: 40px; background: #FFF1E8; display: flex; align-items: center; justify-content: center; }
.tile b { font-family: "Spartan", sans-serif; font-size: 44px; text-align: center; padding: 0 20px; line-height: 1.1; }
/* cta */
.cta-t { font-size: 150px; line-height: 1.02; margin-top: 20px; }
.btn { display: flex; align-items: center; gap: 22px; margin-top: 50px; padding: 30px 64px; border-radius: 999px; background: #E8590C; color: #fff; font-size: 52px; font-weight: 800; }
.pil { margin-top: 34px; padding: 14px 34px; border-radius: 999px; background: #FFF1E8; color: #D9480F; font-size: 34px; font-weight: 800; }
.arrow { margin-top: 20px; }
/* progres poin */
#pbar { position: absolute; left: 80px; bottom: 64px; display: flex; gap: 14px; z-index: 45; align-items: center; }
#pbar .sg { width: 120px; height: 12px; border-radius: 6px; background: #E2E8F0; overflow: hidden; position: relative; }
#pbar .sg i { position: absolute; inset: 0; background: #E8590C; display: block; transform-origin: left center; transform: scaleX(0); }
#pbar .pl { margin-left: 14px; font-size: 24px; font-weight: 800; letter-spacing: 0.14em; color: #64748B; }
`;
