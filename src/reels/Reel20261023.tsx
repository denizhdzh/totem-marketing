import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "../brand";
import { SANS, SERIF } from "../brand";
import { BLUSH, cl, HookTitle, IVORY, LoopSignoff, Night, ramp, ShortCaptions, timing, type Phrase } from "../kit/Short";
import { WORDS } from "./words-20261023";

loadFont({ family: "TotemSymbols", url: staticFile("fonts/NotoSansSymbols.ttf"), weight: "100 900" });

// ── Totem · Venus retrograde slides back into Libra (Sun 25 Oct 2026) ─────────────────
// One idea: the Libra | Scorpio cusp is a single ink line. Venus, the blush point, is walking
// backwards on her retrograde loop and crosses it — back into the sign of partnership — and old chats light up.
// Verified 23 Oct 2026 (cafeastrology.com retrograde-Venus-enters-Libra page, bonniesorsby.com Oct 2026
// forecast, astrostyle.com Venus Rx 2026): Rx station 8°30′ Scorpio Oct 3, re-enters Libra Oct 25,
// stations direct 22°52′ Libra Nov 13, back into Scorpio Dec 4. Today (Oct 23) Venus cazimi 0°45′ Scorpio.

const { S, E, last } = timing(WORDS);
export const REEL_20261023_DURATION = Math.round((last + 0.8) * 30) / 30;
const DUR = REEL_20261023_DURATION;
const SOFT = "rgba(237,230,214,0.5)";
const inOut = Easing.inOut(Easing.cubic);
const SYM = "TotemSymbols";

const PHRASES: Phrase[] = [
  { from: 7, to: 8, accent: [8] },
  { from: 9, to: 14, accent: [14] },
  { from: 15, to: 18, accent: [18] },
  { from: 19, to: 21, accent: [20] },
  { from: 22, to: 25, accent: [23] },
  { from: 26, to: 30, accent: [30] },
  { from: 31, to: 35, accent: [33] },
  { from: 36, to: 39, accent: [39] },
];

