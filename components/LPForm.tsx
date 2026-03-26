'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { LandingPageWithRelations, LandingPageInput, ServiceInput, NoticeInput } from '@/lib/types'

const CATEGORIES = [
  '飲食店・カフェ',
  '美容室・サロン',
  'ネイル・まつ毛',
  'マッサージ・整体',
  '学習塾・教室',
  'フィットネス・ヨガ',
  '写真スタジオ',
  'ペットショップ',
  '雑貨・アパレル',
  'その他',
]

interface Props {
  initial?: LandingPageWithRelations
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40) || 'my-shop'
}

export default function LPForm({ initial }: Props) {
  const router = useRouter()
  const isEdit = !!initial

  const [storeName, setStoreName] = useState(initial?.store_name ?? '')
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0])
  const [catchCopy, setCatchCopy] = useState(initial?.catch_copy ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [businessHours, setBusinessHours] = useState(initial?.business_hours ?? '')
  const [closedDays, setClosedDays] = useState(initial?.closed_days ?? '')
  const [address, setAddress] = useState(initial?.address ?? '')
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [instagramUrl, setInstagramUrl] = useState(initial?.instagram_url ?? '')
  const [lineUrl, setLineUrl] = useState(initial?.line_url ?? '')
  const [mainImageUrl, setMainImageUrl] = useState(initial?.main_image_url ?? '')
  const [ctaLabel, setCtaLabel] = useState(initial?.cta_label ?? 'お問い合わせはこちら')
  const [ctaLink, setCtaLink] = useState(initial?.cta_link ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')

  const [services, setServices] = useState<ServiceInput[]>(
    initial?.services.map(s => ({
      name: s.name,
      description: s.description,
      price_text: s.price_text,
      sort_order: s.sort_order,
    })) ?? [{ name: '', description: '', price_text: '', sort_order: 0 }]
  )

  const [notices, setNotices] = useState<NoticeInput[]>(
    initial?.notices.map(n => ({
      title: n.title,
      body: n.body,
      published_date: n.published_date,
      sort_order: n.sort_order,
    })) ?? [{ title: '', body: '', published_date: '', sort_order: 0 }]
  )

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleStoreNameChange(val: string) {
    setStoreName(val)
    if (!isEdit && !slug) {
      setSlug(slugify(val))
    }
  }

  function updateService(i: number, field: keyof ServiceInput, val: string) {
    setServices(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  }

  function addService() {
    if (services.length >= 3) return
    setServices(prev => [...prev, { name: '', description: '', price_text: '', sort_order: prev.length }])
  }

  function removeService(i: number) {
    setServices(prev => prev.filter((_, idx) => idx !== i))
  }

  function updateNotice(i: number, field: keyof NoticeInput, val: string) {
    setNotices(prev => prev.map((n, idx) => idx === i ? { ...n, [field]: val } : n))
  }

  async function handleSave(redirectTo: 'preview' | 'settings' | null = null) {
    setError('')
    if (!storeName.trim()) { setError('店舗名を入力してください'); return }
    if (!slug.trim()) { setError('スラッグを入力してください'); return }

    setSaving(true)
    try {
      const payload: LandingPageInput = {
        title: storeName,
        store_name: storeName,
        category,
        catch_copy: catchCopy,
        description,
        business_hours: businessHours,
        closed_days: closedDays,
        address,
        phone,
        instagram_url: instagramUrl,
        line_url: lineUrl,
        main_image_url: mainImageUrl,
        cta_label: ctaLabel,
        cta_link: ctaLink,
        template_key: 'default',
        slug,
        status: initial?.status ?? 'draft',
        services: services.filter(s => s.name.trim()),
        notices: notices.filter(n => n.title.trim()),
      }

      const url = isEdit ? `/api/lp/${initial.id}` : '/api/lp'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || '保存に失敗しました'); return }

      const id = data.lp.id
      if (redirectTo === 'preview') router.push(`/preview/${id}`)
      else if (redirectTo === 'settings') router.push(`/settings/${id}`)
      else router.refresh()
    } catch {
      setError('通信エラーが発生しました')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">店舗LP を作成する</h1>
        <p className="mt-1 text-sm text-gray-500">必要な情報を入力して、すぐにランディングページを公開できます</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 基本情報 */}
      <Section title="基本情報">
        <Field label="店舗名" required>
          <input
            type="text"
            value={storeName}
            onChange={e => handleStoreNameChange(e.target.value)}
            placeholder="例：カフェ サクラ"
            className={inputClass}
          />
        </Field>
        <Field label="業種カテゴリ" required>
          <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="キャッチコピー" hint="一言で伝える魅力">
          <input
            type="text"
            value={catchCopy}
            onChange={e => setCatchCopy(e.target.value)}
            placeholder="例：地元素材にこだわった、ほっとできる場所"
            className={inputClass}
          />
        </Field>
        <Field label="店舗の説明文" hint="お客様へのメッセージ">
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="お店のコンセプトや特徴を書いてください"
            rows={4}
            className={inputClass}
          />
        </Field>
        <Field label="メイン画像URL" hint="お店の雰囲気が伝わる写真のURL">
          <input
            type="url"
            value={mainImageUrl}
            onChange={e => setMainImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className={inputClass}
          />
          {mainImageUrl && (
            <img src={mainImageUrl} alt="プレビュー" className="mt-2 rounded-lg h-32 w-full object-cover" />
          )}
        </Field>
      </Section>

      {/* 営業情報 */}
      <Section title="営業情報">
        <Field label="営業時間" required>
          <input
            type="text"
            value={businessHours}
            onChange={e => setBusinessHours(e.target.value)}
            placeholder="例：10:00〜19:00"
            className={inputClass}
          />
        </Field>
        <Field label="定休日">
          <input
            type="text"
            value={closedDays}
            onChange={e => setClosedDays(e.target.value)}
            placeholder="例：毎週火曜日・水曜日"
            className={inputClass}
          />
        </Field>
        <Field label="住所" required>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="例：東京都渋谷区〇〇1-2-3"
            className={inputClass}
          />
        </Field>
        <Field label="電話番号">
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="例：03-1234-5678"
            className={inputClass}
          />
        </Field>
      </Section>

      {/* SNS */}
      <Section title="SNS・連絡先">
        <Field label="Instagram URL">
          <input
            type="url"
            value={instagramUrl}
            onChange={e => setInstagramUrl(e.target.value)}
            placeholder="https://www.instagram.com/your_shop"
            className={inputClass}
          />
        </Field>
        <Field label="LINE URL">
          <input
            type="url"
            value={lineUrl}
            onChange={e => setLineUrl(e.target.value)}
            placeholder="https://lin.ee/xxxxxxx"
            className={inputClass}
          />
        </Field>
      </Section>

      {/* メニュー・サービス */}
      <Section title="メニュー・サービス" hint="最大3件まで登録できます">
        {services.map((svc, i) => (
          <div key={i} className="mb-4 rounded-lg border border-gray-200 p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">サービス {i + 1}</span>
              {services.length > 1 && (
                <button onClick={() => removeService(i)} className="text-xs text-red-500 hover:text-red-700">
                  削除
                </button>
              )}
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={svc.name}
                onChange={e => updateService(i, 'name', e.target.value)}
                placeholder="サービス名（例：ランチセット）"
                className={inputClass}
              />
              <input
                type="text"
                value={svc.description ?? ''}
                onChange={e => updateService(i, 'description', e.target.value)}
                placeholder="説明（例：日替わりメインと小鉢付き）"
                className={inputClass}
              />
              <input
                type="text"
                value={svc.price_text ?? ''}
                onChange={e => updateService(i, 'price_text', e.target.value)}
                placeholder="料金（例：¥880〜）"
                className={inputClass}
              />
            </div>
          </div>
        ))}
        {services.length < 3 && (
          <button
            onClick={addService}
            className="w-full rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
          >
            ＋ サービスを追加
          </button>
        )}
      </Section>

      {/* お知らせ */}
      <Section title="お知らせ" hint="最新情報を1件掲載できます">
        {notices.map((notice, i) => (
          <div key={i} className="rounded-lg border border-gray-200 p-4 bg-white space-y-3">
            <input
              type="text"
              value={notice.title}
              onChange={e => updateNotice(i, 'title', e.target.value)}
              placeholder="タイトル（例：夏季限定メニュー開始）"
              className={inputClass}
            />
            <textarea
              value={notice.body ?? ''}
              onChange={e => updateNotice(i, 'body', e.target.value)}
              placeholder="内容（例：7月1日より夏季限定のかき氷を提供開始します）"
              rows={2}
              className={inputClass}
            />
            <input
              type="date"
              value={notice.published_date ?? ''}
              onChange={e => updateNotice(i, 'published_date', e.target.value)}
              className={inputClass}
            />
          </div>
        ))}
      </Section>

      {/* CTA */}
      <Section title="ボタン設定" hint="LPに表示されるアクションボタン">
        <Field label="ボタンのラベル">
          <input
            type="text"
            value={ctaLabel}
            onChange={e => setCtaLabel(e.target.value)}
            placeholder="例：予約・お問い合わせはこちら"
            className={inputClass}
          />
        </Field>
        <Field label="ボタンのリンク先" hint="電話番号の場合は tel:03-xxxx-xxxx">
          <input
            type="text"
            value={ctaLink}
            onChange={e => setCtaLink(e.target.value)}
            placeholder="例：https://example.com/contact または tel:03-1234-5678"
            className={inputClass}
          />
        </Field>
      </Section>

      {/* 公開URL設定 */}
      <Section title="公開URL設定">
        <Field label="スラッグ（URL）" hint="英小文字・数字・ハイフンのみ" required>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 whitespace-nowrap">/lp/</span>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="my-shop"
              className={inputClass}
            />
          </div>
        </Field>
      </Section>

      {/* アクションボタン */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => handleSave('preview')}
          disabled={saving}
          className="flex-1 rounded-xl bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60 transition-colors"
        >
          {saving ? '保存中…' : 'プレビューを確認する →'}
        </button>
        <button
          onClick={() => handleSave(null)}
          disabled={saving}
          className="flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition-colors"
        >
          保存のみ
        </button>
        {isEdit && (
          <button
            onClick={() => handleSave('settings')}
            disabled={saving}
            className="flex-1 rounded-xl border border-indigo-200 bg-indigo-50 px-6 py-3 text-center text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-60 transition-colors"
          >
            公開設定へ →
          </button>
        )}
      </div>
    </div>
  )
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <div className="mb-4 border-b border-gray-200 pb-2">
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, hint, required, children }: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500 text-xs">必須</span>}
      </label>
      {hint && <p className="mb-1 text-xs text-gray-500">{hint}</p>}
      {children}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition'
