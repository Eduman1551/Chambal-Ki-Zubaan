import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { FACTS } from '../../content/facts'
import { GURU, STOP2, STOPS, type FloatingItem, type ItemKind } from '../../content/story'
import { POINTS_PER_ITEM } from '../../logic/config'
import { sfx } from '../../sound/sfx'
import { useRiverStore } from '../../state/useRiverStore'
import FactNote from '../FactNote'
import Scene, { NextButton, StoryCard } from '../Scene'
import { BarrageScenery } from '../river/Scenery'
import { Birds, Clouds } from '../river/Sky'

/** Hand-drawn SVG for each kind of floating item. */
function ItemArt({ kind }: { kind: ItemKind }) {
  if (kind === 'bottle') {
    return (
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
        <g transform="rotate(-28 32 32)">
          <rect x="26" y="4" width="12" height="8" rx="2" fill="#E2447B" />
          <path d="M24 14 h16 q6 6 6 14 v26 q0 6 -6 6 h-16 q-6 0 -6 -6 v-26 q0 -8 6 -14 Z" fill="#BFE9F5" stroke="#6FB7CC" strokeWidth="2.5" />
          <rect x="18" y="30" width="28" height="14" fill="#fff" opacity="0.85" />
          <path d="M24 22 v30" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        </g>
      </svg>
    )
  }
  if (kind === 'coconut') {
    return (
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
        <circle cx="32" cy="36" r="23" fill="#8A5A2B" />
        <path d="M14 30 Q32 14 50 30" stroke="#6B4320" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M12 40 Q32 26 52 40" stroke="#A8743C" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />
        <circle cx="26" cy="24" r="3" fill="#4A2D12" />
        <circle cx="38" cy="24" r="3" fill="#4A2D12" />
        <circle cx="32" cy="32" r="3" fill="#4A2D12" />
        <path d="M28 14 l4 -9 l4 9" stroke="#A8743C" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    )
  }
  // flower offering tied up in a plastic bag
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <path d="M26 12 q6 -8 12 0 l-2 6 h-8 Z" fill="#fff" stroke="#B9C6CC" strokeWidth="2" />
      <path d="M22 18 h20 q14 14 10 30 q-4 12 -20 12 q-16 0 -20 -12 q-4 -16 10 -30 Z" fill="#fff" fillOpacity="0.8" stroke="#B9C6CC" strokeWidth="2.5" />
      <circle cx="26" cy="40" r="7" fill="#F28C38" />
      <circle cx="38" cy="38" r="7" fill="#F5C542" />
      <circle cx="32" cy="48" r="7" fill="#E2447B" />
      <circle cx="26" cy="40" r="2.5" fill="#C96A1C" />
      <circle cx="38" cy="38" r="2.5" fill="#D9A21B" />
      <circle cx="32" cy="48" r="2.5" fill="#B82A5C" />
    </svg>
  )
}

