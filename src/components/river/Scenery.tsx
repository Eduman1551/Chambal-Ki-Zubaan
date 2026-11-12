// Hand-built SVG scenery for each stop. Every piece sits on the waterline
// (bottom of the sky area). Layers carry data-speed for scroll parallax.

import type { ReactNode } from 'react'

const SAND = '#E9D8B4'
const SAND_DARK = '#D4BC8A'
const STONE = '#C9AE7C'
const LEAF = '#5FA55A'
const LEAF_DARK = '#3F7F4A'
const DEEP = '#14506B'

function Layer({
  children,
  speed,
  className = '',
  viewBox = '0 0 1440 320',
}: {
  children: ReactNode
  speed: number
  className?: string
  viewBox?: string
}) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMax slice"
      className={`absolute bottom-0 left-[-6%] w-[112%] ${className}`}
      data-speed={speed}
      aria-hidden
    >
      {children}
    </svg>
  )
}

function Tree({ x, y, s = 1, dark = false }: { x: number; y: number; s?: number; dark?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-4" y="-30" width="8" height="34" rx="3" fill="#8A6A45" />
      <g className="sway">
        <circle cx="0" cy="-48" r="26" fill={dark ? LEAF_DARK : LEAF} />
        <circle cx="-18" cy="-34" r="16" fill={dark ? LEAF_DARK : LEAF} />
        <circle cx="18" cy="-36" r="18" fill={dark ? LEAF_DARK : LEAF} />
      </g>
    </g>
  )
}

/** Reeds growing out of the water's edge. */
export function Reeds({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 140"
      className={`pointer-events-none absolute ${className}`}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden
    >
      {[
        [20, 135, 14, 30, 0],
        [42, 138, 40, 8, 0.6],
        [60, 136, 66, 26, 1.2],
        [80, 138, 92, 14, 0.3],
        [98, 136, 104, 44, 0.9],
      ].map(([x1, y1, x2, y2, delay], i) => (
        <g key={i} className="sway" style={{ animationDelay: `-${delay}s` }}>
          <path
            d={`M${x1} ${y1} Q${(x1 + x2) / 2 - 6} ${(y1 + y2) / 2} ${x2} ${y2}`}
            stroke={i % 2 ? LEAF_DARK : LEAF}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {i % 2 === 0 && <ellipse cx={x2} cy={y2 + 6} rx="5" ry="13" fill="#8A6A45" />}
        </g>
      ))}
    </svg>
  )
}

/** Chambal ravines and hills: used on the title screen and Stop 1. */
export function HillsScenery() {
  return (
    <>
      <Layer speed={0.25} className="h-[46%] opacity-60">
        <path d="M0 320 V190 Q180 110 360 180 T720 150 T1080 190 T1440 140 V320 Z" fill="#9CC7B5" />
      </Layer>
      <Layer speed={0.5} className="h-[40%]">
        <path
          d="M0 320 V230 L90 200 L150 150 L260 140 L330 190 L470 205 L540 160 L660 150 L740 200 L900 215 L980 170 L1100 160 L1180 205 L1320 190 L1440 220 V320 Z"
          fill={SAND_DARK}
        />
        <path
          d="M0 320 V260 L120 235 L200 200 L300 196 L380 240 L520 250 L600 215 L700 210 L790 250 L940 258 L1030 222 L1130 216 L1220 252 L1440 262 V320 Z"
          fill={SAND}
        />
        <Tree x={250} y={198} s={0.9} />
        <Tree x={650} y={212} s={1.1} dark />
        <Tree x={1080} y={218} s={0.95} />
      </Layer>
      <Layer speed={0.9} className="h-[18%]">
        <path d="M0 320 V250 Q240 205 480 245 T960 240 T1440 250 V320 Z" fill={LEAF} />
        <path d="M0 320 V285 Q360 255 720 285 T1440 280 V320 Z" fill={LEAF_DARK} />
      </Layer>
    </>
  )
}

