import type { CarouselProps } from "../Carousel/Carousel";

// Sunday rotation (moon phase ritual): one small ritual per sign for the Full Moon in Taurus.
// Verified 25 Oct 2026: Full Moon in Taurus Oct 26 (bonniesorsby.com Oct 2026 forecast: 2°46′ Taurus "just after midnight" ET;
// astrology.com October 2026 key dates: Full Moon in Taurus Oct 26). Houses = whole-sign houses of Taurus counted from each Sun sign.
export const carouselRitual: CarouselProps = {
  kicker: "FULL MOON IN TAURUS · OCT 26",
  title: "Your full moon ritual,",
  titleAccent: "sign by sign.",
  subtitle: "Swipe to find yours →",
  explainerTitle: "Why tonight?",
  explainer: "Early on Monday, October 26, the Moon turns full in Taurus, right across from the Sun in Scorpio. Full moons finish things. Find the part of your chart it lights up, and do one small thing about it.",
  signs: [
    { sign: "Aries", house: 2, theme: "self-worth", text: "List what you bring. Stop discounting yourself for people who haggle." },
    { sign: "Taurus", house: 1, theme: "you", text: "It’s your full moon. Buy yourself the flowers. Literally." },
    { sign: "Gemini", house: 12, theme: "the hidden", text: "Write the unsent text by hand. Then tear it up." },
    { sign: "Cancer", house: 11, theme: "friends", text: "Mute the group chat that keeps asking about your ex." },
    { sign: "Leo", house: 10, theme: "reputation", text: "Post the win. Not the thirst trap aimed at one person." },
    { sign: "Virgo", house: 9, theme: "horizons", text: "Plan a trip alone. Watch who suddenly wants to come." },
    { sign: "Libra", house: 8, theme: "what you share", text: "Change one password you shared with someone who’s gone." },
    { sign: "Scorpio", house: 7, theme: "partners", text: "Light a candle for the partner you deserve, not the ex." },
    { sign: "Sagittarius", house: 6, theme: "routines", text: "Clean sheets, clean slate. No repeat guests this week." },
    { sign: "Capricorn", house: 5, theme: "romance", text: "Say yes to the date. Fun is allowed this week." },
    { sign: "Aquarius", house: 4, theme: "home", text: "Give back the spare key. Home shouldn’t make you guess." },
    { sign: "Pisces", house: 3, theme: "messages", text: "Delete the drafts folder. All of them. Yes, that one." },
  ],
  outroTitle: "Let the moon take what you’re done carrying.",
  outroLine: "Save this for tonight and send it to your moon friend.",
};
