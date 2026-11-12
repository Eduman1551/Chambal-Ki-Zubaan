import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { GURU } from '../../content/story'
import { FISH_HOLD_MS, FISH_SHOW_MS } from '../../logic/config'
import { sfx } from '../../sound/sfx'
import { useRiverStore } from '../../state/useRiverStore'

// One period of the wave is 600 units; the strip is 4 periods wide and slides
// left by exactly 2 periods (-50%), so the loop is seamless.
const WAVE_PATH =
  'M0 30 Q150 0 300 30 T600 30 T900 30 T1200 30 T1500 30 T1800 30 T2100 30 T2400 30 V64 H0 Z'

const WAVE_LINE = 'M0 30 Q150 8 300 30 T600 30 T900 30 T1200 30 T1500 30 T1800 30 T2100 30 T2400 30'

interface WaveProps {
  /** Draw only the crest line (used for soft ripples inside the water). */
  line?: boolean
  fillClass?: string
  seconds: number
  top: number
  height: number
  opacity?: number
  reverse?: boolean
}

function Wave({ line, fillClass, seconds, top, height, opacity = 1, reverse }: WaveProps) {
  return (
    <div
      className="wave absolute left-0 w-[200%]"
      style={{
        top,
        height,
        opacity,
        animationDuration: `${seconds}s`,
        animationDirection: reverse ? 'reverse' : 'normal',
      }}
    >
      <svg viewBox="0 0 2400 64" preserveAspectRatio="none" className="block h-full w-full">
        {line ? (
          <path
            d={WAVE_LINE}
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            className="water-stroke"
            vectorEffect="non-scaling-stroke"
          />
        ) : (
          <path d={WAVE_PATH} className={fillClass} />
        )}
      </svg>
    </div>
  )
}

const FISH_COLORS = ['#F28C38', '#F5C542', '#E9F6F8', '#F28C38', '#E2447B', '#F5C542', '#E9F6F8']

/** Easter egg: a school of fish swims across the water once. */
function FishSchool() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="swim absolute top-[30%] left-0 flex w-64 flex-wrap items-center gap-x-5 gap-y-2 md:w-80">
        {FISH_COLORS.map((color, i) => (
          <svg
            key={i}
            viewBox="0 0 60 30"
            className="bob w-10 md:w-14"
            style={{ animationDelay: `-${i * 0.4}s`, animationDuration: '1.2s', marginLeft: i % 2 ? 18 : 0 }}
          >
            <path d="M56 15 Q38 -2 18 15 Q38 32 56 15 Z" fill={color} />
            <path d="M20 15 L4 4 L8 15 L4 26 Z" fill={color} />
            <circle cx="46" cy="12" r="2.5" fill="#2B2B2B" />
          </svg>
        ))}
      </div>
    </div>
  )
}

interface WaterProps {
  className?: string
  children?: ReactNode
}

/**
 * The river band at the bottom of every scene: layered SVG waves on top of
 * a body of water. All colours come from the live --water CSS variables.
 *
 * Easter egg: press and hold on the water for 3 seconds to call a school of fish.
 */
export default function Water({ className = '', children }: WaterProps) {
  const [hold, setHold] = useState<{ x: number; y: number } | null>(null)
  const [fishRun, setFishRun] = useState(0)
  const [fishVisible, setFishVisible] = useState(false)
  const holdTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(
    () => () => {
      clearTimeout(holdTimer.current)
      clearTimeout(hideTimer.current)
    },
    [],
  )

  const cancelHold = () => {
    clearTimeout(holdTimer.current)
    setHold(null)
  }

  const startHold = (e: PointerEvent<HTMLDivElement>) => {
    // holding a button or slider is not "holding the water"
    if ((e.target as HTMLElement).closest('button, input, a')) return
    const box = e.currentTarget.getBoundingClientRect()
    setHold({ x: e.clientX - box.left, y: e.clientY - box.top })
    clearTimeout(holdTimer.current)
    holdTimer.current = setTimeout(() => {
      setHold(null)
      setFishRun((n) => n + 1)
      setFishVisible(true)
      useRiverStore.getState().showFish()
      useRiverStore.getState().say(GURU.fish)
      sfx.bubbles()
      clearTimeout(hideTimer.current)
      hideTimer.current = setTimeout(() => setFishVisible(false), FISH_SHOW_MS)
    }, FISH_HOLD_MS)
  }

  return (
    <div
      className={`relative select-none ${className}`}
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onPointerCancel={cancelHold}
      onContextMenu={(e) => hold && e.preventDefault()}
    >
      {/* wave crests poke up above the water body */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-16 overflow-hidden" aria-hidden>
        <Wave fillClass="water-fill-light" seconds={16} top={0} height={64} opacity={0.6} reverse />
        <Wave fillClass="water-fill" seconds={11} top={12} height={56} />
      </div>
      <div className="water-bg absolute inset-0 top-5" />
      <div className="pointer-events-none absolute inset-x-0 top-12 h-12 overflow-hidden opacity-50" aria-hidden>
        <Wave line seconds={22} top={0} height={48} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[48%] h-10 overflow-hidden opacity-35" aria-hidden>
        <Wave line seconds={28} top={0} height={40} reverse />
      </div>

      {fishVisible && <FishSchool key={fishRun} />}
      <div className="absolute inset-0">{children}</div>

      {/* ring that fills up while holding */}
      {hold && (
        <svg
          viewBox="0 0 48 48"
          className="pointer-events-none absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2"
          style={{ left: hold.x, top: hold.y }}
          aria-hidden
        >
          <circle cx="24" cy="24" r="20" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="126"
            transform="rotate(-90 24 24)"
            style={{ animation: `hold-fill ${FISH_HOLD_MS}ms linear forwards` }}
          />
        </svg>
      )}
    </div>
  )
}
