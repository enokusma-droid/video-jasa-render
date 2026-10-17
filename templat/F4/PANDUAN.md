# PANDUAN format F4 Checklist (channel JASA Nusawebsite)

Standar owner 17 Okt 2026: **setiap kalimat VO = satu blok dengan animasi relevan** (gaya F3), kanvas penuh, hook PERNYATAAN di kalimat pertama (baca `../HOOK.md`). Oranye teks gelap #D9480F/#E8590C, aksen #FF8040, tanpa musik.

## Cara jalan
```bash
cd E:/Rakazo/growth/video/format-jasa
# 1. tulis produksi/<KODE>/naskah.json (lihat contoh di bawah / produksi/J004/naskah.json)
node templat/F4/buat.mjs <KODE> --tanpa-render   # gerbang + TTS Fola + timing whisper + proyek + hyperframes check
node templat/F4/buat.mjs <KODE>                  # + render (antre maks 3 serentak) + frames/_grid.jpg + meta.json
```
- Opsi: `--ulang-vo` (TTS ulang setelah teks berubah; WAJIB bila `teks` diubah), `--ulang-timing`.
- VO yang sudah ada TIDAK dibuat ulang otomatis. Mengubah `param` saja (tampilan) tidak perlu TTS ulang.
- Gerbang menolak: larangan bahasa, keyword tidak utuh di kalimat pertama, kalimat pertama berupa pertanyaan, anim tak dikenal, blok terakhir bukan `cta`, jumlah kata di luar 110-185.
- `hyperframes check` error > 0 = berhenti (lihat `check.log`). Peringatan kontras untuk angka garis luar `ap-o` memang disengaja.
- Hasil: `produksi/<KODE>/hasil.mp4`, `frames/f1..f6 + _grid.jpg`, `meta.json` (judul ≤70, deskripsi dengan `{{LINK_WA}}`, tag, durasi, hook_pola), `timing.json`, `vo/vo.wav`.
- Setelah selesai: ubah `status` entri KODE di `keywords.json` menjadi `"selesai"` (hanya entri itu).

## Struktur naskah (55-70 dtk, ±130-170 kata, 12-15 blok)
1. **Hook** (`hook-peringatan`): pola dari HOOK.md, keyword utuh di kalimat pertama, tanpa tanda tanya.
2. **Taruhan** (`teks-besar` / `red-flag` / `benar-salah`): kenapa penting (akibat bila dilewati), tanpa angka karangan.
3. **4-5 poin**, tiap poin = 2 blok: `angka-poin` ("Pertama, ...") lalu blok bukti visual yang relevan.
4. **Rekap** (`rekap`): semua poin dicentang satu per satu.
5. **CTA** (`cta`): "Konsultasi gratis bersama Nusawebsite, link ada di deskripsi."

Pilih poin sesuai keyword (jangan sama semua video):
- aplikasi (android/ios/kasir/pos/akuntansi/marketplace): portofolio bisa dicoba, mockup disetujui, alur bisnis dipetakan, kode/akun/data milik Anda, uji di perangkat, pendampingan rilis/update, integrasi (printer struk, laporan), keamanan data & cadangan.
- website (wordpress, perusahaan, toko online, landing page, hotel/sekolah/desa, kota): contoh situs nyata, mockup halaman, cepat di HP, siap SEO dasar, domain & hosting atas nama Anda, mudah diedit sendiri, pendampingan/maintenance.
- company profile: tujuan jelas (dipercaya calon klien), foto/konten asli, struktur halaman, kontak WA mudah, tampil rapi di HP.
- software house (+kota): portofolio nyata, proses kerja transparan, komunikasi rutin, kepemilikan kode, dukungan setelah rilis, bisa bertemu/berbasis kota itu (jangan klaim kantor di kota yang tidak ada; Nusawebsite berbasis Jogja, melayani online).

## Katalog animasi (`anim` + `param`)
| anim | param | pakai untuk |
|---|---|---|
| `hook-peringatan` | `judul`, `sorot` (kata yang dioranyekan, dipisah spasi), `ikon` (peringatan/stop/silang memunculkan pita bergaris di bawah; lainnya tidak), `kicker?` | kalimat pertama |
| `teks-besar` | `teks`, `sorot?`, `ikon?`, `kicker?`, `sub?` | pernyataan umum, taruhan |
| `angka-poin` | `judul`, `sorot?`, `sub?`, `n?` (otomatis 01..) | judul tiap poin; mengisi bar progres bawah |
| `judul-poin` | `judul`, `sorot?`, `kicker?`, `sub?` | judul besar tengah tanpa angka |
| `bukti-footage` | `klip` (string atau array, maks ±7 dtk per klip), `perangkat` ("browser"/"keduanya" = + HP), `label?`, `judul?`, `kicker?`, `bar?`, `sorot_titik?` [x,y 0-1] | bukti portofolio DentalCare |
| `wireframe-disetujui` | `judul?`, `stempel?` | mockup → layar asli + stempel DISETUJUI |
| `kepemilikan` | `judul?`, `item` [{ikon, judul, sub}] maks 3, `badge?` | kode/data/akun milik klien |
| `alur` | `judul?`, `langkah` [maks 5], `ikon?` [nama ikon per langkah] | tahapan, pendampingan |
| `papan-progres` | `judul?`, `kolom` [{judul, item[]}] 3 kolom, `persen?` 0-1 | komunikasi/laporan progres, pengujian |
| `benar-salah` | `judul?`, `salah`, `benar`, `label_salah?`, `label_benar?` | perbandingan |
| `red-flag` | `judul`, `item` [maks 4], `kicker?` | tanda bahaya |
| `centang-besar` | `teks`, `sorot?`, `sub?` | penegasan satu poin |
| `rekap` | `judul?`, `kicker?`, `item` [maks 6; >3 jadi 2 kolom] | rekap checklist |
| `ikon-grid` | `judul?`, `item` [{ikon, label}] maks 6 | jenis bisnis/fitur/platform |
| `cta` | `judul?`, `sorot?`, `sub?`, `tombol?`, `pil?`, `kicker?` | blok terakhir |

