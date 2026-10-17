#!/usr/bin/env bash
# Batasi render HyperFrames serentak di PC: maks 1 slot (owner 17 Okt malam: CPU penuh). Pakai: bash render-antre.sh <perintah render...>
# Render hyperframes otomatis memakai GPU (encode NVENC + Chrome GPU, GTX 1050 Ti) dan 2 worker; flag -w/--workers bawaan pemanggil dibuang.
SLOT_DIR="$(cd "$(dirname "$0")" && pwd)/.slot"
mkdir -p "$SLOT_DIR"
ARGS=()
IS_RENDER=0; hf=0
for a in "$@"; do case "$a" in hyperframes|hyperframes@*) hf=1;; render) [ $hf = 1 ] && IS_RENDER=1;; esac; done   # juga bentuk "npx --yes hyperframes@x render" (F1)
if [ $IS_RENDER = 1 ]; then
  skip=0
  for a in "$@"; do
    if [ $skip = 1 ]; then skip=0; continue; fi
    case "$a" in -w|--workers) skip=1; continue;; --workers=*|--gpu|--browser-gpu) continue;; esac
    ARGS+=("$a")
  done
  if [ -n "$JASA_CPU" ]; then ARGS+=(-w "${JASA_WORKERS:-auto}"); else ARGS+=(--gpu --browser-gpu -w 2); fi   # JASA_CPU = runner CI tanpa GPU
else
  ARGS=("$@")
fi
while true; do
  for i in 1; do
    if mkdir "$SLOT_DIR/$i" 2>/dev/null; then
      trap 'rmdir "$SLOT_DIR/$i"' EXIT
      "${ARGS[@]}"; exit $?
    fi
  done
  sleep 15
done
