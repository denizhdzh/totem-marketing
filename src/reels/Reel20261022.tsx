import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "../brand";
import { SANS, SERIF } from "../brand";
import { WORDS } from "./words-20261022";

// ── Totem · Mercury retrograde in Scorpio (24 Oct – 13 Nov 2026) ──────────────────────
// One idea: Mercury is the blinking cursor of a message you're typing. Its path through Scorpio
// is one ink line; when it stations retrograde, the cursor starts moving backwards — a backspace in the sky.
// Verified (cafeastrology.com + bonniesorsby.com, 22 Oct 2026): station retrograde 20°59′ Scorpio Oct 24,
// station direct 5°02′ Scorpio Nov 13, shadow 5°02′–20°59′ Scorpio (Oct 4 – Nov 30). Venus direct Nov 13.

const LAST = WORDS[WORDS.length - 1][2];
export const REEL_20261022_DURATION = Math.ceil((LAST + 3.8) * 10) / 10;
const END_AT = LAST + 0.4;
const IVORY = "#EDE6D6";
const IVORY_SOFT = "rgba(237,230,214,0.5)";
const BLUSH = "#F0B8A6";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.inOut(Easing.cubic);
const S = (i: number) => WORDS[i][1];
const E = (i: number) => WORDS[i][2];
const ramp = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], { ...cl, easing: e });

