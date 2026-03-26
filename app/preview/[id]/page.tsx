import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getLandingPageById } from '@/lib/queries'
import LPPreview from '@/components/LPPreview'

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lp = await getLandingPageById(Number(id))
  if (!lp) notFound()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* プレビューバー */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              プレビュー
            </span>
            <span className="text-sm text-gray-600 truncate">{lp.store_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/editor/${lp.id}`}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ← 編集に戻る
            </Link>
            <Link
              href={`/settings/${lp.id}`}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              公開設定 →
            </Link>
          </div>
        </div>
      </div>

      {/* プレビュー本体（スマホ幅を意識） */}
      <div className="py-6">
        <div className="max-w-sm mx-auto rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-200 bg-white">
          <LPPreview lp={lp} />
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          スマートフォンでの表示イメージです
        </p>
      </div>
    </div>
  )
}
