import { MotionConfig } from 'framer-motion'
import { useEffect, useRef } from 'react'
import Journey from './components/Journey'
import { scrollToId } from './hooks/scrollTo'
import TitleScreen from './components/TitleScreen'
import Ending from './components/ending/Ending'
import Hud from './components/hud/Hud'
import GhariyalGuru from './components/mascot/GhariyalGuru'
import { useScrollJourney } from './hooks/useScrollJourney'
import { getWaterColors } from './logic/waterColor'
import { sfx } from './sound/sfx'
import { useHealth, useRiverStore } from './state/useRiverStore'

export default function App() {
  const phase = useRiverStore((s) => s.phase)
  const start = useRiverStore((s) => s.start)
  const health = useHealth()
  const rootRef = useRef<HTMLElement>(null)

  useScrollJourney(rootRef)

  // River Health -> live water colours (CSS variables used by every wave).
  useEffect(() => {
    const { water, light, deep } = getWaterColors(health)
    const root = document.documentElement.style
    root.setProperty('--water', water)
    root.setProperty('--water-light', light)
    root.setProperty('--water-deep', deep)
  }, [health])

  // The page cannot be scrolled by hand until the player presses Start.
  useEffect(() => {
    document.body.style.overflow = phase === 'title' ? 'hidden' : ''
  }, [phase])

  const handleStart = () => {
    start()
    sfx.splash()
    document.body.style.overflow = ''
    scrollToId('stop-1')
  }

  return (
    <MotionConfig reducedMotion="user">
      <Hud />
      <GhariyalGuru />
      <main ref={rootRef}>
        <TitleScreen onStart={handleStart} />
        {/* until Start is pressed the journey cannot be reached by keyboard either */}
        <div inert={phase === 'title'}>
          <Journey />
          <Ending />
        </div>
      </main>
    </MotionConfig>
  )
}
