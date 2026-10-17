# Templat F2 — Cerita Masalah → Solusi (channel JASA Nusawebsite)

Standar owner 17 Okt 2026: SETIAP kalimat VO punya animasi relevan (gaya F3). Kalimat pertama = HOOK PERNYATAAN, bukan pertanyaan.
Bukti: `produksi/J002/hasil.mp4` (74,5 dtk, 13 blok).

## Cara jalan
```bash
cd E:/Rakazo/growth/video/format-jasa
# 1. tulis produksi/<KODE>/naskah.json (lihat contoh di bawah / produksi/J002/naskah.json)
node templat/F2/buat.mjs <KODE> --tanpa-render   # gerbang + TTS + timing + check (cepat, ulang sampai 0 error)
node templat/F2/buat.mjs <KODE>                  # + render (antre maks 3 serentak, ±7 mnt) + frames + meta.json
```
- VO dibuat sekali (suara Fola). Ubah teks VO → `--ulang-tts`. Waktu blok salah → `--ulang-waktu`. Ubah param saja → jalankan lagi tanpa flag (VO dipakai ulang).
- Keluaran: `produksi/<KODE>/hasil.mp4`, `frames/_grid.jpg` (6 frame di 80% blok), `meta.json` (judul ≤70, deskripsi dengan `{{LINK_WA}}`, tag), `check.log`, `waktu.json`.
- Setelah selesai: set `status` entri itu di `keywords.json` menjadi `"selesai"` (hanya entri itu).

## Cek wajib (LIHAT sendiri)
1. `check.log`: 0 error (layout overlap + kontras ikut dicek).
2. Buka `frames/_grid.jpg` + ambil frame tambahan blok lain bila perlu: ejaan, teks tidak terpotong/keluar layar, tidak ada banner MODE DEMO, animasi cocok dengan kalimat.
3. Judul YouTube di `meta.json` masuk akal (keyword di depan). Boleh menimpa lewat `naskah.json` field `judul`, `deskripsi`, `tag`, `ringkasan`.

## Struktur naskah (55-75 dtk, ±130-170 kata, 11-14 blok, 1 blok = 1 kalimat/ide)
1. `hook` — pernyataan yang memuat keyword UTUH. Pola: "Hati-hati memilih X sebelum Y", "Pelajari X sebelum Y", "Jangan Z sebelum X".
2. `tokoh` — "Bayangkan Anda pemilik <niche sesuai keyword>" (toko, sekolah, hotel, kantor, desa, gudang/distributor, restoran, bengkel, toko online).
3. Masalah: `alat_manual` (alat lama) → `tercecer` / `masalah` → `waktu` (waktu terbuang).
4. `titik_balik` — memutuskan bicara dengan software house.
5. Solusi: `banding` (jadi vs custom) → `hp` dan/atau `dashboard` (tema sesuai niche) → `centang` (hasil).
6. `portofolio` — "Kami sudah membangun aplikasi seperti ini, salah satunya DentalCare". Footage klinik HANYA di sini, sebagai contoh portofolio.
7. `chip_niche` (opsional) → `cta` (WAJIB blok terakhir): "Konsultasi gratis, link ada di deskripsi."

Keyword website (company profile, landing page, toko online, website sekolah/desa/hotel): cerita sama, solusi = `dashboard` tema `website`/`pesanan`/`sekolah`/`desa`/`booking`, kata "aplikasi" diganti "website".

## Larangan bahasa (gerbang menolak otomatis sebagian)
Tanpa harga/biaya/angka Rp · tanpa "tanpa/tidak maksa|paksa" · tanpa em/en dash · tanpa riba (cicilan, kredit, pinjam, gadai, koperasi) · tanpa statistik/persen/testimoni karangan · nomor/URL tidak diucapkan · jangan menjelekkan kompetitor · keyword utuh di kalimat pertama · kalimat pertama bukan pertanyaan · cerita = ilustrasi umum, jangan sebut klien nyata. Keyword berisi "murah"/"harga": jangan sebut angka, arahkan ke "sesuai kebutuhan".

## Katalog anim (param; semua teks opsional kecuali ditandai)
Umum: `judul`, `sorot` (kata/array yang dioranyekan), `sub`, `sorot_sub`, `kicker` (label kecil kapital; default per anim).

