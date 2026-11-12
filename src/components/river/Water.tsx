import type { ReactNode } from 'react'

// One period of the wave is 600 units; the strip is 4 periods wide and slides
// left by exactly 2 periods (-50%), so the loop is seamless.
const WAVE_PATH =
  'M0 30 Q150 0 300 30 T600 30 T900 30 T1200 30 T1500 30 T1800 30 T2100 30 T2400 30 V64 H0 Z'

interface WaveProps {
  fillClass: string
  seconds: number
  top: number
  height: number
  opacity?: number
  reverse?: boolean
}

function Wave({ fillClass, seconds, top, height, opacity = 1, reverse }: WaveProps) {
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
        <path d={WAVE_PATH} className={fillClass} />
      </svg>
    </div>
  )
}

interface WaterProps {
  className?: string
  children?: ReactNode
}

/**
 * The river band at the bottom of every scene: three layered SVG waves on top of
 * a body of water. All colours come from the live --water CSS variables.
 */
export default function Water({ className = '', children }: WaterProps) {
  return (
    <div className={`relative ${className}`}>
      {/* wave crests poke up above the water body */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-16 overflow-hidden" aria-hidden>
        <Wave fillClass="water-fill-light" seconds={16} top={0} height={64} opacity={0.6} reverse />
        <Wave fillClass="water-fill" seconds={11} top={12} height={56} />
      </div>
      <div className="water-bg absolute inset-0 top-5 transition-[background] duration-700" />
      <div className="pointer-events-none absolute inset-x-0 top-10 h-12 overflow-hidden opacity-40" aria-hidden>
        <Wave fillClass="water-fill-light" seconds={22} top={0} height={48} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[45%] h-10 overflow-hidden opacity-25" aria-hidden>
        <Wave fillClass="water-fill-light" seconds={28} top={0} height={40} reverse />
      </div>
      <div className="absolute inset-0">{children}</div>
    </div>
  )
}
