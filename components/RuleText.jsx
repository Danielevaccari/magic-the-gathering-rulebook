import Link from 'next/link'
import { linkify, ruleHref } from '../lib/linkify'
import { isKnownRule } from '../lib/data'

// Renders rule text, turning mentions of other rules into links.
export default function RuleText({ text }) {
  return linkify(text, isKnownRule).map((p, i) =>
    p.ref ? (
      <Link key={i} href={ruleHref(p.ref)} className="ref">
        {p.text}
      </Link>
    ) : (
      p.text
    ),
  )
}
