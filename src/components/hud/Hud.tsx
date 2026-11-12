import { AnimatePresence, motion } from 'framer-motion'
import { STOPS, TITLE } from '../../content/story'
import { useRiverStore } from '../../state/useRiverStore'
import { scrollToId } from '../../hooks/scrollTo'
import HealthMeter from './HealthMeter'

/** Fixed top bar shown during the journey: meter, stop dots, sound toggle. */
export default function Hud() {
  const currentStop = useRiverStore((s) => s.currentStop)
  const muted = useRiverStore((s) => s.muted)
  const toggleMute = useRiverStore((s) => s.toggleMute)
  const visible = currentStop >= 1

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ y: -90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          className="fixed inset-x-0 top-0 z-50 px-2 pt-2 md:px-4 md:pt-3"
        >
          <div className="card mx-auto flex max-w-6xl items-center gap-3 !rounded-full px-4 py-2 md:gap-6 md:px-6">
            <div className="hidden shrink-0 leading-tight lg:block">
              <p className="font-display text-lg font-extrabold text-deep">{TITLE.name}</p>
              <p className="text-xs font-bold text-river">{TITLE.note}</p>
            </div>

            <div className="min-w-0 flex-1">
              <HealthMeter />
            </div>

            <nav aria-label="Stops" className="flex shrink-0 items-center gap-1.5 md:gap-2">
              {STOPS.map((stop, i) => {
                const n = i + 1
                const active = currentStop === n
                const done = currentStop > n
                return (
                  <button
                    key={stop.id}
                    onClick={() => scrollToId(stop.id)}
                    aria-label={`Stop ${n}: ${stop.name}`}
                    aria-current={active ? 'step' : undefined}
                    title={stop.name}
                    className={`font-display grid h-3.5 w-3.5 place-items-center rounded-full border-0 p-0 text-sm font-extrabold transition-all sm:h-7 sm:w-7 md:h-9 md:w-9 md:text-base ${
                      active
                        ? 'scale-110 bg-sunset text-white shadow-md'
                        : done
                          ? 'bg-river text-white'
                          : 'bg-deep/15 text-deep hover:bg-deep/25'
                    }`}
                  >
                    <span className="hidden sm:inline">{n}</span>
                  </button>
                )
              })}
            </nav>

            <button
              onClick={toggleMute}
              aria-pressed={!muted}
              aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
              title={muted ? 'Sound is off' : 'Sound is on'}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-0 bg-deep/10 text-lg transition-colors hover:bg-deep/20 md:h-10 md:w-10"
            >
              <span aria-hidden>{muted ? '🔇' : '🔊'}</span>
            </button>
          </div>
          <p className="mx-auto mt-1 w-fit rounded-full bg-deep/65 px-3 py-0.5 text-[11px] font-bold text-cream lg:hidden">
            {TITLE.note}
          </p>
        </motion.header>
      )}
    </AnimatePresence>
  )
}
