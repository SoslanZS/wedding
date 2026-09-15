# Wedding invitation — Nuxt 3

Single-page animated wedding invitation.

## Flow

1. **Sealed envelope** intro (`components/Envelope/Card.vue`) — a wax-sealed
   envelope centred on screen. Tapping it plays an anime.js timeline: the seal
   spins off, the flap opens in 3D, the letter slides out.
2. On open, a **canvas fireworks** salute launches (`components/Fireworks/Canvas.vue`)
   and page scrolling unlocks.
3. Scrolling reveals the story in order — who invites, when / where / at what
   time, a live countdown, the timeline of the day, a parallax photo gallery of
   the couple, warm words for the guests, the dress code, and a closing screen
   with a "light the fireworks" button.

Falling petals (`components/Decor/Petals.vue`) and blooming SVG flowers
(`components/Decor/Flower.vue`) drift through the whole page.

## Editing the details

All copy — names, date, venue, schedule, gallery captions — lives in one place:
`stores/invitation.js`. Replace the placeholder couple photos in
`public/photos/*.svg` with real images (update the paths in the store).

## Animation

- **anime.js** drives the envelope timeline, the hero entrance and the
  word-by-word text reveals (`components/Ui/AnimatedText.vue`). Loaded lazily,
  client-only, via `composables/useAnime.js`.
- Scroll reveals use one shared `IntersectionObserver`
  (`composables/useScrollReveal.js`) toggling `.is-revealed` on `[data-reveal]`.
- Parallax (hero flowers, gallery photos, timeline progress rail) is
  `requestAnimationFrame`-throttled scroll math.
- Everything degrades: `prefers-reduced-motion` disables motion, no-JS still
  renders the full invitation (the envelope overlay is client-only).

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```