function Chhatri({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  // A little domed riverfront pavilion.
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-44" y="-8" width="88" height="10" rx="3" fill={STONE} />
      {[-34, -12, 12, 34].map((px) => (
        <rect key={px} x={px - 4} y="-58" width="8" height="52" rx="2" fill={SAND} />
      ))}
      <rect x="-48" y="-66" width="96" height="10" rx="4" fill={STONE} />
      <path d="M-36 -66 Q-36 -108 0 -112 Q36 -108 36 -66 Z" fill="#F28C38" />
      <rect x="-3" y="-128" width="6" height="18" rx="3" fill="#C96A1C" />
      <circle cx="0" cy="-130" r="5" fill="#C96A1C" />
    </g>
  )
}

/** Kota Barrage with its gates plus riverfront chhatris: Stop 2. */
export function BarrageScenery() {
  return (
    <>
      <Layer speed={0.25} className="h-[42%] opacity-50">
        <path d="M0 320 V200 Q240 140 480 190 T960 170 T1440 200 V320 Z" fill="#9CC7B5" />
      </Layer>
      <Layer speed={0.55} className="h-[44%]">
        {/* barrage deck + piers */}
        <rect x="380" y="150" width="760" height="26" rx="6" fill={STONE} />
        <rect x="380" y="140" width="760" height="12" rx="4" fill={SAND} />
        {Array.from({ length: 9 }, (_, i) => {
          const x = 400 + i * 88
          return (
            <g key={i}>
              <rect x={x} y="170" width="26" height="150" fill={SAND_DARK} />
              <rect x={x - 5} y="118" width="36" height="26" rx="5" fill={STONE} />
              {i < 8 && <rect x={x + 26} y="186" width="62" height="134" fill={DEEP} opacity="0.55" />}
              {i < 8 && <rect x={x + 26} y="186" width="62" height="16" fill="#F28C38" opacity="0.85" />}
            </g>
          )
        })}
        {/* banks */}
        <path d="M0 320 V236 Q200 210 392 232 V320 Z" fill={SAND} />
        <path d="M1128 232 Q1280 212 1440 240 V320 H1128 Z" fill={SAND} />
        <Chhatri x={170} y={232} />
        <Chhatri x={1290} y={236} s={0.9} />
        <Tree x={300} y={236} s={0.8} />
        <Tree x={1180} y={236} s={0.75} dark />
      </Layer>
      <Layer speed={0.9} className="h-[14%]">
        <path d="M0 320 V270 Q360 240 720 275 T1440 268 V320 Z" fill={SAND_DARK} />
      </Layer>
    </>
  )
}

/** A soft city silhouette on the bank: Stop 3. */
export function CityScenery() {
  const blocks = [
    [40, 120, 90], [140, 170, 70], [220, 100, 80], [310, 150, 60], [380, 190, 90],
    [480, 130, 70], [560, 90, 100], [670, 160, 70], [750, 120, 90], [850, 180, 60],
    [920, 110, 90], [1020, 150, 80], [1110, 95, 70], [1190, 170, 90], [1290, 130, 110],
  ]
  return (
    <>
      <Layer speed={0.3} className="h-[46%] opacity-45">
        {blocks.map(([x, top, w], i) => (
          <rect key={i} x={x + 30} y={top - 30} width={w} height={320} rx="6" fill="#7FA9B5" />
        ))}
      </Layer>
      <Layer speed={0.55} className="h-[42%]">
        {blocks.map(([x, top, w], i) => (
          <g key={i}>
            <rect x={x} y={top + 30} width={w} height={320} rx="6" fill={i % 3 === 0 ? STONE : SAND_DARK} />
            {Array.from({ length: 3 }, (_, r) =>
              Array.from({ length: Math.floor(w / 28) }, (_, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={x + 10 + c * 26}
                  y={top + 46 + r * 30}
                  width="12"
                  height="14"
                  rx="2"
                  fill="#FFF8EA"
                  opacity="0.75"
                />
              )),
            )}
          </g>
        ))}
        <path d="M0 320 V262 Q360 240 720 262 T1440 258 V320 Z" fill={SAND} />
      </Layer>
      <Layer speed={0.9} className="h-[12%]">
        <path d="M0 320 V280 Q360 256 720 284 T1440 276 V320 Z" fill={SAND_DARK} />
      </Layer>
    </>
  )
}

