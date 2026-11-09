import { describe, it, expect } from 'vitest'
import { parseRules, buildSearchIndex } from '../lib/parse-rules.mjs'
import { linkify, ruleHref } from '../lib/linkify.js'

const fixture = (n = 1000) => {
  const body = []
  for (let i = 3; i <= n; i++) body.push(`100.${i}. Rule number ${i}.`, '')
  return [
    'Magic: The Gathering Comprehensive Rules', '', 'These rules are effective as of November 6, 2026.', '',
    'Contents', '', '1. Game Concepts', '100. General', '', 'Glossary', 'Credits', '',
    '1. Game Concepts', '', '100. General', '',
    '100.1. First rule. See rule 100.2.', '', 'Example: an example.', '', '100.1a Sub rule.', '',
    '100.2. Second rule.', '',
    ...body, 'Glossary', 'text', 'Credits',
  ].join('\r\n')
}

describe('parseRules', () => {
  const data = parseRules(fixture())
  it('reads the effective date, sections and chapters', () => {
    expect(data.updated).toBe('November 6, 2026')
    expect(data.sections).toEqual([{ id: '1', title: 'Game Concepts', chapters: [{ id: '100', title: 'General' }] }])
  })
  it('parses rules, subrules and examples', () => {
    const [r1, sub] = data.chapters['100'].rules
    expect(r1).toMatchObject({ id: '100.1', text: 'First rule. See rule 100.2.', examples: ['Example: an example.'] })
    expect(sub).toMatchObject({ id: '100.1a', text: 'Sub rule.' })
  })
  it('builds a search index', () => {
    expect(buildSearchIndex(data)[0][0]).toBe('100.1')
  })
  it('rejects an unexpected format', () => {
    expect(() => parseRules('nothing useful here')).toThrow()
  })
})

describe('linkify', () => {
  const known = (id) => ['100', '702.19b', '100.2'].includes(id)
  it('links known rule references only', () => {
    const parts = linkify('See rule 702.19b and 999.9, also section 100.', known)
    expect(parts.filter((p) => p.ref).map((p) => p.ref)).toEqual(['702.19b', '100'])
  })
  it('does not link bare numbers', () => {
    expect(linkify('a deck of 100 cards', known).some((p) => p.ref)).toBe(false)
  })
  it('builds hrefs', () => {
    expect(ruleHref('702.19b')).toBe('/702#702.19b')
    expect(ruleHref('100')).toBe('/100')
  })
})
