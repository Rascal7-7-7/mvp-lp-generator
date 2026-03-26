'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { LandingPageWithRelations, LPStatus } from '@/lib/types'

interface Props {
  lp: LandingPageWithRelations
  baseUrl: string
}

export default function PublishSettings({ lp, baseUrl }: Props) {
  const router = useRouter()
  const [slug, setSlug] = useState(lp.slug)
  const [status, setStatus] = useState<LPStatus>(lp.status)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const publicUrl = `${baseUrl}/lp/${slug}`

  async function handleSave() {
    setError('')
    setSaved(false)
    if (!slug.trim()) { setError('スラッグを入力してください'); return }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setError('スラッグは英小文字・数字・ハイフンのみ使用できます')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/lp/${lp.id}`)
      const { lp: current } = await res.json()
      const payload = { ...current, slug, status }
      const updateRes = await fetch(`/api/lp/${lp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await updateRes.json()
      if (!updateRes.ok) { setError(data.error || '保存に失敗しました'); return }
      setSaved(true)
      router.refresh()
    } catch {
      setError('通信エラーが発生しました')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl bg-error-container border border-error/20 px-4 py-3 text-sm text-on-error-container flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-error">error</span>
          {error}
        </div>
      )}
      {saved && (
        <div className="rounded-xl bg-secondary-container/30 border border-secondary-container px-4 py-3 text-sm text-on-secondary-container flex items-center gap-2">
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          保存しました
        </div>
      )}

      {/* Status */}
      <div className="bg-white rounded-2xl border border-outline-variant/20 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-primary">現在の状態</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              現在は「{status === 'published' ? '公開中' : '下書き'}」として保存されています
            </p>
          </div>
          <div className="flex bg-surface-container p-1 rounded-lg">
            <button
              onClick={() => setStatus('draft')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                status === 'draft'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              下書き
            </button>
            <button
              onClick={() => setStatus('published')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                status === 'published'
                  ? 'bg-white text-secondary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              公開中
            </button>
          </div>
        </div>

        {status === 'published' ? (
          <div className="flex items-center gap-3 p-3 bg-secondary-container/20 rounded-xl border border-secondary-container/30">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <p className="text-xs text-on-secondary-container font-medium">
              公開に必要な情報はすべて入力されています。いつでも公開可能です。
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl">
            <span className="material-symbols-outlined text-outline text-base">info</span>
            <p className="text-xs text-on-surface-variant">
              下書き状態です。「公開中」に変更するとURLから閲覧できます。
            </p>
          </div>
        )}
      </div>

      {/* URL */}
      <div className="bg-white rounded-2xl border border-outline-variant/20 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
        <h3 className="text-sm font-bold text-primary mb-5">お店のURL設定</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-on-surface-variant mb-2 block ml-0.5">
              URLの末尾（スラッグ）
            </label>
            <div className="flex items-center overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low">
              <span className="px-3 py-3 text-xs text-on-surface-variant bg-surface-container border-r border-outline-variant/20 shrink-0 font-medium">
                /lp/
              </span>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="flex-1 bg-transparent border-none outline-none px-3 py-3 text-sm text-primary font-medium"
                placeholder="shop-name"
              />
            </div>
            <p className="text-xs text-on-surface-variant mt-1.5 ml-0.5">
              半角英数字とハイフンが使用できます。シンプルで覚えやすいものがおすすめです。
            </p>
          </div>

          <div className="p-4 bg-primary text-on-primary rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1 block">公開予定のURL</span>
              <span className="text-sm font-bold font-headline break-all">{publicUrl}</span>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(publicUrl)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-sm">content_copy</span>
              URLをコピー
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-4 rounded-xl font-bold text-base shadow-lg hover:opacity-95 disabled:opacity-60 transition-all active:scale-[0.98]"
      >
        <span className="material-symbols-outlined">public</span>
        {saving ? '保存中…' : 'お店をインターネットに公開する'}
      </button>

      {status === 'published' && (
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-surface-container-highest text-primary py-4 rounded-xl font-bold text-base hover:bg-outline-variant/20 transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined">visibility</span>
          公開ページを見る
        </a>
      )}

      <p className="text-center text-xs text-on-surface-variant">
        公開後も、いつでも下書きに戻したり編集したりすることができます。ご安心ください。
      </p>
    </div>
  )
}
