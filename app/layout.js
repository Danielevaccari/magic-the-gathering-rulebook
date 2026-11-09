import './globals.css'
import Shell from '../components/Shell'
import { sections, chapterTitles, updated } from '../lib/data'

export const metadata = {
  title: { default: 'MTG Rulebook', template: '%s · MTG Rulebook' },
  description: 'Searchable Magic: The Gathering Comprehensive Rules, browsable by chapter with linked rule references.',
}

export const viewport = { themeColor: '#0b0b14', colorScheme: 'dark' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Shell sections={sections} titles={chapterTitles} updated={updated}>
          {children}
        </Shell>
      </body>
    </html>
  )
}
