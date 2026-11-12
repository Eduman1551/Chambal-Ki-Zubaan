import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { getMood } from '../../logic/mood'
import { useHealth } from '../../state/useRiverStore'

const MOOD_FACE = { happy: '😄', okay: '🙂', worried: '😟' } as const

/** The River Health meter. A "+4" style chip pops whenever the value changes. */
export default function HealthMeter({ large = false }: { large?: boolean }) {
  const health = useHealth()
  const previous = useRef(health)
  const [delta, setDelta] = useState<{ value: number; key: number } | null>(null)

  useEffect(() => {
    const diff = health - previous.current
    previous.current = health
    if (diff === 0) return
    // while the chip is showing, keep adding to it (smooth for the slider in Stop 3)
    setDelta((d) => (d ? { value: d.value + diff, key: d.key } : { value: diff, key: Date.now() }))
    const t = setTimeout(() => setDelta(null), 1400)
    return () => clearTimeout(t)
  }, [health])

  return (
    <div className={`relative w-full ${large ? 'max-w-xl' : 'max-w-md'}`}>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className={`font-display font-extrabold whitespace-nowrap text-deep ${large ? 'text-xl' : 'text-sm md:text-base'}`}>
          River Health
        </span>
        <span className={`font-display font-extrabold whitespace-nowrap text-deep tabular-nums ${large ? 'text-2xl' : 'text-sm md:text-lg'}`}>
          <span aria-hidden>{MOOD_FACE[getMood(health)]} </span>
          {health}
          <span className="text-[0.7em] opacity-70">/100</span>
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="River Health"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={health}
        className={`relative overflow-hidden rounded-full bg-deep/20 shadow-inner ${large ? 'h-7' : 'h-4 md:h-5'}`}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--water-deep), var(--water) 60%, var(--water-light))' }}
          initial={false}
          animate={{ width: `${health}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        >
          <span className="absolute inset-x-2 top-[3px] h-[3px] rounded-full bg-white/50" />
        </motion.div>
      </div>
      <AnimatePresence>
        {delta && (
          <motion.span
            key={delta.key}
            initial={{ opacity: 0, y: 6, scale: 0.6 }}
            animate={{ opacity: 1, y: -6, scale: 1 }}
            exit={{ opacity: 0, y: -22 }}
            className={`font-display absolute -bottom-7 right-0 rounded-full px-2.5 py-0.5 text-sm font-extrabold text-white shadow ${
              delta.value > 0 ? 'bg-leaf' : 'bg-murky'
            }`}
            aria-hidden
          >
            {delta.value > 0 ? `+${delta.value}` : delta.value}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
