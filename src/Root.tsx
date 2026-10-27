import { Composition } from "remotion";
import "./brand";
import { FPS, H, W } from "./brand";
import { Carousel, carouselSchema, carouselSlideCount, type CarouselProps } from "./Carousel/Carousel";
import { CazimiReel, CAZIMI_DURATION } from "./Cazimi/CazimiReel";
import { ShortKitDemo } from "./kit/ShortDemo";
import { SignsReel, signsReelDuration } from "./kit/SignsReel";
import { PovSlides, povDemo, povSchema, type PovProps } from "./Pov/PovSlides";
import { carouselCazimi } from "./data/carousel-2026-10-21";
import { carouselExTexts } from "./data/carousel-2026-10-21-ex";
import { carouselFlags } from "./data/carousel-2026-10-22";
import { carouselSorry } from "./data/carousel-2026-10-24";
import { carouselRitual } from "./data/carousel-2026-10-25";
import { Reel20261024, REEL_20261024_DURATION } from "./reels/Reel20261024";
import { Reel20261025, REEL_20261025_DURATION } from "./reels/Reel20261025";
import { Reel20261026, REEL_20261026_DURATION } from "./reels/Reel20261026";
import { carouselLoveWeather } from "./data/carousel-2026-10-26";
import { Reel20261022, REEL_20261022_DURATION } from "./reels/Reel20261022";
import { Reel20261023, REEL_20261023_DURATION } from "./reels/Reel20261023";

