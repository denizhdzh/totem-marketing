---
name: totem-daily-posts
description: Produce and schedule Totem's daily posts (18:00 carousel, 20:30 short reel, Mon/Wed/Fri 13:00 TikTok POV photo post) on Instagram and TikTok from real astrology news, in the Totem ink-line motion style.
---

# Totem daily posts

Totem (iOS app "Soulmate Astrology – TOTEM") grows its Instagram **@totem.astrology** and TikTok **@soulmateastrology** with the same two original posts a day on both, built from that day's real sky events and always framed around love and relationships. The app itself is never advertised directly; the content feeds the concept.

| Slot (Europe/Amsterdam) | Format | Job |
|---|---|---|
| **18:00** | Sign-by-sign concept: **Instagram = "pause on your sign" reel** (`SignsReel`, 1080×1920, ~19 s, music only) · **TikTok = photo carousel** 1080×1920, same content | saves + shares + rewatches: sign-by-sign, relatable |
| **20:30** | Reel, 1080×1920, 30 fps, **15–20 s**, voiceover, IG + TikTok | reach: hook-led story about a sky event |
| **13:00, TikTok only, Mon/Wed/Fri** | POV photo post with the Totem persona (A/B test, see §6b) | reach: the face format that worked before |

The two posts of a day are **always different concepts** (a carousel may share the week's theme, never the reel's idea).

### What the numbers taught us (first week, 22 Oct 2026)
Our 37 s reels were watched **4–6 s on average** (TikTok 4.1 s, Instagram 6.0 s), so TikTok never pushed them past the first ~250-viewer test batch. The only older post that broke out (1,297 views) was a face photo with one big relatable line. TikTok photo carousels got the same views as reels with longer watch time (6.8–7.4 s). Instagram shows a zero-follower account's carousels to almost nobody (0–7 views); Instagram growth comes from reels. Hence: short reels, a hook readable on frame 0, heavier type, a loop instead of an end card, and a face-format test on TikTok.

**Owner decision, 23 Oct 2026: Instagram gets reels only (two a day).** IG carousels stayed at 0–9 views while reels got 136–152, so no more photo carousels on Instagram. The 18:00 sign-by-sign concept goes to Instagram as a `SignsReel` (same props as the carousel) and stays a photo carousel on TikTok, where carousels get 240–285 views and the longest watch time.

## 0 · Setup (fresh session every run)
The project is the GitHub repo attached to this environment (the session starts inside it). Nothing executable is downloaded from the media host any more; `TOTEM_TOKEN` comes from the environment secrets and is only used for state files and uploads.
```bash
bash pipeline/bootstrap.sh   # npm ci, Remotion's headless chrome, numpy/pillow, state/history.json + calendar.md
```
`npx remotion render|still` finds the browser itself (no `--browser-executable` needed). Read `state/history.json` and `state/calendar.md` before deciding anything.

IDs: Buffer org `6ad7aa23cab15d10660ad5b1`, Instagram channel `6ad7c2b5778b240e2f6eb98a`, TikTok channel `6ad7e0f0778b240e2f705a14`. Media host `https://totem-media.totem-astro.workers.dev` (upload with `pipeline/upload.sh`, keys under `private/` are not public).

## 1 · Which slots are open
`list_posts` for both channels and today's date (status scheduled/sent). Slots: 13:00 (TikTok POV, Mon/Wed/Fri), 18:00, 20:30. Slot × channel already holding a post (made by hand or a previous run) is **skipped**; if Instagram has it but TikTok doesn't, reuse the same content for TikTok (18:00: TikTok gets the 9:16 slides, Instagram the SignsReel). Buffer's plan allows 10 scheduled posts in total; if full, schedule Instagram first and report it.

## 2 · Research (never skip, never from memory)
- WebSearch today's and the next 3 days' transits (e.g. "astrology October 24 2026", "Mercury retrograde 2026 dates", "full moon October 2026"). Fetch at least two independent sources (cafeastrology.com, astrostyle.com, astrologyking.com, bonniesorsby.com, astrology.com, chaninicholas.com). A date, degree or sign goes into a post only if two sources agree.
- Paraphrase everything. Never copy sentences, captions or images from those sites.
- Add verified upcoming events to `state/calendar.md`.

