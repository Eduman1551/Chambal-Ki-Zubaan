import { STOP1, STOPS } from '../../content/story'
import { getMood } from '../../logic/mood'
import { useHealth } from '../../state/useRiverStore'
import Scene, { NextButton, StoryCard } from '../Scene'
import { GuruArt } from '../mascot/GhariyalGuru'
import { HillsScenery, Reeds } from '../river/Scenery'
import { Birds, Clouds, Sun } from '../river/Sky'

function LilyPad({ className, flower = false }: { className: string; flower?: boolean }) {
  return (
    <svg viewBox="0 0 80 50" className={`bob pointer-events-none absolute ${className}`} aria-hidden>
      <path d="M40 44 C12 44 4 34 4 26 C4 16 18 8 40 8 C62 8 76 16 76 26 C76 30 72 34 66 37 L42 26 L52 43 C48 44 44 44 40 44 Z" fill="#5FA55A" />
      <path d="M40 40 C20 40 12 32 12 26" stroke="#3F7F4A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {flower && (
        <g transform="translate(30 14)">
          <path d="M0 0 Q-10 -14 0 -22 Q10 -14 0 0 Z" fill="#F7A8C4" />
          <path d="M0 0 Q-18 -6 -16 -18 Q-4 -14 0 0 Z" fill="#E2447B" opacity="0.85" />
          <path d="M0 0 Q18 -6 16 -18 Q4 -14 0 0 Z" fill="#E2447B" opacity="0.85" />
          <circle cx="0" cy="-6" r="3.5" fill="#F5C542" />
        </g>
      )}
    </svg>
  )
}

/** Stop 1: the river introduces itself and Ghariyal Guru. */
export default function Stop1Source() {
  const mood = getMood(useHealth())
  return (
    <Scene
      id={STOPS[0].id}
      stop={1}
      label={STOPS[0].name}
      sky="linear-gradient(#A9DDEA 0%, #D9F0E8 55%, #FFF1CF 100%)"
      scenery={
        <>
          <Sun className="top-[12%] right-[10%] w-28 md:w-40" color="#F5C542" />
          <Clouds />
          <Birds />
          <HillsScenery />
        </>
      }
      water={
        <>
          <Reeds className="-top-20 right-[3%] w-24 md:w-32" flip />
          <LilyPad className="top-[22%] left-[38%] w-16 md:w-24" flower />
          <LilyPad className="top-[48%] left-[62%] w-14 md:w-20" />
          <LilyPad className="top-[30%] left-[80%] w-12 md:w-16" flower />
        </>
      }
    >
      <div className="flex w-full flex-col items-start gap-5 lg:flex-row lg:items-end">
        <StoryCard kicker={STOP1.kicker} title={STOP1.title}>
          {STOP1.body.map((p) => (
            <p key={p} className="mb-3 text-lg">
              {p}
            </p>
          ))}
          <NextButton to={STOPS[1].id}>{STOP1.cta}</NextButton>
        </StoryCard>

        <div className="card reveal flex w-full max-w-md items-center gap-3 p-4 md:p-5">
          <GuruArt mood={mood} className="w-28 shrink-0 md:w-36" />
          <p className="text-base md:text-lg">{STOP1.guruIntro}</p>
        </div>
      </div>
    </Scene>
  )
}
