import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { ENDING, PLEDGES } from '../../content/story'
import { NAME_MAX_LENGTH, PLEDGE_PICK_COUNT } from '../../logic/config'
import { cleanName, isPledgeReady, togglePledge } from '../../logic/pledge'
import { useHealth } from '../../state/useRiverStore'
import { celebrate } from './celebrate'
import PledgeCard from './PledgeCard'

/** Name + pick-3 pledges on the left, live card preview and download on the right. */
export default function PledgeMaker() {
  const health = useHealth()
  const [name, setName] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>('idle')
  const cardRef = useRef<HTMLDivElement>(null)
  const ready = isPledgeReady(picked)

  const download = async () => {
    const node = cardRef.current
    if (!node || !ready) return
    setStatus('working')
    try {
      // html-to-image is loaded only when the button is pressed
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(node, {
        pixelRatio: 1080 / node.offsetWidth, // always export 1080px wide
        cacheBust: true,
      })
      const link = document.createElement('a')
      link.download = 'chambal-river-pledge.png'
      link.href = dataUrl
      link.click()
      setStatus('done')
      celebrate()
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_auto]">
      <div>
        <label htmlFor="pledge-name" className="font-display mb-1 block text-xl font-extrabold text-deep">
          {ENDING.nameLabel}
        </label>
        <input
          id="pledge-name"
          type="text"
          value={name}
          maxLength={NAME_MAX_LENGTH}
          onChange={(e) => setName(e.target.value)}
          placeholder={ENDING.namePlaceholder}
          autoComplete="off"
          className="mb-5 w-full max-w-md rounded-2xl border-[3px] border-river/30 bg-white px-4 py-3 text-xl font-bold text-deep outline-none placeholder:text-ink/35 focus:border-sunset"
        />

        <p className="font-display mb-2 flex items-baseline justify-between text-xl font-extrabold text-deep">
          Pick {PLEDGE_PICK_COUNT} pledges
          <span aria-live="polite" className={`text-lg ${ready ? 'text-leaf' : 'text-sunset'}`}>
            {picked.length}/{PLEDGE_PICK_COUNT} picked {ready && '✓'}
          </span>
        </p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {PLEDGES.map((pledge) => {
            const on = picked.includes(pledge.id)
            const full = ready && !on
            return (
              <motion.button
                key={pledge.id}
                type="button"
                aria-pressed={on}
                disabled={full}
                onClick={() => setPicked((p) => togglePledge(p, pledge.id))}
                whileHover={full ? undefined : { scale: 1.03 }}
                whileTap={full ? undefined : { scale: 0.96 }}
                className={`flex items-center gap-2.5 rounded-2xl border-[3px] px-3.5 py-3 text-left text-lg leading-snug font-bold transition-colors ${
                  on
                    ? 'border-leaf bg-leaf text-white shadow-md'
                    : full
                      ? 'cursor-not-allowed border-transparent bg-white/60 text-ink/40'
                      : 'border-river/25 bg-white text-deep hover:border-river'
                }`}
              >
                <span
                  aria-hidden
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-base ${on ? 'bg-white text-leaf' : 'bg-river/15'}`}
                >
                  {on ? '✓' : ''}
                </span>
                {pledge.text}
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[400px] flex-col items-center gap-4 lg:w-[400px]">
        <div className="w-full rounded-[1.6rem] shadow-2xl ring-4 ring-white">
          <PledgeCard ref={cardRef} name={cleanName(name)} picked={picked} health={health} />
        </div>
        <button className="btn w-full text-xl" disabled={!ready || status === 'working'} onClick={download}>
          {status === 'working' ? ENDING.downloading : `⬇ ${ENDING.download}`}
        </button>
        <p aria-live="polite" className="min-h-6 text-center text-base font-bold">
          {!ready && <span className="text-ink/60">Pick {PLEDGE_PICK_COUNT - picked.length} more to unlock your card.</span>}
          {ready && status === 'done' && <span className="text-leaf">Saved! Share it and keep your promise. 💚</span>}
          {status === 'error' && (
            <span className="text-[#B85E12]">Could not save the image here. A screenshot works too!</span>
          )}
        </p>
      </div>
    </div>
  )
}