## 3 · Choose the concepts
Check `history.json`: no concept repeated within 30 days, no hook pattern within 7 days.

**Reel**: the most relationship-relevant sky event of the next ~3 days.
- Hook = first 2 seconds, spoken AND on screen, personal + curious, ideally about exes, texting, situationships, the person you can't stop thinking about. Patterns: "If your ex texts you this week… blame Venus." · "Don't confess anything until Sunday." · "Why everyone's fighting this week." Banned: "Stop scrolling", "Hey guys", questions with obvious answers.
- Script **35–48 words** (15–20 s spoken), spoken English with contractions, no audio tags, no stage directions. Structure: hook (≤ 8 words) → one accurate sky fact with its date → what it does to your love life → a short, quotable last line that leads back into the hook so the video loops ("…so don't text your ex until Sunday." → video restarts on "Don't text your ex until Sunday."). No list of signs in reels (that is carousel material); at most one line naming one group.

**Carousel / SignsReel (18:00)**: follow the weekday rotation in `state/calendar.md` (signs as…, red flags, compatibility, the week's event sign by sign, …). On a big event day it may be the sign-by-sign guide to that event. Copy per sign **≤ 12 words** (it must read in 1.35 s in the Instagram SignsReel; people pause on their sign), specific and funny or tender, never generic horoscope filler. Cover title (title + titleAccent) ≤ 9 words. No daily 12-sign horoscopes (that is the app's job).

## 4 · Voiceover (ElevenLabs)
1. `creative_generate_speech` — voice **Siren `eXpIbVcVbLo8ZJQDlDnl`**, model **`eleven_multilingual_v2`** (most natural; do NOT use v3/v4 audio tags), `generations_count: 2`, reuse flow `zWoEjfQuuM0nYUwyaN79`. Poll `creative_get_flow_run_status`.
2. Pick the take with the cleaner, shorter read. Download its `content_url` (curl).
3. `creative_add_flow_asset_node` (modality audio, that generation_id) → `creative_transcribe_audio` (`eleven_scribe_v1`, connect_from the node) → save `transcripts[0].words` to `/tmp/words.json`.
4. `python3 pipeline/vo_tighten.py take.mp3 /tmp/words.json public/vo/<date>.mp3 src/reels/words-<date>.ts --gap 0.22 --tempo 1.08` (shortens pauses, speeds up slightly, prints word indices + times). Target 14–18 s of voice; if longer, cut words and regenerate rather than speeding up further.

## 5 · Reel: build, check, render
Create `src/reels/Reel<YYYYMMDD>.tsx`, register it in `src/Root.tsx` as `Reel-YYYY-MM-DD` (duration = last word end + **0.8 s**, no end card). **Build it with the short-form kit `src/kit/Short.tsx`** (`Night`, `HookTitle`, `ShortCaptions`, `LoopSignoff`, `SAFE`, `ramp`, `timing`); `src/kit/ShortDemo.tsx` shows the pattern. `src/reels/Reel20261022.tsx` and `src/Cazimi/CazimiReel.tsx` remain the reference for the ink-line *diagram craft* (paths, glyphs, beats locked to word indices), but their pacing, thin type and end card are retired.

Short-form rules (these come from the analytics, do not relax them):
- **Frame 0** shows the full hook with `HookTitle` (on screen at frame 0, no fade or typing in) AND the central visual already drawn and moving. No empty or slowly drawing first second. Ink lines draw in ≤ 0.6 s.
- The hook stays until the first word after it is spoken, then `ShortCaptions` take over (Cormorant 500, 80 px). Accent 1 word per phrase in blush italic.
- Something on screen changes at least every 1.5 s (a new element, a push-in, a cut to the next beat).
- Diagram strokes ≥ 2.5 px, labels ≥ 24 px Inter tracked caps; everything important inside `SAFE` (TikTok/Reels UI covers the rest).
- **Loop:** in the last ~1 s the visual returns to the frame-0 composition while `LoopSignoff` (small snake + TOTEM, optional blush CTA) fades in; dim the diagram under it. The last spoken line leads back into the hook.

