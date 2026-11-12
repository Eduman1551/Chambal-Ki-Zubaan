// The one zustand store. It remembers the player's CHOICES and a little UI state.
// River Health is never stored: it is always computed from the choices (see logic/meter.ts).

import { create } from 'zustand'
import { computeHealth, clamp, type FestivalChoice } from '../logic/meter'

type Phase = 'title' | 'journey'

interface RiverState {
  phase: Phase
  /** Stop 2: ids of the floating items already collected. */
  collected: string[]
  /** Stop 3: treatment valve, 0-100. */
  treatment: number
  /** Stop 4: festival choice. */
  festival: FestivalChoice | null
  /** Which stop is on screen: 0 = title, 1-5 = stops, 6 = ending. */
  currentStop: number
  /** Sound is muted by default. */
  muted: boolean
  /** What Ghariyal Guru is saying right now (key changes on every new line). */
  guruLine: { text: string; key: number } | null
  /** Increases every time the fish-school easter egg is triggered. */
  fishKey: number

  start: () => void
  collect: (id: string) => void
  setTreatment: (value: number) => void
  chooseFestival: (choice: FestivalChoice) => void
  setStop: (stop: number) => void
  toggleMute: () => void
  say: (text: string) => void
  hush: () => void
  showFish: () => void
  reset: () => void
}

export const useRiverStore = create<RiverState>((set) => ({
  phase: 'title',
  collected: [],
  treatment: 0,
  festival: null,
  currentStop: 0,
  muted: true,
  guruLine: null,
  fishKey: 0,

  start: () => set({ phase: 'journey' }),
  collect: (id) => set((s) => (s.collected.includes(id) ? s : { collected: [...s.collected, id] })),
  setTreatment: (value) => set({ treatment: clamp(Math.round(value), 0, 100) }),
  chooseFestival: (choice) => set({ festival: choice }),
  setStop: (stop) => set((s) => (s.currentStop === stop ? s : { currentStop: stop })),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  say: (text) => set((s) => ({ guruLine: { text, key: (s.guruLine?.key ?? 0) + 1 } })),
  hush: () => set({ guruLine: null }),
  showFish: () => set((s) => ({ fishKey: s.fishKey + 1 })),
  // "Play again": forget the choices, keep the mute setting.
  reset: () =>
    set({ phase: 'title', collected: [], treatment: 0, festival: null, currentStop: 0, guruLine: null }),
}))

/** River Health (0-100) for the current choices. */
export const selectHealth = (s: RiverState): number =>
  computeHealth({ itemsCollected: s.collected.length, treatment: s.treatment, festival: s.festival })

/** Hook: the live River Health. */
export const useHealth = (): number => useRiverStore(selectHealth)
