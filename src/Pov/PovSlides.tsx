import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { z } from "zod";
import "../brand";
import { SANS, SERIF } from "../brand";

// TikTok-only "POV" photo post (A/B test started 22 Oct 2026): a photo of the Totem persona
// (AI model, generated with fal from the reference images in persona/) with one big, relatable line.
// One frame = one slide, 1080×1920. Images are public URLs or paths under public/.

export const povSchema = z.object({
  slides: z.array(z.object({
    image: z.string(),
    text: z.string(),
    accent: z.array(z.string()).default([]),
    position: z.enum(["top", "center", "lower"]).default("top"),
  })),
  signoff: z.string().default(""),
});
export type PovProps = z.infer<typeof povSchema>;

const IVORY = "#FBF7EF";
const BLUSH = "#F6C3B3";
const TOP = { top: 300, center: 760, lower: 1080 } as const;

export const PovSlides: React.FC<PovProps> = ({ slides, signoff }) => {
  const s = slides[useCurrentFrame()] ?? slides[0];
  const src = s.image.startsWith("http") ? s.image : staticFile(s.image);
  const words = s.text.split(" ");
  const isAccent = (w: string) => s.accent.some((a) => w.replace(/[.,!?…’'":]/g, "").toLowerCase() === a.toLowerCase());
  const y = TOP[s.position];
  return (
    <AbsoluteFill style={{ backgroundColor: "#141318" }}>
      <Img src={src} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: y - 220, height: 760, background: "radial-gradient(ellipse 75% 50% at 50% 45%, rgba(0,0,0,0.38), rgba(0,0,0,0))" }} />
      <div style={{
        position: "absolute", left: 90, right: 170, top: y, textAlign: "center",
        fontFamily: SERIF, fontWeight: 600, fontStyle: "italic", fontSize: 92, lineHeight: 1.04, color: IVORY,
        textWrap: "balance", textShadow: "0 3px 18px rgba(0,0,0,0.65), 0 0 2px rgba(0,0,0,0.5)",
      }}>
        {words.map((w, i) => <span key={i} style={{ color: isAccent(w) ? BLUSH : IVORY }}>{w}{i < words.length - 1 ? " " : ""}</span>)}
      </div>
      {signoff && s === slides[slides.length - 1] ? (
        <div style={{ position: "absolute", left: 0, right: 80, top: 1380, textAlign: "center", fontFamily: SANS, fontSize: 24, letterSpacing: "0.38em", color: IVORY, textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>{signoff}</div>
      ) : null}
    </AbsoluteFill>
  );
};

export const povDemo: PovProps = {
  slides: [
    { image: "brand/night-paper.jpg", text: "POV: you said you were over him but you're checking his moon sign at 2am", accent: ["moon", "sign"], position: "top" },
    { image: "brand/night-paper.jpg", text: "Venus is retrograde until November 13. It's not you. It's her.", accent: ["Venus"], position: "center" },
  ],
  signoff: "TOTEM",
};
