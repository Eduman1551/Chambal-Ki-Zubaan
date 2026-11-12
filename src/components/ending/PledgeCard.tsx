import type { Ref } from 'react'
import { ENDING, PLEDGES, TITLE } from '../../content/story'
import { DORIA_COLORS, PLEDGE_PICK_COUNT } from '../../logic/config'
import { getMood } from '../../logic/mood'
import { getResult } from '../../logic/results'
import { getWaterColors } from '../../logic/waterColor'
import { GuruArt } from '../mascot/GhariyalGuru'

interface Props {
  ref?: Ref<HTMLDivElement>
  name: string
  picked: string[]
  health: number
}

/**
 * The River Pledge card. Every size is in "cqw" (percent of the card's width),
 * so the card looks identical at any size and exports as a crisp PNG.
 */
export default function PledgeCard({ ref, name, picked, health }: Props) {
  const result = getResult(health)
  // plain colour values (not CSS variables) so the exported PNG keeps them
  const water = getWaterColors(health)
  const pledges = picked.map((id) => PLEDGES.find((p) => p.id === id)?.text ?? '')
  const slots = Array.from({ length: PLEDGE_PICK_COUNT }, (_, i) => pledges[i] ?? null)
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="@container w-full max-w-[460px]">
      <div
        ref={ref}
        className="relative flex aspect-[4/5] w-full flex-col overflow-hidden bg-cream text-ink"
        style={{ borderRadius: '5cqw' }}
      >
        {/* Kota Doria stripe */}
        <div className="flex shrink-0" style={{ height: '3.2cqw' }}>
          {DORIA_COLORS.map((c) => (
            <span key={c} className="flex-1" style={{ background: c }} />
          ))}
        </div>

        <div className="relative z-10 flex flex-1 flex-col" style={{ padding: '5cqw 6.5cqw 0' }}>
          <p className="font-bold tracking-[0.18em] text-river uppercase" style={{ fontSize: '2.9cqw' }}>
            {TITLE.name}
          </p>
          <p className="font-display font-extrabold text-deep" style={{ fontSize: '10.5cqw', lineHeight: 1 }}>
            {ENDING.cardHeading}
          </p>

          <p
            className="font-display font-extrabold break-words text-sunset"
            style={{ fontSize: name.length > 16 ? '6.2cqw' : '7.6cqw', lineHeight: 1.05, marginTop: '3.4cqw' }}
          >
            {name}
          </p>
          <p className="font-bold text-ink/75" style={{ fontSize: '3.6cqw' }}>
            {ENDING.cardPromise}
          </p>

          <ul className="m-0 flex list-none flex-col p-0" style={{ gap: '2cqw', marginTop: '3cqw' }}>
            {slots.map((text, i) => (
              <li
                key={i}
                className={`flex items-center bg-white font-bold ${text ? 'text-deep' : 'text-ink/40'}`}
                style={{
                  gap: '2.4cqw',
                  padding: '2.7cqw 3cqw',
                  borderRadius: '3cqw',
                  fontSize: '4.1cqw',
                  lineHeight: 1.2,
                  border: text ? '0.5cqw solid #5FA55A' : '0.5cqw dashed #B9C6CC',
                }}
              >
                <svg viewBox="0 0 24 24" style={{ width: '5.6cqw', height: '5.6cqw', flexShrink: 0 }} aria-hidden>
                  <circle cx="12" cy="12" r="11" fill={text ? '#5FA55A' : '#DCE5E8'} />
                  {text && <path d="M6.5 12.5 l3.6 3.6 l7.4 -8" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
                </svg>
                {text ?? `Pledge ${i + 1}`}
              </li>
            ))}
          </ul>
        </div>

        {/* river at the bottom, in the colour of the player's own river */}
        <div className="relative shrink-0" style={{ height: '27cqw' }}>
          <svg viewBox="0 0 400 108" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            <path d="M0 34 Q50 14 100 34 T200 34 T300 34 T400 34 V108 H0 Z" fill={water.light} opacity="0.6" />
            <path d="M0 46 Q50 28 100 46 T200 46 T300 46 T400 46 V108 H0 Z" fill={water.water} />
            <path d="M0 78 Q50 66 100 78 T200 78 T300 78 T400 78 V108 H0 Z" fill={water.deep} opacity="0.7" />
          </svg>
          <div className="absolute" style={{ left: '3cqw', bottom: '3.5cqw', width: '36cqw' }}>
            <GuruArt mood={getMood(health)} className="block w-full" puddle={false} />
          </div>
          <div className="absolute text-right text-white" style={{ right: '5cqw', bottom: '6.4cqw' }}>
            <p className="font-display font-extrabold" style={{ fontSize: '5cqw', lineHeight: 1.05 }}>
              {result.title}
            </p>
            <p className="font-bold opacity-90" style={{ fontSize: '3cqw' }}>
              River Health {health}/100
            </p>
          </div>
          <p className="absolute inset-x-0 text-center font-bold text-white/85" style={{ bottom: '1.6cqw', fontSize: '2.3cqw' }}>
            {TITLE.tagline} · {today} · {TITLE.note}
          </p>
        </div>
      </div>
    </div>
  )
}
