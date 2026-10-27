import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "../brand";
import { SANS, SERIF } from "../brand";
import { BLUSH, cl, HookTitle, IVORY, LoopSignoff, Night, ramp, ShortCaptions, timing, type Phrase } from "../kit/Short";
import { WORDS } from "./words-20261024";

loadFont({ family: "TotemSymbols", url: staticFile("fonts/NotoSansSymbols.ttf"), weight: "100 900" });

// ── Totem · Full Moon in Taurus (Mon 26 Oct 2026) ───────────────────────────────────────────
// One idea: the zodiac dial with the Sun in Scorpio at the bottom. The Moon (the blush point) climbs to the
// exact opposite point, 2°46′ Taurus, and turns full; its light finds the things you kept "just in case".
// Verified 24 Oct 2026: cafeastrology.com full-moon-on-october-26-2026 (12:12 am EDT, 2°46′ Taurus, square Pluto)
// + bonniesorsby.com Oct 2026 forecast (2°46′ Taurus, opposite the Scorpio stellium, T-square Pluto 3°06′ Aquarius)
// + girlandhermoon.com (Oct 26, 4:11 am London). = 05:12 Amsterdam (CET from Oct 25).

const { S, E, last } = timing(WORDS);
export const REEL_20261024_DURATION = Math.round((last + 0.8) * 30) / 30;
const DUR = REEL_20261024_DURATION;
const SOFT = "rgba(237,230,214,0.5)";
const inOut = Easing.inOut(Easing.cubic);
const SYM = "TotemSymbols";

const PHRASES: Phrase[] = [
  { from: 7, to: 9, accent: [7] },
  { from: 10, to: 15, accent: [15] },
  { from: 16, to: 22, accent: [21] },
  { from: 23, to: 28, accent: [24] },
  { from: 29, to: 31, accent: [31] },
  { from: 32, to: 34, accent: [34] },
  { from: 35, to: 38, accent: [35] },
];

// ── geometry ─────────────────────────────────────────────────────────────────────────────────
const CX = 540, CY = 1215, R = 268;
const FULL_L = 32.77; // 2°46′ Taurus (ecliptic longitude)
const SUN_L = FULL_L + 180; // 2°46′ Scorpio at the moment of the full moon
const START_L = FULL_L - 17; // ≈ where the Moon is tonight (Sat 24 Oct, ~32 h before exact)
const th = (L: number) => ((90 + (L - FULL_L)) * Math.PI) / 180; // the full-moon point sits at the top
const P = (L: number, r: number) => [CX + Math.cos(th(L)) * r, CY - Math.sin(th(L)) * r] as const;
const GLYPHS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

const moonL = (t: number) => {
  if (t < S(7)) return interpolate(t, [0, S(7)], [START_L, START_L + 6], cl);
  if (t < E(13)) return interpolate(t, [S(7), E(13)], [START_L + 6, FULL_L], { ...cl, easing: inOut });
  if (t < S(38)) return FULL_L;
  return interpolate(t, [S(38), last + 0.45], [FULL_L, START_L], { ...cl, easing: inOut });
};

