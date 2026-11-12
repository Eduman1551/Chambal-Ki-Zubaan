import { motion } from 'framer-motion'
import { TITLE } from '../content/story'
import { useRiverStore } from '../state/useRiverStore'
import { HillsScenery, Reeds } from './river/Scenery'
import { Birds, Clouds, Sun } from './river/Sky'
import Water from './river/Water'

interface Props {
  onStart: () => void
}

/** The opening screen: name, tagline and one big Start button. */
export default function TitleScreen({ onStart }: Props) {
  const started = useRiverStore((s) => s.phase === 'journey')
  const words = TITLE.name.split(' ')
  let letterIndex = 0

  return (
    <section
      id="title"
      className="scene relative flex min-h-[100svh] flex-col overflow-hidden"
      style={{ background: 'linear-gradient(#14506B 0%, #1F8A9E 38%, #F7C98B 78%, #FFE9C4 100%)' }}
    >
      <div className="relative flex flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0">
          <Sun className="top-[46%] left-[68%] w-48 md:w-72" />
          <Clouds />
          <Birds color="#FFF8EA" />
          <HillsScenery />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 pt-10 pb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-sand md:text-4xl"
            lang="hi"
          >
            {TITLE.hindi}
          </motion.p>

          <h1
            className="text-cream text-[clamp(2.7rem,8.6vw,7rem)] drop-shadow-[0_6px_0_rgba(20,80,107,0.55)]"
            aria-label={TITLE.name}
          >
            {words.map((word, w) => (
              <span key={w} aria-hidden className="mx-[0.12em] inline-block whitespace-nowrap">
                {word.split('').map((ch, i) => {
                  const n = letterIndex++
                  return (
                    <motion.span
                      key={i}
                      className="inline-block"
                      initial={{ opacity: 0, y: 40, rotate: -8 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      transition={{ delay: 0.3 + n * 0.045, type: 'spring', stiffness: 260, damping: 16 }}
                    >
                      {ch}
                    </motion.span>
                  )
                })}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="font-display mt-2 text-2xl font-semibold text-white md:text-4xl"
          >
            {TITLE.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, type: 'spring', stiffness: 220, damping: 14 }}
            className="mt-8"
          >
            <button className="btn px-10 py-5 text-2xl md:text-3xl" onClick={onStart}>
              {started ? 'Continue the journey' : TITLE.start}
              <span aria-hidden>↓</span>
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9 }}
            className="mt-6 rounded-full bg-deep/70 px-4 py-1.5 text-sm font-bold text-cream md:text-base"
          >
            {TITLE.note}
          </motion.p>
        </div>
      </div>

      <Water className="h-[22svh] min-h-[140px]">
        <Reeds className="-top-16 left-[4%] w-20 md:w-28" />
        <Reeds className="-top-14 right-[6%] w-16 md:w-24" flip />
      </Water>
    </section>
  )
}
