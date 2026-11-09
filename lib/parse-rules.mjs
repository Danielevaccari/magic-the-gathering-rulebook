// Parses the Wizards of the Coast Comprehensive Rules .txt into structured data.

const RULE_RE = /^(\d{3}\.\d+[a-z]?)\.?\s+(.*)$/
const CHAPTER_RE = /^(\d{3})\. (.+)$/
const SECTION_RE = /^(\d)\. (.+)$/

export function parseRules(raw) {
  const lines = raw.replace(/^﻿/, '').split(/\r?\n/).map((l) => l.trim())

  const updated = (raw.match(/effective as of ([^.\n]+)\./) || [])[1] || ''

  const tocStart = lines.indexOf('Contents')
  const tocEnd = lines.indexOf('Credits', tocStart)
  const bodyEnd = lines.indexOf('Glossary', tocEnd)
  if (tocStart < 0 || tocEnd < 0 || bodyEnd < 0) {
    throw new Error('Unexpected rules file format: Contents/Credits/Glossary markers not found')
  }

  const sections = []
  const chapters = {}
  for (const line of lines.slice(tocStart + 1, tocEnd)) {
    let m
    if ((m = line.match(CHAPTER_RE)) && sections.length) {
      sections[sections.length - 1].chapters.push({ id: m[1], title: m[2] })
      chapters[m[1]] = { id: m[1], title: m[2], rules: [] }
    } else if ((m = line.match(SECTION_RE))) {
      sections.push({ id: m[1], title: m[2], chapters: [] })
    }
  }

  let last = null
  for (const line of lines.slice(tocEnd + 1, bodyEnd)) {
    if (!line) continue
    let m
    if ((m = line.match(RULE_RE))) {
      const chapter = chapters[m[1].slice(0, 3)]
      if (!chapter) continue
      last = { id: m[1], text: m[2] }
      chapter.rules.push(last)
    } else if (CHAPTER_RE.test(line) || SECTION_RE.test(line)) {
      last = null
    } else if (last) {
      if (line.startsWith('Example:')) (last.examples ||= []).push(line)
      else last.text += '\n' + line
    }
  }

  const ruleCount = Object.values(chapters).reduce((n, c) => n + c.rules.length, 0)
  if (ruleCount < 1000) throw new Error(`Parsed only ${ruleCount} rules; the file format may have changed`)

  return { updated, sections, chapters }
}

// Compact flat index for client-side search: [[ruleId, text + examples], ...]
export function buildSearchIndex(data) {
  const out = []
  for (const c of Object.values(data.chapters)) {
    for (const r of c.rules) out.push([r.id, [r.text, ...(r.examples || [])].join('\n')])
  }
  return out
}
