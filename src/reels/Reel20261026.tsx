import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "../brand";
import { SANS, SERIF } from "../brand";
import { BLUSH, cl, HookTitle, IVORY, LoopSignoff, Night, ramp, ShortCaptions, timing, type Phrase } from "../kit/Short";
import { WORDS } from "./words-20261026";

loadFont({ family: "TotemSymbols", url: staticFile("fonts/NotoSansSymbols.ttf"), weight: "100 900" });

// ── Totem · Mercury Rx square Mars (Mon 26 Oct 2026, about Fri 30 Oct) ─────────────────────────
// One idea: the square is a right angle on the zodiac dial between Mercury (messages, retrograde in Scorpio) and
// Mars (heat, in Leo). In front of it, the angry text you are typing. Type it, breathe, delete it.
// Loops on "So whatever they said…" → "Don't send the angry text until Saturday."
// Verified 26 Oct 2026: Mercury Rx in Scorpio square Mars in Leo on Oct 30 (astrolis.com: 1:20 pm EDT;
// fourthcup.substack.com: 10:20 am PDT; stephaniegailing.substack.com: Oct 30). Mercury Rx since Oct 24 (calendar.md).
// Planet positions on the dial are schematic (no degree labels).

const { S, E, last } = timing(WORDS);
export const REEL_20261026_DURATION = Math.round((last + 0.8) * 30) / 30;
const DUR = REEL_20261026_DURATION;
const SOFT = "rgba(237,230,214,0.5)";
const FAINT = "rgba(237,230,214,0.22)";
const inOut = Easing.inOut(Easing.cubic);
const SYM = "TotemSymbols";

const PHRASES: Phrase[] = [
  { from: 7, to: 11, accent: [11] },
  { from: 12, to: 15, accent: [13] },
  { from: 16, to: 19, accent: [17] },
  { from: 20, to: 24, accent: [21] },
  { from: 25, to: 32, accent: [28] },
  { from: 33, to: 37, accent: [35] },
  { from: 38, to: 41, accent: [39] },
];

const CX = 540, CY = 1205, R = 245;
const GLYPHS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
// ecliptic longitude → screen angle (Aries at the left, counter-clockwise, like a chart)
const pt = (lonDeg: number, r: number, rot: number) => {
  const a = Math.PI + ((lonDeg + rot) * Math.PI) / 180;
  return [CX + Math.cos(a) * r, CY - Math.sin(a) * r] as const;
};
const ANGRY = "you ALWAYS do this";

