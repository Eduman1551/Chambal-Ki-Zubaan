# PLAN — Chambal Ki Zubaan

A short interactive scroll story: the Chambal river at Kota tells its own story and
the player changes how it ends. Static site, no backend.

## Folder structure

```
src/
  main.tsx, App.tsx, index.css     app shell, palette tokens, CSS animations
  content/
    facts.ts                       ALL factual text + sources (team must verify)
    story.ts                       narration, mascot lines, pledges, credits
  logic/                           plain TypeScript, no React (easy to explain)
    config.ts                      every tunable number in one place
    meter.ts                       choices -> River Health (0-100)
    results.ts                     health -> result title
    mood.ts                        health -> mascot mood
    waterColor.ts                  health -> water colour (murky -> teal)
    pledge.ts                      pick-3 pledge rules
  state/useRiverStore.ts           zustand store (choices + UI state)
  hooks/                           reduced motion, typed word, press-and-hold
  sound/sfx.ts                     tiny synthesised sounds (muted by default)
  components/
    TitleScreen.tsx
    Journey.tsx                    the 5 stops + GSAP ScrollTrigger wiring
    Scene.tsx                      shared "sky + scenery + water" layout of a stop
    hud/                           health meter, stop dots, mute, awareness note
    river/                         SVG waves, clouds, birds, reeds, fish school
    mascot/GhariyalGuru.tsx
    stops/Stop1..Stop5
    three/SanctuaryScene.tsx       the ONLY 3D (lazy-loaded)
    ending/                        result, pledge maker + card, sources, credits
scripts/check-logic.ts             tsx sanity check of the meter maths
```

## Build order (≈ one commit each, push every 4-5)

1. Project setup (Vite + React + TS + Tailwind, pnpm)
2. Palette tokens, fonts, config.ts
3. Logic modules + zustand store + logic check script
4. Title screen
5. Scroll journey skeleton (Scene layout, GSAP ScrollTrigger, HUD)
6. Water waves + parallax layers
7. Ghariyal Guru mascot
8. Stop 1 — source
9. Stop 2 — barrage clean-up
10. Stop 3 — drains + treatment valve
11. Stop 4 — festival choice
12. Stop 5 — sanctuary (2D part)
13. Stop 5 — lazy 3D scene
14. Ending + result titles
15. Pledge card + PNG download
16. Facts file + Sources section
17. Easter eggs
18. Sound (muted by default)
19. Responsive pass
20. Performance + accessibility pass
21. README
22. Final polish

## Decisions made (also listed in README)

- Vertical scroll; each stop is a full-screen "storybook page" with its own sky,
  scenery and water band. GSAP ScrollTrigger drives parallax and stop tracking.
- River Health is a pure function of the player's choices (never stored), so
  changing a choice always gives a consistent meter.
- Sounds are synthesised with WebAudio instead of howler: zero audio assets.
- Fonts are bundled (fontsource) so the site works offline in the lecture hall.
