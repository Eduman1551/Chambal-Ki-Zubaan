// ─────────────────────────────────────────────────────────────────────────────
// facts.ts: EVERY factual statement shown on the site lives in this one file.
//
// TODO(team): team must verify with a real source and add the source link
//             before presenting.
//
// Rules for the team:
//   1. Do NOT add numbers or statistics unless a real source says so.
//   2. For each fact: check it, fix the wording if needed, fill in `sourceLabel`
//      and `sourceUrl`, then set `verified: true`.
//   3. Until a fact is verified, keep it a soft, general statement (as below).
//   4. The "Sources" section at the bottom of the page is built from this file.
// ─────────────────────────────────────────────────────────────────────────────

export interface Fact {
  id: string
  /** Where it appears in the story. */
  usedIn: string
  /** The statement shown to the audience. Keep it short and simple. */
  text: string
  /** Set to true only after checking a real source. */
  verified: boolean
  /** Name of the source, e.g. "CPCB report (2023)". Empty until verified. */
  sourceLabel: string
  /** Link to the source. Empty until verified. */
  sourceUrl: string
}

export const FACTS = {
  // TODO(team): team must verify with a real source and add the source link before presenting.
  plastic: {
    id: 'plastic',
    usedIn: 'Stop 2 · Riverfront',
    text: 'Plastic does not break down easily in water. It can stay in a river for a very long time and can harm the animals living there.',
    verified: false,
    sourceLabel: '',
    sourceUrl: '',
  },
  // TODO(team): team must verify with a real source and add the source link before presenting.
  sewage: {
    id: 'sewage',
    usedIn: 'Stop 3 · The drains',
    text: 'When sewage and waste water reach a river without treatment, the water becomes cloudy and holds less oxygen. That makes life harder for fish and other river animals, and for people who depend on the river.',
    verified: false,
    sourceLabel: '',
    sourceUrl: '',
  },
  // TODO(team): team must verify with a real source and add the source link before presenting.
  idols: {
    id: 'idols',
    usedIn: 'Stop 4 · Festival time',
    text: 'Idols made of natural clay dissolve in water far more easily than idols made of plaster, and natural colours are gentler on river life than chemical paints.',
    verified: false,
    sourceLabel: '',
    sourceUrl: '',
  },
  // TODO(team): team must verify with a real source and add the source link before presenting.
  sanctuary: {
    id: 'sanctuary',
    usedIn: 'Stop 5 · The sanctuary',
    text: 'A long stretch of the Chambal is protected as a wildlife sanctuary. It is known as an important home of the gharial, a rare fish-eating reptile with a long, thin snout.',
    verified: false,
    sourceLabel: '',
    sourceUrl: '',
  },
} satisfies Record<string, Fact>

/** All facts as a list (used by the Sources section). */
export const FACT_LIST: Fact[] = Object.values(FACTS)
