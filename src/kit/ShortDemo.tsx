import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BLUSH, HookTitle, IVORY_SOFT, LoopSignoff, Night, ShortCaptions, type Phrase, type Word } from "./Short";

// Reference only: shows how the short-form kit looks (frame 0 = hook already readable, visual already moving).
const WORDS: Word[] = [
  ["Mercury", 2.0, 2.4], ["walks", 2.45, 2.7], ["backwards", 2.75, 3.2], ["on", 3.25, 3.35], ["Saturday.", 3.4, 3.9],
];
const PHRASES: Phrase[] = [{ from: 0, to: 4, accent: [2] }];

export const ShortKitDemo: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const a = -Math.PI / 2 + t * 0.9;
  return (
    <AbsoluteFill>
      <Night t={t} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <circle cx={540} cy={1120} r={300} fill="none" stroke={IVORY_SOFT} strokeWidth={3} />
        <circle cx={540} cy={1120} r={10} fill="none" stroke={IVORY_SOFT} strokeWidth={3} />
        <circle cx={540 + Math.cos(a) * 300} cy={1120 + Math.sin(a) * 300} r={60} fill={BLUSH} opacity={0.18} />
        <circle cx={540 + Math.cos(a) * 300} cy={1120 + Math.sin(a) * 300} r={16} fill={BLUSH} />
      </svg>
      <HookTitle t={t} text="Don't text your ex until Sunday." accent={["ex"]} until={1.9} />
      <ShortCaptions t={t} words={WORDS} phrases={PHRASES} endAt={4.2} />
      <LoopSignoff t={t} from={4.0} cta="Send this to the friend who's typing." />
    </AbsoluteFill>
  );
};