Design system (owner-approved; do not drift):
- Background `#141318` + `brand/night-paper.jpg`. Ink lines ivory `#EDE6D6`, soft ivory `rgba(237,230,214,0.5)`, one accent **blush `#F0B8A6`**. Nothing else.
- Type: Cormorant Garamond **500** (never 300 any more) for hook/captions, italic + blush for 1 accent word per phrase; Inter Medium tracked caps (0.3–0.42em, ≥ 24 px) for diagram labels. Hook 120–132 px, captions 80 px, top-aligned (~250–300 px from the top).
- **One central visual metaphor per reel, drawn with thin ink lines**, that literally explains the event: real planetary paths, glyphs (☉ ☽ ♀ ♂ ☿ …) as geometry, dials, crosses (modalities), aspect lines, orbits, a single blush point of light as protagonist. Minimal, scientific-diagram precise, romantic.
- Every visual beat starts on the word that names it. Ease `Easing.bezier(0.16,1,0.3,1)`. Short push-ins between beats. Small relatable UI moments allowed (a notification, a message being typed and deleted) drawn in the same ink style.
- Forbidden in reels and carousels: handwriting/script fonts, cream "antique paper", engravings copied from other accounts, 3D renders, stock photos, AI images, emoji in the video, more than one accent colour, text that overlaps the diagram.
- No end card (see Loop above).
- Audio: VO starts at 0.0 s (the hook is spoken over frame 0); `music/ambient.wav` at 0.11 from frame 0; `music/chime.wav` once, on the key reveal (0.2–0.3).

QA before the final render: **frame 0 must pass the phone test**: render it, downscale to 360×640 and Read it; the hook must be readable and the visual must make sense without sound. Then render ≥ 10 stills across the timeline (`npx remotion render <id> out/qa --frames=... --sequence --image-format=jpeg`), make a contact sheet, Read it and fix: clipped labels, overlaps, two protagonists on screen, empty first second, unreadable text, text outside SAFE, wrong astrology, last frame not matching the first. Then render: `npx remotion render <id> out/<date>-reel.mp4 --concurrency=2 --crf=18` (~1–2 min).

