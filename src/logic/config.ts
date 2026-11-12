// ─────────────────────────────────────────────────────────────
// config.ts: every tunable number of the story lives here.
// Change a value, save, and the whole site follows.
// ─────────────────────────────────────────────────────────────

/** The palette (also mirrored as CSS tokens in src/index.css). */
export const PALETTE = {
  river: '#1F8A9E',
  deep: '#14506B',
  sunset: '#F28C38',
  sand: '#E9D8B4',
  leaf: '#5FA55A',
  cream: '#FFF8EA',
  ink: '#2B2B2B',
  murky: '#7A6A3A',
} as const

/** Kota Doria saree colours, used by the "kota" easter egg and the pledge card. */
export const DORIA_COLORS = ['#F28C38', '#E2447B', '#F5C542', '#1F8A9E', '#5FA55A', '#7B4FA3'] as const

// ── River Health meter ──────────────────────────────────────
// Health always stays between 0 and 100.
// It is: START + (stop 2 points) + (stop 3 points) + (stop 4 points)

/** Health the river starts the journey with. */
export const START_HEALTH = 40

/** Stop 2: points for each floating item collected into the basket. */
export const POINTS_PER_ITEM = 4

/** Stop 2: how many items float near the barrage. */
export const ITEM_COUNT = 6

/** Stop 3: points when the treatment valve is fully open (scales with the slider). */
export const TREATMENT_MAX_POINTS = 20

/** Stop 4: points for each festival choice. */
export const FESTIVAL_POINTS = {
  eco: 16, // clay idol + tank immersion + flowers to compost
  partial: 6, // river immersion, but plastic goes back home
  dump: -10, // everything goes into the river
} as const

// With the numbers above: best run = 40 + 24 + 20 + 16 = 100, worst run = 30.

// ── Result titles (ending) ──────────────────────────────────
/** Health at or above this = "River's Best Friend". */
export const RESULT_BEST_MIN = 80
/** Health at or above this (and below best) = "Getting There". Below = "Needs Help". */
export const RESULT_OK_MIN = 55

// ── Mascot mood ─────────────────────────────────────────────
/** Health at or above this = happy Ghariyal Guru. */
export const MOOD_HAPPY_MIN = 70
/** Health at or above this (and below happy) = okay. Below = worried. */
export const MOOD_OKAY_MIN = 40

// ── Pledge card ─────────────────────────────────────────────
/** The player picks exactly this many pledges. */
export const PLEDGE_PICK_COUNT = 3
/** Longest name allowed on the pledge card. */
export const NAME_MAX_LENGTH = 24

// ── Easter eggs ─────────────────────────────────────────────
/** Clicks on Ghariyal Guru needed for his spin. */
export const GURU_SPIN_CLICKS = 5
/** Milliseconds of holding on the water before the fish school appears. */
export const FISH_HOLD_MS = 3000
/** How long the fish school stays on screen. */
export const FISH_SHOW_MS = 6000
/** The secret word typed on the title screen. */
export const SECRET_WORD = 'kota'

// ── 3D sanctuary scene (Stop 5) ─────────────────────────────
/** Max device pixel ratio for the 3D canvas (keeps laptops cool). */
export const SCENE_MAX_DPR = 1.5
/** Most fish shown in the 3D scene when the river is at full health. */
export const SCENE_MAX_FISH = 9
/** Fish only appear in 3D above this health. */
export const SCENE_FISH_MIN_HEALTH = 50