/** Moon disk with the lit part facing the Sun (towards the dial's centre). e = elongation in degrees. */
const MoonDisk: React.FC<{ x: number; y: number; r: number; e: number; full: number }> = ({ x, y, r, e, full }) => {
  const c = Math.cos((e * Math.PI) / 180);
  const rx = Math.max(0.01, r * Math.abs(c));
  const rot = (Math.atan2(CY - y, CX - x) * 180) / Math.PI;
  const lit = `M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r} A ${rx} ${r} 0 0 ${c < 0 ? 1 : 0} 0 ${-r} Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <circle r={r} fill="rgba(20,19,24,0.9)" stroke={SOFT} strokeWidth={2.5} />
      <path d={lit} fill={BLUSH} opacity={0.6 + 0.4 * full} />
      <circle r={r} fill={BLUSH} opacity={full} />
    </g>
  );
};

const KEPT = ["their hoodie", "a voice note from June", "the playlist"];

export const Reel20261024: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const L = moonL(t);
  const [mx, my] = P(L, R);
  const elong = L - SUN_L + 360;
  const fullK = ramp(t, S(13) - 0.1, E(13) + 0.2) * (1 - ramp(t, S(38), last + 0.3));
  const bloom = 1 + 0.08 * Math.sin(t * 4.5);

  // beats
  const dateK = ramp(t, S(7), S(7) + 0.4) * (1 - ramp(t, S(23) - 0.3, S(23)));
  const axisK = ramp(t, S(13), S(13) + 0.55);
  const axisOut = 1 - ramp(t, S(38), S(38) + 0.5);
  const taurusK = ramp(t, S(15), S(15) + 0.4) * (1 - ramp(t, S(38), S(38) + 0.4));
  const wedgeK = ramp(t, S(17), S(17) + 0.5) * (1 - ramp(t, S(23), S(23) + 0.4));
  const sunLabK = ramp(t, S(13), S(13) + 0.4) * (1 - ramp(t, S(16), S(16) + 0.4));
  const coneK = ramp(t, S(24), S(25) + 0.2) * (1 - ramp(t, S(38), S(38) + 0.4));
  const lessonK = ramp(t, S(33), E(34));
  const restK = ramp(t, S(35), E(37), inOut);
  const rowsGone = ramp(t, S(38), S(38) + 0.35);

  // camera: push toward the Moon on the date + full beats, a second push on "the sign of…", release for the rows
  const push1 = ramp(t, S(7), E(13), inOut);
  const push2 = ramp(t, S(16), E(22), inOut);
  const rel = ramp(t, S(23), S(24), inOut);
  const loopRel = ramp(t, S(38), last + 0.4, inOut);
  const scale = (1 + (0.07 * push1 + 0.05 * push2) * (1 - rel) + 0.02 * ramp(t, 0, S(7))) * (1 - loopRel) + loopRel + 0.01 * Math.sin(t * 0.9);
  const shiftY = (40 * push1 + 30 * push2) * (1 - rel) * (1 - loopRel);
  const dim = 1 - 0.55 * ramp(t, last - 0.5, last + 0.3);

  const axisLen = 2 * R;
  const [sx, sy] = P(SUN_L, R);
  const [ax0, ay0] = P(30, R), [ax1, ay1] = P(60, R);

  return (
    <AbsoluteFill>
      <Night t={t} />

      {/* ── light cone from the Moon up to the kept things ── */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: coneK * 0.9 }}>
        <defs>
          <linearGradient id="cone" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={BLUSH} stopOpacity={0.32} />
            <stop offset="100%" stopColor={BLUSH} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={`M ${CX - 30} ${CY - R} L 150 560 L 930 560 L ${CX + 30} ${CY - R} Z`} fill="url(#cone)" />
      </svg>

      {/* ── central dial ── */}
      <AbsoluteFill style={{ opacity: dim, scale, translate: `0px ${shiftY}px`, transformOrigin: `${CX}px ${CY - R}px` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <radialGradient id="mglow"><stop offset="0%" stopColor={BLUSH} stopOpacity={0.65} /><stop offset="100%" stopColor={BLUSH} stopOpacity={0} /></radialGradient>
          </defs>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke={SOFT} strokeWidth={2.5} />
          <circle cx={CX} cy={CY} r={R - 96} fill="none" stroke="rgba(237,230,214,0.28)" strokeWidth={2.5} />
          {Array.from({ length: 12 }, (_, i) => {
            const [x1, y1] = P(i * 30, R - 96), [x2, y2] = P(i * 30, R + 14);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={SOFT} strokeWidth={2.5} />;
          })}
          <path d={`M ${ax0} ${ay0} A ${R} ${R} 0 0 0 ${ax1} ${ay1}`} fill="none" stroke={BLUSH} strokeWidth={6} strokeLinecap="round" opacity={wedgeK} />
          {GLYPHS.map((g, i) => {
            const [x, y] = P(i * 30 + 15, R - 50);
            const isT = i === 1;
            return (
              <text key={g} x={x} y={y + 13} fill={isT && taurusK > 0.3 ? BLUSH : SOFT} fontFamily={SYM} fontSize={isT ? 34 + 14 * taurusK : 34} textAnchor="middle">{g}︎</text>
            );
          })}
          <circle cx={CX} cy={CY} r={8} fill="none" stroke={IVORY} strokeWidth={2.5} />

          {/* opposition axis: Moon ↔ Sun, drawn from the Moon */}
          <line x1={CX} y1={CY - R} x2={CX} y2={CY + R} stroke={IVORY} strokeWidth={2.5} strokeDasharray={`${axisLen * axisK} ${axisLen}`} opacity={0.75 * axisOut} />

          {/* Sun ☉ in Scorpio */}
          <circle cx={sx} cy={sy} r={40} fill="rgba(20,19,24,0.9)" />
          <circle cx={sx} cy={sy} r={22} fill="none" stroke={IVORY} strokeWidth={3} />
          <circle cx={sx} cy={sy} r={4.5} fill={IVORY} />
          <text x={sx + 48} y={sy + 9} fill={SOFT} fontFamily={SANS} fontSize={24} letterSpacing={7} opacity={sunLabK}>SUN · SCORPIO</text>

          {/* the Moon: the single blush point */}
          <circle cx={mx} cy={my} r={(70 + 50 * fullK) * bloom} fill="url(#mglow)" opacity={0.7 + 0.3 * fullK} />
          <MoonDisk x={mx} y={my} r={24} e={elong} full={fullK} />
          <circle cx={mx} cy={my} r={38 + 14 * ((t * 1.2) % 1)} fill="none" stroke={BLUSH} strokeWidth={2.5} opacity={(1 - ((t * 1.2) % 1)) * 0.5 * (1 - fullK)} />
        </svg>

        {/* labels beside the full-moon point */}
        <div style={{ position: "absolute", left: CX + 70, top: CY - R - 64, fontFamily: SANS, fontSize: 26, letterSpacing: "0.34em", lineHeight: 1.45, color: BLUSH, opacity: dateK, translate: `${(1 - ramp(t, S(7), S(7) + 0.4)) * 14}px 0px` }}>
          FULL MOON<br /><span style={{ color: IVORY }}>MON · OCT 26</span>
        </div>
        <div style={{ position: "absolute", right: 1080 - (CX - 70), top: CY - R - 64, textAlign: "right", fontFamily: SANS, fontSize: 26, letterSpacing: "0.34em", lineHeight: 1.45, color: IVORY, opacity: taurusK * (1 - ramp(t, S(23) - 0.3, S(23))) }}>
          2°46′<br /><span style={{ color: BLUSH }}>TAURUS</span>
        </div>
      </AbsoluteFill>

      {/* ── the things you kept, lit by the Moon ── */}
      <AbsoluteFill style={{ opacity: 1 - rowsGone }}>
        {KEPT.map((txt, i) => {
          const inK = ramp(t, S(24) + i * 0.18, S(24) + i * 0.18 + 0.45);
          const litAt = [S(26), S(28), S(31)][i];
          const lit = ramp(t, litAt, litAt + 0.3);
          const isLesson = i === 1;
          const gone = isLesson ? 0 : restK;
          const top = 600 + i * 104;
          const gx = 0, gy = 36 * gone;
          return (
            <div key={txt} style={{ position: "absolute", left: 150, right: 150, top, height: 84, display: "flex", alignItems: "center", gap: 26, opacity: inK * (1 - ramp(gone, 0, 0.55, Easing.linear)), translate: `${gx}px ${gy + (1 - inK) * 30}px`, scale: 1 - 0.25 * gone }}>
              <div style={{ width: 64, height: 64, borderRadius: 32, border: `2.5px solid ${lit > 0.5 ? BLUSH : SOFT}`, boxShadow: `0 0 ${30 * lit}px ${8 * lit}px rgba(240,184,166,0.28)`, flexShrink: 0 }} />
              <div style={{ position: "relative", flex: 1, height: 64 }}>
                <div style={{ position: "absolute", inset: 0, fontFamily: SERIF, fontWeight: 500, fontSize: 48, color: IVORY, opacity: (0.45 + 0.55 * lit) * (isLesson ? 1 - lessonK : 1), whiteSpace: "nowrap" }}>{txt}</div>
                {isLesson ? <div style={{ position: "absolute", inset: 0, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 52, color: BLUSH, opacity: lessonK, whiteSpace: "nowrap" }}>the lesson</div> : null}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      <HookTitle t={t} text="The full moon wants their hoodie back." accent={["hoodie"]} until={S(7) - 0.35} top={290} size={124} />
      <ShortCaptions t={t} words={WORDS} phrases={PHRASES} endAt={DUR} top={260} />
      <LoopSignoff t={t} from={last - 0.4} cta="Send this to whoever has the hoodie." />

      <Audio src={staticFile("vo/2026-10-24.mp3")} />
      <Audio src={staticFile("music/ambient.wav")} volume={(f) => interpolate(f / fps, [0, DUR - 0.3, DUR], [0.11, 0.11, 0.05], cl)} />
      <Sequence from={Math.round(S(13) * fps)} layout="none"><Audio src={staticFile("music/chime.wav")} volume={0.25} /></Sequence>
    </AbsoluteFill>
  );
};
