import { notFound } from 'next/navigation'
import ChapterView from '../../components/ChapterView'
import { chapters, chapterOrder } from '../../lib/data'

export const dynamicParams = false

export const generateStaticParams = () => chapterOrder.map((chapter) => ({ chapter }))

export async function generateMetadata({ params }) {
  const { chapter } = await params
  const c = chapters[chapter]
  return { title: c ? `${c.id}. ${c.title}` : 'Not found' }
}

export default async function ChapterPage({ params }) {
  const { chapter } = await params
  if (!chapters[chapter]) notFound()
  return <ChapterView id={chapter} />
}
