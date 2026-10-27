import type { CarouselProps } from "../Carousel/Carousel";

// Venus cazimi at 0°45′ Scorpio (Oct 23). Houses = whole-sign houses counted from each Sun sign.
export const carouselCazimi: CarouselProps = {
  kicker: "OCTOBER 23 · VENUS CAZIMI",
  title: "Venus disappears into the Sun",
  titleAccent: "today.",
  subtitle: "Here’s where your sign will feel it →",
  explainerTitle: "What’s a cazimi?",
  explainer:
    "When a planet sits in the exact heart of the Sun, astrologers call it cazimi. Venus does this mid-retrograde only once every 19 months. Think of it as a reset button for love.",
  signs: [
    { sign: "Aries", house: 8, theme: "intimacy", text: "A truth about trust comes up. Let someone actually see you." },
    { sign: "Taurus", house: 7, theme: "partnership", text: "This one’s about your person. Commit, or finally let go." },
    { sign: "Gemini", house: 6, theme: "daily love", text: "Love lives in the small things now. Notice who shows up." },
    { sign: "Cancer", house: 5, theme: "romance", text: "A spark returns. Say yes to the date you almost cancelled." },
    { sign: "Leo", house: 4, theme: "home", text: "Old family patterns are showing up in your love life. Name them." },
    { sign: "Virgo", house: 3, theme: "words", text: "The text you keep drafting? Read it out loud first." },
    { sign: "Libra", house: 2, theme: "self-worth", text: "Stop discounting yourself to be chosen. Raise the price." },
    { sign: "Scorpio", house: 1, theme: "you", text: "It’s happening in your sign. You’re magnetic. Use it gently." },
    { sign: "Sagittarius", house: 12, theme: "secrets", text: "A hidden feeling surfaces. Let it pass through, not take over." },
    { sign: "Capricorn", house: 11, theme: "friends", text: "A friend might be more than a friend. Or less. Watch closely." },
    { sign: "Aquarius", house: 10, theme: "status", text: "Is it official or not? This week asks you to decide." },
    { sign: "Pisces", house: 9, theme: "distance", text: "Someone far away, or very different, is on your mind. Reach out." },
  ],
  outroTitle: "Save this for later.",
  outroLine: "Send it to the sign who needs it most.",
};
