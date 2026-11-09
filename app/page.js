import Link from 'next/link'
import { sections, updated } from '../lib/data'

export default function Home() {
  return (
    <>
      <h1 className="hero-title">Magic: The Gathering Comprehensive Rules</h1>
      <p className="muted">
        Effective {updated}. Pick a chapter, or press <kbd>/</kbd> to search every rule.
      </p>
      <div className="cards">
        {sections.map((s) => (
          <div key={s.id} className="card">
            <h2>
              {s.id}. {s.title}
            </h2>
            <ul>
              {s.chapters.map((c) => (
                <li key={c.id}>
                  <Link href={`/${c.id}`} prefetch={false}>
                    <span>{c.id}</span> {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}
