#!/usr/bin/env python3
"""Generate the missing product photos from tools/image-prompts.json.

Uses the OpenAI Images API (needs OPENAI_API_KEY). Existing photos are skipped,
so it is safe to re-run. Output: assets/img/products/<id>.jpg and assets/img/site/<name>.jpg

    pip install pillow
    OPENAI_API_KEY=sk-... python3 tools/generate_images.py
"""
import base64, io, json, os, sys, urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
cfg = json.loads((ROOT / "tools/image-prompts.json").read_text())
key = os.environ.get("OPENAI_API_KEY") or sys.exit("Set OPENAI_API_KEY")

jobs = [(ROOT / f"assets/img/products/{pid}.jpg", cfg["prefix"] + subj + cfg["style"]) for pid, subj in cfg["subjects"].items()]
jobs += [(ROOT / f"assets/img/site/{name}.jpg", prompt) for name, prompt in cfg["site"].items()]

for out, prompt in jobs:
    if out.exists():
        continue
    print("generating", out.relative_to(ROOT))
    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=json.dumps({"model": "gpt-image-1", "prompt": prompt, "size": "1536x1024", "quality": "high"}).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    data = json.load(urllib.request.urlopen(req, timeout=300))
    img = Image.open(io.BytesIO(base64.b64decode(data["data"][0]["b64_json"]))).convert("RGB")
    img.thumbnail((1600, 1600))
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "JPEG", quality=84, optimize=True, progressive=True)
