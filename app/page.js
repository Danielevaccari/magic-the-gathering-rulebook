import Link from 'next/link'
import { sections, chapters, chapterTitles, updated } from '../lib/data'

const QUICK = ['100', '506', '601', '702', '704', '903']

const BLURBS = {
  1: 'Players, zones, mana, colors, and the basic building blocks of a game.',
  2: 'Name, mana cost, types, text box, power and toughness, and more.',
  3: 'Creatures, instants, sorceries, lands, and every other card type.',
  4: 'Library, hand, battlefield, graveyard, stack, exile, and the rest.',
  5: 'The phases and steps of a turn, from untap to cleanup.',
  6: 'Casting spells, activating and triggering abilities, and effects.',
  7: 'Keyword abilities, state-based actions, and special rules.',
  8: 'Rules for games with more than two players.',
  9: 'Planechase, Vanguard, Commander, Archenemy, and Conspiracy Draft.',
}

const ruleCount = Object.values(chapters).reduce((n, c) => n + c.rules.length, 0)

export default function Home() {
  return (
    <>
      <h1 className="hero-title">Magic: The Gathering Comprehensive Rules</h1>
      <p className="muted">
        Browse by section below, use the chapter list, or press <kbd>/</kbd> to search every rule.
      </p>
      <ul className="stats">
        <li>
          <strong>{ruleCount.toLocaleString('en-US')}</strong>rules
        </li>
        <li>
          <strong>{Object.keys(chapters).length}</strong>chapters
        </li>
        <li>
          <strong>{updated}</strong>effective date
        </li>
      </ul>
      <div className="quick">
        {QUICK.map((id) => (
          <Link key={id} href={`/${id}`} prefetch={false}>
            <span>{id}</span>
            {chapterTitles[id]}
          </Link>
        ))}
      </div>
      <div className="cards">
        {sections.map((s) => (
          <div key={s.id} className="card">
            <h2>
              {s.id}. {s.title}
            </h2>
            {BLURBS[s.id] && <p>{BLURBS[s.id]}</p>}
            <ul>
              {s.chapters.map((c) => (
                <li key={c.id}>
                  <Link href={`/${c.id}`} prefetch={false}>
                    <span>{c.id}</span>
                    {c.title}
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
