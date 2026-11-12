// pledge.ts: rules for picking pledges on the River Pledge card.

import { NAME_MAX_LENGTH, PLEDGE_PICK_COUNT } from './config'

/**
 * Tap a pledge: adds it if there is room, removes it if already picked.
 * Never lets the list grow past PLEDGE_PICK_COUNT.
 */
export function togglePledge(picked: string[], id: string): string[] {
  if (picked.includes(id)) return picked.filter((p) => p !== id)
  if (picked.length >= PLEDGE_PICK_COUNT) return picked
  return [...picked, id]
}

/** The card can be downloaded once exactly PLEDGE_PICK_COUNT pledges are picked. */
export function isPledgeReady(picked: string[]): boolean {
  return picked.length === PLEDGE_PICK_COUNT
}

/** Tidy the typed name; fall back to a friendly default. */
export function cleanName(raw: string): string {
  const name = raw.replace(/\s+/g, ' ').trim().slice(0, NAME_MAX_LENGTH)
  return name || 'A friend of the Chambal'
}
