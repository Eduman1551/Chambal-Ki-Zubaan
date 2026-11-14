# Chambal Ki Zubaan

**Let the river speak.** A short interactive scroll story about the health of the
Chambal river at Kota, Rajasthan. The river tells its own story in first person,
a cartoon gharial called Ghariyal Guru reacts, and the player changes how it ends.

> Awareness story, not live data. It is not a monitoring tool.

Built for the course *Engineering for Social Empowerment*.

## Run it

```powershell
pnpm install
pnpm dev
```

Other commands: `pnpm build` (type-check + production build), `pnpm preview`,
`pnpm check:logic` (sanity check of the meter maths, run with tsx).

Deploys as a static site on Vercel (framework preset: Vite, output: `dist`).

## The journey

1. **Source of the story**: the river introduces itself and Ghariyal Guru.
2. **Kota Barrage and riverfront**: tap 6 floating items into a basket.
3. **The drains**: slide the treatment valve and watch murky water clear.
4. **Festival time**: pick one of 3 immersion choices, each with a gentle reply.
5. **The sanctuary**: a small 3D scene shows the river you ended up with.

Ending: a result title, a **River Pledge** card (name + 3 pledges) you can
download as a PNG, Play again, Sources and Credits.

## How it works (for the presentation)

- **One number drives everything.** River Health (0 to 100) is a pure function
  of the player's choices: `start 40 + 4 per item + up to 20 for treatment +
  festival choice (+16 / +6 / -10)`. See `src/logic/meter.ts`.
- **All tunable numbers** are in `src/logic/config.ts`.
- **Logic is separate from UI.** `src/logic` is plain TypeScript: `meter.ts`
  (health), `results.ts` (ending title), `mood.ts` (mascot mood),
  `waterColor.ts` (murky brown-green to teal), `pledge.ts` (pick 3 rules).
- **State**: one small zustand store (`src/state/useRiverStore.ts`) holds the
  choices. Health is never stored, always computed.
- **Visual reaction**: health sets three CSS variables (`--water`,
  `--water-light`, `--water-deep`), so every wave changes colour together.
  The mascot's face and the 3D scene read the same number.
- **Scroll journey**: GSAP ScrollTrigger tracks the current stop, moves the
  scenery layers sideways (parallax) and reveals the cards.
- **3D only at Stop 5**: `src/components/three/SanctuaryScene.tsx` is lazy-loaded,
  low-poly, pixel ratio capped, and paused when off-screen.
- **Smooth on laptops**: scenes that are off screen pause their CSS animations,
  and everything respects `prefers-reduced-motion`.
- **Facts**: every factual sentence is in `src/content/facts.ts`.

## Before presenting (team TODO)

- `src/content/facts.ts`: verify each fact with a real source, add the link,
  set `verified: true`. Until then the statements are deliberately general.
- `src/content/story.ts`: replace the placeholder team names in `CREDITS`.

## Easter eggs

- Click Ghariyal Guru 5 times: he spins and says something silly.
- Press and hold on the water for 3 seconds: a school of fish swims by.
- Type `kota` on the title screen: a Kota Doria colour wave plays.

## Decisions made along the way

- Vertical scroll with full-screen "storybook pages", one per stop.
- Sounds are synthesised with the Web Audio API instead of howler, so there are
  no audio files. Sound is muted by default (speaker button in the top bar).
- Fonts (Baloo 2, Nunito) are bundled, so the site works offline in class.
- Page scrolling uses GSAP's ScrollToPlugin rather than CSS smooth scrolling.
- Ghariyal Guru leaves his corner at the ending and appears in the result card.
- Tapping an item counts immediately, so a tap is never lost to an animation.

## Future ideas (out of scope on purpose)

Accounts, a backend, maps, live pollution data, sensors, multiplayer,
leaderboards, more stops, 3D outside Stop 5, a Hindi language toggle.
