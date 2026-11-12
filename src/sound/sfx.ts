// Tiny sound effects, synthesised with the Web Audio API (no audio files at all).
// Sound is MUTED by default; the speaker button in the top bar turns it on.

import { useRiverStore } from '../state/useRiverStore'

let ctx: AudioContext | null = null

function audio(): AudioContext | null {
  if (useRiverStore.getState().muted) return null
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null // no audio support: stay silent
  }
}

/** One short note that slides from one pitch to another. */
function note(from: number, to: number, start: number, length: number, type: OscillatorType = 'sine', volume = 0.12) {
  const ac = audio()
  if (!ac) return
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  const t = ac.currentTime + start
  osc.type = type
  osc.frequency.setValueAtTime(from, t)
  osc.frequency.exponentialRampToValueAtTime(to, t + length)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + length)
  osc.connect(gain).connect(ac.destination)
  osc.start(t)
  osc.stop(t + length + 0.02)
}

export const sfx = {
  /** Item lands in the basket. */
  pop: () => note(420, 880, 0, 0.12, 'triangle'),
  /** A choice is made. */
  click: () => note(600, 500, 0, 0.07, 'square', 0.05),
  /** Something good happened: three rising notes. */
  chime: () => [523, 659, 784].forEach((f, i) => note(f, f, i * 0.09, 0.22)),
  /** Something not so good: a soft falling note. */
  drop: () => note(330, 180, 0, 0.3, 'sine', 0.1),
  /** Ghariyal Guru's spin. */
  boing: () => {
    note(180, 720, 0, 0.25, 'sawtooth', 0.06)
    note(720, 240, 0.25, 0.3, 'sawtooth', 0.06)
  },
  /** Bubbles for the fish school. */
  bubbles: () => [0, 1, 2, 3, 4].forEach((i) => note(500 + i * 130, 900 + i * 160, i * 0.08, 0.09)),
  /** Splash at the start of the journey. */
  splash: () => {
    note(900, 200, 0, 0.35, 'sine', 0.1)
    note(1200, 300, 0.05, 0.3, 'triangle', 0.05)
  },
}
