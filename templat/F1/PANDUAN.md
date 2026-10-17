# Templat F1 "Bedah Portofolio" (channel JASA Nusawebsite)

Video 55-70 dtk, 1920x1080 30 fps, VO Fola satu job, tanpa musik, gaya terang Nusawebsite, watermark WA kanan bawah.
Standar owner 17 Okt 2026: SETIAP blok (kalimat) VO = satu scene dengan animasi relevan (gaya F3). Hook = pernyataan, BUKAN pertanyaan.

## Cara menjalankan (dari `growth/video/format-jasa`)
1. Pastikan entri ada di `keywords.json` (kode, keyword, format F1).
2. Tulis `produksi/<KODE>/naskah.json` (lihat struktur di bawah).
3. `node templat/F1/buat.mjs <KODE> --tanpa-render` → gerbang naskah + TTS + timing + proyek + `check` (lihat `produksi/<KODE>/check.log`, harus `0 error`).
4. `node templat/F1/buat.mjs <KODE>` → render (antre maks 3 slot PC, ±4-5 mnt per video) → `hasil-polos.mp4` → watermark → `hasil.mp4` + `frames/_grid.jpg` + `meta.json`.
- Opsi: `--ulang-vo` (naskah diubah → VO baru; tanpa ini generator MENOLAK naskah yang beda dari VO), `--ulang-waktu` (hitung ulang timing).
- VO tidak dibuat ulang kalau `vo/vo.wav` ada. Timing = faster-whisper `small` (Python310) dijajarkan ke kata naskah; cadangan silencedetect (`waktu.json` → `sumber`).
- Selesai: ubah HANYA status entri Anda di `keywords.json` → `"selesai"` (file dipakai bersama).

## Struktur naskah F1 (±130-170 kata, 11-14 blok)
| Urut | Isi | anim yang cocok |
|---|---|---|
| 1 | HOOK pernyataan, keyword UTUH di kalimat ini ("Jangan pilih X sebelum melihat Y", "Hati-hati Z sebelum X", "Pelajari X sebelum Y") | `hook` |
| 2-3 | Masalah cara manual + akibatnya | `kartu-coret`, `ikon-masalah` |
| 4-5 | Portofolio: "Ini DentalCare, aplikasi … yang kami bangun" + "ada tiga fitur" | `footage-browser`, `angka-besar` |
| 6-8 | 3 fitur dibedah, bernomor 01-03 | `footage-browser` (nomor + sorot) |
| 9 | Hasil/perubahan | `perbandingan`, `daftar-centang` |
| 10 | Bisa disesuaikan untuk NICHE keyword (toko, sekolah, hotel, …) | `chip-niche`, `fitur-grid` |
| 11-12 | Cara kerja / akses (mockup disetujui, buka dari HP) | `wireframe-ui`, `footage-hp`, `diagram-alur` |
| 13 | CTA konsultasi gratis, "link ada di deskripsi" | `cta` |

Variasikan pilihan anim antar video (jangan urutan identik semua). Satu blok = 1-2 kalimat (±2-7 dtk). Blok < 2 dtk terlalu cepat untuk animasi.

## naskah.json
```json
{
 "meta": { "judul": "≤70 huruf, keyword di depan (opsional)", "ringkas": "kalimat deskripsi (opsional)", "tag": ["tambahan"] },
 "blok": [
  { "teks": "Jangan pilih jasa pembuatan aplikasi sebelum melihat aplikasi yang benar-benar mereka bangun.",
    "anim": "hook", "param": { "judul": "Jangan pilih *sebelum melihat* buktinya.", "sub": "Lihat aplikasi yang *benar-benar* dibangun." } },
  { "teks": "Pertama, antrean. Petugas memanggil pasien sesuai urutan.", "anim": "footage-browser",
    "param": { "klip": "antrean", "kicker": "Bedah fitur DentalCare", "nomor": "01", "judul": "Antrean pasien", "ket": "Dipanggil sesuai urutan",
               "fokus": [90, 47], "zoom": 1.12, "sorot": { "x": 85.5, "y": 40, "w": 9, "h": 13, "label": "Panggil sesuai urutan" } } }
 ]
}
```
Contoh lengkap terbukti: `produksi/J001/naskah.json`. `*kata*` = sorot oranye. Elemen (kartu, chip, item) muncul TEPAT saat kata pertamanya diucapkan
(pencocokan kata blok); kalau kata tidak diucapkan, muncul berurutan merata. Jadi tulis label yang memakai kata dari kalimat VO.

