import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "../brand";
import { SANS, SERIF } from "../brand";
import { BLUSH, cl, HookTitle, IVORY, LoopSignoff, Night, ramp, ShortCaptions, timing, type Phrase } from "../kit/Short";
import { WORDS } from "./words-20261025";

loadFont({ family: "TotemSymbols", url: staticFile("fonts/NotoSansSymbols.ttf"), weight: "100 900" });

// ── Totem · Double retrograde (Sun 25 Oct 2026) ─────────────────────────────────────────────
// One idea: Venus (love) and Mercury (messages) each trace a retrograde loop on the ecliptic, side by side
// across the Libra|Scorpio line. Both loops end at the same station point: November 13. An old message
// ("hey stranger") is just the sky replaying a chat. Loops on "…remember" → "That 'hey stranger' text is a rerun."
// Verified 25 Oct 2026: Venus Rx re-entered Libra Oct 25 5:09 am EDT (cafeastrology.com + bonniesorsby.com), direct
// 22°52′ Libra Nov 13 (cafeastrology.com + bonniesorsby.com Nov 2026); Mercury Rx since Oct 24 at 20°59′ Scorpio,
// direct 5°02′ Scorpio Nov 13 10:53 am EST (cafeastrology.com Mercury-direct-2026 + bonniesorsby.com Nov 2026).

const { S, E, last } = timing(WORDS);
export const REEL_20261025_DURATION = Math.round((last + 0.8) * 30) / 30;
const DUR = REEL_20261025_DURATION;
const SOFT = "rgba(237,230,214,0.5)";
const FAINT = "rgba(237,230,214,0.22)";
const inOut = Easing.inOut(Easing.cubic);
const SYM = "TotemSymbols";

const PHRASES: Phrase[] = [
  { from: 7, to: 14, accent: [12] },
  { from: 15, to: 17, accent: [15] },
  { from: 18, to: 23, accent: [20] },
  { from: 24, to: 27, accent: [25] },
  { from: 28, to: 33, accent: [32] },
  { from: 34, to: 37, accent: [37] },
  { from: 38, to: 42, accent: [42] },
];

// ── geometry: a retrograde loop. x goes backwards between the two stations (s≈0.149 → s≈0.851) ──
const LW = 300, LB = 100, LH = 130, BASE = 1300;
const loopPt = (cx: number, s: number) => [cx + LW * (s - 0.5) - LB * Math.sin(2 * Math.PI * s), BASE - (LH * (1 - Math.cos(2 * Math.PI * s))) / 2] as const;
const loopPath = (cx: number) => Array.from({ length: 121 }, (_, i) => { const [x, y] = loopPt(cx, i / 120); return `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`; }).join(" ");
const ST_RX = 0.171, ST_D = 0.829;
const VX = 320, MX = 740; // Venus in Libra (left), Mercury in Scorpio (right)
const PATH_LEN = 1100;

const OLD = ["hey stranger", "u up?", "saw this and thought of you"];

const Bubble: React.FC<{ text: string; x: number; y: number; o: number; dot?: number; replay?: number; stamp?: number; scale?: number }> = ({ text, x, y, o, dot = 0, replay = 0, stamp = 0, scale = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, scale, transformOrigin: "left center" }}>
    <div style={{ position: "relative", display: "inline-block", padding: "18px 34px 20px", borderRadius: 44, border: `2.5px solid ${IVORY}`, background: "rgba(20,19,24,0.82)", fontFamily: SERIF, fontWeight: 500, fontSize: 58, color: IVORY, whiteSpace: "nowrap" }}>
      {text}
      <div style={{ position: "absolute", right: -10, top: -10, width: 26, height: 26, borderRadius: 13, background: BLUSH, opacity: dot, boxShadow: "0 0 24px 6px rgba(240,184,166,0.35)" }} />
      <svg width={54} height={54} viewBox="-27 -27 54 54" style={{ position: "absolute", right: -70, top: 18, opacity: replay, rotate: `${-replay * 300}deg` }}>
        <path d="M 16 -10 A 19 19 0 1 0 19 4" fill="none" stroke={BLUSH} strokeWidth={3} strokeLinecap="round" />
        <path d="M 9 -14 L 17 -10 L 19 -19" fill="none" stroke={BLUSH} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <div style={{ marginTop: 10, marginLeft: 14, fontFamily: SANS, fontSize: 24, letterSpacing: "0.3em", color: SOFT, opacity: stamp }}>23:47 · DELIVERED</div>
  </div>
);

