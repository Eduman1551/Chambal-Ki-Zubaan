// Quick sanity check of the story maths. Run with: pnpm check:logic
import assert from 'node:assert/strict'
import { ITEM_COUNT, PLEDGE_PICK_COUNT, START_HEALTH } from '../src/logic/config.ts'
import { computeHealth, INITIAL_CHOICES } from '../src/logic/meter.ts'
import { getMood } from '../src/logic/mood.ts'
import { isPledgeReady, togglePledge } from '../src/logic/pledge.ts'
import { getResultTier } from '../src/logic/results.ts'
import { getWaterColors } from '../src/logic/waterColor.ts'

const start = computeHealth(INITIAL_CHOICES)
const best = computeHealth({ itemsCollected: ITEM_COUNT, treatment: 100, festival: 'eco' })
const worst = computeHealth({ itemsCollected: 0, treatment: 0, festival: 'dump' })

assert.equal(start, START_HEALTH, 'journey starts at START_HEALTH')
assert.equal(best, 100, 'a perfect run reaches 100')
assert.ok(worst >= 0 && worst < start, 'worst run stays in range and below the start')
assert.equal(getResultTier(best), 'best')
assert.equal(getResultTier(worst), 'help')
assert.equal(getMood(best), 'happy')
assert.equal(getMood(worst), 'worried')
assert.equal(getWaterColors(100).water, '#1f8a9e', 'full health water is river teal')
assert.equal(getWaterColors(0).water, '#7a6a3a', 'zero health water is murky')

let picked: string[] = []
for (const id of ['a', 'b', 'c', 'd']) picked = togglePledge(picked, id)
assert.equal(picked.length, PLEDGE_PICK_COUNT, 'cannot pick more pledges than allowed')
assert.ok(isPledgeReady(picked))
assert.deepEqual(togglePledge(picked, 'a'), ['b', 'c'], 'tapping again removes a pledge')

console.log(`Logic OK  start=${start}  best=${best}  worst=${worst}`)
