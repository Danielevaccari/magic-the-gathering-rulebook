'use client'

import { useDeferredValue, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SearchResults from './SearchResults'

export default function Shell({ sections, titles, updated, children }) {
  const pathname = usePathname()
  const [navOpen, setNavOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(null)
  const inputRef = useRef(null)
  const loading = useRef(false)
  const deferred = useDeferredValue(query)
  const searching = query.trim().length > 0

  // The search index is a static file, fetched the first time search is used.
  const loadIndex = () => {
    if (loading.current) return
    loading.current = true
    fetch('/search.json')
      .then((r) => r.json())
      .then((rows) => setIndex(rows.map(([id, text]) => [id, text, `${id} ${text}`.toLowerCase()])))
      .catch(() => {
        loading.current = false
      })
  }

  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable
      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        inputRef.current?.focus()
      } else if (e.key === 'Escape') {
        setQuery('')
        setNavOpen(false)
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const closeAll = () => {
    setNavOpen(false)
    setQuery('')
  }

  return (
    <>
      <header className="topbar glass">
        <button
          className="menu-btn"
          aria-label="Toggle chapter list"
          aria-expanded={navOpen}
          aria-controls="chapter-nav"
          onClick={() => setNavOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
        <Link href="/" className="brand" onClick={closeAll}>
          <strong>Magic: The Gathering</strong>
          <span>Rulebook</span>
        </Link>
        <div className="search">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={loadIndex}
            placeholder="Search all rules…"
            aria-label="Search all rules"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </header>

      <div className="layout">
        <div className={navOpen ? 'scrim show' : 'scrim'} onClick={() => setNavOpen(false)} />
        <nav id="chapter-nav" className={navOpen ? 'sidebar glass open' : 'sidebar glass'} aria-label="Chapters">
          {sections.map((s) => (
            <div key={s.id} className="nav-section">
              <h2>
                {s.id}. {s.title}
              </h2>
              <ul>
                {s.chapters.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/${c.id}`}
                      prefetch={false}
                      aria-current={pathname === `/${c.id}` ? 'page' : undefined}
                      onClick={closeAll}
                    >
                      <span>{c.id}</span> {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <main className="content glass">
          <div hidden={searching}>{children}</div>
          {searching && <SearchResults query={deferred.trim() || query.trim()} index={index} titles={titles} onNavigate={closeAll} />}
          <footer className="footer">
            Rules effective {updated}. Unofficial fan project, not affiliated with Wizards of the Coast. Text from the{' '}
            <a href="https://magic.wizards.com/en/rules" target="_blank" rel="noreferrer">
              Comprehensive Rules
            </a>
            .
          </footer>
        </main>
      </div>
    </>
  )
}
