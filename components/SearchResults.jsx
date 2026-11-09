import Link from 'next/link'
import { ruleHref } from '../lib/linkify'

const MAX_RESULTS = 100
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function Highlight({ text, re }) {
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part))
}

// index entries: [ruleId, text, lowercased "id text"]
export default function SearchResults({ query, index, titles, onNavigate }) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!index) return <p className="muted">Loading search index…</p>

  const hits = []
  let total = 0
  for (const entry of index) {
    if (terms.every((t) => entry[2].includes(t))) {
      total++
      if (hits.length < MAX_RESULTS) hits.push(entry)
    }
  }
  const re = new RegExp(`(${terms.map(escapeRe).join('|')})`, 'gi')

  return (
    <section aria-live="polite">
      <h1 className="chapter-title">
        {total} {total === 1 ? 'result' : 'results'}
      </h1>
      {total > MAX_RESULTS && <p className="muted">Showing the first {MAX_RESULTS}. Refine your search to narrow it down.</p>}
      <ul className="results">
        {hits.map(([id, text]) => (
          <li key={id}>
            <Link href={ruleHref(id)} onClick={onNavigate}>
              <span className="result-meta">
                {id} · {titles[id.slice(0, 3)]}
              </span>
              <span className="result-text">
                <Highlight text={text} re={re} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
