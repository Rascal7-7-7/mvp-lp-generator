import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getLandingPageById } from '@/lib/queries'
import PublishSettings from '@/components/PublishSettings'
import Sidebar from '@/components/Sidebar'

export default async function SettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lp = await getLandingPageById(Number(id))
  if (!lp) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-nav shadow-sm h-16 flex items-center justify-between px-6">
        <div className="text-xl font-headline font-bold text-primary tracking-tight">LP Concierge</div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href={`/editor/${lp.id}`} className="text-sm text-on-surface-variant hover:text-primary transition-colors font-medium">作成</Link>
          <Link href={`/preview/${lp.id}`} className="text-sm text-on-surface-variant hover:text-primary transition-colors font-medium">プレビュー</Link>
          <span className="text-sm text-primary font-bold border-b-2 border-primary pb-0.5">公開設定</span>
        </nav>
        <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center">
          <span className="material-symbols-outlined text-base text-on-surface-variant">person</span>
        </div>
      </header>

      <div className="flex pt-16 flex-1">
        <Sidebar lpId={lp.id} />

        <main className="flex-1 bg-surface-container-low overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-10">
            <div className="mb-8">
              <h1 className="text-2xl font-headline font-bold text-primary">公開設定</h1>
              <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
                お店のページをインターネットに公開するための設定を行います。シンプルに、かつ確実にお客さまへ届けましょう。
              </p>
            </div>
            <PublishSettings lp={lp} baseUrl={baseUrl} />
          </div>
        </main>
      </div>
    </div>
  )
}
