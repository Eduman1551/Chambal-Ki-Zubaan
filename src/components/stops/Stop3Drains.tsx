import { useEffect, useRef } from 'react'
import { FACTS } from '../../content/facts'
import { GURU, STOP3, STOPS } from '../../content/story'
import { mixColors } from '../../logic/waterColor'
import { sfx } from '../../sound/sfx'
import { useRiverStore } from '../../state/useRiverStore'
import FactNote from '../FactNote'
import Scene, { NextButton, StoryCard } from '../Scene'
import { CityScenery } from '../river/Scenery'
import { Clouds } from '../river/Sky'

const DIRTY = '#5A4A22'
const CLEAN = '#8FD8E8'

/** The drain pipe with its pouring stream. `t` is 0 (untreated) to 1 (treated). */
function DrainPipe({ t }: { t: number }) {
  const flow = mixColors(DIRTY, CLEAN, t)
  return (
    <svg viewBox="0 0 300 210" className="pointer-events-none absolute -top-24 left-[30%] w-56 md:-top-32 md:left-[54%] md:w-80" aria-hidden>
      {/* stream */}
      <path d="M176 66 Q226 70 232 200" stroke={flow} strokeWidth="30" fill="none" strokeLinecap="round" style={{ transition: 'stroke 0.3s' }} />
      <path className="pour" d="M176 62 Q222 68 228 200" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity={0.25 + t * 0.4} />
      {/* wall + pipe */}
      <rect x="0" y="14" width="96" height="84" rx="10" fill="#B9AE98" />
      <rect x="0" y="14" width="96" height="14" rx="7" fill="#9E927B" />
      <rect x="60" y="40" width="112" height="46" rx="8" fill="#7C8A8F" />
      <rect x="60" y="46" width="112" height="8" rx="4" fill="#A5B1B5" />
      <rect x="160" y="33" width="20" height="60" rx="7" fill="#5E6B70" />
      <ellipse cx="180" cy="63" rx="6" ry="23" fill="#2B2B2B" />
      {/* splash */}
      <ellipse className="ripple" cx="232" cy="198" rx="40" ry="8" fill="none" stroke="#fff" strokeWidth="3" opacity="0.7" />
    </svg>
  )
}

function Fish({ className, color = '#F28C38' }: { className: string; color?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={`bob absolute ${className}`} aria-hidden>
      <path d="M4 15 Q22 -2 42 15 Q22 32 4 15 Z" fill={color} />
      <path d="M40 15 L56 4 L52 15 L56 26 Z" fill={color} />
      <circle cx="14" cy="12" r="2.5" fill="#2B2B2B" />
    </svg>
  )
}

/** Valve wheel that turns with the slider. */
function ValveWheel({ value }: { value: number }) {
  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16 shrink-0 md:h-20 md:w-20" aria-hidden>
      <g style={{ transform: `rotate(${value * 5.4}deg)`, transformOrigin: '40px 40px', transition: 'transform 0.15s linear' }}>
        <circle cx="40" cy="40" r="32" fill="none" stroke="#F28C38" strokeWidth="9" />
        {[0, 60, 120].map((a) => (
          <rect key={a} x="36" y="8" width="8" height="64" rx="4" fill="#F28C38" transform={`rotate(${a} 40 40)`} />
        ))}
        <circle cx="40" cy="40" r="10" fill="#C96A1C" />
        <circle cx="40" cy="12" r="5" fill="#fff" />
      </g>
    </svg>
  )
}