// ── geometry: Venus' retrograde loop around the Libra|Scorpio cusp ──────────────────────
// x = degrees from 0° Scorpio (Libra negative), y = stylised latitude
const PTS: [number, number][] = [
  [-10, 1.5], [-3, 1.75], [3, 1.7], [7.2, 1.3], [8.5, 0.6], // 4: Rx station 8°30′ Scorpio, Oct 3
  [7.3, -0.1], [3.5, -0.5], [0, -0.8], // 7: crosses back into Libra, Oct 25
  [-4.5, -1.25], [-7.13, -1.75], // 9: direct 22°52′ Libra, Nov 13
  [-6, -2.3], [0, -2.55], [8, -2.65], // 11: back into Scorpio, Dec 4
];
const SEG = 24;
const RX_IDX = 4 * SEG, CROSS_IDX = 7 * SEG, DIR_IDX = 9 * SEG, END_IDX = 12 * SEG;
const START_IDX = Math.round(6.62 * SEG); // ~1.2° Scorpio: she's already walking back at frame 0
const CUSP_X = 520, SX = 38, Y0 = 1150, SY = 74;
const toXY = ([lon, lat]: [number, number]) => [CUSP_X + lon * SX, Y0 - lat * SY] as const;
function catmull(points: (readonly [number, number])[]) {
  const out: [number, number][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(points.length - 1, i + 2)];
    for (let k = 0; k < SEG; k++) {
      const u = k / SEG, u2 = u * u, u3 = u2 * u;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (-a + 3 * b - 3 * c + d) * u3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push([...points[points.length - 1]] as [number, number]);
  return out;
}
const PATH = catmull(PTS.map(toXY));
const D = (a: number, b: number) => "M " + PATH.slice(Math.max(0, a), Math.max(a + 1, b) + 1).map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ");
const AXIS_Y = Y0 + 250;

// Venus' path index over time (frame 0 and the last frame share the same position → seamless loop)
const venusAt = (t: number) => {
  const crossEnd = E(14);
  if (t < S(11)) return interpolate(t, [0, S(11)], [START_IDX, START_IDX + 10], cl);
  if (t < crossEnd) return interpolate(t, [S(11), crossEnd], [START_IDX + 10, CROSS_IDX + 12], { ...cl, easing: inOut });
  if (t < S(31)) return interpolate(t, [crossEnd, S(31)], [CROSS_IDX + 12, CROSS_IDX + 22], cl);
  if (t < E(33)) return interpolate(t, [S(31), E(33)], [CROSS_IDX + 22, DIR_IDX], { ...cl, easing: inOut });
  if (t < S(36)) return DIR_IDX;
  return interpolate(t, [S(36), last - 0.1], [DIR_IDX, START_IDX], { ...cl, easing: inOut });
};
const at = (i: number) => {
  const a = Math.floor(i), b = Math.min(PATH.length - 1, a + 1), f = i - a;
  return [PATH[a][0] + (PATH[b][0] - PATH[a][0]) * f, PATH[a][1] + (PATH[b][1] - PATH[a][1]) * f] as const;
};

// small ink-style chat row
const Row: React.FC<{ y: number; initial: string; line: number; op: number; lit: number; muted: number; text?: string }> = ({ y, initial, line, op, lit, muted, text }) => (
  <div style={{ position: "absolute", left: 130, right: 150, top: y, height: 92, display: "flex", alignItems: "center", gap: 28, opacity: op * (1 - muted * 0.55) }}>
    <div style={{ width: 76, height: 76, borderRadius: 38, border: `2.5px solid ${lit > 0.5 ? BLUSH : SOFT}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 500, fontSize: 40, color: lit > 0.5 ? BLUSH : IVORY, boxShadow: `0 0 ${36 * lit}px ${10 * lit}px rgba(240,184,166,0.28)` }}>{initial}</div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
      {text && lit > 0.02 ? (
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 44, color: IVORY, opacity: lit, whiteSpace: "nowrap" }}>{text}</div>
      ) : (
        <>
          <div style={{ width: `${line}%`, height: 3, background: SOFT, borderRadius: 2 }} />
          <div style={{ width: `${line * 0.6}%`, height: 3, background: "rgba(237,230,214,0.28)", borderRadius: 2 }} />
        </>
      )}
    </div>
    <div style={{ width: 18, height: 18, borderRadius: 9, background: BLUSH, opacity: lit * (1 - muted), boxShadow: "0 0 20px 6px rgba(240,184,166,0.4)" }} />
  </div>
);

export const Reel20261023: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const vi = venusAt(t);
  const [vx, vy] = at(vi);
  const pulse = 1 + 0.12 * Math.sin(t * 5);

  // beats
  const dateK = ramp(t, S(7), S(7) + 0.5) * (1 - ramp(t, S(19) - 0.3, S(19)));
  const rxK = ramp(t, S(9), S(10) + 0.3);
  const crossK = ramp(t, S(13), E(14));
  const libraK = ramp(t, S(15), E(18)) * (1 - ramp(t, S(19) - 0.2, S(19) + 0.3));
  const rowsK = ramp(t, S(19), S(21));
  const litK = ramp(t, S(22), S(23) + 0.2);
  const mutedK = ramp(t, S(26), E(30));
  const rowsOut = 1 - ramp(t, S(31) - 0.3, S(31) + 0.2);
  const dirK = ramp(t, S(33), S(34) + 0.3) * (1 - ramp(t, S(36), S(36) + 0.4));
  const loopK = ramp(t, last - 0.6, last + 0.1);

  // camera: push toward the cusp on the crossing, toward Libra on the direct station, back out for the loop
  const push1 = ramp(t, S(11), E(14), inOut) * (1 - ramp(t, S(19), S(20), inOut));
  const push2 = ramp(t, S(31), E(35), inOut) * (1 - ramp(t, S(36), last, inOut));
  const scale = 1 + 0.08 * push1 + 0.07 * push2 + 0.012 * Math.sin(t * 0.9);
  const ox = interpolate(push2, [0, 1], [CUSP_X, CUSP_X - 4 * SX]);
  const dim = 1 - 0.55 * ramp(t, last - 0.5, last + 0.3);

  // drawn path: everything up to now in ivory; the retrograde stretch (from the station) in blush
  const travelled = Math.floor(vi);
  const rxStart = RX_IDX;

  return (
    <AbsoluteFill>
      <Night t={t} />

      {/* ── central diagram ── */}
      <AbsoluteFill style={{ opacity: dim, scale, transformOrigin: `${ox}px ${Y0}px` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <radialGradient id="vglow"><stop offset="0%" stopColor={BLUSH} stopOpacity={0.6} /><stop offset="100%" stopColor={BLUSH} stopOpacity={0} /></radialGradient>
          </defs>
          {/* ecliptic axis with degree ticks */}
          <line x1={CUSP_X - 11 * SX} y1={AXIS_Y} x2={CUSP_X + 10.5 * SX} y2={AXIS_Y} stroke={SOFT} strokeWidth={2.5} />
          {Array.from({ length: 22 }, (_, k) => k - 11).map((d) => (
            <line key={d} x1={CUSP_X + d * SX} y1={AXIS_Y - (d % 5 === 0 ? 14 : 6)} x2={CUSP_X + d * SX} y2={AXIS_Y + (d % 5 === 0 ? 14 : 6)} stroke={SOFT} strokeWidth={2.5} />
          ))}
          {/* the cusp: one ink line */}
          <line x1={CUSP_X} y1={Y0 - 250} x2={CUSP_X} y2={AXIS_Y + 20} stroke={crossK > 0.5 && crossK < 1 ? BLUSH : IVORY} strokeWidth={2.5} opacity={0.85} />
          <text x={CUSP_X - 30} y={AXIS_Y + 64} fill={libraK > 0.3 ? BLUSH : IVORY} fontFamily={SANS} fontSize={26} letterSpacing={9} textAnchor="end">LIBRA</text>
          <text x={CUSP_X + 30} y={AXIS_Y + 64} fill={IVORY} fontFamily={SANS} fontSize={26} letterSpacing={9} textAnchor="start">SCORPIO</text>
          <text x={CUSP_X - 3 * SX} y={Y0 - 218} fill={libraK > 0.3 ? BLUSH : SOFT} fontFamily={SYM} fontSize={64 + libraK * 22} textAnchor="middle">♎︎</text>
          <text x={CUSP_X + 3 * SX} y={Y0 - 218} fill={SOFT} fontFamily={SYM} fontSize={64} textAnchor="middle">♏︎</text>

          {/* the whole loop, faint: where she's been and where she's going */}
          <path d={D(0, END_IDX)} fill="none" stroke={SOFT} strokeWidth={2.5} strokeDasharray="3 10" strokeLinecap="round" opacity={0.7} />
          {/* travelled: direct (ivory), retrograde (blush) */}
          <path d={D(0, Math.min(travelled, rxStart))} fill="none" stroke={IVORY} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
          <path d={D(rxStart, travelled)} fill="none" stroke={BLUSH} strokeWidth={3} strokeLinecap="round" opacity={0.6 + 0.4 * rxK} />

          {/* station markers */}
          <g opacity={rxK * (1 - ramp(t, S(19) - 0.3, S(19)))}>
            <circle cx={PATH[RX_IDX][0]} cy={PATH[RX_IDX][1]} r={12} fill="none" stroke={IVORY} strokeWidth={2.5} />
            <text x={PATH[RX_IDX][0] + 10} y={PATH[RX_IDX][1] - 120} fill={IVORY} fontFamily={SANS} fontSize={24} letterSpacing={6} textAnchor="end">RETROGRADE</text>
            <text x={PATH[RX_IDX][0] + 10} y={PATH[RX_IDX][1] - 86} fill={SOFT} fontFamily={SANS} fontSize={24} letterSpacing={6} textAnchor="end">SINCE OCT 3</text>
          </g>
          <g opacity={dirK}>
            <circle cx={PATH[DIR_IDX][0]} cy={PATH[DIR_IDX][1]} r={14} fill="none" stroke={IVORY} strokeWidth={2.5} />
            <text x={PATH[DIR_IDX][0] - 6} y={PATH[DIR_IDX][1] + 66} fill={BLUSH} fontFamily={SANS} fontSize={26} letterSpacing={7} textAnchor="start">DIRECT · NOV 13</text>
            <text x={PATH[DIR_IDX][0] - 6} y={PATH[DIR_IDX][1] + 100} fill={SOFT} fontFamily={SANS} fontSize={24} letterSpacing={6} textAnchor="start">22°52′ LIBRA</text>
          </g>

          {/* Venus: the single blush point */}
          <circle cx={vx} cy={vy} r={70 * pulse} fill="url(#vglow)" />
          <circle cx={vx} cy={vy} r={15} fill={BLUSH} />
          <text x={vx} y={vy - 40} fill={IVORY} fontFamily={SYM} fontSize={40} textAnchor="middle" opacity={rxK * (1 - dirK) * (1 - loopK) + loopK * 0}>♀︎</text>
        </svg>
        {/* date tag on the cusp */}
        <div style={{ position: "absolute", left: CUSP_X - 200, width: 400, top: Y0 - 310, textAlign: "center", fontFamily: SANS, fontSize: 26, letterSpacing: "0.36em", color: BLUSH, opacity: dateK, translate: `0px ${(1 - ramp(t, S(7), S(7) + 0.5)) * 14}px` }}>SUN · OCT 25</div>
        <div style={{ position: "absolute", left: CUSP_X - 300, width: 600, top: AXIS_Y + 96, textAlign: "center", fontFamily: SANS, fontSize: 24, letterSpacing: "0.34em", color: BLUSH, opacity: libraK }}>THE SIGN OF PARTNERSHIP</div>
      </AbsoluteFill>

      {/* ── old names / old chats, between captions and diagram ── */}
      <AbsoluteFill style={{ opacity: rowsK * rowsOut }}>
        {[
          { y: 600, i: "J", l: 62, d: 0 },
          { y: 712, i: "M", l: 48, d: 0.25 },
          { y: 824, i: "A", l: 55, d: 0.5 },
        ].map((r, k) => {
          const inK = ramp(t, S(19) + r.d, S(19) + r.d + 0.5);
          return (
            <div key={r.i} style={{ position: "absolute", inset: 0, translate: `0px ${(1 - inK) * 40}px` }}>
              <Row y={r.y} initial={r.i} line={r.l} op={inK} lit={k === 0 ? litK : 0} muted={mutedK} text={k === 0 ? "hey stranger…" : undefined} />
            </div>
          );
        })}
        <div style={{ position: "absolute", right: 150, top: 560, fontFamily: SANS, fontSize: 24, letterSpacing: "0.32em", color: SOFT, opacity: mutedK }}>MUTED</div>
      </AbsoluteFill>

      <HookTitle t={t} text="Your ex is about to remember you." accent={["ex"]} until={S(7)} top={300} size={126} />
      <ShortCaptions t={t} words={WORDS} phrases={PHRASES} endAt={DUR} top={260} />
      <LoopSignoff t={t} from={last - 0.4} />

      <Audio src={staticFile("vo/2026-10-23.mp3")} />
      <Audio src={staticFile("music/ambient.wav")} volume={(f) => interpolate(f / fps, [0, DUR - 0.3, DUR], [0.11, 0.11, 0.05], cl)} />
      <Sequence from={Math.round(S(14) * fps)} layout="none"><Audio src={staticFile("music/chime.wav")} volume={0.25} /></Sequence>
    </AbsoluteFill>
  );
};

