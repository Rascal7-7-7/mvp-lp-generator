import { notFound } from 'next/navigation'
import LPForm from '@/components/LPForm'
import { getLandingPageById } from '@/lib/queries'

export default async function EditorEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lp = await getLandingPageById(Number(id))
  if (!lp) notFound()
  return <LPForm initial={lp} />
}
