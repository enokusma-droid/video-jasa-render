# Brief agent produksi video jasa (channel Nusawebsite Software House)

Kamu memproduksi video YouTube 16:9 untuk daftar KODE yang diberikan, memakai templat yang SUDAH JADI. Jangan ubah templat (`templat/F*/`) kecuali ada bug yang menghalangi; bila mengubah, catat di laporan.

Folder kerja: `E:\Rakazo\growth\video\format-jasa\` (Git Bash, Node 22). Data keyword: `keywords.json` (field kode, keyword, format, status).

## Untuk tiap KODE (berurutan)
1. Baca `templat/<FORMAT>/PANDUAN.md` (sekali di awal) + `templat/HOOK.md` (pola hook).
2. Tulis `produksi/<KODE>/naskah.json` sesuai PANDUAN format itu:
   - Kalimat pertama = hook PERNYATAAN (bukan pertanyaan) yang memuat keyword UTUH. Variasikan pola hook antar video (jangan semua "Hati-hati").
   - Isi relevan dengan keyword (aplikasi / website / company profile / software house + kota: sebut kota secara wajar, Nusawebsite melayani online dari Jogja ke seluruh Indonesia; jangan mengaku punya kantor di kota itu).
   - SETIAP kalimat punya animasi relevan (pilih `anim` yang cocok, variasikan).
   - Panjang sesuai PANDUAN (target 55-70 dtk).
   - Larangan: tanpa harga/angka biaya (juga untuk keyword "murah": bahas efisiensi/fitur sesuai kebutuhan, bukan harga), tanpa "tanpa/tidak maksa|paksa", tanpa em/en dash, tanpa riba (pinjam/kredit/cicilan/koperasi/gadai), tanpa statistik/testimoni/nama klien karangan, tanpa janji durasi angka pasti, nomor/URL tidak diucapkan, jangan menjelekkan kompetitor. CTA sopan: konsultasi gratis, link di deskripsi.
3. Jalankan `node templat/<FORMAT>/buat.mjs <KODE>` (dari folder templat bila PANDUAN begitu). Ini menjalankan TTS (suara Fola, antrean VPS), timing, render (antrean maks 3 render serentak di PC; menunggu slot itu normal), watermark WA, frame, meta.json.
4. LIHAT `produksi/<KODE>/frames/_grid.jpg` (Read tool) + 1-2 frame tambahan di bagian rawan: ejaan, teks tidak terpotong/bertumpuk, animasi relevan, watermark WA kanan bawah tidak menutupi elemen penting, tidak ada banner MODE DEMO. Ada cacat → perbaiki naskah/param lalu render ulang.
5. Cek `meta.json`: judul diawali keyword (≤70 huruf, kapitalisasi rapi), deskripsi kalimat 1 memuat keyword.
6. Set status KODE itu di `keywords.json` → "selesai" (baca-ubah-tulis SEGERA, hanya entri itu; agent lain menulis file yang sama). Gagal permanen → "gagal: <sebab>".

## Larangan
- Jangan upload, commit, posting, atau menyentuh YouTube.
- Jangan menjalankan lebih dari 1 render sekaligus dari dirimu sendiri.
- TTS gagal/QUOTA → tunggu 2-5 mnt lalu ulang (maks 3x), lalu tandai gagal dan lanjut KODE berikutnya.

## Laporan akhir (maks 12 baris)
Tabel KODE | durasi | status | catatan cacat. Plus kendala/bug templat yang ditemukan.

## Tambahan 17 Okt sore (WAJIB dibaca)
- Banyak KODE SUDAH punya `naskah.json` (dan sebagian `vo/vo.wav`, bahkan hasil lama). Baca dulu; pakai ulang bila lolos aturan, perbaiki seperlunya. Jangan tulis ulang dari nol.
- Naskah diubah setelah VO dibuat → jalankan dengan `--ulang-vo` (lihat PANDUAN format). Naskah tidak berubah → jangan TTS ulang.
- KODE bertanda RENDER ULANG: naskah sudah diperbaiki agent sebelumnya; cukup render lagi lalu cek frame di bagian yang diperbaiki.
- Render otomatis pakai GPU + 2 worker lewat `render-antre.sh` (maks 2 render serentak di PC). Menunggu slot itu normal; jalankan buat.mjs dengan run_in_background dan tunggu notifikasi, jangan loop background yang tetap hidup setelah kamu selesai.
- F1: judul/ket lower-third harus jujur sesuai isi klip (lihat PANDUAN F1). F3: label visual `halaman` maks ±14 huruf. Semua format: untuk keyword website/company profile, rapikan `meta.json` (deskripsi & tag jangan bernada "aplikasi"), isi `hook_pola` bila templat belum.
- Naskah ≤145 kata agar durasi 55-70 dtk.
