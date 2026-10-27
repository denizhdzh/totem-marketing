import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import "../brand";
import { SANS, SERIF } from "../brand";
import type { CarouselProps } from "../Carousel/Carousel";
import { BLUSH, cl, HookTitle, IVORY, LoopSignoff, Night, ramp, SAFE } from "./Short";

loadFont({ family: "TotemSymbols", url: staticFile("fonts/NotoSansSymbols.ttf"), weight: "100 900" });

// ── 18:00 Instagram reel made from the day's carousel props (owner decision 23 Oct 2026: Instagram = reels only) ──
// Instagram showed our photo carousels to almost nobody (0–9 views) while reels got 136–152, so the
// sign-by-sign concept now goes out on Instagram as a "pause on your sign" reel. Same props as the carousel,
// no voiceover (ambient music only). Frame 0 = cover hook + zodiac wheel already turning; one sign per beat;
// the last beat returns to the cover composition so it loops.

export const SIGNS_REEL = { cover: 1.8, perSign: 1.35, outro: 1.5, fps: 30 } as const;
export const signsReelDuration = (p: CarouselProps) => SIGNS_REEL.cover + p.signs.length * SIGNS_REEL.perSign + SIGNS_REEL.outro;

const ORDER = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const GLYPH = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
const SOFT = "rgba(237,230,214,0.5)";
const ord = (n: number) => `${n}${n === 1 ? "ST" : n === 2 ? "ND" : n === 3 ? "RD" : "TH"}`;
const CX = 540, CY = 1110, R = 255;
// sign i sits at angle; Aries at the left (like a chart's ascendant), signs run counter-clockwise
const ang = (i: number) => Math.PI + (i + 0.5) * (Math.PI / 6);
const pt = (a: number, r: number) => [CX + Math.cos(a) * r, CY - Math.sin(a) * r] as const;

