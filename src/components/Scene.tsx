import type { ReactNode } from 'react'
import { scrollToId } from '../hooks/scrollTo'
import Water from './river/Water'

interface SceneProps {
  id: string
  /** 1-5 for the stops. */
  stop: number
  /** CSS background for the sky. */
  sky: string
  /** SVG scenery standing on the waterline. */
  scenery?: ReactNode
  /** Things floating in / interacting with the water. */
  water?: ReactNode
  /** Tailwind height classes for the water band. */
  waterClass?: string
  /** Accessible name of the stop. */
  label: string
  children: ReactNode
}

/**
 * One stop of the journey: a full-screen "storybook page" with sky and scenery
 * on top and the river along the bottom. Each page overlaps the previous one
 * with rounded corners, like turning pages while scrolling downstream.
 */
export default function Scene({
  id,
  stop,
  sky,
  scenery,
  water,
  waterClass = 'h-[32svh] min-h-[220px]',
  label,
  children,
}: SceneProps) {
  return (
    <section
      id={id}
      data-stop={stop}
      aria-label={label}
      className="scene relative -mt-8 flex min-h-[100svh] flex-col overflow-hidden rounded-t-[2.25rem] shadow-[0_-14px_40px_-10px_rgba(20,80,107,0.45)]"
      style={{ background: sky, zIndex: stop }}
    >
      <div className="relative flex flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0">{scenery}</div>
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-4 pt-24 pb-12 md:px-8">
          {children}
        </div>
      </div>
      <Water className={waterClass}>{water}</Water>
    </section>
  )
}

/** The cream story card used by every stop. */
export function StoryCard({
  kicker,
  title,
  children,
  className = '',
}: {
  kicker: string
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`card reveal w-full max-w-xl p-5 md:p-8 ${className}`}>
      <p className="mb-2 text-sm font-bold tracking-wide text-river uppercase md:text-base">{kicker}</p>
      <h2 className="mb-3 text-3xl text-deep md:text-4xl">{title}</h2>
      {children}
    </div>
  )
}

/** The "keep flowing" button at the end of each stop. */
export function NextButton({ to, children }: { to: string; children: ReactNode }) {
  return (
    <button className="btn btn-teal mt-5" onClick={() => scrollToId(to)}>
      {children} <span aria-hidden>↓</span>
    </button>
  )
}