function Basket({ count, total }: { count: number; total: number }) {
  return (
    <div className="relative">
      <motion.svg
        key={count}
        viewBox="0 0 120 100"
        className="w-24 drop-shadow-lg md:w-36"
        initial={{ scale: count ? 1.25 : 1, rotate: count ? -6 : 0 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        aria-hidden
      >
        <path d="M22 40 Q60 -14 98 40" stroke="#8A5A2B" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M10 38 h100 l-12 52 q-2 8 -10 8 h-56 q-8 0 -10 -8 Z" fill="#D9A45B" />
        {[50, 64, 78].map((y) => (
          <path key={y} d={`M14 ${y} h92`} stroke="#B07A35" strokeWidth="4" strokeLinecap="round" />
        ))}
        {[30, 48, 66, 84].map((x) => (
          <path key={x} d={`M${x} 40 l${x < 60 ? 4 : -4} 56`} stroke="#B07A35" strokeWidth="3" />
        ))}
        <rect x="6" y="32" width="108" height="12" rx="6" fill="#8A5A2B" />
      </motion.svg>
      <span className="font-display absolute -top-2 -right-2 grid h-10 min-w-10 place-items-center rounded-full bg-sunset px-2 text-lg font-extrabold text-white shadow-md md:h-12 md:min-w-12 md:text-xl">
        {count}/{total}
      </span>
    </div>
  )
}

interface FloatingProps {
  item: FloatingItem
  index: number
  collected: boolean
  onCollect: (item: FloatingItem, el: HTMLElement) => { x: number; y: number }
}

function Floating({ item, index, collected, onCollect }: FloatingProps) {
  const [fly, setFly] = useState<{ x: number; y: number } | null>(null)
  const gone = collected || fly !== null

  // "Play again" un-collects everything: put the item back in the water.
  useEffect(() => {
    if (!collected) setFly(null)
  }, [collected])

  return (
    <motion.button
      type="button"
      aria-label={`Collect: ${item.label}`}
      disabled={gone}
      tabIndex={gone ? -1 : 0}
      onClick={(e) => setFly(onCollect(item, e.currentTarget))}
      className="absolute h-14 w-14 border-0 bg-transparent p-0 md:h-20 md:w-20"
      style={{ left: `${item.x}%`, top: `${item.y}%`, pointerEvents: gone ? 'none' : 'auto' }}
      initial={false}
      animate={
        gone
          ? { x: fly?.x ?? 0, y: fly?.y ?? -40, scale: 0.2, rotate: 200, opacity: 0 }
          : { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }
      }
      transition={gone ? { duration: 0.65, ease: [0.5, -0.3, 0.6, 1] } : { duration: 0.3 }}
      whileHover={{ scale: 1.18 }}
      whileTap={{ scale: 0.88 }}
    >
      <span className="bob block h-full w-full drop-shadow-md" style={{ animationDelay: `-${index * 0.55}s` }}>
        <ItemArt kind={item.kind} />
      </span>
      {/* ripple under the item */}
      <svg viewBox="0 0 80 20" className="pointer-events-none absolute -bottom-2 left-1/2 w-[130%] -translate-x-1/2" aria-hidden>
        <ellipse className="ripple" cx="40" cy="10" rx="30" ry="6" fill="none" stroke="#fff" strokeWidth="2" opacity="0.6" />
      </svg>
    </motion.button>
  )
}

/** Stop 2: tap the floating items to collect them into the basket. */
export default function Stop2Barrage() {
  const collected = useRiverStore((s) => s.collected)
  const collect = useRiverStore((s) => s.collect)
  const say = useRiverStore((s) => s.say)
  const basketRef = useRef<HTMLDivElement>(null)
  const total = STOP2.items.length
  const allDone = collected.length === total

  // Collect right away (so a tap is never lost) and tell the item where to fly.
  const handleCollect = (item: FloatingItem, el: HTMLElement) => {
    const from = el.getBoundingClientRect()
    const to = basketRef.current?.getBoundingClientRect()
    collect(item.id)
    sfx.pop()
    say(collected.length + 1 === total ? GURU.allCollected : item.line)
    if (!to) return { x: 0, y: -60 }
    return {
      x: to.left + to.width / 2 - (from.left + from.width / 2),
      y: to.top + to.height / 2 - (from.top + from.height / 2),
    }
  }

  return (
    <Scene
      id={STOPS[1].id}
      stop={2}
      label={STOPS[1].name}
      sky="linear-gradient(#8FD0E3 0%, #CDEBE6 55%, #FFEFC9 100%)"
      scenery={
        <>
          <Clouds />
          <Birds />
          <BarrageScenery />
        </>
      }
      waterClass="h-[38svh] min-h-[260px]"
      water={
        <div className="absolute inset-y-0 right-0 left-[26%] md:left-[20%]">
          <div className="absolute inset-y-0 left-0 w-[76%]">
            {STOP2.items.map((item, i) => (
              <Floating
                key={item.id}
                item={item}
                index={i}
                collected={collected.includes(item.id)}
                onCollect={handleCollect}
              />
            ))}
          </div>
          <div ref={basketRef} className="absolute right-[3%] bottom-[14%] md:right-[5%]">
            <Basket count={collected.length} total={total} />
          </div>
        </div>
      }
    >
      <StoryCard kicker={STOP2.kicker} title={STOP2.title}>
        <p className="mb-3 text-lg">{STOP2.body}</p>
        <p
          aria-live="polite"
          className={`font-display rounded-xl px-3 py-2 text-lg font-semibold ${
            allDone ? 'bg-leaf/20 text-leaf' : 'bg-sunset/15 text-[#B85E12]'
          }`}
        >
          {allDone
            ? STOP2.done
            : `👆 ${STOP2.hint} (+${POINTS_PER_ITEM} each) · ${collected.length}/${total}`}
        </p>
        {allDone && <FactNote fact={FACTS.plastic} className="mt-3" />}
        <NextButton to={STOPS[2].id}>{STOP2.cta}</NextButton>
      </StoryCard>
    </Scene>
  )
}