## Katalog anim (14)
| anim | param | visual |
|---|---|---|
| `hook` | judul, sub?, pill? (default keyword), gambar? (false = tanpa kartu UI), ukuran? | pil keyword pop, judul naik per kata, garis oranye, kartu UI + HP melayang |
| `kartu-coret` | kicker?, judul, kartu[{ikon, judul, ket}] 2-4, coret? (kata pemicu), akibat?[] | kartu cara manual masuk, lalu dicoret merah + abu |
| `ikon-masalah` | kicker?, judul, sub?, ikon?, masalah[{ikon, teks}] 2-4 | ikon peringatan bergetar, kartu masalah bercabang + goyang |
| `footage-browser` | klip, kicker?, nomor?, ikon?, judul, ket?, fokus [x%,y%], zoom (1.05-1.15), url?, sorot?{x,y,w,h (% video), label} | footage asli di bingkai browser, push-in ke titik fokus, lower-third bernomor, kotak sorot berdenyut |
| `footage-hp` | kicker?, judul, ket?, poin[] 0-3, notif?, ikonNotif? | HP (layar asli DentalCare) naik, poin centang, notifikasi pop |
| `daftar-centang` | kicker?, judul, item[] 2-6, gambar? (true = kartu kanan) | baris muncul + centang hijau tergambar |
| `chip-niche` | kicker?, judul, sub?, pusat?, ikonPusat?, chip[{ikon, teks}] 3-6 (terakhir disorot) | hub "Aplikasi" + garis ke chip niche |
| `diagram-alur` | kicker?, judul, langkah[{ikon, teks}] 3-5 | kotak + panah tergambar, titik berjalan |
| `angka-besar` | angka (bukan statistik), kicker?, label, ket?, item[]? | lingkaran tergambar, angka menghitung naik |
| `perbandingan` | judul?, kiri{judul, item[]}, kanan{judul, item[]}, pemicu? (kata VO saat kolom kanan muncul; paling lambat 50% blok) | kolom manual (abu, X) vs aplikasi (oranye, centang), VS berputar |
| `kutipan-sorot` | teks, atribusi?, ukuran? | tanda kutip, kata muncul mengikuti VO, stabilo di kata *sorot* |
| `wireframe-ui` | kicker?, judul, ket?, jadi (kata pemicu), stempel?, url? | kerangka mockup tersusun → layar asli + stempel |
| `fitur-grid` | kicker?, judul, fitur[{ikon, teks, ket?}] 3-6 | kartu fitur pop dengan ikon memantul |
| `cta` | kicker?, judul, sub?, tombol?, catatan?, ukuran? | judul per kata, tombol pop, kursor klik + riak, tombol berdenyut |

Ikon: buku excel chat kertas jam stok laporan user toko gudang sekolah klinik kode hp web cek x kalender gembok gear roket grafik cari alert layar layer truk resto sync bintang printer rumah pena.

## Footage DentalCare (`footage.json`, dipotong otomatis dari `_bahan/dentalcare-yt004.mp4`, crop jendela aplikasi 1808x761)
| klip | detik sumber | isi |
|---|---|---|
| dashboard | 3-20 | kartu pendapatan, grafik tren, demografi |
| dashboard2 | 172-182 | stok rendah, leaderboard dokter |
| pasien | 46-57 | tabel data pasien |
| antrean | 59-68 | antrean hari ini, tombol Panggil (sorot x85.5 y40 w9 h13) |
| soap | 70-86 | rekam medis SOAP diketik |
| odontogram | 87-100 | peta gigi |
| tindakan | 102-112 | tindakan & resep |
| konfirmasi | 113-124 | konfirmasi kunjungan |
| invoice | 130,5-134 | daftar invoice (pendek 3,5 dtk, diperlambat otomatis; 125-130 ternyata antrean/konfirmasi) |
| invoice-detail | 134-142 | detail invoice siap cetak |
Dihindari: 0-2 (judul), 23-41 & 142-168 (kartu teks), 182+ (kartu WA). Blok lebih panjang dari klip → klip diperlambat otomatis (peringatan bila > 1,7x).
**Judul/ket lower-third WAJIB jujur sesuai isi klip** (CEO 17 Okt: J009 "Daftar transaksi" di atas klip pemeriksaan medis = salah). Boleh dibahasakan umum ("Konfirmasi sebelum simpan"), tidak boleh mengaku fitur lain. CTA: kursor jangan berhenti di atas teks tombol.
Angka Rp di UI demo boleh (data contoh), tapi VO/teks layar tidak menyebut harga.

## Larangan bahasa (gerbang `buat.mjs` menolak)
Tanpa harga/biaya/tarif/murah/diskon/juta/ribu (kecuali di dalam keyword), tanpa "tanpa/tidak maksa|paksa", tanpa em/en dash, tanpa riba
(cicilan, kredit, pinjam, bunga, gadai, koperasi), tanpa URL/nomor diucapkan, tanpa persen/statistik/testimoni karangan, keyword UTUH di blok 1,
kalimat pertama BUKAN pertanyaan. Juga (tidak dicek mesin): jangan menjelekkan kompetitor, tidak menyebut nama klien nyata selain DentalCare (produk kami),
tokoh manusia wanita tanpa hijab, CTA sopan.

## Tata letak
Area kanan bawah ±460x180 px DIKOSONGKAN untuk watermark WA (semua anim sudah menghindarinya). Logo kanan atas otomatis. Jangan menaruh teks penting di sana.

## Cek frame (WAJIB, lihat sendiri)
Buka `produksi/<KODE>/frames/_grid.jpg` (6 frame di 75% tiap scene terpilih). Cek: ejaan, teks tidak terpotong/tumpang tindih, footage tidak menampilkan
banner MODE DEMO/kartu teks lama, animasi tiap blok berbeda & relevan dengan kalimatnya, watermark tidak menutupi apa pun.
Butuh detik lain: `ffmpeg -ss <dtk> -i hasil.mp4 -frames:v 1 x.png`. Waktu tiap blok ada di `waktu.json` (+0,4 dtk offset VO).

## Keluaran `meta.json`
`{kode, keyword, format, judul, deskripsi (keyword di kalimat 1, CTA + {{LINK_WA}}), tag (≤12), durasi, kata, waktu}`. Bab otomatis bila blok diberi `"bab"` (≥3, mulai 0:00).
