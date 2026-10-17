# PANDUAN templat F3 "Alur Proses" (channel jasa Nusawebsite)

Format favorit owner (17 Okt 2026): **setiap kalimat VO punya animasi yang relevan**. Generator `buat.mjs` mengubah
`naskah.json` (blok teks + jenis animasi) menjadi video 1920x1080 30 fps, suara Fola, tanpa musik.

## Cara jalan
```bash
cd E:/Rakazo/growth/video/format-jasa/templat/F3
# 1. tulis ../../produksi/<KODE>/naskah.json (lihat contoh di bawah / produksi/J003/naskah.json)
node buat.mjs <KODE> --tanpa-render   # gerbang naskah + TTS + timing + proyek + hyperframes check (cepat)
node buat.mjs <KODE>                  # + render (antre maks 3 render serentak) + frames + meta.json
```
- Opsi: `--ulang-vo` (TTS ulang setelah naskah diubah), `--ulang-waktu`. VO yang ada tidak ditimpa tanpa `--ulang-vo`.
- Keluaran `produksi/<KODE>/`: `vo/vo.wav`, `waktu.json` (whisper/silencedetect), `proyek/` (HyperFrames), `check.json`,
  `hasil.mp4`, `frames/_grid.jpg` (6 frame), `meta.json` (judul ≤70 huruf keyword di depan, deskripsi dengan `{{LINK_WA}}`, 8-12 tag, durasi).
- Render ±5 mnt per video (3 worker). TTS ±1-3 mnt (antrean konten `/api/tts`).
- Setelah selesai: ubah `status` entri di `keywords.json` menjadi `"selesai"` (hanya entri itu).

## Cek wajib setelah render (LIHAT sendiri)
1. Buka `frames/_grid.jpg`. Ejaan benar, teks tidak terpotong/bertumpuk, logo kanan atas, tidak ada banner MODE DEMO.
2. Frame grid bisa jatuh saat elemen baru masuk. Untuk memastikan tiap scene lengkap, ambil frame 0,5 dtk sebelum scene berakhir:
   `hyperframes snapshot produksi/<KODE>/proyek --at <t1,t2,...> --no-end -o produksi/<KODE>/snaps`
   (waktu scene: atribut `data-start`/`data-duration` tiap `<section>` di `proyek/index.html`).
3. `check.json` → `lint.errorCount` harus 0 (peringatan `timeline_track_too_dense` dan `duplicate_media` boleh).
4. Durasi 55-75 dtk. Lebih panjang → pangkas naskah, `--ulang-vo`.

## Struktur naskah (55-70 dtk = 120-145 kata, gerbang 100-160)
| # | Blok | anim | Isi |
|---|---|---|---|
| 1 | Hook | `judul-keyword` | Kalimat 1 = PERNYATAAN berisi keyword UTUH. Pola: "Pelajari N tahap ini sebelum memesan <keyword>." / "Hati-hati memilih <keyword> sebelum ...". DILARANG pertanyaan. Kalimat 2 = taruhannya. |
| 2 | Bahaya/taruhan (opsional) | `peringatan` | "Hati-hati dengan ...": 3-4 akibat buruk muncul satu per satu saat disebut. |
| 3 | Overview | `stepper-overview` | "Di Nusawebsite, alurnya N tahap." Label tahap pendek (≤14 huruf). |
| 4-8 | Tahap 1..N (4-6) | `tahap` | Kalimat dibuka "Tahap satu, <nama>." lalu 1 kalimat isi dengan 3-4 hal yang disebut (jadi item animasi). |
| 9 | Bukti nyata | `contoh-hasil` atau `footage` | Footage DentalCare asli. Selalu sebut "contoh", jangan klaim untuk niche lain. |
| 10 | CTA | `cta` | "Konsultasi gratis, link ada di deskripsi." (pertanyaan boleh di CTA). |

