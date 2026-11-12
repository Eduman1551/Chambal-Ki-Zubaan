import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Glide the page to a vertical position (jumps instantly for reduced motion). */
export function scrollToY(y: number) {
  if (prefersReducedMotion()) {
    window.scrollTo(0, y)
    return
  }
  gsap.to(window, { scrollTo: { y, autoKill: true }, duration: 1.1, ease: 'power2.inOut', overwrite: true })
}

/** Glide the page to a section by its id. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY)
}
