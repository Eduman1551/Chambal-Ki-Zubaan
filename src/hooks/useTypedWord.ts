import { useEffect, useRef } from 'react'

/** Calls onMatch when the user types `word` on the keyboard (anywhere on the page). */
export function useTypedWord(word: string, onMatch: () => void, enabled = true) {
  const callback = useRef(onMatch)
  callback.current = onMatch

  useEffect(() => {
    if (!enabled) return
    let typed = ''
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return
      typed = (typed + e.key.toLowerCase()).slice(-word.length)
      if (typed === word) {
        typed = ''
        callback.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [word, enabled])
}
