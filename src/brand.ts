import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const SERIF = "Cormorant";
export const SANS = "InterTotem";

loadFont({ family: SERIF, url: staticFile("fonts/Cormorant.ttf"), weight: "300 700", style: "normal" });
loadFont({ family: SERIF, url: staticFile("fonts/Cormorant-Italic.ttf"), weight: "300 700", style: "italic" });
loadFont({ family: SANS, url: staticFile("fonts/Inter-Medium.otf"), weight: "500" });

export const COLORS = {
  ink: "#05070d",
  text: "#FBF9FF",
  label: "rgba(236, 232, 248, 0.86)",
  warm: "rgba(255, 236, 214, 0.9)",
  muted: "rgba(214, 206, 230, 0.9)",
};

export const W = 1080;
export const H = 1920;
export const FPS = 30;
