import Link from 'next/link'
import { chapters, chapterOrder } from '../lib/data'
import RuleText from './RuleText'

export default function ChapterView({ id }) {
  const chapter = chapters[id]
  const i = chapterOrder.indexOf(id)
  const prev = chapters[chapterOrder[i - 1]]
  const next = chapters[chapterOrder[i + 1]]

  return (
    <article>
      <h1 className="chapter-title">
        <span>{chapter.id}.</span> {chapter.title}
      </h1>
      <div className="rules">
        {chapter.rules.map((r) => (
          <section key={r.id} id={r.id} className={/[a-z]$/.test(r.id) ? 'rule sub' : 'rule'}>
            <a className="rid" href={`#${r.id}`}>
              {r.id}
            </a>
            <p>
              <RuleText text={r.text} />
            </p>
            {r.examples?.map((ex, k) => (
              <p key={k} className="example">
                <RuleText text={ex} />
              </p>
            ))}
          </section>
        ))}
      </div>
      <nav className="pager" aria-label="Chapter navigation">
        {prev ? (
          <Link href={`/${prev.id}`} rel="prev">
            <small>Previous</small>
            {prev.id}. {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/${next.id}`} rel="next" className="next">
            <small>Next</small>
            {next.id}. {next.title}
          </Link>
        )}
      </nav>
    </article>
  )
}
