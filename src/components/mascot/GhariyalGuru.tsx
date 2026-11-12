import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { GURU } from '../../content/story'
import { GURU_SPIN_CLICKS } from '../../logic/config'
import { getMood, type Mood } from '../../logic/mood'
import { useHealth, useRiverStore } from '../../state/useRiverStore'

const GREEN = '#5FA55A'
const GREEN_DARK = '#3F7F4A'
const GREEN_LIGHT = '#CFE3B0'

/** The cartoon gharial, drawn with plain SVG shapes. His face follows the mood. */
export function GuruArt({ mood, className = '' }: { mood: Mood; className?: string }) {
  const happy = mood === 'happy'
  const worried = mood === 'worried'
  return (
    <svg viewBox="0 0 240 150" className={className} role="img" aria-label={`${GURU.name}, feeling ${mood}`}>
      {/* tail */}
      <g className="sway" style={{ animationDuration: happy ? '0.9s' : '3s' }}>
        <path d="M40 104 Q4 100 4 58 Q24 86 52 82 Z" fill={GREEN_DARK} />
      </g>
      {/* body */}
      <ellipse cx="80" cy="106" rx="56" ry="34" fill={GREEN} />
      {[38, 56, 76, 96].map((x, i) => (
        <path key={x} d={`M${x} ${80 - i * 2} l9 -15 l9 15 Z`} fill={GREEN_DARK} />
      ))}
      <ellipse cx="88" cy="120" rx="38" ry="18" fill={GREEN_LIGHT} />
      {/* head */}
      <ellipse cx="130" cy="86" rx="36" ry="30" fill={GREEN} />
      {/* long snout + the famous "ghara" bump on the tip */}
      <rect x="142" y="84" width="90" height="20" rx="10" fill={GREEN} />
      <rect x="150" y="97" width="78" height="8" rx="4" fill={GREEN_LIGHT} />
      <circle cx="226" cy="80" r="11" fill={GREEN_DARK} />
      <circle cx="229" cy="77" r="2" fill="#2B2B2B" opacity="0.6" />
      {/* teeth */}
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${154 + i * 9} 97 l3.5 7 l3.5 -7 Z`} fill="#fff" />
      ))}
      {/* eyes */}
      <circle cx="114" cy="60" r="17" fill={GREEN} />
      <circle cx="143" cy="60" r="17" fill={GREEN} />
      <circle cx="114" cy="60" r="12" fill="#fff" />
      <circle cx="143" cy="60" r="12" fill="#fff" />
      {happy ? (
        <>
          <path d="M106 62 Q114 52 122 62" stroke="#2B2B2B" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M135 62 Q143 52 151 62" stroke="#2B2B2B" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx={117} cy={worried ? 64 : 60} r="5.5" fill="#2B2B2B" />
          <circle cx={146} cy={worried ? 64 : 60} r="5.5" fill="#2B2B2B" />
          <circle cx={119} cy={worried ? 62 : 58} r="1.8" fill="#fff" />
          <circle cx={148} cy={worried ? 62 : 58} r="1.8" fill="#fff" />
        </>
      )}
      {worried && (
        <>
          <path d="M102 46 L122 40" stroke={GREEN_DARK} strokeWidth="4" strokeLinecap="round" />
          <path d="M155 46 L135 40" stroke={GREEN_DARK} strokeWidth="4" strokeLinecap="round" />
          <path d="M166 50 q-7 12 0 16 q7 -4 0 -16" fill="#9ED8E6" />
        </>
      )}
      {/* cheek + mouth */}
      {happy && <circle cx="124" cy="92" r="7" fill="#F28C38" opacity="0.55" />}
      <path
        d={happy ? 'M134 96 Q146 112 160 100' : worried ? 'M134 106 Q146 96 160 102' : 'M134 101 L160 101'}
        stroke="#2B2B2B"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* his own little patch of river */}
      <ellipse cx="120" cy="136" rx="116" ry="14" className="water-fill" />
      <ellipse cx="96" cy="131" rx="52" ry="5" className="water-fill-light" opacity="0.7" />
      <ellipse cx="184" cy="136" rx="26" ry="3.5" className="water-fill-light" opacity="0.6" />
    </svg>
  )
}

/**
 * Ghariyal Guru lives in the bottom-left corner during the journey.
 * He reacts to the meter (mood), greets each stop and speaks story lines.
 * Easter egg: click him 5 times for a spin.
 */
export default function GhariyalGuru() {
  const health = useHealth()
  const mood = getMood(health)
  const currentStop = useRiverStore((s) => s.currentStop)
  const guruLine = useRiverStore((s) => s.guruLine)
  const say = useRiverStore((s) => s.say)
  const hush = useRiverStore((s) => s.hush)
  const spin = useAnimationControls()
  const clicks = useRef(0)
  const spins = useRef(0)

  // Greet every stop as it scrolls in.
  useEffect(() => {
    if (currentStop >= 1) say(GURU.stopGreetings[currentStop] ?? '')
  }, [currentStop, say])

  // Comment when the mood changes.
  const lastMood = useRef(mood)
  useEffect(() => {
    if (lastMood.current === mood) return
    lastMood.current = mood
    say(GURU.byMood[mood])
  }, [mood, say])

  // Speech bubbles fade after a few seconds.
  useEffect(() => {
    if (!guruLine) return
    const t = setTimeout(hush, 5200)
    return () => clearTimeout(t)
  }, [guruLine, hush])

  const handleClick = () => {
    clicks.current += 1
    if (clicks.current % GURU_SPIN_CLICKS === 0) {
      say(GURU.spin[spins.current % GURU.spin.length])
      spins.current += 1
      spin.start({ rotate: [0, 360], scale: [1, 1.25, 1], transition: { duration: 0.9, ease: 'easeInOut' } })
    } else {
      spin.start({ scale: [1, 0.92, 1.05, 1], transition: { duration: 0.3 } })
    }
  }

  return (
    <AnimatePresence>
      {currentStop >= 1 && (
        <motion.div
          initial={{ y: 140, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 140, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 18 }}
          className="pointer-events-none fixed bottom-1 left-1 z-40 md:bottom-3 md:left-4"
        >
          <AnimatePresence mode="wait">
            {guruLine?.text && (
              <motion.div
                key={guruLine.key}
                role="status"
                initial={{ opacity: 0, scale: 0.6, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                className="font-display absolute bottom-full left-6 mb-1 w-max max-w-[min(70vw,300px)] origin-bottom-left rounded-2xl rounded-bl-sm bg-white px-4 py-2.5 text-base leading-snug font-semibold text-deep shadow-lg md:left-14 md:text-lg"
              >
                {guruLine.text}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={handleClick}
            animate={spin}
            whileHover={{ y: -4 }}
            aria-label={`${GURU.name}. Poke him!`}
            className="pointer-events-auto block border-0 bg-transparent p-0"
          >
            <div className="bob" style={{ animationDuration: '4s' }}>
              <GuruArt mood={mood} className="w-32 drop-shadow-lg md:w-48" />
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
