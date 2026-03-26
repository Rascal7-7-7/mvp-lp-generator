import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getLandingPageById } from '@/lib/queries'
import PublishSettings from '@/components/PublishSettings'

export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lp = await getLandingPageById(Number(id))
  if (!lp) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <span className="text-sm font-semibold text-indigo-600">公開設定</span>
          <div className="flex items-center gap-3">
            <Link href={`/editor/${lp.id}`} className="text-xs text-gray-500 hover:text-gray-700">
              ← 編集に戻る
            </Link>
            <Link href={`/preview/${lp.id}`} className="text-xs text-indigo-600 hover:underline">
              プレビュー
            </Link>
          </div>
        </div>
      </nav>
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">公開設定</h1>
          <p className="mt-1 text-sm text-gray-500">
            スラッグとステータスを設定してLPを公開しましょう
          </p>
        </div>
        <PublishSettings lp={lp} baseUrl={baseUrl} />
      </div>
    </main>
  )
}