| anim | param khusus | isi visual |
|---|---|---|
| `hook` | `baris` [1-2 baris judul, baris terakhir oranye], `ikon` [≤4 nama ikon melayang] | judul mask-reveal + ikon melayang |
| `tokoh` | `niche` (ikon), `chip` [{ikon,teks} ≤3] | ilustrasi niche digambar + chip |
| `alat_manual` | `item` [{ikon,judul,sub} 2-4], `coret` (default true), `bawah` | kartu alat lama miring + dicoret merah |
| `masalah` | `item` [teks 2-4] | daftar dengan X merah bergetar |
| `waktu` | `hari` [5 label] | jam berputar + kalender dicoret |
| `tercecer` | `label` [≤10] | kertas beterbangan berserakan |
| `titik_balik` | `kiri`, `kanan` (label) | garis dari cara lama ke aplikasi custom |
| `banding` | `kiri` {judul,item[]}, `kanan` {judul,item[]} | kartu jadi (dicoret) VS custom (centang) |
| `dashboard` | `tema`, `label` (badge) | browser + KPI menghitung + grafik + tabel |
| `hp` | `tema`, `notif` | HP + daftar masuk + notifikasi |
| `portofolio` | `klip` [dash, inv, odon, soap] | footage DentalCare + HP + badge portofolio |
| `centang` | `item` [2-4], `label` | daftar centang hijau + bar kemajuan |
| `chip_niche` | `item` [{ikon,teks}] | chip bidang usaha bermunculan |
| `kutipan` | `teks` (wajib), `sorot` | pernyataan kata demi kata |
| `cta` | `judul`, `sub`, `tombol`, `mini` [label] | Konsultasi Gratis + pil "Link ada di deskripsi" |

Tema dashboard/hp: `stok`, `kasir`, `website`, `booking`, `sekolah`, `kantor`, `desa`, `pesanan` (angka di UI = data contoh, tanpa Rp).
Ikon: toko, sekolah, hotel, kantor, desa, gudang, restoran, bengkel, online, klinik, aplikasi, website, excel, chat, kertas, buku, telepon, jam, kalender, stok, grafik, user, tim, lampu, kunci, cari, laporan, sinkron, peringatan, x, cek, panah, bintang.

Footage portofolio (`templat/F2/aset/`, 1812x756, 7 dtk, bersih tanpa lower-third/watermark; disalin dari F3-alur yang memotongnya dari `_bahan/dentalcare-yt004.mp4`): `dash` dashboard, `inv` invoice, `odon` odontogram, `soap` rekam medis SOAP. Satu blok `portofolio` dibagi rata ke klip yang dipilih (maks 7 dtk per klip).

## Contoh naskah.json (ringkas)
```json
{"blok": [
 {"teks": "Hati-hati memilih jasa pembuatan aplikasi Android dan iOS sebelum Anda paham masalah bisnis Anda sendiri.", "anim": "hook",
  "param": {"kicker": "HATI-HATI SEBELUM MEMILIH", "baris": ["Jasa Pembuatan Aplikasi", "Android dan iOS"], "sub": "Pahami dulu masalah bisnis Anda", "sorot_sub": "masalah bisnis", "ikon": ["aplikasi","chat","excel","kertas"]}},
 {"teks": "Bayangkan Anda pemilik usaha distributor dengan beberapa sales yang berkeliling setiap hari.", "anim": "tokoh",
  "param": {"niche": "gudang", "judul": "Anda pemilik usaha distributor", "sorot": "distributor", "chip": [{"ikon":"tim","teks":"Tim sales"}]}},
 {"teks": "Di kantor, Anda melihat stok, pesanan, dan laporan harian dalam satu dashboard.", "anim": "dashboard",
  "param": {"tema": "stok", "judul": "Semua terlihat di satu dashboard", "sorot": "satu dashboard", "label": "Ilustrasi aplikasi distributor"}},
 {"teks": "Ceritakan alur kerja bisnis Anda. Konsultasi gratis, link ada di deskripsi.", "anim": "cta", "param": {}}
]}
```
Naskah lengkap: `produksi/J002/naskah.json`.

## Berkas templat
`buat.mjs` (generator), `anim.mjs` (pustaka anim + CSS + tema), `waktu.py` (faster-whisper small → batas blok; cadangan silencedetect), `aset/` (font, logo, footage, HP DentalCare).
