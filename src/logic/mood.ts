// mood.ts: Ghariyal Guru's mood follows the River Health meter.

import { MOOD_HAPPY_MIN, MOOD_OKAY_MIN } from './config'

export type Mood = 'happy' | 'okay' | 'worried'

export function getMood(health: number): Mood {
  if (health >= MOOD_HAPPY_MIN) return 'happy'
  if (health >= MOOD_OKAY_MIN) return 'okay'
  return 'worried'
}
