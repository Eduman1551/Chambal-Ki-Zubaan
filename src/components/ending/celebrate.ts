import { DORIA_COLORS } from '../../logic/config'

/** A burst of confetti in Kota Doria colours. The library is loaded on demand. */
export async function celebrate() {
  const { default: confetti } = await import('canvas-confetti')
  const colors = [...DORIA_COLORS]
  const base = { colors, disableForReducedMotion: true, zIndex: 100 }
  confetti({ ...base, particleCount: 90, spread: 80, origin: { x: 0.5, y: 0.65 } })
  setTimeout(() => confetti({ ...base, particleCount: 50, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } }), 180)
  setTimeout(() => confetti({ ...base, particleCount: 50, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } }), 320)
}