## 6 · 18:00: TikTok carousel + Instagram SignsReel — build, check, render
Write `src/data/carousel-<date>.ts` using `carouselSchema` (`src/Carousel/Carousel.tsx`): `kicker` (tracked caps), `title` + `titleAccent` (hook; accent italic blush), `subtitle` ("Swipe to find yours →"), optional `explainerTitle/explainer` (one slide of real astrology context), `signs` (12 entries; `house` > 0 draws the whole-sign house wheel for event guides, `house: 0` draws the zodiac glyph), `outroTitle`, `outroLine` (CTA: save / tag / send). Register it twice with the same props: `Carousel-YYYY-MM-DD-tiktok` at 1080×1920 (TikTok photo post; the layout keeps clear of TikTok's top bar, caption area and right-side buttons) and **`SignsReel-YYYY-MM-DD`** with `SignsReel` (`src/kit/SignsReel.tsx`, copy the `SignsReelDemo` registration in Root.tsx: duration = `signsReelDuration(props)`, ~19.5 s for 12 signs). No 1080×1350 render any more (Instagram carousels are retired).
- TikTok slides: render `--sequence --image-format=png`, convert to JPEG q94, contact sheet, fix, upload to `carousels/<date>-<slug>-916/`.
- SignsReel: frame-0 phone test (360×640: cover hook readable, wheel already turning), QA stills (cover, 3 sign beats mid-beat, outro, last frame) → contact sheet → fix (text clipped or > 3 lines, labels outside SAFE). Render `npx remotion render SignsReel-YYYY-MM-DD out/<date>-signs-reel.mp4 --concurrency=2 --crf=18`, upload to `reels/<date>-<slug>-signs.mp4`. No voiceover (no ElevenLabs cost); ambient music is built in. The cover title is the hook in big Cormorant 500: keep it ≤ 9 words so it reads on a profile grid and in the TikTok feed.

## 6b · TikTok POV photo post (A/B test, Mon/Wed/Fri 13:00, TikTok only)
Only if the persona reference images exist (`curl -sI https://totem-media.totem-astro.workers.dev/persona/ref-1.jpg` returns 200; refs are `persona/ref-1.jpg … ref-N.jpg`). If they don't, skip this section and mention it in the report.
1. Write 2–3 slides: slide 1 = one relatable "POV: …" or "me when…" line about love/exes/texting tied to the current sky (≤ 16 words), slides 2–3 = the astrology reason in one line each and a soft CTA. Same banned-hook and 30-day repeat rules as reels.
2. Generate one image per slide with **fal** (`recommend_model` for "edit: the same young woman as in the reference images, new scene", typically a Nano Banana edit endpoint; pass the reference URLs as `image_urls`). The persona must be recognisably the same person; candid phone-photo look (bedroom at night with phone glow, car seat, café window, bathroom mirror), natural skin, 9:16. Never celebrities, never real people, nothing sexualised. Pick the best of the variations, download, upload to `pov/<date>-<slug>/img-N.jpg`.
3. Register `Pov-YYYY-MM-DD` in `src/Root.tsx` with `PovSlides` (`src/Pov/PovSlides.tsx`, props `{slides:[{image, text, accent, position}], signoff:"TOTEM"}`), render `--sequence --image-format=jpeg --jpeg-quality=94`, check the text sits on a calm part of the photo (choose `position`), upload to `pov/<date>-<slug>/slide-N.jpg`.
4. Buffer TikTok photo post at 13:00, `metadata.tiktok {title: <slide 1 line ≤ 90 chars>, isAiGenerated: true}` (realistic AI person: the label is mandatory). Caption ≤ 300 chars, 5 hashtags incl. #astrologytiktok. Record it in history with `"format": "pov"`.

## 7 · Upload + schedule
- `bash pipeline/upload.sh out/<date>-reel.mp4 reels/<date>-<slug>.mp4` → URL. Slides → `carousels/<date>-<slug>/slide-N.jpg`. Verify each URL returns 200.
- Buffer `create_post`, `schedulingType: automatic`, `mode: customScheduled`, `dueAt` today 18:00 / 20:30 **with the correct Amsterdam offset** (CEST +02:00 until Oct 25 2026, then CET +01:00; take it from `get_account.currentTime`).
  - Reel: one `video` asset with `thumbnailOffset: 200` (the hook frame, so the profile grid shows the hook), `metadata.instagram {type:"reel", shouldShareToFeed:true}`.
  - 18:00 Instagram: the SignsReel as one `video` asset, `thumbnailOffset: 200` (cover hook), `metadata.instagram {type:"reel", shouldShareToFeed:true}`. Never an Instagram photo carousel.
- **TikTok, same slot, same media:** `create_post` on channel `6ad7e0f0778b240e2f705a14`. Reel → one `video` asset (+ thumbnailOffset), `metadata.tiktok {isAiGenerated: true}` (AI voiceover). Carousel → photo post with all **9:16** slide `image` assets (`-916/`), `metadata.tiktok {title: <hook, ≤ 90 chars>}`. Caption ≤ 300 chars: hook, one keyword sentence, CTA, 5 hashtags incl. #astrologytiktok.
- Caption: line 1 = the hook; 2–4 short lines with the searchable keywords written naturally (planet, sign, event, "love life", date); a save/share/tag CTA; then **exactly 5 targeted hashtags** (Instagram's limit; no #reels/#explore/#fyp).

## 8 · Save state
First, record performance: `list_posts` with `includeMetrics: true` for the last 7 days, and write each earlier post's `views`, `avgWatchSec` and `shares` per channel into its history entry (`metrics: {ig:{…}, tt:{…}, at:"<date>"}`). This is what the weekly review uses.
Then append each new post to `state/history.json` (date, slot, format, concept, hook, sky, media key, buffer_id, tiktok_buffer_id, composition) and update `state/calendar.md`; upload both to `private/state/`. Then commit the new reel/carousel source files (`src/reels/`, `src/data/`, `src/Root.tsx`, `public/vo/`) with a short message and `git push` to the repo, so future runs build on them. Never commit `out/`, `state/`, `node_modules/` or secrets.

## 9 · Report
Send the owner (Turkish, short): what goes out at 18:00 (IG SignsReel + TikTok carousel) and 20:30 (reel on both) (and 13:00 TikTok POV on Mon/Wed/Fri), the hooks, yesterday's numbers in one line (views + average watch time of the reel per platform), and the files (both reel mp4s + TikTok carousel contact sheet via SendUserFile) so they can cancel in Buffer if needed. If something failed (no ElevenLabs credits, render error, unverifiable dates), schedule only what is correct, say what is missing and why. Never publish broken or unverified content.