Tahap per jenis keyword (pilih visual yang cocok):
- **Aplikasi** (android/ios/mobile/kasir/pos/akuntansi/toko online/marketplace): Konsultasi `catatan` → Rancang MVP `alur` → Mockup `wireframe` → Develop & Uji `kode` → Rilis `rilis`.
- **Software house / perusahaan software**: Konsultasi `catatan` → Rancang `alur` → Mockup `wireframe` → Komunikasi tiap tahap `chat` → Serah terima `serah` (kode & akses milik klien) → contoh `ui`/`contoh-hasil`.
- **Website / company profile / landing page / toko online web**: Konsultasi `catatan` → Struktur halaman `halaman` → Mockup `wireframe` mode `web` → SEO dasar `seo` → Online & serah terima `serah` / `rilis`.
- **Maintenance / perbaikan / kelola / redesign website**: Audit `catatan` (label "HASIL AUDIT") → Perbaikan `kode` → Pemantauan `uptime` → Laporan rutin `chat` → Serah/akses `serah`.

## Katalog anim (blok) dan param
Semua teks di param = teks layar (pendek). `kata` = kata pemicu: item ke-j muncul saat kata itu diucapkan (awal kata,
huruf kecil). Tanpa `kata` → item dibagi rata sepanjang blok.

| anim | param | Tampilan |
|---|---|---|
| `judul-keyword` | `kicker`, `sorot` (bagian keyword baris 2 oranye), `sub`, `kata_sub`, `judul_yt` (opsional, judul YouTube) | Keyword besar 2 baris, naik dari mask, zoom pelan |
| `peringatan` | `judul` ("Hati-hati"), `desk`, `item[3-4]`, `kata[]` | Ikon segitiga oranye bergetar + kartu silang merah satu per satu |
| `stepper-overview` | `kicker`, `judul?`, `tahap[4-6]`, `kata[]` | Lingkaran bernomor muncul saat tahap disebut |
| `tahap` | `judul` (pakai `\n`), `desk`, `visual`, + param visual | Angka besar bergaris kiri + visual kanan, rail tahap di atas otomatis |
| `footage` | `klip[]`, `label`, `caption` | Footage asli lebar penuh di bingkai browser + caption |
| `contoh-hasil` | `kicker`, `judul`, `klip[]` | Footage asli bergantian + HP |
| `cta` | `judul` ("Konsultasi\|Gratis"), `sub`, `kata_link`, `mini[]` (default label stepper) | Pil "Link ada di deskripsi" berdenyut |

Visual `tahap` (kanan):
| visual | param | Isi |
|---|---|---|
| `catatan` | `label`, `item[3-4]`, `kata[]`, `bubble?` | Kartu catatan, baris ikon masuk saat disebut |
| `alur` | `alur[3]`, `on[3]`, `kata[]`, `off[]`, `catatan?` | Diagram 3 kotak + chip fitur inti (oranye) + chip nanti (putus-putus) |
| `wireframe` | `mode` ("app" desktop+HP / "web" desktop), `stempel`, `kata_stempel` | Kerangka layar tergambar, stempel DISETUJUI saat kata disebut |
| `kode` | `label`, `item[3-4]`, `kata[]` | Panel kode tergambar + daftar hasil uji bercentang |
| `rilis` | `klip[]`, `item[≤2]`, `kata[]`, `hp` (default true) | Footage asli di browser + HP + badge |
| `ui` | `klip[]`, `item[≤4]`, `kata[]` | Footage asli di browser + badge fitur (lebih banyak UI asli) |
| `chat` | `label`, `item[3-5]` (bergantian klien/tim), `kata[]` | Grup chat, gelembung muncul satu per satu |
| `uptime` | `label`, `item[3]`, `kata[]` | Grafik tergambar + status Online berdenyut + centang |
| `seo` | `cari`, `domain`, `judul_hasil`, `item[3]`, `kata[]` | Kotak pencarian mengetik + hasil pencarian + centang |
| `serah` | `label`, `item[3-4]`, `kata[]` | Daftar serah terima dengan centang hijau |
| `halaman` | `item[≤4]` (nama bagian), `kata[]` | Halaman website tersusun per bagian + label |