const BUNTING = ['#F28C38', '#E2447B', '#F5C542', '#1F8A9E', '#5FA55A', '#7B4FA3']

/** Ghats, a temple spire and festive bunting: Stop 4. */
export function FestivalScenery() {
  return (
    <>
      <Layer speed={0.3} className="h-[44%] opacity-50">
        <path d="M0 320 V210 Q240 150 480 200 T960 180 T1440 210 V320 Z" fill="#C9788A" />
      </Layer>
      <Layer speed={0.55} className="h-[46%]">
        {/* temple */}
        <g transform="translate(1120 0)">
          <path d="M-60 250 V170 Q-60 90 0 40 Q60 90 60 170 V250 Z" fill="#B5573F" />
          <path d="M-36 250 V180 Q-36 120 0 86 Q36 120 36 180 V250 Z" fill="#D97B4F" />
          <rect x="-3" y="14" width="6" height="30" fill="#F5C542" />
          <path d="M3 14 L26 22 L3 30 Z" fill="#F28C38" />
          <path d="M-16 250 V214 Q-16 196 0 196 Q16 196 16 214 V250 Z" fill="#5A2A22" />
        </g>
        <Chhatri x={250} y={236} s={0.95} />
        {/* ghats: steps down to the water */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={-20 - i * 14} y={236 + i * 22} width={1500 + i * 28} height="24" fill={i % 2 ? SAND_DARK : SAND} />
        ))}
        {/* bunting */}
        <path d="M120 96 Q560 190 1060 70" stroke="#8A6A45" strokeWidth="3" fill="none" />
        {Array.from({ length: 16 }, (_, i) => {
          const t = (i + 0.5) / 16
          const x = 120 + (1060 - 120) * t
          // point on the same quadratic curve as the string
          const y = (1 - t) * (1 - t) * 96 + 2 * (1 - t) * t * 190 + t * t * 70
          return (
            <path
              key={i}
              className="sway"
              style={{ animationDelay: `-${i * 0.3}s`, transformOrigin: 'top center' }}
              d={`M${x - 13} ${y} L${x + 13} ${y} L${x} ${y + 30} Z`}
              fill={BUNTING[i % BUNTING.length]}
            />
          )
        })}
      </Layer>
    </>
  )
}

/** Quiet cliffs, trees and a sandbank: Stop 5. */
export function SanctuaryScenery() {
  return (
    <>
      <Layer speed={0.25} className="h-[46%] opacity-55">
        <path d="M0 320 V170 Q200 100 420 160 T860 130 T1440 170 V320 Z" fill="#6FA9A0" />
      </Layer>
      <Layer speed={0.55} className="h-[42%]">
        <path
          d="M0 320 V170 L70 150 L130 96 L240 88 L300 150 L380 176 L420 320 Z"
          fill={SAND_DARK}
        />
        <path d="M1040 320 L1080 180 L1150 150 L1210 92 L1320 84 L1380 140 L1440 160 V320 Z" fill={SAND_DARK} />
        <path d="M0 320 V250 Q360 226 720 250 T1440 246 V320 Z" fill={SAND} />
        <Tree x={190} y={92} s={0.9} dark />
        <Tree x={1260} y={88} s={1} />
        <Tree x={560} y={244} s={1.1} />
        <Tree x={640} y={246} s={0.8} dark />
        <Tree x={900} y={246} s={1} dark />
      </Layer>
      <Layer speed={0.9} className="h-[14%]">
        <path d="M0 320 V268 Q360 240 720 272 T1440 262 V320 Z" fill={LEAF} />
      </Layer>
    </>
  )
}
