# Brief batch 3 (29 Okt 2026): NASKAH + VO saja (render nanti di CI oleh CEO)

Baca dulu `_bahan/BRIEF-PRODUKSI.md` (aturan naskah, larangan, hook) — langkah 1-2 di sana BERLAKU. Langkah 3-6 DIGANTI dengan yang di bawah.

Folder kerja: `E:\Rakazo\growth\video\format-jasa\` (Git Bash, Node 22). Tulis output hanya di folder ini (`produksi/<KODE>/`). Jangan menulis di luar workspace E:\Rakazo.

## Untuk tiap KODE
1. Baca `templat/<FORMAT>/PANDUAN.md` + `templat/HOOK.md` (sekali per format). Lihat 2-3 contoh naskah.json lulus dengan format sama di `produksi/` (J0xx untuk jasa, G0xx untuk gigi) supaya struktur & panjang sama.
2. Tulis `produksi/<KODE>/naskah.json` (≤145 kata, target 55-70 dtk, hook pernyataan memuat keyword utuh, pola hook bervariasi antar video, setiap kalimat punya `anim` relevan & bervariasi).
3. Jalankan `node templat/<FORMAT>/buat.mjs <KODE> --tanpa-render` → gerbang bahasa, TTS (suara Fola, antrean VPS, bisa menunggu lama), timing, proyek HyperFrames, check. Jalankan dengan run_in_background, MAKS 3 KODE bersamaan dari dirimu; tunggu notifikasi, jangan polling sleep.
4. Lulus bila: `produksi/<KODE>/vo/vo.wav` ada, durasi wav 50-75 dtk (`ffprobe`), check tanpa error. Gerbang menolak → perbaiki naskah lalu ulang (naskah berubah setelah VO ada → `--ulang-tts`). TTS gagal/kuota → tunggu 2-5 mnt, ulang maks 3x, lalu catat gagal dan lanjut.
5. JANGAN ubah `keywords.json` (CEO yang menandai status). JANGAN render, upload, commit, atau menyentuh YouTube.

## Khusus channel GIGI (G)
- Penonton = dokter gigi / pemilik / staf klinik. Produk = aplikasi klinik DentalCare buatan Nusawebsite (rekam medis, odontogram, jadwal, kasir, komisi dokter). Banyak keyword bersifat informasi (contoh, cara mengisi, simbol odontogram, dasar hukum RME): jawab pertanyaannya dengan benar dan praktis, lalu jembatani wajar ke aplikasi.
- Jangan mengarang nomor peraturan, pasal, tanggal tenggat, angka statistik, atau nama klien. Regulasi cukup disebut umum ("aturan Kemenkes tentang rekam medis elektronik") kecuali kamu YAKIN (mis. Permenkes 24 Tahun 2022 memang tentang rekam medis). Simbol/istilah odontogram harus benar secara klinis; ragu → bahas di tingkat umum.
- Keyword non-gigi (klinik bidan, apotek, rumah sakit, puskesmas): bahas kebutuhan klinik itu, sebut Nusawebsite bisa membuatkan sistem sesuai kebutuhan; jangan klaim DentalCare dipakai bidan/RS.

## Laporan akhir (maks 12 baris)
Tabel KODE | durasi VO | status (ok / gagal: sebab). Plus kendala templat.