Klip footage DentalCare (`aset/*.mp4`, 8 dtk, potongan bersih tanpa lower-third dari `_bahan/dentalcare-yt004.mp4`, crop 1808x740+56+110):
`dash` (4-12 dtk, dashboard grafik), `pasien` (46-54, daftar pasien), `antrean` (59-67, antrean hari ini), `soap` (74-82, rekam medis SOAP),
`resep` (103-111, tindakan & resep), `invoice` (128-136, daftar invoice), `dash2` (172-180, dashboard + appointment),
`odon` (salinan klip F3, odontogram). Gambar: `ui-dentalcare.png`, `ui-dentalcare-hp.png`.

## Contoh naskah.json (J003, terbukti)
```json
[
 {"teks": "Pelajari lima tahap ini sebelum memesan jasa pembuatan aplikasi android. Urutannya menentukan aplikasi Anda dipakai atau terbengkalai.",
  "anim": "judul-keyword", "param": {"kicker": "SEBELUM MEMESAN", "sorot": "aplikasi android", "sub": "5 tahap yang menentukan hasil aplikasi Anda", "kata_sub": "urutannya"}},
 {"teks": "Hati-hati dengan proyek yang langsung koding. Fitur menumpuk, tampilan membingungkan, dan tim kembali ke cara lama.",
  "anim": "peringatan", "param": {"judul": "Hati-hati", "item": ["Langsung koding", "Fitur menumpuk", "Tampilan membingungkan", "Tim kembali ke cara lama"], "kata": ["langsung", "fitur", "tampilan", "kembali"]}},
 {"teks": "Di Nusawebsite, alurnya selalu lima tahap.", "anim": "stepper-overview", "param": {"tahap": ["Konsultasi", "Rancang MVP", "Mockup", "Develop & Uji", "Rilis"]}},
 {"teks": "Tahap satu, konsultasi. Kami dengarkan masalah bisnis, alur kerja harian, dan siapa penggunanya.",
  "anim": "tahap", "param": {"judul": "Konsultasi\nKebutuhan", "desk": "...", "visual": "catatan", "item": ["Masalah bisnis", "Alur kerja harian", "Siapa penggunanya"], "kata": ["masalah", "alur", "siapa"]}},
 "... tahap 2-5 (alur, wireframe, kode, rilis), contoh-hasil, cta: lihat produksi/J003/naskah.json"
]
```

## Larangan bahasa (gerbang `buat.mjs` menolak sebagian otomatis)
- Keyword UTUH di kalimat pertama; kalimat pertama bukan pertanyaan.
- Tanpa harga/angka biaya/diskon, tanpa "tanpa/tidak maksa|paksa", tanpa em/en dash, tanpa riba (pinjam, kredit, cicilan, koperasi, gadai).
- Tanpa statistik/persen/testimoni karangan, tanpa janji durasi angka pasti ("2 minggu jadi"), tanpa menjelekkan kompetitor.
- Nomor/URL tidak diucapkan. CTA sopan: "Konsultasi gratis, link ada di deskripsi."
- Footage DentalCare selalu disebut "contoh" (aplikasi klinik gigi buatan kami), jangan diklaim sebagai aplikasi niche lain.

## Watermark WA (owner 17 Okt)
Render → `hasil-polos.mp4`, lalu `_bahan/watermark.mjs` membakar nomor WA kanan bawah → `hasil.mp4`. Area kanan bawah (x > 1440, y > 880) DIKOSONGKAN dari elemen penting; jangan menaruh HP/badge/caption di sana bila mengubah tata letak.

## Gaya (dikunci)
Terang/clean, latar putih-krem + grid halus, aksen #FF8040 untuk non-teks, teks oranye #D9480F/#E8590C (kontras), teks #0F172A,
League Spartan (judul) + Inter, logo kanan atas, tanpa musik. Ubah tampilan → `gaya.css` + `buat.mjs`, lalu uji `produksi/UJIF3` (semua visual) dengan `--tanpa-render` + snapshot.
