// waterColor.ts: blends the water from murky brown-green to river teal.

import { PALETTE } from './config'
import { clamp } from './meter'

type RGB = [number, number, number]

function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex([r, g, b]: RGB): string {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
}

/** Mix two hex colours. t = 0 gives `from`, t = 1 gives `to`. */
export function mixColors(from: string, to: string, t: number): string {
  const a = hexToRgb(from)
  const b = hexToRgb(to)
  const k = clamp(t, 0, 1)
  return rgbToHex([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k])
}

/** Clean-ness from 0 (murky) to 1 (clear) for a health value. */
export function cleanness(health: number): number {
  return clamp(health, 0, 100) / 100
}

export interface WaterColors {
  /** Main water colour. */
  water: string
  /** Lighter tone for wave highlights. */
  light: string
  /** Darker tone for depth. */
  deep: string
}

/** The three water tones for a given River Health. */
export function getWaterColors(health: number): WaterColors {
  const t = cleanness(health)
  const water = mixColors(PALETTE.murky, PALETTE.river, t)
  return {
    water,
    light: mixColors(water, '#ffffff', 0.18 + 0.2 * t),
    deep: mixColors(mixColors('#4d4425', PALETTE.deep, t), water, 0.25),
  }
}
