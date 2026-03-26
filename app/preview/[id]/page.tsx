import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getLandingPageById } from '@/lib/queries'
import LPPreview from '@/components/LPPreview'

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lp = await getLandingPageById(Number(id))
  if (!lp) notFound()

  return (
    <div className="min-h-screen bg-surface-container">
      {/* Preview bar */}
      <header className="fixed top-0 w-full z-20 glass-nav shadow-sm h-14 flex items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <span className="text-xl font-headline font-bold text-primary">LP Concierge</span>
          <span className="hidden md:flex bg-surface-container p-1 rounded-lg">
            <span className="px-3 py-1 text-xs font-bold text-primary bg-white rounded-md shadow-sm">プレビュー</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href={`/editor/${lp.id}`} className="text-sm text-on-surface-variant hover:text-primary transition-colors">作成</Link>
          <span className="text-sm text-primary font-bold border-b-2 border-primary pb-0.5">プレビュー</span>
          <Link href={`/settings/${lp.id}`} className="text-sm text-on-surface-variant hover:text-primary transition-colors">公開設定</Link>
        </nav>
        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center">
          <span className="material-symbols-outlined text-sm text-on-surface-variant">person</span>
        </div>
      </header>

      <div className="pt-14 pb-20">
        <div className="max-w-[900px] mx-auto bg-white editorial-shadow">
          <LPPreview lp={lp} />
        </div>
      </div>

      {/* Floating actions */}
      <div className="fixed bottom-6 right-6 flex gap-3 z-50">
        <Link
          href={`/editor/${lp.id}`}
          className="flex items-center gap-1.5 bg-white text-primary border border-outline-variant px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-base">edit</span>
          編集に戻る
        </Link>
        <Link
          href={`/settings/${lp.id}`}
          className="flex items-center gap-1.5 bg-primary text-on-primary px-5 py-2.5 rounded-full text-sm font-bold shadow-xl hover:opacity-90 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-base">rocket_launch</span>
          公開設定へ
        </Link>
      </div>
    </div>
  )
}
