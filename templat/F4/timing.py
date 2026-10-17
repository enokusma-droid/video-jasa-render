# Waktu mulai/akhir tiap blok naskah dari VO (faster-whisper word timestamps; cadangan proporsional jumlah huruf).
# Pakai: python timing.py <vo.wav> <naskah_blok.json> <keluar.json>
import json, re, sys, difflib, subprocess

wav, src, out = sys.argv[1:4]
blok = json.load(open(src, encoding="utf-8"))
norm = lambda s: re.sub(r"[^a-z0-9]+", " ", s.lower()).split()
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav], text=True).strip())

tok, owner = [], []
for i, b in enumerate(blok):
    for w in norm(b["teks"]):
        tok.append(w); owner.append(i)

words, metode = [], "whisper"
try:
    from faster_whisper import WhisperModel
    try:  # GPU dulu (owner 17 Okt: maksimalkan GPU), jatuh ke CPU
        m = WhisperModel("small", device="cuda", compute_type="int8_float32")
    except Exception:
        m = WhisperModel("small", device="cpu", compute_type="int8")
    segs, _ = m.transcribe(wav, language="id", word_timestamps=True, initial_prompt=" ".join(b["teks"] for b in blok)[:800])
    for s in segs:
        for w in s.words or []:
            for t in norm(w.word):
                words.append((t, w.start, w.end))
except Exception as e:
    print("whisper gagal:", e, file=sys.stderr); metode = "proporsional"

starts = [None] * len(blok); ends = [None] * len(blok)
if words:
    sm = difflib.SequenceMatcher(a=tok, b=[w[0] for w in words], autojunk=False)
    map_ = {}
    for a, b2, n in sm.get_matching_blocks():
        for k in range(n): map_[a + k] = b2 + k
    for i in range(len(blok)):
        idx = [j for j, o in enumerate(owner) if o == i]
        hit = sorted(map_[j] for j in idx if j in map_)
        # buang hit pencilan di tepi (kata sama milik blok tetangga, mis. "halaman"): lompatan > 3 kata
        while len(hit) > 2 and hit[1] - hit[0] > 3: hit.pop(0)
        while len(hit) > 2 and hit[-1] - hit[-2] > 3: hit.pop()
        if len(hit) >= max(1, len(idx) // 4):
            starts[i] = words[min(hit)][1]; ends[i] = words[max(hit)][2]
    cocok = len(map_) / max(1, len(tok))
    if cocok < 0.5: metode = "proporsional"; starts = [None] * len(blok)
else:
    cocok = 0

# isi yang kosong secara proporsional jumlah huruf
huruf = [max(1, len(b["teks"])) for b in blok]; tot = sum(huruf); acc = 0
for i in range(len(blok)):
    p0 = acc / tot * dur; acc += huruf[i]; p1 = acc / tot * dur
    if starts[i] is None: starts[i] = p0
    if ends[i] is None: ends[i] = p1
for i in range(1, len(blok)):
    if starts[i] < ends[i - 1] - 0.1 and ends[i - 1] < ends[i]: starts[i] = ends[i - 1] - 0.1  # jangan mulai sebelum blok sebelumnya selesai diucapkan
    if starts[i] < starts[i - 1] + 0.8: starts[i] = starts[i - 1] + 0.8
starts[0] = 0.0
json.dump({"metode": metode, "cocok": round(cocok, 3), "durasi": round(dur, 3),
           "blok": [{"start": round(starts[i], 2), "end": round(ends[i], 2)} for i in range(len(blok))]},
          open(out, "w", encoding="utf-8"), indent=1)
print(metode, "cocok", round(cocok, 3), "durasi", round(dur, 2))
