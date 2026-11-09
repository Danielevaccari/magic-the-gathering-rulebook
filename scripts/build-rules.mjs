// Downloads the comprehensive rules and writes data/rules.json + public/search.json.
// Run automatically before `dev` and `build`. If the download fails but a previous
// result exists, the existing files are kept.
import { mkdir, writeFile, access } from 'node:fs/promises'
import { parseRules, buildSearchIndex } from '../lib/parse-rules.mjs'

// Update this when Wizards publishes a new version (https://magic.wizards.com/en/rules),
// or override with the RULES_URL environment variable.
const RULES_URL = process.env.RULES_URL || 'https://media.wizards.com/2026/downloads/MagicCompRules%2020261106.txt'

const exists = (p) => access(p).then(() => true, () => false)

try {
  const res = await fetch(RULES_URL)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${RULES_URL}`)
  const data = parseRules(await res.text())
  await mkdir(new URL('../data/', import.meta.url), { recursive: true })
  await mkdir(new URL('../public/', import.meta.url), { recursive: true })
  await writeFile(new URL('../data/rules.json', import.meta.url), JSON.stringify(data))
  await writeFile(new URL('../public/search.json', import.meta.url), JSON.stringify(buildSearchIndex(data)))
  console.log(`rules: ${Object.keys(data.chapters).length} chapters, rules effective ${data.updated}`)
} catch (err) {
  if (await exists(new URL('../data/rules.json', import.meta.url))) {
    console.warn(`rules: download failed (${err.message}); using existing data`)
  } else {
    console.error(`rules: ${err.message}`)
    process.exit(1)
  }
}
