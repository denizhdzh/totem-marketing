"""Tighten a voiceover and keep word timings exact.

usage: python3 pipeline/vo_tighten.py <in.mp3> <words.json> <out.mp3> <out_words.ts> [--gap 0.28] [--tempo 1.06]

words.json = the `words` array from the ElevenLabs transcription
             ([{"text","start","end"}...] or [[text,start,end]...]).
Pauses longer than --gap are shortened to --gap, then audio is sped up by --tempo (pitch kept).
Writes out_words.ts exporting WORDS: [word, start, end][] in the final timeline.
"""
import json, subprocess, sys, wave
import numpy as np

args = sys.argv[1:]
src, wpath, dst, ts_out = args[:4]
gap = float(args[args.index("--gap") + 1]) if "--gap" in args else 0.28
tempo = float(args[args.index("--tempo") + 1]) if "--tempo" in args else 1.06

raw = json.load(open(wpath))
words = [[w["text"], w["start"], w["end"]] if isinstance(w, dict) else w for w in raw if (not isinstance(w, dict) or w.get("type", "word") == "word")]
sr = 44100
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", src, "-ac", "1", "-ar", str(sr), "/tmp/_vo.wav"], check=True)
w = wave.open("/tmp/_vo.wav"); a = np.frombuffer(w.readframes(w.getnframes()), np.int16)

segs, cur, prev_end = [], 0.0, 0.0
for i, (_, s, e) in enumerate(words):
    if i > 0 and s - prev_end > gap:
        segs.append((cur, prev_end + gap / 2)); cur = s - gap / 2
    prev_end = e
segs.append((cur, len(a) / sr))
out = np.concatenate([a[int(x * sr):int(y * sr)] for x, y in segs])
with wave.open("/tmp/_vo_cut.wav", "wb") as o:
    o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr); o.writeframes(out.tobytes())
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", "/tmp/_vo_cut.wav", "-af", f"atempo={tempo}", "-ar", str(sr), "-b:a", "192k", dst], check=True)

def remap(t):
    acc = 0.0
    for x, y in segs:
        if t <= y: return (acc + max(0.0, t - x)) / tempo
        acc += y - x
    return acc / tempo

final = [[t, round(remap(s), 3), round(remap(e), 3)] for t, s, e in words]
open(ts_out, "w").write("// [word, start, end] in seconds, final timeline\nexport const WORDS: [string, number, number][] = " + json.dumps(final) + ";\n")
print(f"duration {len(out) / sr / tempo:.2f}s, {len(final)} words -> {dst}, {ts_out}")
for i, (t, s, e) in enumerate(final):
    print(i, t, s, e)
