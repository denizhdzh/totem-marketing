import type { CarouselProps } from "../Carousel/Carousel";

// Monday rotation (the week's love weather, by sign). House = whole-sign house of Libra counted from each Sun sign,
// because Venus spends the whole week retrograde in Libra.
// Verified 26 Oct 2026 in two sources (astrolis.com Oct 2026 calendar + fourthcup.substack.com Oct 26–Nov 1):
// Venus retrograde in Libra opposite Chiron in Aries Oct 28 (3:34 am EDT / 12:34 am PDT); Mercury retrograde in Scorpio
// square Mars in Leo Oct 30 (1:20 pm EDT / 10:20 am PDT). Venus + Mercury turn direct Nov 13 (calendar.md, verified 25 Oct).
export const carouselLoveWeather: CarouselProps = {
  kicker: "VENUS RX IN LIBRA · WEEK OF OCT 26",
  title: "Your love weather this week,",
  titleAccent: "sign by sign.",
  subtitle: "Swipe to find yours →",
  explainerTitle: "Why this week?",
  explainer: "Venus is retrograde in Libra all week. On Wednesday it opposes Chiron, so old hurts ask for attention. On Friday, Mercury retrograde squares Mars, so words run hot. Find the part of your chart Libra rules.",
  signs: [
    { sign: "Aries", house: 7, theme: "partners", text: "An ex asks “how have you been?” Answer slowly." },
    { sign: "Taurus", house: 6, theme: "daily life", text: "Love lives in small habits now. Notice who still shows up." },
    { sign: "Gemini", house: 5, theme: "romance", text: "Old crush energy returns. Flirt, but don’t rewrite history." },
    { sign: "Cancer", house: 4, theme: "home", text: "Late nights get nostalgic. Don’t reread the old chats." },
    { sign: "Leo", house: 3, theme: "messages", text: "Every message sounds flirty this week. Most of them aren’t." },
    { sign: "Virgo", house: 2, theme: "self-worth", text: "Stop paying for dinners with someone who won’t commit." },
    { sign: "Libra", house: 1, theme: "you", text: "Venus is retrograde in your sign. Choose you, not them." },
    { sign: "Scorpio", house: 12, theme: "the hidden", text: "A secret crush keeps you up. Sleep is self-care too." },
    { sign: "Sagittarius", house: 11, theme: "friends", text: "A friend might feel like more. Wait until November 13." },
    { sign: "Capricorn", house: 10, theme: "reputation", text: "Don’t soft-launch anyone this week. Let them earn the post." },
    { sign: "Aquarius", house: 9, theme: "distance", text: "Someone far away crosses your mind. Let it pass." },
    { sign: "Pisces", house: 8, theme: "intimacy", text: "Old wounds want attention. Be tender with yourself first." },
  ],
  outroTitle: "Love moves slowly until November 13.",
  outroLine: "Save this and send it to your person.",
};
