// Splits rule text into plain text and references to other rules, e.g. "rule 702.19b".
// Bare three-digit numbers only count as references right after "rule(s)", "section" or "chapter".
const REF_RE = /(?<=\b(?:rules?|sections?|chapters?) )\d{3}\b(?!\.\d)|\b\d{3}\.\d+[a-z]?\b/g

export function linkify(text, isKnown) {
  const parts = []
  let last = 0
  for (const m of text.matchAll(REF_RE)) {
    if (!isKnown(m[0])) continue
    if (m.index > last) parts.push({ text: text.slice(last, m.index) })
    parts.push({ text: m[0], ref: m[0] })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push({ text: text.slice(last) })
  return parts
}

// Path for a rule id: "702.19b" -> "/702#702.19b", "702" -> "/702"
export function ruleHref(ref) {
  const chapter = ref.slice(0, 3)
  return ref.length > 3 ? `/${chapter}#${ref}` : `/${chapter}`
}
