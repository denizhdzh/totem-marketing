import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "../brand";
import { SANS, SERIF } from "../brand";
import { WORDS } from "../data/cazimiWords";

// ── Totem · Venus Cazimi (23 Oct 2026) ─────────────────────────────────────────────
// One idea carries the whole piece: Venus is a point of light. Her real retrograde path is a
// single ink line; where it loops, the Sun's glyph ☉ closes around her and she becomes its dot.

export const CAZIMI_DURATION = 36.8;
const IVORY = "#EDE6D6";
const IVORY_SOFT = "rgba(237,230,214,0.5)";
const BLUSH = "#F0B8A6";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.inOut(Easing.cubic);
const S = (i: number) => WORDS[i][1]; // word start (s)
const E = (i: number) => WORDS[i][2]; // word end (s)
const ramp = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], { ...cl, easing: e });

// ── geometry: geocentric Venus, Sep 20 – Dec 1 2026 (°lon from 0° Scorpio, °lat) ─────
// stations retrograde 8°29′ Scorpio (Oct 3) · cazimi 0°45′ Scorpio (Oct 23) · direct 22°52′ Libra (Nov 13)
const PTS: [number, number][] = [
  [-17, 3.3], [-12, 3.4], [-6, 3.2], [3, 2.6], [7.4, 1.8], [8.5, 0.9], [7.6, -0.1], [4.6, -1.3],
  [0.75, -2.4], [-3.2, -3.5], [-6.2, -4.6], [-7.1, -5.5], [-6.0, -6.3], [-1.5, -6.9], [6, -7.3], [16, -7.5],
];
const SEG = 24;
const ST_IDX = 5 * SEG, CAZ_IDX = 8 * SEG, DIRECT_IDX = 11 * SEG;
const X0 = 560, Y0 = 1060, SX = 27, SY = 52;
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
const PATH_D = "M " + PATH.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ");
const [CX, CY] = PATH[CAZ_IDX];
const SUN_R = 92;

// fragments that orbit the Sun in "what's real stays / what isn't burns off"
const FRAGS = Array.from({ length: 46 }, (_, k) => {
  const r = (n: number) => { const x = Math.sin(k * 127.1 + n * 311.7) * 43758.5453; return x - Math.floor(x); };
  return { a: r(1) * Math.PI * 2, rad: 140 + r(2) * 210, len: 10 + r(3) * 26, stays: r(4) > 0.55, drift: 0.6 + r(5) * 0.8, rot: (r(6) - 0.5) * 1.2 };
});

// ── captions: phrases revealed word by word (karaoke) ─────────────────────────────
const PHRASES: { from: number; to: number; big?: boolean; accent?: number[] }[] = [
  { from: 0, to: 8, big: true, accent: [2, 8] },
  { from: 9, to: 18, accent: [11] },
  { from: 19, to: 30, accent: [29, 30] },
  { from: 31, to: 38, accent: [38] },
  { from: 39, to: 43, accent: [43] },
  { from: 44, to: 52, accent: [47, 48] },
  { from: 53, to: 55, accent: [54] },
  { from: 56, to: 59, accent: [58, 59] },
  { from: 60, to: 73, accent: [] },
  { from: 74, to: 77, accent: [76, 77] },
  { from: 78, to: 82, accent: [82] },
];

const Captions: React.FC<{ t: number }> = ({ t }) => {
  const idx = PHRASES.findIndex((p, i) => t >= S(p.from) - 0.12 && (i === PHRASES.length - 1 || t < S(PHRASES[i + 1].from) - 0.12));
  if (idx < 0 || t > 33.4) return null;
  const p = PHRASES[idx];
  const words = WORDS.slice(p.from, p.to + 1);
  const big = !!p.big;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: big ? 300 : 250 }}>
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
            }}>{w.replace("...", "…")}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── the sky diagram ──────────────────────────────────────────────────────────────
