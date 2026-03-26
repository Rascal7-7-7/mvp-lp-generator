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
      // 現在のLPデータを取得して status と slug だけ更新
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
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {saved && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          保存しました
        </div>
      )}

      {/* ステータス */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">公開ステータス</h2>
        <div className="flex gap-3">
          <StatusButton
            value="draft"
            current={status}
            label="下書き"
            description="非公開。URLを知っても閲覧できません"
            onClick={() => setStatus('draft')}
          />
          <StatusButton
            value="published"
            current={status}
            label="公開中"
            description="誰でもURLから閲覧できます"
            onClick={() => setStatus('published')}
          />
        </div>
      </div>

      {/* スラッグ */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-800 mb-1">公開URL</h2>
        <p className="text-xs text-gray-500 mb-4">英小文字・数字・ハイフンのみ使用できます</p>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-500 whitespace-nowrap">/lp/</span>
          <input
            type="text"
            value={slug}
            onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
          <span className="text-xs text-gray-500 flex-1 break-all">{publicUrl}</span>
          <button
            onClick={() => navigator.clipboard.writeText(publicUrl)}
            className="shrink-0 text-xs text-indigo-600 hover:text-indigo-800"
          >
            コピー
          </button>
        </div>
      </div>

      {/* 保存ボタン */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60 transition-colors"
      >
        {saving ? '保存中…' : '設定を保存する'}
      </button>

      {/* 公開URLへ遷移 */}
      {status === 'published' && (
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-xl border border-indigo-200 bg-indigo-50 px-6 py-3 text-center text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          公開ページを確認する ↗
        </a>
      )}
    </div>
  )
}

function StatusButton({ value, current, label, description, onClick }: {
  value: LPStatus
  current: LPStatus
  label: string
  description: string
  onClick: () => void
}) {
  const isActive = value === current
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl border-2 p-4 text-left transition-colors ${
        isActive
          ? value === 'published'
            ? 'border-green-400 bg-green-50'
            : 'border-gray-400 bg-gray-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={`inline-block h-2 w-2 rounded-full ${
          value === 'published' ? 'bg-green-500' : 'bg-gray-400'
        }`} />
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        {isActive && <span className="text-xs text-gray-500">（現在）</span>}
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </button>
  )
}
