import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
loadFont({ family: "TotemSymbols", url: staticFile("fonts/NotoSansSymbols.ttf"), weight: "100 900" });
import { z } from "zod";
import "../brand";
import { SANS, SERIF } from "../brand";

// One frame = one carousel slide (1080×1350). Render with `--sequence` to get one PNG per slide.
const IVORY = "#EDE6D6";
const IVORY_SOFT = "rgba(237,230,214,0.55)";
const BLUSH = "#F0B8A6";

export const signSchema = z.object({ sign: z.string(), house: z.number().default(0), theme: z.string().default(""), text: z.string() });
export const carouselSchema = z.object({
  kicker: z.string(),
  title: z.string(),
  titleAccent: z.string(),
  subtitle: z.string(),
  explainerTitle: z.string().default(""),
  explainer: z.string().default(""),
  signs: z.array(signSchema),
  outroTitle: z.string(),
  outroLine: z.string(),
});
export type CarouselProps = z.infer<typeof carouselSchema>;
const hasExplainer = (p: CarouselProps) => !!p.explainerTitle;
export const carouselSlideCount = (p: CarouselProps) => 2 + (hasExplainer(p) ? 1 : 0) + Math.ceil(p.signs.length / 2);
const GLYPH: Record<string, string> = { Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋", Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏", Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓" };
const SignGlyph: React.FC<{ sign: string; size: number }> = ({ sign, size }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, border: `1.5px solid ${IVORY_SOFT}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "TotemSymbols", fontWeight: 300, fontSize: size * 0.42, color: BLUSH, flexShrink: 0 }}>{GLYPH[sign] ?? "✶"}︎</div>
);

const ord = (n: number) => `${n}${n === 1 ? "ST" : n === 2 ? "ND" : n === 3 ? "RD" : "TH"}`;

/** The Sun glyph ☉ with Venus as its dot. */
const SunGlyph: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="-150 -150 300 300">
    <defs><radialGradient id="g"><stop offset="0%" stopColor={BLUSH} stopOpacity={0.6} /><stop offset="100%" stopColor={BLUSH} stopOpacity={0} /></radialGradient></defs>
    <circle r={140} fill="none" stroke={IVORY_SOFT} strokeWidth={1} strokeDasharray="1 6" />
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <line key={i} x1={Math.cos(a) * 100} y1={Math.sin(a) * 100} x2={Math.cos(a) * (i % 3 === 0 ? 116 : 108)} y2={Math.sin(a) * (i % 3 === 0 ? 116 : 108)} stroke={IVORY} strokeWidth={2} />;
    })}
    <circle r={90} fill="none" stroke={IVORY} strokeWidth={3} />
    <circle r={60} fill="url(#g)" />
    <circle r={13} fill={BLUSH} />
  </svg>
);

/** A 12-house wheel with the house Venus falls in highlighted (whole-sign houses from the Sun sign). */
const HouseWheel: React.FC<{ house: number; size: number }> = ({ house, size }) => {
  const R = 100, r = 62;
  const wedge = (i: number) => {
    // house 1 starts at the left (ascendant), houses run counter-clockwise below the horizon
    const a0 = Math.PI + (i * Math.PI) / 6, a1 = a0 + Math.PI / 6;
    const p = (a: number, rr: number) => `${(Math.cos(a) * rr).toFixed(1)} ${(-Math.sin(a) * rr).toFixed(1)}`;
    return `M ${p(a0, r)} L ${p(a0, R)} A ${R} ${R} 0 0 0 ${p(a1, R)} L ${p(a1, r)} A ${r} ${r} 0 0 1 ${p(a0, r)} Z`;
  };
  const mid = Math.PI + ((house - 0.5) * Math.PI) / 6;
  return (
    <svg width={size} height={size} viewBox="-120 -120 240 240">
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={wedge(i)} fill={i === house - 1 ? "rgba(240,184,166,0.22)" : "none"} stroke={i === house - 1 ? BLUSH : IVORY_SOFT} strokeWidth={i === house - 1 ? 1.6 : 1} />
      ))}
      <circle r={8} fill="none" stroke={IVORY} strokeWidth={1.4} />
      <circle cx={Math.cos(mid) * 81} cy={-Math.sin(mid) * 81} r={6} fill={BLUSH} />
    </svg>
  );
};

const useLayout = () => {
  const tall = useVideoConfig().height > 1500;
  return tall
    ? { tall, pad: "250px 140px 0 92px", footerBottom: 380, coverGlyphTop: 900, coverSubBottom: 500, coverTitle: 138, glyph: 340, explGlyphBottom: 520, signsH: 1180, outroShift: -80 }
    : { tall, pad: "96px 92px", footerBottom: 64, coverGlyphTop: 760, coverSubBottom: 150, coverTitle: 124, glyph: 300, explGlyphBottom: 120, signsH: 1060, outroShift: 0 };
};
const Frame: React.FC<{ children: React.ReactNode; page: number; total: number }> = ({ children, page, total }) => {
  const L = useLayout();
  return (
  <AbsoluteFill style={{ backgroundColor: "#141318" }}>
    <Img src={staticFile("brand/night-paper.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ padding: L.pad }}>{children}</AbsoluteFill>
    <div style={{ position: "absolute", left: 92, right: L.tall ? 140 : 92, bottom: L.footerBottom, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: SANS, fontSize: 20, letterSpacing: "0.3em", color: IVORY_SOFT }}>
      <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Img src={staticFile("brand/snake-light.png")} style={{ width: 26, opacity: 0.8 }} /> TOTEM
      </span>
      <span>{page} / {total}</span>
    </div>
  </AbsoluteFill>
  );
};

export const Carousel: React.FC<CarouselProps> = (p) => {
  const frame = useCurrentFrame();
  const total = carouselSlideCount(p);
  const page = frame + 1;
  const L = useLayout();

  if (frame === 0) {
    return (
      <Frame page={page} total={total}>
        <div style={{ fontFamily: SANS, fontSize: 24, letterSpacing: "0.36em", color: IVORY_SOFT }}>{p.kicker}</div>
        <div style={{ marginTop: 36, fontFamily: SERIF, fontWeight: 500, fontSize: L.coverTitle, lineHeight: 0.98, letterSpacing: "-0.01em", color: IVORY, textWrap: "balance", textShadow: "0 2px 30px rgba(0,0,0,0.45)" }}>
          {p.title} <span style={{ fontStyle: "italic", color: BLUSH }}>{p.titleAccent}</span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: L.coverGlyphTop, display: "flex", justifyContent: "center" }}><SunGlyph size={L.glyph} /></div>
        <div style={{ position: "absolute", left: 92, right: 92, bottom: L.coverSubBottom, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 50, color: IVORY }}>{p.subtitle}</div>
      </Frame>
    );
  }
  if (frame === 1 && hasExplainer(p)) {
    return (
      <Frame page={page} total={total}>
        <div style={{ fontFamily: SANS, fontSize: 24, letterSpacing: "0.36em", color: IVORY_SOFT }}>FIRST, A DEFINITION</div>
        <div style={{ marginTop: 40, fontFamily: SERIF, fontWeight: 500, fontSize: 96, lineHeight: 1.02, color: IVORY }}>{p.explainerTitle}</div>
        <div style={{ marginTop: 44, fontFamily: SERIF, fontWeight: 500, fontSize: 48, lineHeight: 1.32, color: IVORY, maxWidth: 860 }}>{p.explainer}</div>
        <div style={{ position: "absolute", right: L.tall ? 140 : 70, bottom: L.explGlyphBottom, opacity: 0.9 }}><SunGlyph size={260} /></div>
      </Frame>
    );
  }
  if (frame === total - 1) {
    return (
      <Frame page={page} total={total}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", translate: `0px ${L.outroShift}px` }}>
          <Img src={staticFile("brand/snake-light.png")} style={{ width: 240, marginBottom: 60 }} />
          <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 100, lineHeight: 1.02, color: IVORY, maxWidth: 860, textWrap: "balance" }}>{p.outroTitle}</div>
          <div style={{ marginTop: 30, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 50, color: BLUSH, maxWidth: 820 }}>{p.outroLine}</div>
        </AbsoluteFill>
      </Frame>
    );
  }
  const first = hasExplainer(p) ? 2 : 1;
  const pair = p.signs.slice((frame - first) * 2, (frame - first) * 2 + 2);
  return (
    <Frame page={page} total={total}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", height: L.signsH, marginTop: -20 }}>
        {pair.map((s, i) => (
          <div key={s.sign} style={{ display: "flex", gap: 44, alignItems: "flex-start", paddingTop: i ? 70 : 0, borderTop: i ? `1px solid rgba(237,230,214,0.18)` : "none" }}>
            {s.house > 0 ? <HouseWheel house={s.house} size={230} /> : <SignGlyph sign={s.sign} size={200} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 104, lineHeight: 1, color: IVORY }}>{s.sign}</div>
              {s.house > 0 || s.theme ? <div style={{ marginTop: 14, fontFamily: SANS, fontSize: 21, letterSpacing: "0.3em", color: BLUSH }}>{s.house > 0 ? `${ord(s.house)} HOUSE · ` : ""}{s.theme.toUpperCase()}</div> : null}
              <div style={{ marginTop: 26, fontFamily: SERIF, fontWeight: 500, fontSize: 52, lineHeight: 1.24, color: IVORY }}>{s.text}</div>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
};