const venusIndexAt = (t: number) => {
  if (t < S(9)) return 0;
  if (t < S(13)) return Math.round(interpolate(t, [S(9), S(13)], [0, ST_IDX], { ...cl, easing: Easing.out(Easing.quad) }));
  if (t < S(16)) return ST_IDX; // the station: she stops
  if (t < E(38)) return Math.round(interpolate(t, [S(16), E(38) - 0.25], [ST_IDX, CAZ_IDX], { ...cl, easing: Easing.inOut(Easing.sin) }));
  if (t < S(79)) return CAZ_IDX; // held in the heart of the Sun
  return Math.round(interpolate(t, [S(79), 33.6], [CAZ_IDX, DIRECT_IDX + 40], { ...cl, easing: Easing.inOut(Easing.quad) }));
};

export const CazimiReel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const vi = venusIndexAt(t);
  const [vx, vy] = PATH[vi];
  const drawnTo = Math.max(vi, t > E(38) ? CAZ_IDX : 0) / (PATH.length - 1);

  // camera: wide on the path, then pushes into the Sun for the middle act, then eases back out
  const inK = ramp(t, S(39) - 0.4, S(44), inOut);
  const outK = ramp(t, S(74), S(79), inOut);
  const k = inK * (1 - outK);
  const scale = interpolate(k, [0, 1], [1, 1.32]);
  const tx = interpolate(k, [0, 1], [0, 540 - CX]);
  const ty = interpolate(k, [0, 1], [0, 1080 - CY]);
  const sunX = CX + tx, sunY = CY + ty;

  const hookPulse = t < S(7) ? 1 + 0.3 * Math.max(0, Math.sin(t * 5.4)) ** 8 : 1;
  const dialK = ramp(t, S(28), E(30), Easing.out(Easing.quad));
  const dialOut = 1 - ramp(t, S(31), S(33));
  const sunDraw = ramp(t, S(32), S(38), ease);
  const arrived = ramp(t, E(38) - 0.3, E(38));
  const pulse = ramp(t, E(38) - 0.2, E(38) + 1.4, Easing.out(Easing.cubic));
  const pulse2 = ramp(t, S(47), S(47) + 1.4, Easing.out(Easing.cubic)); // the "reset"
  const resetSpin = interpolate(t, [S(47) - 0.1, E(48) + 0.3], [0, -360], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const venusGone = ramp(t, 33.6, 34.2);
  const diagramDim = 1 - 0.9 * ramp(t, 33.2, 34.2);

  // notification card (hook)
  const card = ramp(t, 0.05, 0.6) * (1 - ramp(t, S(7) - 0.1, S(8)));
  const cardY = interpolate(ramp(t, 0.05, 0.7), [0, 1], [-60, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#141318" }}>
      <Img src={staticFile("brand/night-paper.jpg")} style={{ position: "absolute", width: "100%", height: "100%", scale: 1 + t * 0.002 }} />

      <AbsoluteFill style={{ opacity: diagramDim }}>
        <AbsoluteFill style={{ translate: `${tx}px ${ty}px`, scale, transformOrigin: `${CX}px ${CY}px` }}>
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <defs>
              <radialGradient id="glow"><stop offset="0%" stopColor={BLUSH} stopOpacity={0.6} /><stop offset="100%" stopColor={BLUSH} stopOpacity={0} /></radialGradient>
              <radialGradient id="sunglow"><stop offset="0%" stopColor={IVORY} stopOpacity={0.16} /><stop offset="100%" stopColor={IVORY} stopOpacity={0} /></radialGradient>
            </defs>

            {/* ecliptic */}
            <g opacity={ramp(t, S(9) - 0.3, S(11)) * (1 - 0.6 * k)}>
              <line x1={20} y1={Y0} x2={1060} y2={Y0} stroke={IVORY_SOFT} strokeWidth={1} strokeDasharray="2 8" />
              {Array.from({ length: 37 }, (_, d) => d - 18).map((deg) => (
                <line key={deg} x1={X0 + deg * SX} y1={Y0 - (deg % 5 === 0 ? 9 : 4)} x2={X0 + deg * SX} y2={Y0 + (deg % 5 === 0 ? 9 : 4)} stroke={IVORY_SOFT} strokeWidth={1} />
              ))}
              <text x={X0 - 12 * SX} y={Y0 + 40} fill={IVORY_SOFT} fontFamily={SANS} fontSize={19} letterSpacing={6} textAnchor="middle">← LIBRA</text>
              <text x={X0 + 9 * SX} y={Y0 + 40} fill={IVORY_SOFT} fontFamily={SANS} fontSize={19} letterSpacing={6} textAnchor="middle">SCORPIO →</text>
            </g>

            {/* Venus' path, one ink line */}
            <path d={PATH_D} fill="none" stroke={IVORY} strokeWidth={2} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawnTo} opacity={0.9 * (1 - 0.5 * k)} />
            {/* station marker */}
            <g opacity={ramp(t, S(13), S(14) + 0.3) * (1 - 0.7 * k)}>
              <circle cx={PATH[ST_IDX][0]} cy={PATH[ST_IDX][1]} r={6} fill="none" stroke={IVORY} strokeWidth={1.4} />
              <text x={PATH[ST_IDX][0] - 4} y={PATH[ST_IDX][1] - 34} fill={IVORY_SOFT} fontFamily={SANS} fontSize={20} letterSpacing={5} textAnchor="end">TURNS RETROGRADE · OCT 3</text>
            </g>

            {/* every nineteen months: a dial of 19 ticks around the place she's heading */}
            <g opacity={dialK * dialOut}>
              {Array.from({ length: 19 }, (_, i) => {
                const a = -Math.PI / 2 + (i / 19) * Math.PI * 2;
                const on = dialK * 19 > i;
                return <line key={i} x1={CX + Math.cos(a) * 200} y1={CY + Math.sin(a) * 200} x2={CX + Math.cos(a) * 222} y2={CY + Math.sin(a) * 222} stroke={i === 18 ? BLUSH : IVORY} strokeWidth={2} opacity={on ? 1 : 0} />;
              })}
              <circle cx={CX} cy={CY} r={211} fill="none" stroke={IVORY_SOFT} strokeWidth={0.8} strokeDasharray="1 6" />
              <text x={CX} y={CY + 262} fill={IVORY} fontFamily={SANS} fontSize={21} letterSpacing={7} textAnchor="middle">ONCE EVERY 19 MONTHS</text>
            </g>

            {/* the Sun ☉ */}
            <circle cx={CX} cy={CY} r={260} fill="url(#sunglow)" opacity={arrived} />
            <g transform={`rotate(${resetSpin} ${CX} ${CY})`}>
              <circle cx={CX} cy={CY} r={SUN_R} fill="none" stroke={IVORY} strokeWidth={2.4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sunDraw} transform={`rotate(-90 ${CX} ${CY})`} />
              {/* tick marks on the rim make the reset spin readable */}
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return <line key={i} x1={CX + Math.cos(a) * (SUN_R + 8)} y1={CY + Math.sin(a) * (SUN_R + 8)} x2={CX + Math.cos(a) * (SUN_R + (i % 3 === 0 ? 22 : 14))} y2={CY + Math.sin(a) * (SUN_R + (i % 3 === 0 ? 22 : 14))} stroke={IVORY} strokeWidth={1.4} opacity={ramp(t, S(39), S(41))} />;
              })}
            </g>
            <circle cx={CX} cy={CY} r={SUN_R + pulse * 170} fill="none" stroke={IVORY} strokeWidth={1.2} opacity={(1 - pulse) * 0.7 * arrived} />
            <circle cx={CX} cy={CY} r={SUN_R + pulse * 90} fill="none" stroke={BLUSH} strokeWidth={1} opacity={(1 - pulse) * 0.6 * arrived} />
            <circle cx={CX} cy={CY} r={SUN_R + pulse2 * 260} fill="none" stroke={IVORY} strokeWidth={1} opacity={(1 - pulse2) * 0.6 * ramp(t, S(47), S(47) + 0.1)} />

            {/* what's real stays · what isn't burns off */}
            {FRAGS.map((f, i) => {
              const appear = ramp(t, S(53) + i * 0.008, S(53) + 0.4 + i * 0.008);
              const settle = ramp(t, S(55), E(55));
              const burn = f.stays ? 0 : ramp(t, S(58) + (i % 7) * 0.05, S(58) + 1.3 + (i % 7) * 0.05, Easing.in(Easing.quad));
              const fade = 1 - ramp(t, S(60), S(61));
              const r = f.rad - (f.stays ? settle * (f.rad - 120) * 0.35 : 0);
              const a = f.a + t * 0.05 * f.drift;
              const x = CX + Math.cos(a) * r, y = CY + Math.sin(a) * r - burn * 220 * f.drift;
              const ang = a + Math.PI / 2 + f.rot;
              const col = f.stays ? IVORY : interpolate(burn, [0, 0.15, 1], [0, 1, 1]) > 0.5 ? BLUSH : IVORY;
              const op = appear * fade * (f.stays ? 0.55 + 0.45 * settle : 0.7 * (1 - burn));
              return <line key={i} x1={x - Math.cos(ang) * f.len / 2 * (1 - burn * 0.7)} y1={y - Math.sin(ang) * f.len / 2 * (1 - burn * 0.7)} x2={x + Math.cos(ang) * f.len / 2 * (1 - burn * 0.7)} y2={y + Math.sin(ang) * f.len / 2 * (1 - burn * 0.7)} stroke={col} strokeWidth={f.stays ? 1.8 : 1.4} strokeLinecap="round" opacity={op} />;
            })}

            {/* Venus */}
            <g opacity={(1 - venusGone) * ramp(t, S(9) + 0.05, S(9) + 0.25, Easing.linear)}>
              <circle cx={vx} cy={vy} r={64} fill="url(#glow)" opacity={0.7 + arrived * 0.3} />
              <circle cx={vx} cy={vy} r={9 * hookPulse + arrived * 5 * (1 - ramp(t, S(79), S(80)))} fill={BLUSH} />
            </g>
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* hook: a message notification whose light becomes Venus */}
      <AbsoluteFill style={{ opacity: card }}>
        <div style={{ position: "absolute", left: 100, top: 860 + cardY, width: 880, height: 132, borderRadius: 30, border: `1.5px solid ${IVORY_SOFT}`, background: "rgba(20,19,24,0.72)", display: "flex", alignItems: "center", gap: 26, paddingLeft: 30 }}>
          <div style={{ width: 70, height: 70, borderRadius: 35, border: `1.5px solid ${IVORY_SOFT}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 34, color: IVORY }}>ex</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontFamily: SANS, fontSize: 22, letterSpacing: "0.18em", color: IVORY_SOFT }}>MESSAGE · NOW</div>
            <div style={{ fontFamily: SERIF, fontSize: 40, color: IVORY }}>hey… you up?</div>
          </div>
        </div>
      </AbsoluteFill>
      {/* the pink dot that leaves the notification and becomes Venus (drawn in screen space during the hook) */}
      {t < S(9) + 0.3 ? (() => {
        const p = ramp(t, S(7) - 0.1, S(9) + 0.2, inOut);
        const x = interpolate(p, [0, 1], [930, PATH[0][0]]);
        const y = interpolate(p, [0, 1], [926, PATH[0][1]]) - Math.sin(p * Math.PI) * 140;
        return <div style={{ position: "absolute", left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 9, background: BLUSH, boxShadow: `0 0 40px 14px rgba(240,184,166,0.35)`, opacity: ramp(t, 0.3, 0.7) * (1 - ramp(t, S(9) + 0.1, S(9) + 0.3)), scale: hookPulse }} />;
      })() : null}

      {/* cazimi stamp */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 0 }}>
        <div style={{ position: "absolute", top: sunY + 150 * scale + 40, fontFamily: SANS, fontSize: 23, letterSpacing: "0.42em", color: IVORY, opacity: ramp(t, S(43), S(43) + 0.6) * (1 - ramp(t, S(53) - 0.4, S(53))) }}>
          VENUS CAZIMI · 0°45′ SCORPIO · OCT 23
        </div>
      </AbsoluteFill>

      {/* the fixed cross: Scorpio / Taurus / Leo / Aquarius */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {[
          { i: 64, name: "SCORPIO", dx: 0, dy: -1 },
          { i: 65, name: "TAURUS", dx: 0, dy: 1 },
          { i: 66, name: "LEO", dx: 1, dy: 0 },
          { i: 68, name: "AQUARIUS", dx: -1, dy: 0 },
        ].map((s) => {
          const p = ramp(t, S(s.i) - 0.1, S(s.i) + 0.5);
          const out = 1 - ramp(t, S(74) - 0.3, S(74) + 0.2);
          const r0 = SUN_R * scale + 30, r1 = r0 + 150 * p;
          const lx = sunX + s.dx * (r0 + 210), ly = sunY + s.dy * (r0 + 190);
          return (
            <g key={s.name} opacity={out}>
              <line x1={sunX + s.dx * r0} y1={sunY + s.dy * r0} x2={sunX + s.dx * r1} y2={sunY + s.dy * r1} stroke={IVORY} strokeWidth={1.4} opacity={p} />
              <text x={lx} y={ly + 8} fill={p > 0.5 ? BLUSH : IVORY} fontFamily={SANS} fontSize={26} letterSpacing={8} textAnchor="middle" opacity={p}>{s.name}</text>
            </g>
          );
        })}
        <text x={540} y={1690} fill={IVORY_SOFT} fontFamily={SANS} fontSize={20} letterSpacing={7} textAnchor="middle" opacity={ramp(t, S(64), S(65)) * (1 - ramp(t, S(74) - 0.3, S(74) + 0.2))}>THE FIXED SIGNS FEEL IT MOST</text>
      </svg>

      {/* don't text first: a message field that types, then deletes */}
      {(() => {
        const a = ramp(t, S(74) - 0.2, S(74) + 0.3) * (1 - ramp(t, E(77) + 0.4, E(77) + 0.8));
        if (a <= 0) return null;
        const full = "hey, i miss";
        const typed = Math.floor(interpolate(t, [S(75), S(76) + 0.2], [0, full.length], cl));
        const del = Math.floor(interpolate(t, [S(77), E(77) + 0.2], [0, full.length], cl));
        const shown = full.slice(0, Math.max(0, typed - del));
        const caret = Math.floor(t * 2.2) % 2 === 0;
        return (
          <div style={{ position: "absolute", left: 120, top: 1520, width: 840, height: 96, borderRadius: 48, border: `1.5px solid ${IVORY_SOFT}`, opacity: a, display: "flex", alignItems: "center", paddingLeft: 40, fontFamily: SERIF, fontSize: 42, color: IVORY }}>
            {shown}<span style={{ width: 2, height: 46, background: BLUSH, marginLeft: 4, opacity: caret ? 1 : 0 }} />
            <div style={{ position: "absolute", right: 22, width: 54, height: 54, borderRadius: 27, border: `1.5px solid ${IVORY_SOFT}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 26, color: IVORY_SOFT }}>↑</div>
          </div>
        );
      })()}

      <Captions t={t} />

      {/* end card */}
      <Sequence from={Math.round(33.4 * fps)} layout="absolute-fill">
        <EndCard />
      </Sequence>

      <Sequence from={Math.round(0.08 * fps)} layout="none">
        <Audio src={staticFile("vo/cazimi-siren.mp3")} />
      </Sequence>
      <Audio src={staticFile("music/ambient.wav")} volume={(f) => interpolate(f / fps, [0, 1, CAZIMI_DURATION - 1.5, CAZIMI_DURATION], [0, 0.11, 0.11, 0], cl)} />
      <Sequence from={Math.round((E(38) - 0.25) * fps)} layout="none"><Audio src={staticFile("music/chime.wav")} volume={0.28} /></Sequence>
      <Sequence from={Math.round(S(47) * fps)} layout="none"><Audio src={staticFile("music/chime.wav")} volume={0.16} playbackRate={0.75} /></Sequence>
      <Sequence from={Math.round(33.5 * fps)} layout="none"><Audio src={staticFile("music/chime.wav")} volume={0.22} /></Sequence>
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
