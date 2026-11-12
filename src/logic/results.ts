// results.ts: picks the ending title from the final River Health.

import { RESULT_BEST_MIN, RESULT_OK_MIN } from './config'

export type ResultTier = 'best' | 'okay' | 'help'

export interface Result {
  tier: ResultTier
  title: string
  /** A little Hindi flavour shown under the title. */
  hindi: string
  /** What the river says about this ending. Always encouraging. */
  message: string
}

const RESULTS: Record<ResultTier, Result> = {
  best: {
    tier: 'best',
    title: "River's Best Friend",
    hindi: 'Chambal ka pakka dost!',
    message:
      'Wah! You made me sparkle today. Every small choice you made added up, and that is exactly how a river gets better.',
  },
  okay: {
    tier: 'okay',
    title: 'Getting There',
    hindi: 'Shabaash, chalte raho!',
    message:
      'I feel lighter already. A few more small habits and I will be sparkling. You are closer than you think.',
  },
  help: {
    tier: 'help',
    title: 'Needs Help',
    hindi: 'Koi baat nahi, phir se!',
    message:
      'I am a bit tired today, but I do not give up and neither should you. Every journey is a fresh chance. Shall we flow again?',
  },
}

/** Which tier a health value falls in. */
export function getResultTier(health: number): ResultTier {
  if (health >= RESULT_BEST_MIN) return 'best'
  if (health >= RESULT_OK_MIN) return 'okay'
  return 'help'
}

/** The full result (title + message) for a health value. */
export function getResult(health: number): Result {
  return RESULTS[getResultTier(health)]
}
