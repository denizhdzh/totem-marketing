import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import "../brand";
import { SANS, SERIF } from "../brand";

// ── Short-form kit (owner-approved 22 Oct 2026 after the first analytics) ──────────────────
// Every reel is 15–20 s and must survive the first second: the hook is fully readable on frame 0,
// something is already moving, type is heavy enough to read at phone size, and the last beat
// returns to the opening image so the video loops.

export const IVORY = "#EDE6D6";
export const IVORY_SOFT = "rgba(237,230,214,0.62)";
export const BLUSH = "#F0B8A6";
export const BG = "#141318";

/** Areas TikTok / Reels UI covers. Keep text and key visuals inside SAFE. */
export const SAFE = { top: 230, bottom: 1500, left: 70, right: 930 } as const;

export type Word = [string, number, number];
export type Phrase = { from: number; to: number; accent?: number[] };

export const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const ramp = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], { ...cl, easing: e });
export const timing = (words: Word[]) => ({ S: (i: number) => words[i][1], E: (i: number) => words[i][2], last: words[words.length - 1][2] });

/** Background used by every reel: night paper, never pitch black. */
export const Night: React.FC<{ t: number }> = ({ t }) => (
  <>
    <AbsoluteFill style={{ backgroundColor: BG }} />
    <Img src={staticFile("brand/night-paper.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: 1.02 + t * 0.003 }} />
  </>
);

/**
 * The hook. Fully on screen at frame 0 (no fade, no typing), heavy serif, accent words in blush italic.
 * It settles slightly during the first 0.6 s so the very first frames already move, and leaves fast at `until`.
 */
export const HookTitle: React.FC<{ t: number; text: string; accent?: string[]; until: number; top?: number; size?: number }> = ({
  t, text, accent = [], until, top = 300, size = 128,
}) => {
  const out = ramp(t, until - 0.05, until + 0.25);
  if (out >= 1) return null;
  const settle = ramp(t, 0, 0.6);
  const words = text.split(" ");
  const isAccent = (w: string) => accent.some((a) => w.replace(/[.,!?…’'"]/g, "").toLowerCase() === a.toLowerCase());
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: top - 160, height: size * 4.6, background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(10,9,13,0.55), rgba(10,9,13,0))" }} />
      <div style={{
        position: "absolute", left: SAFE.left + 10, right: 1080 - SAFE.right + 10, top,
        textAlign: "center", fontFamily: SERIF, fontWeight: 500, fontSize: size, lineHeight: 1.0, letterSpacing: "-0.01em",
        color: IVORY, textWrap: "balance", textShadow: "0 2px 34px rgba(0,0,0,0.5)",
        opacity: 1 - out, translate: `0px ${-out * 40}px`, scale: interpolate(settle, [0, 1], [1.035, 1]),
      }}>
        {words.map((w, i) => (
          <span key={i} style={{ fontStyle: isAccent(w) ? "italic" : "normal", color: isAccent(w) ? BLUSH : IVORY }}>{w}{i < words.length - 1 ? " " : ""}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Karaoke captions after the hook: whole phrase readable, each word lands quickly (0.12 s, light blur). */
export const ShortCaptions: React.FC<{ t: number; words: Word[]; phrases: Phrase[]; endAt: number; top?: number }> = ({ t, words, phrases, endAt, top = 250 }) => {
  const S = (i: number) => words[i][1];
  const idx = phrases.findIndex((p, i) => t >= S(p.from) - 0.1 && (i === phrases.length - 1 || t < S(phrases[i + 1].from) - 0.1));
  if (idx < 0 || t > endAt) return null;
  const p = phrases[idx];
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: top }}>
      <div style={{ width: SAFE.right - SAFE.left, textAlign: "center", fontFamily: SERIF, fontWeight: 500, fontSize: 80, lineHeight: 1.08, color: IVORY, textWrap: "balance", textShadow: "0 2px 26px rgba(0,0,0,0.5)" }}>
        {words.slice(p.from, p.to + 1).map(([w, s], k) => {
          const i = p.from + k;
          const acc = p.accent?.includes(i);
          const k1 = ramp(t, s - 0.06, s + 0.12);
          return (
            <span key={i} style={{ display: "inline-block", marginRight: "0.22em", fontStyle: acc ? "italic" : "normal", color: acc ? BLUSH : IVORY, opacity: 0.25 + 0.75 * k1, filter: `blur(${(1 - k1) * 3}px)` }}>{w}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Quiet sign-off during the last ~1.2 s (no separate end card: it kills retention and the loop). */
export const LoopSignoff: React.FC<{ t: number; from: number; cta?: string }> = ({ t, from, cta }) => {
  const k = ramp(t, from, from + 0.5);
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: SAFE.bottom - 210, display: "flex", flexDirection: "column", alignItems: "center", opacity: k }}>
      {cta ? <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 54, color: BLUSH, marginBottom: 26 }}>{cta}</div> : null}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Img src={staticFile("brand/snake-light.png")} style={{ width: 54 }} />
        <div style={{ fontFamily: SANS, fontSize: 22, letterSpacing: "0.42em", color: IVORY_SOFT }}>TOTEM</div>
      </div>
    </div>
  );
};
