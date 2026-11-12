import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, type RefObject } from 'react'
import { useRiverStore } from '../state/useRiverStore'

gsap.registerPlugin(ScrollTrigger)

/**
 * Wires the scroll journey with GSAP ScrollTrigger:
 *  1. tracks which stop is on screen (for the HUD and the mascot),
 *  2. slides scenery layers sideways while scrolling ("travelling downstream"),
 *  3. reveals each stop's cards as it enters,
 *  4. pauses the CSS animations of scenes that are off screen.
 * Parallax and reveals are skipped when the user prefers reduced motion.
 */
export function useScrollJourney(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>('.scene', root)

      // 1. current stop
      scenes.forEach((scene) => {
        const stop = Number(scene.dataset.stop ?? 0)
        ScrollTrigger.create({
          trigger: scene,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && useRiverStore.getState().setStop(stop),
        })
      })

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        scenes.forEach((scene) => {
          // 2. parallax: faster layers (bigger data-speed) feel closer
          gsap.utils.toArray<HTMLElement>('[data-speed]', scene).forEach((layer) => {
            const speed = Number(layer.dataset.speed)
            gsap.fromTo(
              layer,
              { xPercent: speed * 5 },
              {
                xPercent: -speed * 5,
                ease: 'none',
                scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
              },
            )
          })

          // 3. reveal cards
          const cards = gsap.utils.toArray<HTMLElement>('.reveal', scene)
          if (cards.length) {
            gsap.from(cards, {
              y: 50,
              autoAlpha: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.15,
              scrollTrigger: { trigger: scene, start: 'top 60%', once: true },
            })
          }
        })
      })
    }, root)

    // 4. performance: scenes that are off screen get paused CSS animations (see index.css).
    //    Fail-safe: if the observer never fires, nothing is paused.
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('off-screen', !e.isIntersecting)),
      { rootMargin: '100px 0px' },
    )
    root.querySelectorAll('.scene').forEach((scene) => observer.observe(scene))

    return () => {
      observer.disconnect()
      ctx.revert()
    }
  }, [rootRef])
}
