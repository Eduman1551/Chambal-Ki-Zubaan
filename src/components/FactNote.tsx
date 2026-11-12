import type { Fact } from '../content/facts'

/** A small "why it matters" box. The text always comes from content/facts.ts. */
export default function FactNote({ fact, className = '' }: { fact: Fact; className?: string }) {
  return (
    <aside className={`rounded-2xl border-l-[6px] border-leaf bg-leaf/12 px-4 py-3 text-base ${className}`}>
      <p className="font-display mb-0.5 text-sm font-extrabold tracking-wide text-leaf uppercase">Why it matters</p>
      <p className="leading-snug">{fact.text}</p>
    </aside>
  )
}