/** Stop 3: slide the treatment valve and watch the water clear up. */
export default function Stop3Drains() {
  const treatment = useRiverStore((s) => s.treatment)
  const setTreatment = useRiverStore((s) => s.setTreatment)
  const say = useRiverStore((s) => s.say)
  const t = treatment / 100
  const level = treatment >= 100 ? 3 : treatment >= 60 ? 2 : treatment >= 20 ? 1 : 0

  // Ghariyal Guru celebrates when the valve is fully open.
  const wasFull = useRef(false)
  useEffect(() => {
    const full = treatment >= 100
    if (full && !wasFull.current) {
      say(GURU.valveOpen)
      sfx.chime()
    }
    wasFull.current = full
  }, [treatment, say])

  return (
    <Scene
      id={STOPS[2].id}
      stop={3}
      label={STOPS[2].name}
      sky="linear-gradient(#A8CBD6 0%, #D5E3D6 55%, #F6EACB 100%)"
      scenery={
        <>
          <Clouds dim />
          <CityScenery />
          {/* haze that lifts as the water is treated */}
          <div className="absolute inset-0 bg-[#8A7F5A]" style={{ opacity: (1 - t) * 0.28, transition: 'opacity 0.3s' }} />
        </>
      }
      waterClass="h-[36svh] min-h-[250px]"
      water={
        <>
          {/* murky plume spreading from the drain */}
          <div
            className="pointer-events-none absolute top-[2%] left-[24%] h-[95%] w-[74%] md:left-[48%] md:w-[50%]"
            style={{
              background: 'radial-gradient(closest-side, rgba(74,58,24,0.92), rgba(74,58,24,0.55) 55%, transparent)',
              opacity: 1 - t,
              transform: `scale(${0.55 + (1 - t) * 0.5})`,
              transition: 'opacity 0.3s, transform 0.3s',
            }}
          />
          {[
            [62, 34, 10], [72, 58, 7], [81, 30, 8], [67, 76, 6], [88, 62, 9], [56, 62, 6],
          ].map(([x, y, r], i) => (
            <span
              key={i}
              className="bob pointer-events-none absolute rounded-full bg-[#3B2E12]"
              style={{ left: `${x}%`, top: `${y}%`, width: r * 2, height: r * 2, opacity: (1 - t) * 0.8, animationDelay: `-${i * 0.5}s`, transition: 'opacity 0.3s' }}
            />
          ))}
          {/* life comes back as the water clears */}
          <div className="pointer-events-none absolute inset-0" style={{ opacity: Math.max(0, (t - 0.55) / 0.45), transition: 'opacity 0.4s' }}>
            <Fish className="top-[38%] left-[44%] w-12 md:w-16" />
            <Fish className="top-[66%] left-[62%] w-10 md:w-14" color="#F5C542" />
            <Fish className="top-[46%] left-[88%] w-9 md:w-12" color="#E9F6F8" />
          </div>
          <DrainPipe t={t} />
        </>
      }
    >
      <div className="flex w-full flex-col items-start gap-5 lg:flex-row lg:items-start">
      <StoryCard kicker={STOP3.kicker} title={STOP3.title}>
        <p className="mb-3 text-lg">{STOP3.body}</p>

        <div className="rounded-2xl bg-white/80 p-3 shadow-inner md:p-4">
          <div className="flex items-center gap-3">
            <ValveWheel value={treatment} />
            <div className="min-w-0 flex-1">
              <label htmlFor="treatment" className="font-display flex items-baseline justify-between text-lg font-extrabold text-deep">
                {STOP3.sliderLabel}
                <span className="flex items-center gap-1.5 text-sunset tabular-nums">
                  {/* a drop of the outflow, so the colour change is visible right next to the slider */}
                  <svg viewBox="0 0 24 30" className="h-6 w-5" aria-hidden>
                    <path d="M12 2 Q22 16 22 20 a10 10 0 0 1 -20 0 Q2 16 12 2 Z" fill={mixColors(DIRTY, CLEAN, t)} stroke="#14506B" strokeWidth="1.5" />
                  </svg>
                  {treatment}%
                </span>
              </label>
              <input
                id="treatment"
                type="range"
                min={0}
                max={100}
                step={1}
                value={treatment}
                onChange={(e) => setTreatment(Number(e.target.value))}
                className="valve-slider mt-2"
                aria-valuetext={`${treatment} percent treated`}
              />
              <div className="mt-1 flex justify-between text-sm font-bold text-ink/70">
                <span>{STOP3.sliderLow}</span>
                <span>{STOP3.sliderHigh}</span>
              </div>
            </div>
          </div>
          <p aria-live="polite" className="font-display mt-2 text-center text-lg font-semibold text-river">
            {treatment === 0 ? `👉 ${STOP3.hint}` : `“${STOP3.levels[level]}”`}
          </p>
        </div>

        <NextButton to={STOPS[3].id}>{STOP3.cta}</NextButton>
      </StoryCard>
      <div className="card reveal w-full max-w-md p-3">
        <FactNote fact={FACTS.sewage} />
      </div>
      </div>
    </Scene>
  )
}