export const Reel20261025: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // planets: start just past the retrograde station, walk backwards through the loop, arrive at the direct station on "thirteenth"
  const s0 = 0.22 + 0.02 * Math.min(t, S(7)) / S(7);
  const sNow = (lag: number) => {
    if (t < S(18)) return interpolate(t, [0, S(18)], [s0, 0.42 - lag], cl);
    if (t < E(23)) return interpolate(t, [S(18), E(23)], [0.42 - lag, ST_D], { ...cl, easing: inOut });
    if (t < S(42)) return ST_D;
    return interpolate(t, [S(42), last + 0.45], [ST_D, 0.22], { ...cl, easing: inOut });
  };
  const sV = sNow(0.04), sM = sNow(0);

  // beats
  const venusK = ramp(t, S(7), S(7) + 0.4);
  const mercK = ramp(t, S(9), S(9) + 0.4);
  const rxK = ramp(t, S(12), S(12) + 0.4) * (1 - ramp(t, S(24), S(24) + 0.3));
  const loveK = ramp(t, S(15), S(15) + 0.35) * (1 - ramp(t, S(24), S(24) + 0.3));
  const msgK = ramp(t, S(17), S(17) + 0.35) * (1 - ramp(t, S(24), S(24) + 0.3));
  const dateK = ramp(t, S(22), S(22) + 0.4) * (1 - ramp(t, S(42), S(42) + 0.4));
  const draw = (k: number) => 0.35 + 0.65 * k; // loops are faintly there from frame 0, ink in on their names
  const loopsTrail = (s: number) => s; // trail length along the loop

  // chat stack: the single bubble at frame 0 → three "rerun" bubbles on "Old chats" → one typing bubble on "So before you answer"
  const stackK = ramp(t, S(24), S(24) + 0.45);
  const stackOut = ramp(t, S(38), S(38) + 0.4);
  const replayK = ramp(t, S(6), S(6) + 0.4) * (1 - ramp(t, S(24), S(24) + 0.3)) + ramp(t, S(32), S(32) + 0.5) * (1 - stackOut);
  const dimOld = ramp(t, S(34), S(37));
  const typeK = ramp(t, S(38), S(38) + 0.35) * (1 - ramp(t, S(42), S(42) + 0.4));
  const firstBack = ramp(t, S(42), S(42) + 0.4);
  const firstO = (1 - stackK) + firstBack;
  const typed = "it's been a while";
  const nChars = Math.max(0, Math.floor(interpolate(t, [S(38) + 0.1, S(39) + 0.3, S(40) + 0.25, S(42) - 0.05], [0, typed.length, typed.length, 0], cl)));

  // camera: small push-ins per beat, release for the chat stack, return to frame-0 framing for the loop
  const push = 0.04 * ramp(t, S(7), S(12), inOut) + 0.05 * ramp(t, S(18), E(23), inOut);
  const rel = ramp(t, S(24), S(24) + 0.6, inOut);
  const loopRel = ramp(t, S(42), last + 0.4, inOut);
  const scale = 1 + 0.015 * ramp(t, 0, S(7)) + push * (1 - rel) * (1 - loopRel) + 0.006 * Math.sin(t * 1.1);
  const dim = 1 - 0.5 * ramp(t, last - 0.5, last + 0.3);

  const [vx, vy] = loopPt(VX, sV), [mx, my] = loopPt(MX, sM);
  const [dvx, dvy] = loopPt(VX, ST_D), [dmx, dmy] = loopPt(MX, ST_D);
  const pulse = (t * 1.3) % 1;

  return (
    <AbsoluteFill>
      <Night t={t} />

      <AbsoluteFill style={{ opacity: dim, scale, transformOrigin: "540px 1240px" }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* ecliptic + Libra|Scorpio cusp */}
          <line x1={70} y1={BASE + 40} x2={1010} y2={BASE + 40} stroke={SOFT} strokeWidth={2.5} />
          {Array.from({ length: 19 }, (_, i) => <line key={i} x1={70 + i * 52} y1={BASE + 32} x2={70 + i * 52} y2={BASE + 48} stroke={FAINT} strokeWidth={2.5} />)}
          <line x1={540} y1={BASE - 150} x2={540} y2={BASE + 70} stroke={SOFT} strokeWidth={2.5} strokeDasharray="6 10" />
          <text x={520} y={BASE + 104} fill={SOFT} fontFamily={SANS} fontSize={24} letterSpacing={8} textAnchor="end">LIBRA</text>
          <text x={560} y={BASE + 104} fill={SOFT} fontFamily={SANS} fontSize={24} letterSpacing={8}>SCORPIO</text>

          {/* the two retrograde loops: faint full path + inked trail up to the planet */}
          {[{ cx: VX, k: venusK, s: sV }, { cx: MX, k: mercK, s: sM }].map(({ cx, k, s }) => (
            <g key={cx}>
              <path d={loopPath(cx)} fill="none" stroke={FAINT} strokeWidth={2.5} />
              <path d={loopPath(cx)} fill="none" stroke={IVORY} strokeWidth={3} strokeLinecap="round" opacity={draw(k)} strokeDasharray={`${PATH_LEN * loopsTrail(s) * 1.0} ${PATH_LEN * 2}`} pathLength={PATH_LEN} />
            </g>
          ))}

          {/* retrograde arrows on the backwards stretch */}
          {[VX, MX].map((cx) => {
            const [ax, ay] = loopPt(cx, 0.5);
            return <path key={cx} d={`M ${ax + 22} ${ay - 18} L ${ax - 4} ${ay} L ${ax + 22} ${ay + 18}`} fill="none" stroke={IVORY} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={rxK} />;
          })}

          {/* Nov 13: both loops end on the same day — one blush thread between the two station points */}
          <line x1={dvx} y1={dvy} x2={dvx + (dmx - dvx) * dateK} y2={dmy} stroke={BLUSH} strokeWidth={3} strokeDasharray="4 10" strokeLinecap="round" opacity={dateK} />
          {[[dvx, dvy], [dmx, dmy]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill={BLUSH} opacity={dateK} />)}

          {/* planets: glyph discs moving on their loops */}
          {[{ x: vx, y: vy, g: "♀", k: venusK }, { x: mx, y: my, g: "☿", k: mercK }].map(({ x, y, g, k }) => (
            <g key={g}>
              <circle cx={x} cy={y} r={42 + 12 * pulse} fill="none" stroke={IVORY} strokeWidth={2.5} opacity={(1 - pulse) * 0.35} />
              <circle cx={x} cy={y} r={36} fill="rgba(20,19,24,0.92)" stroke={IVORY} strokeWidth={3} />
              <text x={x} y={y + 15} fill={k > 0.5 ? IVORY : SOFT} fontFamily={SYM} fontSize={42} textAnchor="middle">{g}︎</text>
            </g>
          ))}
        </svg>

        {/* labels */}
        {[{ x: VX, k: venusK, name: "VENUS", role: "LOVE", rk: loveK }, { x: MX, k: mercK, name: "MERCURY", role: "MESSAGES", rk: msgK }].map(({ x, k, name, role, rk }) => (
          <div key={name} style={{ position: "absolute", left: x - 200, width: 400, top: BASE + 140, textAlign: "center", fontFamily: SANS, fontSize: 26, letterSpacing: "0.34em", lineHeight: 1.5, color: IVORY, opacity: 0.4 + 0.6 * k, translate: `0px ${(1 - k) * 10}px` }}>
            {name}
            <div style={{ color: BLUSH, opacity: rk, height: 40 }}>{role}</div>
            <div style={{ color: SOFT, fontSize: 24, opacity: rxK }}>RETROGRADE</div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: BASE - 250, textAlign: "center", fontFamily: SANS, fontSize: 28, letterSpacing: "0.34em", color: BLUSH, opacity: dateK * (1 - stackK), translate: `0px ${(1 - dateK) * 12}px` }}>
          NOV 13 · BOTH TURN DIRECT
        </div>
      </AbsoluteFill>

      {/* ── the chat ── */}
      <AbsoluteFill style={{ opacity: dim }}>
        <Bubble text="hey stranger" x={150} y={760} o={Math.min(1, firstO)} dot={1 - stackK} replay={replayK * (1 - stackK) + firstBack * 0} stamp={ramp(t, S(3), S(3) + 0.3) * (1 - stackK)} />
        {OLD.map((txt, i) => {
          const inK = ramp(t, S(24) + i * 0.25, S(24) + i * 0.25 + 0.4);
          return (
            <Bubble key={txt} text={txt} x={150} y={700 + i * 120} o={inK * (1 - stackOut) * (1 - 0.6 * dimOld)} replay={i === 0 ? replayK : 0} scale={0.82} />
          );
        })}
        <div style={{ position: "absolute", left: 150, top: 880, opacity: typeK }}>
          <div style={{ display: "inline-flex", alignItems: "center", padding: "18px 34px 20px", borderRadius: 44, border: `2.5px dashed ${SOFT}`, fontFamily: SERIF, fontWeight: 500, fontSize: 58, color: IVORY, minWidth: 160, minHeight: 70 }}>
            {typed.slice(0, nChars)}
            <span style={{ display: "inline-block", width: 4, height: 56, marginLeft: 6, background: BLUSH, opacity: Math.floor(t * 3) % 2 ? 1 : 0.2 }} />
          </div>
        </div>
      </AbsoluteFill>

      <HookTitle t={t} text="That “hey stranger” text is a rerun." accent={["rerun"]} until={S(7) - 0.35} top={290} size={124} />
      <ShortCaptions t={t} words={WORDS} phrases={PHRASES} endAt={DUR} top={260} />
      <LoopSignoff t={t} from={last - 0.4} cta="Send this before you text back." />

      <Audio src={staticFile("vo/2026-10-25.mp3")} />
      <Audio src={staticFile("music/ambient.wav")} volume={(f) => interpolate(f / fps, [0, DUR - 0.3, DUR], [0.11, 0.11, 0.05], cl)} />
      <Sequence from={Math.round(S(22) * fps)} layout="none"><Audio src={staticFile("music/chime.wav")} volume={0.25} /></Sequence>
    </AbsoluteFill>
  );
};