// Each daily run adds: src/reels/<Date><Slug>.tsx (+ its words file) and src/data/carousel-<date>.ts,
// then registers them here with ids "Reel-YYYY-MM-DD" and "Carousel-YYYY-MM-DD".
const carouselMeta = ({ props }: { props: CarouselProps }) => ({ durationInFrames: carouselSlideCount(props) });

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* reference reel — the quality bar for every new reel */}
      {/* short-form kit reference (src/kit/Short.tsx) — every new reel uses it */}
      <Composition id="ShortKitDemo" component={ShortKitDemo} width={W} height={H} fps={FPS} durationInFrames={5 * FPS} />
      {/* 18:00 Instagram reel from the day's carousel props: register SignsReel-YYYY-MM-DD the same way */}
      <Composition id="SignsReelDemo" component={SignsReel} schema={carouselSchema} defaultProps={carouselFlags} width={W} height={H} fps={FPS} durationInFrames={Math.round(signsReelDuration(carouselFlags) * FPS)} calculateMetadata={({ props }: { props: CarouselProps }) => ({ durationInFrames: Math.round(signsReelDuration(props) * FPS) })} />
      {/* TikTok POV photo posts: register Pov-YYYY-MM-DD with that day's props */}
      <Composition id="PovDemo" component={PovSlides} schema={povSchema} defaultProps={povDemo} width={1080} height={1920} fps={1} durationInFrames={povDemo.slides.length} calculateMetadata={({ props }: { props: PovProps }) => ({ durationInFrames: props.slides.length })} />
      <Composition id="CazimiReel" component={CazimiReel} width={W} height={H} fps={FPS} durationInFrames={Math.round(CAZIMI_DURATION * FPS)} />
      <Composition id="Carousel-2026-10-21" component={Carousel} schema={carouselSchema} defaultProps={carouselExTexts} width={1080} height={1350} fps={1} durationInFrames={carouselSlideCount(carouselExTexts)} calculateMetadata={carouselMeta} />
      <Composition id="Carousel-2026-10-23" component={Carousel} schema={carouselSchema} defaultProps={carouselCazimi} width={1080} height={1350} fps={1} durationInFrames={carouselSlideCount(carouselCazimi)} calculateMetadata={carouselMeta} />
      <Composition id="Reel-2026-10-22" component={Reel20261022} width={W} height={H} fps={FPS} durationInFrames={Math.round(REEL_20261022_DURATION * FPS)} />
      <Composition id="Carousel-2026-10-22" component={Carousel} schema={carouselSchema} defaultProps={carouselFlags} width={1080} height={1350} fps={1} durationInFrames={carouselSlideCount(carouselFlags)} calculateMetadata={carouselMeta} />
      <Composition id="Carousel-2026-10-22-tiktok" component={Carousel} schema={carouselSchema} defaultProps={carouselFlags} width={1080} height={1920} fps={1} durationInFrames={carouselSlideCount(carouselFlags)} calculateMetadata={carouselMeta} />
      <Composition id="Reel-2026-10-23" component={Reel20261023} width={W} height={H} fps={FPS} durationInFrames={Math.round(REEL_20261023_DURATION * FPS)} />
      {/* TikTok 9:16 versions — same content */}
      <Composition id="Carousel-2026-10-21-tiktok" component={Carousel} schema={carouselSchema} defaultProps={carouselExTexts} width={1080} height={1920} fps={1} durationInFrames={carouselSlideCount(carouselExTexts)} calculateMetadata={carouselMeta} />
      <Composition id="Carousel-2026-10-23-tiktok" component={Carousel} schema={carouselSchema} defaultProps={carouselCazimi} width={1080} height={1920} fps={1} durationInFrames={carouselSlideCount(carouselCazimi)} calculateMetadata={carouselMeta} />
      <Composition id="Carousel-2026-10-24-tiktok" component={Carousel} schema={carouselSchema} defaultProps={carouselSorry} width={1080} height={1920} fps={1} durationInFrames={carouselSlideCount(carouselSorry)} calculateMetadata={carouselMeta} />
      <Composition id="SignsReel-2026-10-24" component={SignsReel} schema={carouselSchema} defaultProps={carouselSorry} width={W} height={H} fps={FPS} durationInFrames={Math.round(signsReelDuration(carouselSorry) * FPS)} calculateMetadata={({ props }: { props: CarouselProps }) => ({ durationInFrames: Math.round(signsReelDuration(props) * FPS) })} />
      <Composition id="Reel-2026-10-24" component={Reel20261024} width={W} height={H} fps={FPS} durationInFrames={Math.round(REEL_20261024_DURATION * FPS)} />
      <Composition id="Carousel-2026-10-25-tiktok" component={Carousel} schema={carouselSchema} defaultProps={carouselRitual} width={1080} height={1920} fps={1} durationInFrames={carouselSlideCount(carouselRitual)} calculateMetadata={carouselMeta} />
      <Composition id="SignsReel-2026-10-25" component={SignsReel} schema={carouselSchema} defaultProps={carouselRitual} width={W} height={H} fps={FPS} durationInFrames={Math.round(signsReelDuration(carouselRitual) * FPS)} calculateMetadata={({ props }: { props: CarouselProps }) => ({ durationInFrames: Math.round(signsReelDuration(props) * FPS) })} />
      <Composition id="Reel-2026-10-25" component={Reel20261025} width={W} height={H} fps={FPS} durationInFrames={Math.round(REEL_20261025_DURATION * FPS)} />
      <Composition id="Carousel-2026-10-26-tiktok" component={Carousel} schema={carouselSchema} defaultProps={carouselLoveWeather} width={1080} height={1920} fps={1} durationInFrames={carouselSlideCount(carouselLoveWeather)} calculateMetadata={carouselMeta} />
      <Composition id="SignsReel-2026-10-26" component={SignsReel} schema={carouselSchema} defaultProps={carouselLoveWeather} width={W} height={H} fps={FPS} durationInFrames={Math.round(signsReelDuration(carouselLoveWeather) * FPS)} calculateMetadata={({ props }: { props: CarouselProps }) => ({ durationInFrames: Math.round(signsReelDuration(props) * FPS) })} />
      <Composition id="Reel-2026-10-26" component={Reel20261026} width={W} height={H} fps={FPS} durationInFrames={Math.round(REEL_20261026_DURATION * FPS)} />
    </>
  );
};
