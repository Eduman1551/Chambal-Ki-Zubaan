import { AnimatePresence, motion } from 'framer-motion'
import { FACTS } from '../../content/facts'
import { GURU, STOP4, STOPS } from '../../content/story'
import { FESTIVAL_POINTS } from '../../logic/config'
import type { FestivalChoice } from '../../logic/meter'
import { useRiverStore } from '../../state/useRiverStore'
import FactNote from '../FactNote'
import Scene, { NextButton, StoryCard } from '../Scene'
import { FestivalScenery } from '../river/Scenery'
import { Sun } from '../river/Sky'

const ICONS: Record<FestivalChoice, string> = { eco: '🪔', partial: '🛍️', dump: '🌊' }

/** A floating leaf lamp with a flickering flame. */
function Diya({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <svg
      viewBox="0 0 60 50"
      className="bob pointer-events-none absolute w-12 md:w-16"
      style={{ left: `${x}%`, top: `${y}%`, animationDelay: `-${delay}s` }}
      aria-hidden
    >
      <ellipse cx="30" cy="24" rx="16" ry="14" fill="#F5C542" opacity="0.3" />
      <path className="flicker" d="M30 8 Q38 20 30 28 Q22 20 30 8 Z" fill="#F28C38" />
      <path d="M8 28 Q30 52 52 28 Q30 34 8 28 Z" fill="#B5573F" />
      <path d="M8 28 Q30 22 52 28 Q30 36 8 28 Z" fill="#D97B4F" />
    </svg>
  )
}

/** Things left behind in the water (shown for the less river-friendly choices). */
function Debris({ x, y, kind, delay = 0 }: { x: number; y: number; kind: 'bag' | 'garland' | 'paint'; delay?: number }) {
  return (
    <svg
      viewBox="0 0 60 40"
      className="bob pointer-events-none absolute w-12 md:w-16"
      style={{ left: `${x}%`, top: `${y}%`, animationDelay: `-${delay}s` }}
      aria-hidden
    >
      {kind === 'bag' && (
        <path d="M10 30 Q6 10 22 12 L26 4 L32 12 Q54 10 50 30 Q30 38 10 30 Z" fill="#fff" fillOpacity="0.8" stroke="#B9C6CC" strokeWidth="2" />
      )}
      {kind === 'garland' &&
        [8, 18, 28, 38, 48].map((cx, i) => (
          <circle key={cx} cx={cx} cy={20 + (i % 2 ? 5 : -2)} r="6.5" fill={i % 2 ? '#F5C542' : '#F28C38'} />
        ))}
      {kind === 'paint' && (
        <>
          <ellipse cx="30" cy="22" rx="26" ry="10" fill="#7B4FA3" opacity="0.45" />
          <ellipse cx="22" cy="20" rx="12" ry="5" fill="#E2447B" opacity="0.5" />
        </>
      )}
    </svg>
  )
}

/** What floats on the water for each choice. */
function FestivalWater({ choice }: { choice: FestivalChoice | null }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={choice ?? 'none'}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {(choice === null || choice === 'eco') && (
          <>
            <Diya x={44} y={22} />
            <Diya x={62} y={50} delay={1.2} />
            <Diya x={80} y={20} delay={0.6} />
            {choice === 'eco' && <Diya x={30} y={56} delay={1.8} />}
            {choice === 'eco' && <Diya x={90} y={58} delay={2.4} />}
          </>
        )}
        {choice === 'partial' && (
          <>
            <Diya x={46} y={22} />
            <Diya x={82} y={24} delay={0.9} />
            <Debris x={62} y={50} kind="paint" delay={0.4} />
            <Debris x={32} y={58} kind="garland" delay={1.5} />
          </>
        )}
        {choice === 'dump' && (
          <>
            <Debris x={42} y={22} kind="bag" />
            <Debris x={58} y={52} kind="paint" delay={0.5} />
            <Debris x={74} y={22} kind="garland" delay={1.1} />
            <Debris x={88} y={54} kind="bag" delay={1.7} />
            <Debris x={30} y={58} kind="paint" delay={2.2} />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

/** Stop 4: one festival choice with a kind, non-judgemental consequence. */
export default function Stop4Festival() {
  const festival = useRiverStore((s) => s.festival)
  const chooseFestival = useRiverStore((s) => s.chooseFestival)
  const say = useRiverStore((s) => s.say)
  const chosen = STOP4.options.find((o) => o.id === festival)

  const pick = (id: FestivalChoice) => {
    chooseFestival(id)
    say(GURU.festival[id])
  }

  return (
    <Scene
      id={STOPS[3].id}
      stop={4}
      label={STOPS[3].name}
      sky="linear-gradient(#4B4A8C 0%, #B4568F 38%, #F28C38 72%, #F9CF7A 100%)"
      scenery={
        <>
          <Sun className="top-[34%] left-[72%] w-40 md:w-64" color="#FFD27A" />
          <FestivalScenery />
        </>
      }
      water={<FestivalWater choice={festival} />}
    >
      <StoryCard kicker={STOP4.kicker} title={STOP4.title} className="!max-w-4xl">
        <p className="mb-3 text-lg">{STOP4.body}</p>

        <div role="radiogroup" aria-label="Festival choice" className="grid gap-3 md:grid-cols-3">
          {STOP4.options.map((option) => {
            const selected = festival === option.id
            const points = FESTIVAL_POINTS[option.id]
            return (
              <motion.button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => pick(option.id)}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.96 }}
                className={`relative rounded-2xl border-4 p-3 text-left transition-colors md:p-4 ${
                  selected ? 'border-sunset bg-white shadow-lg' : 'border-transparent bg-white/75 hover:bg-white'
                }`}
              >
                <span className="mb-1 flex items-center gap-2">
                  <span className="text-3xl" aria-hidden>
                    {ICONS[option.id]}
                  </span>
                  <span className="font-display text-lg leading-tight font-extrabold text-deep md:text-xl">{option.title}</span>
                </span>
                <span className="block text-base leading-snug text-ink/85">{option.detail}</span>
                {selected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="font-display absolute -top-3 -right-3 rounded-full bg-sunset px-2.5 py-0.5 text-sm font-extrabold text-white shadow"
                  >
                    {points > 0 ? `+${points}` : points}
                  </motion.span>
                )}
              </motion.button>
            )
          })}
        </div>

        <div aria-live="polite" className="mt-3 min-h-[3.2rem]">
          <AnimatePresence mode="wait">
            {chosen ? (
              <motion.div
                key={chosen.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid gap-3 md:grid-cols-2"
              >
                <p className="font-display rounded-2xl bg-river/12 px-4 py-3 text-lg leading-snug font-semibold text-deep">
                  “{chosen.consequence}”
                </p>
                <FactNote fact={FACTS.idols} />
              </motion.div>
            ) : (
              <motion.p key="hint" exit={{ opacity: 0 }} className="font-display text-lg font-semibold text-river">
                👆 {STOP4.hint}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <NextButton to={STOPS[4].id}>{STOP4.cta}</NextButton>
      </StoryCard>
    </Scene>
  )
}