export const SignsReel: React.FC<CarouselProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const n = p.signs.length;
  const signsEnd = SIGNS_REEL.cover + n * SIGNS_REEL.perSign;
  const dur = signsEnd + SIGNS_REEL.outro;
  const k = Math.floor((t - SIGNS_REEL.cover) / SIGNS_REEL.perSign); // current sign beat
  const inSigns = t >= SIGNS_REEL.cover && k >= 0 && k < n;
  const s = inSigns ? p.signs[k] : null;
  const si = s ? Math.max(0, ORDER.indexOf(s.sign)) : -1;
  const beatT = inSigns ? t - (SIGNS_REEL.cover + k * SIGNS_REEL.perSign) : 0;
  const outroK = ramp(t, signsEnd, signsEnd + 0.4);

  // the blush point: drifts on the ring during the cover, jumps to each sign, drifts back for the loop
  const idle = (tt: number) => Math.PI * 0.5 + tt * 0.35; // frame-0 position (top of wheel), slowly turning
  const target = si >= 0 ? ang(si) : idle(t);
  const prevA = k > 0 && inSigns ? ang(Math.max(0, ORDER.indexOf(p.signs[k - 1].sign))) : idle(SIGNS_REEL.cover);
  let a = inSigns ? interpolate(ramp(beatT, 0, 0.35), [0, 1], [prevA, target]) : idle(t);
  if (t >= signsEnd) {
    const last = ang(Math.max(0, ORDER.indexOf(p.signs[n - 1].sign)));
    a = interpolate(ramp(t, signsEnd, dur - 0.15, Easing.inOut(Easing.cubic)), [0, 1], [last, idle(0) + Math.PI * 2 * Math.round((last - idle(0)) / (Math.PI * 2))]);
  }
  const [px, py] = pt(a, R - 34);
  const push = inSigns ? 1 + 0.03 * ramp(beatT, 0, SIGNS_REEL.perSign, Easing.linear) : 1 + 0.01 * Math.sin(t);

  const textIn = ramp(beatT, 0, 0.18);
  const wedge = (i: number) => {
    const a0 = Math.PI + (i * Math.PI) / 6, a1 = a0 + Math.PI / 6, r0 = R - 70;
    const P = (aa: number, rr: number) => pt(aa, rr).map((v) => v.toFixed(1)).join(" ");
    return `M ${P(a0, r0)} L ${P(a0, R)} A ${R} ${R} 0 0 0 ${P(a1, R)} L ${P(a1, r0)} A ${r0} ${r0} 0 0 1 ${P(a0, r0)} Z`;
  };

  return (
    <AbsoluteFill>
      <Night t={t} />
      {/* ── the wheel: one central visual for the whole reel ── */}
      <AbsoluteFill style={{ scale: push, transformOrigin: `${CX}px ${CY}px`, opacity: 1 - 0.45 * ramp(t, dur - 0.9, dur - 0.3) }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <defs><radialGradient id="sg"><stop offset="0%" stopColor={BLUSH} stopOpacity={0.6} /><stop offset="100%" stopColor={BLUSH} stopOpacity={0} /></radialGradient></defs>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke={SOFT} strokeWidth={2.5} />
          <circle cx={CX} cy={CY} r={R - 70} fill="none" stroke={SOFT} strokeWidth={2.5} />
          <circle cx={CX} cy={CY} r={12} fill="none" stroke={IVORY} strokeWidth={2.5} />
          {Array.from({ length: 12 }, (_, i) => {
            const [x1, y1] = pt(Math.PI + (i * Math.PI) / 6, R - 70), [x2, y2] = pt(Math.PI + (i * Math.PI) / 6, R);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={SOFT} strokeWidth={2.5} />;
          })}
          {si >= 0 ? <path d={wedge(si)} fill="rgba(240,184,166,0.18)" stroke={BLUSH} strokeWidth={2.5} opacity={ramp(beatT, 0.05, 0.3)} /> : null}
          {GLYPH.map((g, i) => {
            const [x, y] = pt(ang(i), R + 52);
            const on = i === si;
            return <text key={g} x={x} y={y + 14} fill={on ? BLUSH : SOFT} fontFamily="TotemSymbols" fontSize={on ? 50 : 38} textAnchor="middle">{g}︎</text>;
          })}
          {/* aspect line from the centre to the point */}
          <line x1={CX} y1={CY} x2={px} y2={py} stroke={IVORY} strokeWidth={2.5} opacity={0.55} />
          <circle cx={px} cy={py} r={60} fill="url(#sg)" />
          <circle cx={px} cy={py} r={14} fill={BLUSH} />
        </svg>
        {s && s.house > 0 ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: CY + 40, textAlign: "center", fontFamily: SANS, fontSize: 24, letterSpacing: "0.34em", color: BLUSH, opacity: ramp(beatT, 0.1, 0.3) }}>{ord(s.house)} HOUSE</div>
        ) : null}
      </AbsoluteFill>

      {/* ── cover (frame 0) and the loop return ── */}
      <AbsoluteFill style={{ opacity: Math.max(1 - ramp(t, SIGNS_REEL.cover - 0.15, SIGNS_REEL.cover + 0.05), 0) }}>
        <div style={{ position: "absolute", left: SAFE.left + 10, right: 1080 - SAFE.right + 10, top: 250, textAlign: "center", fontFamily: SANS, fontSize: 24, letterSpacing: "0.36em", color: SOFT }}>{p.kicker}</div>
      </AbsoluteFill>
      <HookTitle t={t} text={`${p.title} ${p.titleAccent}`} accent={p.titleAccent.split(" ").slice(-1).map((w) => w.replace(/[.,!?…’'"]/g, ""))} until={SIGNS_REEL.cover} top={310} size={116} />
      <div style={{ position: "absolute", left: 0, right: 0, top: SAFE.bottom - 30, textAlign: "center", fontFamily: SANS, fontSize: 26, letterSpacing: "0.36em", color: BLUSH, opacity: 1 - ramp(t, SIGNS_REEL.cover + 1.2, SIGNS_REEL.cover + 1.6) }}>PAUSE ON YOUR SIGN</div>

      {/* ── one sign per beat ── */}
      {s ? (
        <AbsoluteFill style={{ alignItems: "center" }}>
          <div style={{ position: "absolute", top: 250, left: SAFE.left + 10, right: 1080 - SAFE.right + 10, textAlign: "center", opacity: textIn, translate: `0px ${(1 - textIn) * 18}px` }}>
            <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 112, lineHeight: 1, color: IVORY }}>{s.sign}</div>
            {s.theme ? <div style={{ marginTop: 16, fontFamily: SANS, fontSize: 24, letterSpacing: "0.32em", color: BLUSH }}>{s.theme.toUpperCase()}</div> : null}
            <div style={{ marginTop: 26, fontFamily: SERIF, fontWeight: 500, fontSize: 62, lineHeight: 1.12, color: IVORY, textWrap: "balance" }}>{s.text}</div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ── outro: CTA while the wheel returns to the cover position ── */}
      {t >= signsEnd ? (
        <div style={{ position: "absolute", top: 300, left: SAFE.left + 10, right: 1080 - SAFE.right + 10, textAlign: "center", fontFamily: SERIF, fontWeight: 500, fontSize: 92, lineHeight: 1.02, color: IVORY, textWrap: "balance", opacity: outroK }}>{p.outroTitle}</div>
      ) : null}
      <LoopSignoff t={t} from={signsEnd + 0.2} cta={p.outroLine} />

      <Audio src={staticFile("music/ambient.wav")} volume={(f) => interpolate(f / fps, [0, dur - 0.3, dur], [0.3, 0.3, 0.12], cl)} />
    </AbsoluteFill>
  );
};
