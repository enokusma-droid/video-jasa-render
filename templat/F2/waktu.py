# Timing per blok naskah dari VO: faster-whisper (word timestamps), cadangan silencedetect/proporsi huruf.
# Pakai: py -3.10 waktu.py <vo.wav> <naskah-teks.json (array string)> <keluar.json>
import json, re, subprocess, sys

wav, src, out = sys.argv[1:4]
blok = json.load(open(src, encoding="utf-8"))
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav]).decode().strip())
norm = lambda s: re.findall(r"[a-z0-9]+", s.lower())
nkata = [max(1, len(norm(b))) for b in blok]
hasil = {"durasi": dur, "metode": None, "blok": []}

def simpan(batas):
    # batas = daftar waktu mulai tiap blok (len = n), blok terakhir berakhir di dur
    for i, t in enumerate(batas):
        akhir = batas[i + 1] if i + 1 < len(batas) else dur
        hasil["blok"].append({"mulai": round(t, 3), "akhir": round(akhir, 3)})
    json.dump(hasil, open(out, "w", encoding="utf-8"), indent=1)

try:
    from faster_whisper import WhisperModel
    try:  # GPU dulu (owner 17 Okt: maksimalkan GPU), jatuh ke CPU
        m = WhisperModel("small", device="cuda", compute_type="int8_float32")
    except Exception:
        m = WhisperModel("small", device="cpu", compute_type="int8")
    segs, _ = m.transcribe(wav, language="id", word_timestamps=True, vad_filter=False)
    kata = [w for s in segs for w in (s.words or [])]
    if len(kata) < sum(nkata) * 0.5:
        raise RuntimeError("kata whisper terlalu sedikit")
    W, T = len(kata), sum(nkata)
    batas, kum = [0.0], 0
    for n in nkata[:-1]:
        kum += n
        j = min(W - 1, max(1, round(kum * W / T)))
        # batas = tengah jeda antara kata j-1 dan j
        batas.append((kata[j - 1].end + kata[j].start) / 2)
    hasil["metode"] = "whisper"
    hasil["kata"] = [[round(w.start, 2), round(w.end, 2), w.word.strip()] for w in kata]
    simpan(batas)
except Exception as e:
    print("whisper gagal:", e, "-> silencedetect", file=sys.stderr)
    log = subprocess.run(["ffmpeg", "-i", wav, "-af", "silencedetect=noise=-35dB:d=0.25", "-f", "null", "-"], capture_output=True, text=True).stderr
    jeda = [(float(a) + float(b)) / 2 for a, b in zip(re.findall(r"silence_start: ([\d.]+)", log), re.findall(r"silence_end: ([\d.]+)", log))]
    T, kum, batas = sum(nkata), 0, [0.0]
    for n in nkata[:-1]:
        kum += n
        target = dur * kum / T
        dekat = min(jeda, key=lambda x: abs(x - target)) if jeda else target
        batas.append(dekat if abs(dekat - target) < 2.5 and dekat > batas[-1] + 0.8 else target)
    hasil["metode"] = "silencedetect"
    simpan(batas)
print(hasil["metode"], len(hasil["blok"]), "blok", round(dur, 2), "dtk")
