import { MotionConfig } from 'framer-motion'
import { useEffect, useRef } from 'react'
import Journey from './components/Journey'
import { scrollToId } from './components/Scene'
import TitleScreen from './components/TitleScreen'
import Hud from './components/hud/Hud'
import { useScrollJourney } from './hooks/useScrollJourney'
import { getWaterColors } from './logic/waterColor'
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
    document.body.style.overflow = ''
    scrollToId('stop-1')
  }

  return (
    <MotionConfig reducedMotion="user">
      <Hud />
      <main ref={rootRef}>
        <TitleScreen onStart={handleStart} />
        <Journey />
      </main>
    </MotionConfig>
  )
}
