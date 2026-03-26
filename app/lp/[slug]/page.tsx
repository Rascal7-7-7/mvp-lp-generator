import { notFound } from 'next/navigation'
import { getLandingPageBySlug } from '@/lib/queries'
import LPPreview from '@/components/LPPreview'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const lp = await getLandingPageBySlug(slug)
  if (!lp || lp.status !== 'published') return { title: 'ページが見つかりません' }
  return {
    title: lp.store_name,
    description: lp.catch_copy || lp.description,
  }
}

export default async function PublicLPPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const lp = await getLandingPageBySlug(slug)

  if (!lp || lp.status !== 'published') {
    notFound()
  }

  return <LPPreview lp={lp} />
}
