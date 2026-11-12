import { useInView, useReducedMotion } from 'framer-motion'
import { Component, lazy, Suspense, useRef, type ReactNode } from 'react'
import { FACTS } from '../../content/facts'
import { STOP5, STOPS } from '../../content/story'
import { getMood } from '../../logic/mood'
import { getResultTier } from '../../logic/results'
import { useHealth } from '../../state/useRiverStore'
import FactNote from '../FactNote'
import Scene, { NextButton, StoryCard } from '../Scene'
import { GuruArt } from '../mascot/GhariyalGuru'
import { Reeds, SanctuaryScenery } from '../river/Scenery'
import { Birds, Clouds } from '../river/Sky'

// The 3D scene (and three.js) is a separate chunk, loaded only when needed.
const SanctuaryScene = lazy(() => import('../three/SanctuaryScene'))

/** 2D stand-in shown while 3D loads, or if WebGL is not available. */
function Fallback({ health, text }: { health: number; text: string }) {
  return (
    <div className="water-bg absolute inset-0 grid place-items-center">
      <div className="text-center">
        <GuruArt mood={getMood(health)} className="bob mx-auto w-40" />
        <p className="font-display mt-1 px-4 text-lg font-semibold text-white">{text}</p>
      </div>
    </div>
  )
}

/** If WebGL fails on an old laptop, keep the story going with the 2D stand-in. */
class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

const SKY_BY_TIER = {
  best: 'linear-gradient(#8FD8EE, #DDF5E4)',
  okay: 'linear-gradient(#A9CFD6, #E6EBD2)',
  help: 'linear-gradient(#B4B6A6, #D9D0B4)',
}

function Turtle({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 90 60" className={`pointer-events-none absolute ${className}`} aria-hidden>
      <ellipse cx="45" cy="50" rx="42" ry="9" fill="#9A9488" />
      <circle cx="70" cy="34" r="8" fill="#8DB36A" />
      <circle cx="73" cy="32" r="1.6" fill="#2B2B2B" />
      <path d="M18 42 Q42 2 66 42 Z" fill="#4E7A3A" />
      <path d="M30 40 L42 20 L54 40 M42 20 V40" stroke="#3B5E2C" strokeWidth="2.5" fill="none" />
    </svg>
  )
}

/** Stop 5: the protected stretch. A small 3D scene shows the final river health. */
export default function Stop5Sanctuary() {
  const health = useHealth()
  const tier = getResultTier(health)
  const frame = useRef<HTMLDivElement>(null)
  // mount the 3D scene a little before it scrolls in; render only while visible
  const near = useInView(frame, { margin: '500px 0px', once: true })
  const visible = useInView(frame)
  const reduced = useReducedMotion() ?? false

  return (
    <Scene
      id={STOPS[4].id}
      stop={5}
      label={STOPS[4].name}
      sky="linear-gradient(#7CCBE2 0%, #C9EDE4 55%, #F3F6D8 100%)"
      scenery={
        <>
          <Clouds />
          <Birds />
          <SanctuaryScenery />
        </>
      }
      waterClass="h-[26svh] min-h-[180px]"
      water={
        <>
          <Reeds className="-top-20 right-[4%] w-24 md:w-32" flip />
          <Reeds className="-top-16 left-[30%] w-16 md:w-24" />
          {health >= 55 && <Turtle className="top-[18%] right-[22%] w-20 md:w-28" />}
        </>
      }
    >
      <div className="flex w-full flex-col items-center gap-5 lg:flex-row lg:items-center">
        <StoryCard kicker={STOP5.kicker} title={STOP5.title} className="lg:!max-w-md">
          <p className="mb-3 text-lg">{STOP5.body}</p>
          <FactNote fact={FACTS.sanctuary} />
          <NextButton to="ending">{STOP5.cta}</NextButton>
        </StoryCard>

        <figure className="reveal m-0 w-full max-w-2xl flex-1">
          <div
            ref={frame}
            className="relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] border-[6px] border-white shadow-2xl transition-[background] duration-700"
            style={{ background: SKY_BY_TIER[tier] }}
            role="img"
            aria-label={`3D view of the sanctuary. ${STOP5.sceneLabels[tier]}`}
          >
            {near && (
              <SceneBoundary fallback={<Fallback health={health} text={STOP5.sceneLabels[tier]} />}>
                <Suspense fallback={<Fallback health={health} text={STOP5.loading} />}>
                  <SanctuaryScene health={health} active={visible} still={reduced} />
                </Suspense>
              </SceneBoundary>
            )}
          </div>
          <figcaption
            aria-live="polite"
            className="font-display mx-auto mt-3 w-fit rounded-full bg-white/90 px-5 py-2 text-center text-lg font-semibold text-deep shadow"
          >
            {STOP5.sceneLabels[tier]}
          </figcaption>
        </figure>
      </div>
    </Scene>
  )
}
