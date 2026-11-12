import { MotionConfig } from 'framer-motion'
import { useEffect } from 'react'
import TitleScreen from './components/TitleScreen'
import { getWaterColors } from './logic/waterColor'
import { useHealth, useRiverStore } from './state/useRiverStore'

export default function App() {
  const phase = useRiverStore((s) => s.phase)
  const start = useRiverStore((s) => s.start)
  const health = useHealth()

  // River Health -> live water colours (CSS variables used by every wave).
  useEffect(() => {
    const { water, light, deep } = getWaterColors(health)
    const root = document.documentElement.style
    root.setProperty('--water', water)
    root.setProperty('--water-light', light)
    root.setProperty('--water-deep', deep)
  }, [health])

  // The page cannot scroll until the player presses Start.
  useEffect(() => {
    document.body.style.overflow = phase === 'title' ? 'hidden' : ''
  }, [phase])

  const handleStart = () => {
    start()
    // Wait one frame so the journey is rendered before scrolling to it.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => document.getElementById('stop-1')?.scrollIntoView({ behavior: 'smooth' })),
    )
  }

  return (
    <MotionConfig reducedMotion="user">
      <TitleScreen onStart={handleStart} />
    </MotionConfig>
  )
}