// ── geometry: Mercury's loop in Scorpio (°lon within Scorpio; latitude stylised) ─────────
// direct to 20°59′ (Oct 24) → retrograde back to 5°02′ (Nov 13) → direct again, clears 20°59′ (Nov 30)
const PTS: [number, number][] = [
  [-1, 1.0], [5.03, 1.5], [12, 1.9], [17.5, 1.8], [20.4, 1.2], [20.98, 0.4], [20.1, -0.5], [16.5, -1.3],
  [12, -1.8], [7.6, -2.2], [5.03, -2.6], [5.6, -3.0], [9.5, -3.25], [15, -3.35], [20.98, -3.3], [26, -3.2],
];
const SEG = 24;
const RX_IDX = 5 * SEG, DIR_IDX = 10 * SEG, END_IDX = 15 * SEG;
const X0 = 130, Y0 = 1140, SX = 33, SY = 62;
const toXY = ([lon, lat]: [number, number]) => [X0 + lon * SX, Y0 - lat * SY] as const;
function catmull(points: (readonly [number, number])[]) {
  const out: [number, number][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(points.length - 1, i + 2)];
    for (let k = 0; k < SEG; k++) {
      const t = k / SEG, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push([points[points.length - 1][0], points[points.length - 1][1]]);
  return out;
}
const PATH = catmull(PTS.map(toXY));
const PATH_D = (a: number, b: number) => "M " + PATH.slice(a, b + 1).map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ");

// ── captions ─────────────────────────────────────────────────────────────────────
const PHRASES: { from: number; to: number; big?: boolean; accent?: number[] }[] = [
  { from: 0, to: 5, big: true, accent: [1, 5] },
  { from: 6, to: 7, accent: [7] },
  { from: 8, to: 11, accent: [11] },
  { from: 12, to: 16, accent: [16] },
  { from: 17, to: 22, accent: [18] },
  { from: 23, to: 28, accent: [28] },
  { from: 29, to: 33, accent: [33] },
  { from: 34, to: 40, accent: [39, 40] },
  { from: 41, to: 46, accent: [43] },
  { from: 47, to: 50, accent: [48] },
  { from: 51, to: 54, accent: [] },
  { from: 55, to: 62, accent: [56] },
  { from: 63, to: 67, accent: [64] },
  { from: 68, to: 70, accent: [70] },
  { from: 71, to: 73, accent: [73] },
  { from: 74, to: 77, accent: [77] },
];

const Captions: React.FC<{ t: number }> = ({ t }) => {
  const idx = PHRASES.findIndex((p, i) => t >= S(p.from) - 0.12 && (i === PHRASES.length - 1 || t < S(PHRASES[i + 1].from) - 0.12));
  if (idx < 0 || t > END_AT) return null;
  const p = PHRASES[idx];
  const words = WORDS.slice(p.from, p.to + 1);
  const big = !!p.big;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: big ? 270 : 250 }}>
      <div style={{ width: 920, textAlign: "center", fontFamily: SERIF, fontWeight: 300, fontSize: big ? 104 : 68, lineHeight: big ? 1.04 : 1.14, color: IVORY, textWrap: "balance" }}>
        {words.map(([w, s], k) => {
          const i = p.from + k;
          const accent = p.accent?.includes(i);
          return (
            <span key={i} style={{
              display: "inline-block", marginRight: "0.24em",
              fontStyle: accent ? "italic" : "normal",
              color: accent ? BLUSH : IVORY,
              opacity: ramp(t, s - 0.05, s + 0.22),
              translate: `0px ${(1 - ramp(t, s - 0.05, s + 0.35)) * 16}px`,
              filter: `blur(${(1 - ramp(t, s - 0.05, s + 0.25, Easing.linear)) * 7}px)`,
            }}>{w}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Mercury's index on its path over time
const mercIndexAt = (t: number) => {
  if (t < S(9)) return 0;
  if (t < S(17)) return Math.round(interpolate(t, [S(9), S(17)], [0, RX_IDX], { ...cl, easing: Easing.out(Easing.quad) }));
  if (t < S(26)) return RX_IDX; // the station: the cursor stops
  if (t < E(33)) return Math.round(interpolate(t, [S(26), E(33)], [RX_IDX, DIR_IDX], { ...cl, easing: Easing.inOut(Easing.sin) }));
  return DIR_IDX; // waits at the direct station (Nov 13)
};

// a small ink-line message bubble
const Bubble: React.FC<{ x: number; y: number; w: number; text: string; op: number; caret?: boolean; t: number; sent?: boolean; size?: number }> = ({ x, y, w, text, op, caret, t, sent, size = 42 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, minHeight: size * 2.2, borderRadius: size * 1.1, border: `1.5px solid ${IVORY_SOFT}`, background: "rgba(20,19,24,0.6)", opacity: op, display: "flex", alignItems: "center", padding: `0 ${size}px`, fontFamily: SERIF, fontSize: size, color: sent ? IVORY_SOFT : IVORY, boxSizing: "border-box" }}>
    {text}
    {caret ? <span style={{ width: 2, height: size * 1.1, background: BLUSH, marginLeft: 4, opacity: Math.floor(t * 2.2) % 2 === 0 ? 1 : 0.15, boxShadow: `0 0 18px 4px rgba(240,184,166,0.35)` }} /> : null}
  </div>
);

export const Reel20261022: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // ── act 1 (hook): a confession being typed, then deleted ────────────────────────
  const hookFull = "i think i still love y";
  const typed = Math.floor(interpolate(t, [0.15, S(4)], [0, hookFull.length], cl));
  const deleted = Math.floor(interpolate(t, [S(5), E(5) + 0.1], [0, hookFull.length], { ...cl, easing: Easing.in(Easing.quad) }));
  const hookText = hookFull.slice(0, Math.max(0, typed - deleted));
  const hookOp = ramp(t, 0, 0.25) * (1 - ramp(t, S(7), E(7)));

  // ── act 2: Mercury's path ─────────────────────────────────────────────────────
  const mi = mercIndexAt(t);
  const [mx, my] = PATH[mi];
  const pathOp = ramp(t, S(8) - 0.2, S(9) + 0.3) * (1 - ramp(t, S(34) - 0.35, S(34) + 0.1));
  const forwardDrawn = Math.min(mi, RX_IDX);
  const backDrawn = mi > RX_IDX ? mi : RX_IDX;
  const ghostOp = ramp(t, E(33) + 0.2, S(35)); // the rest of the loop, faint, once he's back at 5°
  const rxMark = ramp(t, S(17), S(18) + 0.3);
  const dirMark = ramp(t, S(28), S(29) + 0.3);
  const secrets = ramp(t, S(31), E(33));
  const camK = ramp(t, S(9), S(26), inOut) * (1 - ramp(t, S(47), S(51), inOut));
  const scale = interpolate(camK, [0, 1], [1, 1.07]);

  // the cursor that falls from the hook bubble onto the ecliptic
  const drop = ramp(t, S(7) - 0.1, S(9) + 0.2, inOut);

  // ── act 3: the 2 a.m. message ─────────────────────────────────────────────────
  const msg = "i never stopped thinking abo";
  const msgTyped = Math.floor(interpolate(t, [S(35), E(40)], [0, msg.length], cl));
  const msgOp = ramp(t, S(34) - 0.1, S(34) + 0.3) * (1 - ramp(t, S(51) - 0.5, S(51)));
  const dark = ramp(t, S(43), E(43)); // "darker": the message dims, a read receipt appears
  const ghosts = ramp(t, S(47), S(48) + 0.3);

  // ── act 4: the fixed cross ────────────────────────────────────────────────────
  const WX = 540, WY = 1180, WR = 250;
  const wheelOp = ramp(t, S(51) - 0.3, S(51) + 0.4) * (1 - ramp(t, S(68) - 0.4, S(68)));
  // zodiac angle: Scorpio centred at top; signs run counter-clockwise on screen
  const zAng = (signIdx: number, deg: number) => -Math.PI / 2 - (((signIdx - 7) * 30 + deg - 15) * Math.PI) / 180;
  const SIGNS = ["ARIES", "TAURUS", "GEMINI", "CANCER", "LEO", "VIRGO", "LIBRA", "SCORPIO", "SAGITTARIUS", "CAPRICORN", "AQUARIUS", "PISCES"];
  const fixed = [
    { w: 51, s: 1 }, { w: 52, s: 4 }, { w: 53, s: 7 }, { w: 54, s: 10 },
  ];
  const crossK = ramp(t, S(55), E(57));
  const venusK = ramp(t, S(64), E(64) + 0.2);
  const mAng = zAng(7, 20.98);
  const vAng = zAng(7, 0.4);

  // ── act 5: write · save · send in November ───────────────────────────────────
  const fieldOp = ramp(t, S(68) - 0.3, S(68) + 0.2) * (1 - ramp(t, END_AT - 0.3, END_AT));
  const draft = "i miss you";
  const dTyped = Math.floor(interpolate(t, [S(68), E(70)], [0, draft.length], cl));
  const saved = ramp(t, S(71), E(73), inOut);
  const send = ramp(t, S(74), E(77));

  const diagramDim = 1 - 0.9 * ramp(t, END_AT - 0.4, END_AT + 0.4);

  return (
    <AbsoluteFill style={{ backgroundColor: "#141318" }}>
      <Img src={staticFile("brand/night-paper.jpg")} style={{ position: "absolute", width: "100%", height: "100%", scale: 1 + t * 0.002 }} />

      <AbsoluteFill style={{ opacity: diagramDim }}>
        {/* ── Mercury's loop ── */}
        <AbsoluteFill style={{ opacity: pathOp, scale, transformOrigin: `${PATH[RX_IDX][0] - 120}px ${Y0}px` }}>
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <defs>
              <radialGradient id="mglow"><stop offset="0%" stopColor={BLUSH} stopOpacity={0.55} /><stop offset="100%" stopColor={BLUSH} stopOpacity={0} /></radialGradient>
            </defs>
            {/* ecliptic: 0°–30° Scorpio */}
            <line x1={X0 - 40} y1={Y0 + 300} x2={X0 + 30 * SX - 60} y2={Y0 + 300} stroke={IVORY_SOFT} strokeWidth={1} strokeDasharray="2 8" />
            {Array.from({ length: 28 }, (_, d) => d).map((deg) => (
              <line key={deg} x1={X0 + deg * SX} y1={Y0 + 300 - (deg % 5 === 0 ? 10 : 4)} x2={X0 + deg * SX} y2={Y0 + 300 + (deg % 5 === 0 ? 10 : 4)} stroke={IVORY_SOFT} strokeWidth={1} />
            ))}
            {[0, 5, 10, 15, 20, 25].map((d) => (
              <text key={d} x={X0 + d * SX} y={Y0 + 346} fill={IVORY_SOFT} fontFamily={SANS} fontSize={19} letterSpacing={3} textAnchor="middle">{d}°</text>
            ))}
            <text x={540} y={Y0 + 400} fill={IVORY_SOFT} fontFamily={SANS} fontSize={20} letterSpacing={8} textAnchor="middle">SCORPIO</text>

            {/* the shadow zone 5°–21°, lights up on "sign of secrets" */}
            <rect x={X0 + 5.03 * SX} y={Y0 - 200} width={(20.98 - 5.03) * SX} height={500} fill="rgba(240,184,166,0.06)" opacity={secrets} />
            <line x1={X0 + 5.03 * SX} y1={Y0 - 200} x2={X0 + 5.03 * SX} y2={Y0 + 300} stroke={IVORY_SOFT} strokeWidth={1} strokeDasharray="3 7" opacity={Math.max(dirMark, secrets)} />
            <line x1={X0 + 20.98 * SX} y1={Y0 - 200} x2={X0 + 20.98 * SX} y2={Y0 + 300} stroke={IVORY_SOFT} strokeWidth={1} strokeDasharray="3 7" opacity={rxMark} />

            {/* faint rest of the loop (Nov 13 → Nov 30) */}
            <path d={PATH_D(DIR_IDX, END_IDX)} fill="none" stroke={IVORY_SOFT} strokeWidth={1.4} strokeDasharray="2 9" strokeLinecap="round" opacity={ghostOp} />
            {/* forward path, then the backwards path in blush */}
            <path d={PATH_D(0, Math.max(1, forwardDrawn))} fill="none" stroke={IVORY} strokeWidth={2} strokeLinecap="round" opacity={0.9} />
            {mi > RX_IDX ? <path d={PATH_D(RX_IDX, backDrawn)} fill="none" stroke={BLUSH} strokeWidth={2} strokeLinecap="round" opacity={0.9} /> : null}

            {/* station labels */}
            <g opacity={rxMark}>
              <circle cx={PATH[RX_IDX][0]} cy={PATH[RX_IDX][1]} r={11} fill="none" stroke={IVORY} strokeWidth={1.4} />
              <text x={PATH[RX_IDX][0] + 20} y={Y0 - 236} fill={IVORY} fontFamily={SANS} fontSize={21} letterSpacing={5} textAnchor="end">RETROGRADE · OCT 24</text>
              <text x={PATH[RX_IDX][0] + 20} y={Y0 - 206} fill={IVORY_SOFT} fontFamily={SANS} fontSize={19} letterSpacing={5} textAnchor="end">20°59′ SCORPIO</text>
            </g>
            <g opacity={dirMark}>
              <circle cx={PATH[DIR_IDX][0]} cy={PATH[DIR_IDX][1]} r={11} fill="none" stroke={IVORY} strokeWidth={1.4} />
              <text x={X0 + 5.03 * SX - 20} y={Y0 + 240} fill={IVORY} fontFamily={SANS} fontSize={21} letterSpacing={5} textAnchor="start" dx={0}>DIRECT · NOV 13 · 5°02′</text>
            </g>
            <text x={X0 + 13 * SX} y={Y0 - 160} fill={BLUSH} fontFamily={SANS} fontSize={20} letterSpacing={7} textAnchor="middle" opacity={secrets * (1 - ramp(t, S(34) - 0.3, S(34)))}>THE SIGN OF SECRETS</text>

            {/* Mercury: the cursor */}
            <g opacity={ramp(t, S(9) - 0.05, S(9) + 0.15, Easing.linear)}>
              <circle cx={mx} cy={my} r={60} fill="url(#mglow)" />
              <rect x={mx - 2.5} y={my - 26} width={5} height={52} rx={2.5} fill={BLUSH} opacity={t > S(17) && t < S(26) ? (Math.floor(t * 2.4) % 2 === 0 ? 1 : 0.25) : 1} />
            </g>
          </svg>
          {/* "backspace" label while he walks backwards */}
          <div style={{ position: "absolute", left: 0, right: 0, top: Y0 + 30, textAlign: "center", fontFamily: SANS, fontSize: 21, letterSpacing: "0.38em", color: BLUSH, opacity: ramp(t, S(27), S(28)) * (1 - ramp(t, S(31), S(31) + 0.3)) }}>⌫ BACKSPACE</div>
        </AbsoluteFill>

        {/* ── the 2 a.m. message, above the loop ── */}
        <AbsoluteFill style={{ opacity: msgOp }}>
          {["we should talk.", "remember us?"].map((g, i) => (
            <div key={g} style={{ position: "absolute", left: i ? 300 : 130, top: 700 + i * 120 + (1 - ghosts) * -40, opacity: ghosts * 0.55 }}>
              <Bubble x={0} y={0} w={i ? 380 : 420} text={g} op={1} t={t} sent size={34} />
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
            <Bubble x={110} y={ghosts > 0 ? 980 + ghosts * 0 : 980} w={860} text={msg.slice(0, msgTyped)} op={1 - dark * 0.45} caret t={t} />
          </div>
          <div style={{ position: "absolute", right: 120, top: 1092, fontFamily: SANS, fontSize: 19, letterSpacing: "0.3em", color: BLUSH, opacity: dark }}>READ · 2:04 AM</div>
        </AbsoluteFill>

        {/* ── the fixed cross ── */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: wheelOp }}>
          <circle cx={WX} cy={WY} r={WR} fill="none" stroke={IVORY_SOFT} strokeWidth={1.2} />
          <circle cx={WX} cy={WY} r={WR - 46} fill="none" stroke={IVORY_SOFT} strokeWidth={0.8} strokeDasharray="1 6" />
          {Array.from({ length: 12 }, (_, i) => {
            const a = zAng(i, 0);
            return <line key={i} x1={WX + Math.cos(a) * (WR - 46)} y1={WY + Math.sin(a) * (WR - 46)} x2={WX + Math.cos(a) * WR} y2={WY + Math.sin(a) * WR} stroke={IVORY_SOFT} strokeWidth={1} />;
          })}
          {fixed.map((f) => {
            const p = ramp(t, S(f.w) - 0.1, S(f.w) + 0.5);
            const a = zAng(f.s, 15);
            const lx = WX + Math.cos(a) * (WR + 70), ly = WY + Math.sin(a) * (WR + 56);
            return (
              <g key={f.s}>
                <line x1={WX} y1={WY} x2={WX + Math.cos(a) * (WR - 46) * Math.max(p, crossK)} y2={WY + Math.sin(a) * (WR - 46) * Math.max(p, crossK)} stroke={IVORY} strokeWidth={1.4} opacity={p} />
                <text x={lx} y={ly + 8} fill={p > 0.5 ? BLUSH : IVORY} fontFamily={SANS} fontSize={24} letterSpacing={7} textAnchor="middle" opacity={p}>{SIGNS[f.s]}</text>
              </g>
            );
          })}
          <text x={WX} y={WY + WR + 160} fill={IVORY_SOFT} fontFamily={SANS} fontSize={20} letterSpacing={7} textAnchor="middle" opacity={crossK}>THE FIXED SIGNS FEEL IT MOST</text>
          {/* Mercury at 20°59′ Scorpio */}
          <circle cx={WX + Math.cos(mAng) * (WR - 23)} cy={WY + Math.sin(mAng) * (WR - 23)} r={40} fill="url(#mglow2)" />
          <defs><radialGradient id="mglow2"><stop offset="0%" stopColor={BLUSH} stopOpacity={0.55} /><stop offset="100%" stopColor={BLUSH} stopOpacity={0} /></radialGradient></defs>
          <circle cx={WX + Math.cos(mAng) * (WR - 23)} cy={WY + Math.sin(mAng) * (WR - 23)} r={9} fill={BLUSH} />
          {/* Venus, retrograde, near 0° Scorpio — an ivory ring, not a second protagonist */}
          <g opacity={venusK}>
            <circle cx={WX + Math.cos(vAng) * (WR - 23)} cy={WY + Math.sin(vAng) * (WR - 23)} r={10} fill="none" stroke={IVORY} strokeWidth={1.6} />
            <circle cx={WX + Math.cos(vAng) * (WR - 23)} cy={WY + Math.sin(vAng) * (WR - 23)} r={10 + venusK * 26} fill="none" stroke={IVORY} strokeWidth={1} opacity={1 - venusK} />
            <text x={WX + Math.cos(vAng) * (WR - 23) + 34} y={WY + Math.sin(vAng) * (WR - 23) - 30} fill={IVORY} fontFamily={SANS} fontSize={19} letterSpacing={5} textAnchor="start">VENUS · RETROGRADE TO NOV 13</text>
          </g>
        </svg>

        {/* ── write · save · send in November ── */}
        <AbsoluteFill style={{ opacity: fieldOp }}>
          <div style={{ position: "absolute", left: 120, top: 1000 + saved * -120, opacity: 1 - saved * 0.5, scale: 1 - saved * 0.25, transformOrigin: "left center" }}>
            <Bubble x={0} y={0} w={840} text={draft.slice(0, dTyped)} op={1} caret={saved < 0.5} t={t} />
          </div>
          <div style={{ position: "absolute", left: 120, top: 840, fontFamily: SANS, fontSize: 20, letterSpacing: "0.36em", color: IVORY_SOFT, opacity: saved }}>DRAFTS · 1</div>
          <div style={{ position: "absolute", left: 120, right: 120, top: 1260, display: "flex", alignItems: "center", justifyContent: "center", gap: 28, opacity: send }}>
            <div style={{ width: 92, height: 92, borderRadius: 46, border: `1.5px solid ${BLUSH}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 38, color: BLUSH, boxShadow: `0 0 ${30 * send}px ${8 * send}px rgba(240,184,166,0.25)` }}>↑</div>
            <div style={{ fontFamily: SANS, fontSize: 22, letterSpacing: "0.36em", color: IVORY }}>SCHEDULED · NOV 13</div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ── hook bubble ── */}
      <AbsoluteFill style={{ opacity: hookOp }}>
        <Bubble x={110} y={900} w={860} text={hookText} op={1} caret={t < S(7)} t={t} />
        <div style={{ position: "absolute", left: 140, top: 852, fontFamily: SANS, fontSize: 19, letterSpacing: "0.3em", color: IVORY_SOFT }}>NEW MESSAGE · 1:58 AM</div>
      </AbsoluteFill>
      {t > S(7) - 0.15 && t < S(9) + 0.3 ? (() => {
        const x = interpolate(drop, [0, 1], [180 + hookText.length * 18, PATH[0][0]]);
        const y = interpolate(drop, [0, 1], [946, PATH[0][1]]) - Math.sin(drop * Math.PI) * 60;
        return <div style={{ position: "absolute", left: x - 2.5, top: y - 26, width: 5, height: 52, borderRadius: 3, background: BLUSH, boxShadow: `0 0 40px 14px rgba(240,184,166,0.35)`, opacity: 1 - ramp(t, S(9) + 0.1, S(9) + 0.3) }} />;
      })() : null}

      <Captions t={t} />

      <Sequence from={Math.round(END_AT * fps)} layout="absolute-fill">
        <EndCard />
      </Sequence>

      <Sequence from={Math.round(0.08 * fps)} layout="none">
        <Audio src={staticFile("vo/2026-10-22.mp3")} />
      </Sequence>
      <Audio src={staticFile("music/ambient.wav")} volume={(f) => interpolate(f / fps, [0, 1, REEL_20261022_DURATION - 1.5, REEL_20261022_DURATION], [0, 0.11, 0.11, 0], cl)} />
      <Sequence from={Math.round((S(17) - 0.1) * fps)} layout="none"><Audio src={staticFile("music/chime.wav")} volume={0.26} /></Sequence>
      <Sequence from={Math.round((END_AT + 0.1) * fps)} layout="none"><Audio src={staticFile("music/chime.wav")} volume={0.22} /></Sequence>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Img src={staticFile("brand/snake-light.png")} style={{ width: 300, opacity: ramp(t, 0.1, 0.9), scale: interpolate(ramp(t, 0.1, 2.4), [0, 1], [0.94, 1]) }} />
        <div style={{ marginTop: 50, fontFamily: SERIF, fontWeight: 500, fontSize: 72, letterSpacing: "0.34em", paddingLeft: "0.34em", color: IVORY, opacity: ramp(t, 0.5, 1.3) }}>TOTEM</div>
        <div style={{ marginTop: 22, fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: 50, color: BLUSH, opacity: ramp(t, 1.0, 1.8), translate: `0px ${(1 - ramp(t, 1.0, 1.8)) * 10}px` }}>
          Send this to someone who needs it.
        </div>
      </div>
    </AbsoluteFill>
  );
};