export const Reel20261026: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // dial turns slowly the whole time so frame 0 already moves; it returns to its frame-0 angle for the loop
  const loopK = ramp(t, S(38), last + 0.5, inOut);
  const rot = 88 + interpolate(t, [0, S(38)], [-8, 8], cl) * (1 - loopK) + -8 * loopK;

  // Mercury walks backwards (retrograde) through Scorpio, Mars sits in Leo; they meet the square on "squares"
  const MARS = 137;
  const mercLon = interpolate(t, [0, S(13), S(21)], [233, 230, 227], { ...cl, easing: inOut }) * (1 - loopK) + 233 * loopK;
  const mercK = ramp(t, S(7), S(7) + 0.4);
  const msgK = ramp(t, S(11), S(11) + 0.35);
  const rxK = ramp(t, S(13), S(13) + 0.4);
  const dateK = ramp(t, S(16), S(16) + 0.4);
  const sqK = ramp(t, S(21), S(21) + 0.55) * (1 - loopK);
  const marsK = ramp(t, S(22), S(22) + 0.4);
  const diagOut = 1 - 0.55 * ramp(t, S(25), S(25) + 0.4) * (1 - loopK);

  // chat: angry draft on frame 0 (cursor blinking), "angry" turns it blush, "sharper" makes it shake,
  // "Type it" retypes, "breathe" puts a slow ring round send, "delete it" backspaces to empty, loop retypes it.
  const angryK = ramp(t, S(3), S(3) + 0.3);
  const shake = ramp(t, S(28), S(28) + 0.2) * (1 - ramp(t, S(33), S(33) + 0.2));
  const jitter = shake * 6 * Math.sin(t * 60);
  const nChars = Math.round(
    interpolate(t, [0, S(33), S(33) + 0.01, E(34), S(36), E(37), S(38) + 0.05, last], [ANGRY.length, ANGRY.length, 0, ANGRY.length, ANGRY.length, 0, 0, ANGRY.length], cl),
  );
  const breatheK = ramp(t, S(35), S(35) + 0.3) * (1 - ramp(t, S(36) + 0.2, S(36) + 0.5));
  const breathe = 1 + 0.35 * Math.sin(Math.max(0, t - S(35)) * 4);
  const sendPulse = ramp(t, S(4), S(4) + 0.3) * (1 - ramp(t, S(7), S(7) + 0.3));
  const satK = ramp(t, S(6), S(6) + 0.3) * (1 - ramp(t, S(7) + 0.2, S(7) + 0.5));

  // camera: push into the dial for the astrology beats, back out for the chat beats, home for the loop
  const push = 0.05 * ramp(t, S(7), S(21), inOut) * (1 - ramp(t, S(25), S(25) + 0.6, inOut));
  const scale = 1 + 0.015 * ramp(t, 0, S(7)) + push + 0.006 * Math.sin(t * 1.1);
  const dim = 1 - 0.5 * ramp(t, last - 0.5, last + 0.3);

  const [mx, my] = pt(mercLon, R, rot);
  const [ax, ay] = pt(MARS, R, rot);
  const pulse = (t * 1.3) % 1;
  // right-angle marker at the centre, between the two rays
  const u1 = [(mx - CX) / R, (my - CY) / R], u2 = [(ax - CX) / R, (ay - CY) / R];
  const m = 34;
  const corner = `M ${CX + u1[0] * m} ${CY + u1[1] * m} L ${CX + (u1[0] + u2[0]) * m} ${CY + (u1[1] + u2[1]) * m} L ${CX + u2[0] * m} ${CY + u2[1] * m}`;

  return (
    <AbsoluteFill>
      <Night t={t} />

      <AbsoluteFill style={{ opacity: dim * diagOut, scale, transformOrigin: `${CX}px ${CY}px` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke={SOFT} strokeWidth={2.5} />
          <circle cx={CX} cy={CY} r={R - 70} fill="none" stroke={FAINT} strokeWidth={2.5} />
          {GLYPHS.map((g, i) => {
            const [x1, y1] = pt(i * 30, R, rot), [x2, y2] = pt(i * 30, R - 70, rot);
            const [gx, gy] = pt(i * 30 + 15, R - 35, rot);
            const hot = i === 4 ? marsK : i === 7 ? mercK : 0;
            return (
              <g key={g}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={FAINT} strokeWidth={2.5} />
                <text x={gx} y={gy + 11} fill={hot > 0.5 ? BLUSH : SOFT} fontFamily={SYM} fontSize={30} textAnchor="middle">{g}︎</text>
              </g>
            );
          })}

          {/* the square: two rays from the centre, a right-angle mark, a blush chord between the planets */}
          <line x1={CX} y1={CY} x2={CX + (mx - CX) * sqK} y2={CY + (my - CY) * sqK} stroke={IVORY} strokeWidth={3} opacity={sqK} />
          <line x1={CX} y1={CY} x2={CX + (ax - CX) * sqK} y2={CY + (ay - CY) * sqK} stroke={IVORY} strokeWidth={3} opacity={sqK} />
          <path d={corner} fill="none" stroke={BLUSH} strokeWidth={3} opacity={sqK} />
          <line x1={mx} y1={my} x2={mx + (ax - mx) * sqK} y2={my + (ay - my) * sqK} stroke={BLUSH} strokeWidth={3} strokeDasharray="4 10" strokeLinecap="round" opacity={sqK} />

          {/* retrograde arrow next to Mercury */}
          {(() => {
            const [bx, by] = pt(mercLon - 12, R + 62, rot);
            return <path d={`M ${bx - 16} ${by - 14} L ${bx + 6} ${by} L ${bx - 16} ${by + 14}`} transform={`rotate(${-(mercLon + rot) + 90} ${bx} ${by})`} fill="none" stroke={IVORY} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={rxK * (1 - loopK)} />;
          })()}

          {[{ x: mx, y: my, g: "☿", k: mercK }, { x: ax, y: ay, g: "♂", k: marsK }].map(({ x, y, g, k }) => (
            <g key={g}>
              <circle cx={x} cy={y} r={40 + 12 * pulse} fill="none" stroke={k > 0.5 ? BLUSH : IVORY} strokeWidth={2.5} opacity={(1 - pulse) * (0.2 + 0.3 * k)} />
              <circle cx={x} cy={y} r={34} fill="rgba(20,19,24,0.94)" stroke={IVORY} strokeWidth={3} />
              <text x={x} y={y + 14} fill={k > 0.5 ? IVORY : SOFT} fontFamily={SYM} fontSize={40} textAnchor="middle">{g}︎</text>
            </g>
          ))}
        </svg>

        {/* labels under the dial */}
        <div style={{ position: "absolute", left: 70, right: 70, top: CY + R + 34, display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 26, letterSpacing: "0.32em", lineHeight: 1.5, color: IVORY }}>
          <div style={{ opacity: 0.35 + 0.65 * mercK, translate: `0px ${(1 - mercK) * 10}px` }}>
            MERCURY · SCORPIO
            <div style={{ color: BLUSH, opacity: msgK }}>MESSAGES</div>
            <div style={{ color: SOFT, fontSize: 24, opacity: rxK }}>RETROGRADE</div>
          </div>
          <div style={{ textAlign: "right", opacity: 0.35 + 0.65 * marsK, translate: `0px ${(1 - marsK) * 10}px` }}>
            MARS · LEO
            <div style={{ color: BLUSH, opacity: marsK }}>HEAT</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: CY - R - 70, textAlign: "center", fontFamily: SANS, fontSize: 28, letterSpacing: "0.34em", color: BLUSH, opacity: dateK * (1 - loopK) }}>
          FRI · OCT 30 · SQUARE
        </div>
      </AbsoluteFill>

      {/* ── the draft ── */}
      <AbsoluteFill style={{ opacity: dim }}>
        <div style={{ position: "absolute", left: 110, right: 110, top: 735, display: "flex", alignItems: "center", gap: 22, translate: `${jitter}px 0px` }}>
          <div style={{ flex: 1, padding: "18px 30px 20px", borderRadius: 44, border: `2.5px solid ${angryK > 0.5 && nChars > 0 ? BLUSH : IVORY}`, background: "rgba(20,19,24,0.84)", fontFamily: SERIF, fontWeight: 500, fontSize: 58, color: IVORY, minHeight: 72, whiteSpace: "nowrap", overflow: "hidden" }}>
            {ANGRY.slice(0, nChars)}
            <span style={{ display: "inline-block", width: 4, height: 54, marginLeft: 6, verticalAlign: "-8px", background: BLUSH, opacity: Math.floor(t * 3) % 2 ? 1 : 0.2 }} />
          </div>
          <div style={{ position: "relative", width: 84, height: 84, flexShrink: 0 }}>
            <div style={{ position: "absolute", inset: -16, borderRadius: 60, border: `2.5px solid ${BLUSH}`, opacity: breatheK * 0.8, scale: breathe }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: 42, border: `2.5px solid ${IVORY}`, background: `rgba(240,184,166,${0.15 + 0.5 * sendPulse})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={40} height={40} viewBox="-20 -20 40 40"><path d="M 0 14 L 0 -12 M -11 -1 L 0 -12 L 11 -1" fill="none" stroke={IVORY} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 140, top: 852, fontFamily: SANS, fontSize: 24, letterSpacing: "0.3em", color: BLUSH, opacity: satK }}>SEND · SATURDAY</div>
      </AbsoluteFill>

      <HookTitle t={t} text="Don’t send the angry text until Saturday." accent={["angry"]} until={S(7) - 0.3} top={290} size={124} />
      <ShortCaptions t={t} words={WORDS} phrases={PHRASES} endAt={DUR} top={260} />
      <LoopSignoff t={t} from={last - 0.4} cta="Send this to your hothead friend." />

      <Audio src={staticFile("vo/2026-10-26.mp3")} />
      <Audio src={staticFile("music/ambient.wav")} volume={(f) => interpolate(f / fps, [0, DUR - 0.3, DUR], [0.11, 0.11, 0.05], cl)} />
      <Sequence from={Math.round(S(21) * fps)} layout="none"><Audio src={staticFile("music/chime.wav")} volume={0.25} /></Sequence>
    </AbsoluteFill>
  );
};
