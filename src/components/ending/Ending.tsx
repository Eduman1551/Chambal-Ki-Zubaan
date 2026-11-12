import { motion, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { CREDITS, ENDING, TITLE } from '../../content/story'
import { scrollToY } from '../../hooks/scrollTo'
import { DORIA_COLORS } from '../../logic/config'
import { getMood } from '../../logic/mood'
import { getResult } from '../../logic/results'
import { useHealth, useRiverStore } from '../../state/useRiverStore'
import HealthMeter from '../hud/HealthMeter'
import { GuruArt } from '../mascot/GhariyalGuru'
import { celebrate } from './celebrate'
import PledgeMaker from './PledgeMaker'
import Sources from './Sources'

const TIER_COLOR = { best: 'text-leaf', okay: 'text-river', help: 'text-sunset' } as const

/** The ending: result title, River Pledge, play again, sources and credits. */
export default function Ending() {
  const health = useHealth()
  const result = getResult(health)
  const run = useRiverStore((s) => s.run)
  const reset = useRiverStore((s) => s.reset)
  const hero = useRef<HTMLDivElement>(null)
  const seen = useInView(hero, { amount: 0.6 })

  // Confetti once per run when a "River's Best Friend" reaches the ending.
  const celebratedRun = useRef(-1)
  useEffect(() => {
    if (seen && result.tier === 'best' && celebratedRun.current !== run) {
      celebratedRun.current = run
      celebrate()
    }
  }, [seen, result.tier, run])

  const playAgain = () => {
    reset()
    scrollToY(0)
  }

  return (
    <section
      id="ending"
      data-stop={6}
      aria-label="The ending"
      className="scene relative z-[6] -mt-8 overflow-hidden rounded-t-[2.25rem] bg-cream shadow-[0_-14px_40px_-10px_rgba(20,80,107,0.45)]"
    >
      {/* Kota Doria stripe */}
      <div className="flex h-3" aria-hidden>
        {DORIA_COLORS.map((c) => (
          <span key={c} className="flex-1" style={{ background: c }} />
        ))}
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pt-24 pb-16 md:px-8">
        {/* ── Result ── */}
        <div ref={hero} className="reveal flex flex-col items-center text-center">
          <p className="mb-1 text-base font-bold tracking-wide text-river uppercase">{ENDING.kicker}</p>
          <motion.h2
            key={result.tier}
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className={`text-[clamp(2.6rem,7vw,5.5rem)] ${TIER_COLOR[result.tier]}`}
          >
            {result.title}
          </motion.h2>
          <p className="font-display mb-5 text-2xl font-semibold text-deep">{result.hindi}</p>

          <HealthMeter large />

          <div className="card mt-8 flex max-w-2xl flex-col items-center gap-3 p-5 text-left sm:flex-row md:p-6">
            <GuruArt mood={getMood(health)} className="w-36 shrink-0" />
            <p className="font-display text-xl leading-snug font-semibold text-deep md:text-2xl">“{result.message}”</p>
          </div>
        </div>

        {/* ── River Pledge ── */}
        <div className="reveal">
          <h2 className="text-center text-4xl text-deep md:text-5xl">{ENDING.pledgeTitle}</h2>
          <p className="mx-auto mt-2 mb-8 max-w-xl text-center text-xl">{ENDING.pledgeIntro}</p>
          {/* key = a fresh pledge form on every "Play again" */}
          <PledgeMaker key={run} />
        </div>

        <div className="flex justify-center">
          <button className="btn btn-teal px-8 py-4 text-2xl" onClick={playAgain}>
            ↻ {ENDING.playAgain}
          </button>
        </div>

        <Sources />

        {/* ── Credits ── */}
        <section aria-labelledby="credits-heading" className="text-center">
          <h3 id="credits-heading" className="text-2xl text-deep md:text-3xl">
            {CREDITS.heading}
          </h3>
          <p className="mt-1 font-bold text-river">{CREDITS.course}</p>
          <ul className="m-0 mt-3 flex list-none flex-wrap justify-center gap-2 p-0">
            {CREDITS.team.map((member) => (
              <li key={member} className="font-display rounded-full bg-sand px-4 py-1.5 text-lg font-semibold text-deep">
                {member}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-base">{CREDITS.thanks}</p>
          <p className="mt-2 inline-block rounded-full bg-deep px-4 py-1.5 text-sm font-bold text-cream">{TITLE.note}</p>
        </section>
      </div>
    </section>
  )
}
