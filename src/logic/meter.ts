// meter.ts: turns the player's choices into one River Health number (0-100).
// Pure functions only. No React, no storage. Same choices in = same health out.

import {
  FESTIVAL_POINTS,
  ITEM_COUNT,
  POINTS_PER_ITEM,
  START_HEALTH,
  TREATMENT_MAX_POINTS,
} from './config'

/** The three festival options of Stop 4. */
export type FestivalChoice = keyof typeof FESTIVAL_POINTS

/** Everything the player has decided so far. */
export interface Choices {
  /** Stop 2: how many floating items were collected (0..ITEM_COUNT). */
  itemsCollected: number
  /** Stop 3: treatment valve position, 0 (closed) to 100 (fully open). */
  treatment: number
  /** Stop 4: the festival choice, or null if not chosen yet. */
  festival: FestivalChoice | null
}

/** Choices at the very start of the journey. */
export const INITIAL_CHOICES: Choices = {
  itemsCollected: 0,
  treatment: 0,
  festival: null,
}

/** Keep a number inside a range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Stop 2 points: a fixed amount per collected item. */
export function cleanupPoints(itemsCollected: number): number {
  return clamp(itemsCollected, 0, ITEM_COUNT) * POINTS_PER_ITEM
}

/** Stop 3 points: grows evenly as the treatment valve opens. */
export function treatmentPoints(treatment: number): number {
  return (clamp(treatment, 0, 100) / 100) * TREATMENT_MAX_POINTS
}

/** Stop 4 points: depends on the festival choice (0 until a choice is made). */
export function festivalPoints(festival: FestivalChoice | null): number {
  return festival === null ? 0 : FESTIVAL_POINTS[festival]
}

/** The River Health meter: start value plus the points of each stop. */
export function computeHealth(choices: Choices): number {
  const total =
    START_HEALTH +
    cleanupPoints(choices.itemsCollected) +
    treatmentPoints(choices.treatment) +
    festivalPoints(choices.festival)
  return Math.round(clamp(total, 0, 100))
}
