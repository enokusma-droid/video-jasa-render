#!/usr/bin/env bash
# Simpan semua video final (status selesai) ke Directus Nusawebsite/Video/Channel Jasa + katalog video_aset. Aman diulang (nama sama dilewati).
cd "$(dirname "$0")/.."
S=C:/Users/RIFE/.claude/skills/directus-pustaka/simpan.mjs
for row in $(node -e 'console.log(require("./keywords.json").filter(x=>x.status=="selesai").map(x=>x.kode+"|"+x.format+"|"+x.keyword.replace(/ /g,"_")).join(" "))'); do
  IFS='|' read k f kw <<< "$row"; kw=${kw//_/ }; kl=$(echo $k | tr A-Z a-z)
  uc=$(node -e 'try{const n=require("./produksi/'$k'/naskah.json");const b=Array.isArray(n)?n:(n.blok||n.naskah||[]);console.log(b.map(x=>x.teks).join(" ").slice(0,1500))}catch{console.log("")}')
  node $S --brand Nusawebsite --jenis Video --sub "Channel Jasa" --file "produksi/$k/hasil.mp4" --varian "$kl $kw" \
    --deskripsi "Video final channel YouTube Software House by Nusawebsite (format $f, 16:9, watermark WA). Keyword: $kw." \
    --tags "channel-jasa,$kl,$(echo $f | tr A-Z a-z)" --produk "Software House" --kategori lainnya --detik-poster 3 --ucapan "$uc" > "produksi/$k/directus.log" 2>&1
  echo "$k exit $? $(grep -o 'TERSIMPAN[^ ]* [^ ]*\|id=[a-f0-9-]*' produksi/$k/directus.log | head -1)"
done
