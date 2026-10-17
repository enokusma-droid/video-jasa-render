# Unggah hasil satu KODE ke G3 bucket konten: jasa/<KODE>/ (hasil.mp4, hasil-polos.mp4, meta.json, vo/vo.wav, waktu*.json, frames/*)
import os, sys, glob, boto3
from botocore.config import Config
d = sys.argv[1].rstrip("/"); kode = os.path.basename(d)
s3 = boto3.client("s3", endpoint_url=os.environ["S3_ENDPOINT"], aws_access_key_id=os.environ["S3_ACCESS_KEY"],
                  aws_secret_access_key=os.environ["S3_SECRET"], region_name=os.environ.get("S3_REGION", "auto"),
                  config=Config(s3={"addressing_style": "path"}))
pola = ["hasil.mp4", "hasil-polos.mp4", "meta.json", "naskah.json", "vo/vo.wav", "waktu*.json", "timing.json", "frames/*"]
n = 0
for p in pola:
    for f in glob.glob(os.path.join(d, p)):
        if os.path.isfile(f):
            key = f"jasa/{kode}/" + os.path.relpath(f, d).replace("\\", "/")
            ct = "video/mp4" if f.endswith(".mp4") else "audio/wav" if f.endswith(".wav") else "image/jpeg" if f.endswith((".jpg", ".jpeg")) else "image/png" if f.endswith(".png") else "application/json"
            s3.upload_file(f, "konten", key, ExtraArgs={"ContentType": ct}); n += 1
print(f"G3: {n} berkas → konten/jasa/{kode}/")
if not os.path.exists(os.path.join(d, "hasil.mp4")): sys.exit("hasil.mp4 tidak ada")
