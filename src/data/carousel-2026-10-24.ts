import type { CarouselProps } from "../Carousel/Carousel";

// Saturday rotation (playful): how each sign apologises — Mercury stationed retrograde today.
// Verified 24 Oct 2026: Mercury Rx station 20°59′ Scorpio Oct 24 (bonniesorsby.com Oct 2026 forecast, 3:12 am ET;
// cafeastrology.com Mercury-direct-2026 page), direct 5°02′ Scorpio Nov 13 (cafeastrology.com; calendar, both sources).
export const carouselSorry: CarouselProps = {
  kicker: "MERCURY RETROGRADE · OCT 24 – NOV 13",
  title: "How every sign",
  titleAccent: "says sorry.",
  subtitle: "Swipe to find yours →",
  explainerTitle: "Why now?",
  explainer: "Mercury, the planet of messages, turned retrograde today at 20°59′ Scorpio and walks backwards until November 13. Old conversations come back — and so do the apologies nobody sent.",
  signs: [
    { sign: "Aries", house: 0, theme: "", text: "“Sorry you got mad.” Then fixes it before you notice." },
    { sign: "Taurus", house: 0, theme: "", text: "Shows up with your favourite food. Never says the word." },
    { sign: "Gemini", house: 0, theme: "", text: "Sends a meme at 2 a.m. That was the apology." },
    { sign: "Cancer", house: 0, theme: "", text: "Apologises first, cries second, brings up 2019 third." },
    { sign: "Leo", house: 0, theme: "", text: "A grand gesture. Possibly public. Definitely filmed." },
    { sign: "Virgo", house: 0, theme: "", text: "A three-paragraph text with sources and an action plan." },
    { sign: "Libra", house: 0, theme: "", text: "Says sorry for things that weren’t even their fault." },
    { sign: "Scorpio", house: 0, theme: "", text: "Rare. Quiet. Devastatingly sincere. You get it once." },
    { sign: "Sagittarius", house: 0, theme: "", text: "“My bad!” Then books you both a weekend away." },
    { sign: "Capricorn", house: 0, theme: "", text: "Doesn’t say it. Quietly fixes the thing that broke." },
    { sign: "Aquarius", house: 0, theme: "", text: "Explains why they were technically right. Then hugs you anyway." },
    { sign: "Pisces", house: 0, theme: "", text: "Writes a whole poem about it. Forgets to send it." },
  ],
  outroTitle: "Some apologies are worth the wait.",
  outroLine: "Send this to the one who still owes you.",
};
