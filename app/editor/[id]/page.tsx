import { notFound } from 'next/navigation'
import LPForm from '@/components/LPForm'
import { getLandingPageById } from '@/lib/queries'
import Link from 'next/link'

export default async function EditorEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lp = await getLandingPageById(Number(id))
  if (!lp) notFound()

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-sm font-semibold text-indigo-600">LP ジェネレーター</span>
          <div className="flex items-center gap-3">
            <Link href={`/preview/${lp.id}`} className="text-xs text-indigo-600 hover:underline">
              プレビュー
            </Link>
            <Link href={`/settings/${lp.id}`} className="text-xs text-indigo-600 hover:underline">
              公開設定
            </Link>
          </div>
        </div>
      </nav>
      <LPForm initial={lp} />
    </main>
  )
}