Ikon: peringatan, silang, stop, cek, kode, data, kunci, chat, hp, laptop, toko, klinik, gudang, sekolah, hotel, grafik, jam, orang, dokumen, gear, roket, bintang, globe, keranjang, rumah, kalender, bendera, wa, palet, perisai, kacamata, tangan.

Teks di param = ringkas (judul ≤ 45 huruf, item ≤ 24 huruf); ukuran huruf mengecil otomatis bila panjang.

## Klip footage DentalCare (`templat/F4/aset/`, 1812x756, 7 dtk, bersih tanpa lower-third/kartu)
| klip | isi | sumber `_bahan/dentalcare-yt004.mp4` |
|---|---|---|
| `dash` | dashboard grafik pendapatan | potongan F3 (±5-20 dtk) |
| `pasien` | daftar data pasien | 45-52 dtk, crop 1812:756:54:108 |
| `antrean` | antrean hari ini, tombol panggil | 60-67 dtk, crop sama |
| `soap` | rekam medis SOAP | potongan F3 (±70-85 dtk) |
| `odon` | odontogram | potongan F3 (±90-100 dtk) |
| `inv` | invoice | potongan F3 (±125-140 dtk) |
Bagian lain sumber (kartu teks 25-38, 140-150, rekap 2:25-2:45) JANGAN dipakai. Klip baru: crop `1812:756:54:108` hanya untuk bagian yang tidak di-zoom.
Label wajib "Contoh dari portofolio kami: DentalCare" (bawaan) agar jujur bahwa itu contoh klinik.

## Larangan bahasa (gerbang + cek manual)
Tanpa harga/angka biaya/"murah" (kecuali bagian keyword), tanpa "tanpa/tidak maksa|paksa", tanpa em/en dash, tanpa riba (pinjam, kredit, cicilan, koperasi, gadai), tanpa statistik/testimoni karangan, tanpa janji durasi angka pasti, nomor/URL tidak diucapkan, jangan menjelekkan kompetitor, tokoh manusia wanita tanpa hijab, CTA sopan.

## Cek frame (WAJIB lihat sendiri)
Buka `produksi/<KODE>/frames/_grid.jpg` (+ ambil frame tambahan bila ragu: `ffmpeg -ss <t> -i hasil.mp4 -frames:v 1 x.png`). Periksa: ejaan, teks tidak terpotong/bertumpuk, footage tidak menampilkan "MODE DEMO", elemen mengisi layar, animasi sesuai kalimat (lihat `timing.json`).

## Contoh naskah.json
```json
{
 "hook_pola": "jangan-sebelum",
 "judul": "Jasa Pembuatan Aplikasi iOS: Cek 5 Hal Ini Sebelum Mulai Proyek",
 "blok": [
  {"teks": "Jangan mulai proyek jasa pembuatan aplikasi iOS sebelum mengecek lima hal ini.", "anim": "hook-peringatan", "param": {"judul": "Jangan mulai proyek aplikasi iOS sebelum cek 5 hal ini", "sorot": "5 hal ini", "ikon": "peringatan"}},
  {"teks": "Pertama, portofolio nyata yang bisa dicoba.", "anim": "angka-poin", "param": {"judul": "Portofolio nyata yang bisa dicoba", "sorot": "nyata"}},
  {"teks": "Minta demo aplikasi yang benar-benar jalan, seperti sistem klinik gigi buatan kami ini.", "anim": "bukti-footage", "param": {"klip": ["dash", "antrean"], "perangkat": "keduanya"}},
  {"teks": "Ceritakan kebutuhan aplikasi iOS bisnis Anda. Konsultasi gratis bersama Nusawebsite, link ada di deskripsi.", "anim": "cta", "param": {"sub": "Ceritakan kebutuhan aplikasi iOS bisnis Anda"}}
 ]
}
```
Contoh lengkap 14 blok: `produksi/J004/naskah.json`.
