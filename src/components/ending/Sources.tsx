import { FACT_LIST } from '../../content/facts'
import { TITLE } from '../../content/story'

/** Lists every fact from content/facts.ts with its source (or a clear "pending" label). */
export default function Sources() {
  return (
    <section aria-labelledby="sources-heading" className="card p-5 md:p-7">
      <h3 id="sources-heading" className="text-2xl text-deep md:text-3xl">
        Sources
      </h3>
      <p className="mt-1 mb-4 text-base font-bold text-[#17708A]">
        {TITLE.note} Statements stay general until each one is checked against a real source.
      </p>
      <ol className="m-0 grid list-none gap-3 p-0 md:grid-cols-2">
        {FACT_LIST.map((fact) => (
          <li key={fact.id} className="rounded-2xl bg-white/80 p-4">
            <p className="text-sm font-bold tracking-wide text-ink/60 uppercase">{fact.usedIn}</p>
            <p className="my-1 text-base leading-snug">{fact.text}</p>
            {fact.verified && fact.sourceUrl ? (
              <a
                href={fact.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="font-bold text-river underline underline-offset-2"
              >
                Source: {fact.sourceLabel || fact.sourceUrl}
              </a>
            ) : (
              <span className="inline-block rounded-full bg-sunset/15 px-3 py-0.5 text-sm font-bold text-[#B85E12]">
                Source link to be added by the team
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
