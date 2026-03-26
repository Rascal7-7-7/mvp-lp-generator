'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { LandingPageWithRelations, LandingPageInput, ServiceInput, NoticeInput } from '@/lib/types'
import PreviewPanel, { type PreviewData } from './PreviewPanel'
import Header from './Header'
import Sidebar from './Sidebar'

const CATEGORIES = [
  'カフェ・飲食店',
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
  const [ctaLabel, setCtaLabel] = useState(initial?.cta_label ?? 'ご予約・お問い合わせ')
  const [ctaLink, setCtaLink] = useState(initial?.cta_link ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')

  const [services, setServices] = useState<ServiceInput[]>(
    initial?.services.length
      ? initial.services.map(s => ({ name: s.name, description: s.description, price_text: s.price_text, sort_order: s.sort_order }))
      : [{ name: '', description: '', price_text: '', sort_order: 0 }]
  )
  const [notices, setNotices] = useState<NoticeInput[]>(
    initial?.notices.length
      ? initial.notices.map(n => ({ title: n.title, body: n.body, published_date: n.published_date, sort_order: n.sort_order }))
      : [{ title: '', body: '', published_date: '', sort_order: 0 }]
  )

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const previewData: PreviewData = {
    storeName, category, catchCopy, description,
    businessHours, closedDays, address, phone,
    instagramUrl, lineUrl, mainImageUrl, ctaLabel, ctaLink,
    services, notices,
  }

  function handleStoreNameChange(val: string) {
    setStoreName(val)
    if (!isEdit && !slug) setSlug(slugify(val))
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

  const handleSave = useCallback(async (redirectTo: 'preview' | 'settings' | null = null) => {
    setError('')
    if (!storeName.trim()) { setError('店舗名を入力してください'); return }
    if (!slug.trim()) { setError('URLスラッグを入力してください'); return }

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
  }, [storeName, slug, category, catchCopy, description, businessHours, closedDays, address, phone, instagramUrl, lineUrl, mainImageUrl, ctaLabel, ctaLink, services, notices, initial, isEdit, router])

  return (
    <div className="flex flex-col min-h-screen">
      <Header lpId={initial?.id} onSave={() => handleSave(null)} saving={saving} />

      <div className="flex pt-16">
        <Sidebar lpId={initial?.id} />

        {/* Form + Preview split */}
        <div className="flex flex-1 overflow-hidden">
          {/* Form */}
          <main className="flex-1 overflow-y-auto scrollbar-thin bg-white">
            <div className="max-w-2xl mx-auto px-8 py-10 pb-24 space-y-14">
              {/* Page title */}
              <div>
                <h1 className="text-2xl font-headline font-bold text-primary tracking-tight">
                  ショップの魅力を伝えましょう
                </h1>
                <p className="text-on-surface-variant text-sm mt-1">
                  情報を入力するだけで、プロフェッショナルなLPが完成します
                </p>
              </div>

              {error && (
                <div className="rounded-xl bg-error-container border border-error/20 px-4 py-3 text-sm text-on-error-container flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-error">error</span>
                  {error}
                </div>
              )}

              {/* ① 基本情報 */}
              <section id="section-basic" className="space-y-5">
                <SectionHeader num={1} title="基本情報" />
                <Field label="店舗名" required>
                  <Input
                    value={storeName}
                    onChange={e => handleStoreNameChange(e.target.value)}
                    placeholder="例：Cafe de Flore"
                  />
                </Field>
                <Field label="業種カテゴリ">
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className={inputCls}
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="キャッチコピー" hint="一言でお店の魅力を表現しましょう">
                  <Input
                    value={catchCopy}
                    onChange={e => setCatchCopy(e.target.value)}
                    placeholder="例：香り高いコーヒーと至福の時間を"
                  />
                </Field>
                <Field label="紹介文" hint="お店のこだわり・コンセプトを書いてください">
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="お店のこだわりや歴史について入力してください"
                    rows={4}
                    className={inputCls + ' resize-none'}
                  />
                </Field>
                <Field label="メイン画像URL" hint="お店の雰囲気が伝わる写真のURL">
                  <Input
                    type="url"
                    value={mainImageUrl}
                    onChange={e => setMainImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  {mainImageUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden h-32 bg-surface-container">
                      <img src={mainImageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </Field>
              </section>

              {/* ② 営業情報 */}
              <section id="section-business" className="space-y-5">
                <SectionHeader num={2} title="営業情報" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="営業時間" required>
                    <Input
                      value={businessHours}
                      onChange={e => setBusinessHours(e.target.value)}
                      placeholder="10:00 - 20:00"
                    />
                  </Field>
                  <Field label="定休日">
                    <Input
                      value={closedDays}
                      onChange={e => setClosedDays(e.target.value)}
                      placeholder="毎週月曜日"
                    />
                  </Field>
                </div>
                <Field label="住所" required>
                  <Input
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="東京都渋谷区..."
                  />
                </Field>
                <Field label="電話番号">
                  <Input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="03-0000-0000"
                  />
                </Field>
              </section>

              {/* ③ SNS・導線 */}
              <section id="section-sns" className="space-y-5">
                <SectionHeader num={3} title="SNS・導線" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Instagram URL">
                    <div className="flex items-center gap-2 bg-surface-container-low rounded-xl border border-outline-variant/30 px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary-fixed/30 focus-within:border-primary-fixed">
                      <span className="material-symbols-outlined text-pink-500 text-base shrink-0">photo_camera</span>
                      <input
                        type="url"
                        value={instagramUrl}
                        onChange={e => setInstagramUrl(e.target.value)}
                        placeholder="https://instagram.com/..."
                        className="bg-transparent border-none outline-none text-sm flex-1 min-w-0"
                      />
                    </div>
                  </Field>
                  <Field label="LINE URL">
                    <div className="flex items-center gap-2 bg-surface-container-low rounded-xl border border-outline-variant/30 px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary-fixed/30 focus-within:border-primary-fixed">
                      <span className="material-symbols-outlined text-green-500 text-base shrink-0">chat</span>
                      <input
                        type="url"
                        value={lineUrl}
                        onChange={e => setLineUrl(e.target.value)}
                        placeholder="https://lin.ee/..."
                        className="bg-transparent border-none outline-none text-sm flex-1 min-w-0"
                      />
                    </div>
                  </Field>
                </div>
                <Field label="CTAボタンのラベル" hint="お客様に取ってほしいアクション">
                  <Input
                    value={ctaLabel}
                    onChange={e => setCtaLabel(e.target.value)}
                    placeholder="ご予約・お問い合わせはこちら"
                  />
                </Field>
                <Field label="CTAリンク先" hint="tel:03-xxxx-xxxx 形式も可">
                  <Input
                    value={ctaLink}
                    onChange={e => setCtaLink(e.target.value)}
                    placeholder="https://example.com/contact"
                  />
                </Field>
              </section>

              {/* ④ 掲載内容 */}
              <section id="section-content" className="space-y-5">
                <SectionHeader num={4} title="掲載内容" />

                {/* Services */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-on-surface-variant ml-1">
                    メニュー・サービス
                    <span className="ml-1 text-xs font-normal text-on-surface-variant">（最大3件）</span>
                  </label>
                  <div className="space-y-3">
                    {services.map((svc, i) => (
                      <div
                        key={i}
                        className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 space-y-3 hover:border-primary-fixed/40 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-on-surface-variant">サービス {i + 1}</span>
                          {services.length > 1 && (
                            <button
                              onClick={() => removeService(i)}
                              className="text-xs text-error hover:text-error/80 flex items-center gap-0.5"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                              削除
                            </button>
                          )}
                        </div>
                        <input
                          value={svc.name}
                          onChange={e => updateService(i, 'name', e.target.value)}
                          placeholder="サービス名（例：ランチセット）"
                          className={inputCls}
                        />
                        <input
                          value={svc.description ?? ''}
                          onChange={e => updateService(i, 'description', e.target.value)}
                          placeholder="説明（例：日替わりメインと小鉢付き）"
                          className={inputCls}
                        />
                        <input
                          value={svc.price_text ?? ''}
                          onChange={e => updateService(i, 'price_text', e.target.value)}
                          placeholder="料金（例：¥880〜）"
                          className={inputCls}
                        />
                      </div>
                    ))}
                    {services.length < 3 && (
                      <button
                        onClick={addService}
                        className="w-full py-3 rounded-xl border-2 border-dashed border-outline-variant text-on-surface-variant text-sm font-medium flex items-center justify-center gap-1.5 hover:border-primary-fixed/50 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">add</span>
                        アイテムを追加
                      </button>
                    )}
                  </div>
                </div>

                {/* Notice */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-on-surface-variant ml-1">お知らせ</label>
                  {notices.map((notice, i) => (
                    <div key={i} className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 space-y-3">
                      <input
                        value={notice.title}
                        onChange={e => updateNotice(i, 'title', e.target.value)}
                        placeholder="タイトル（例：夏季限定メニュー開始）"
                        className={inputCls}
                      />
                      <textarea
                        value={notice.body ?? ''}
                        onChange={e => updateNotice(i, 'body', e.target.value)}
                        placeholder="内容"
                        rows={2}
                        className={inputCls + ' resize-none'}
                      />
                      <input
                        type="date"
                        value={notice.published_date ?? ''}
                        onChange={e => updateNotice(i, 'published_date', e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  ))}
                </div>

                {/* Slug */}
                <div className="space-y-2 pt-2 border-t border-outline-variant/20">
                  <label className="text-sm font-bold text-on-surface-variant ml-1">
                    公開URL（スラッグ）
                    <span className="ml-1 text-xs font-normal">英小文字・数字・ハイフン</span>
                  </label>
                  <div className="flex items-center gap-1 bg-surface-container-low rounded-xl border border-outline-variant/30 overflow-hidden">
                    <span className="pl-3 text-sm text-on-surface-variant whitespace-nowrap shrink-0">/lp/</span>
                    <input
                      value={slug}
                      onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="my-shop"
                      className="flex-1 bg-transparent border-none outline-none px-2 py-2.5 text-sm text-primary font-medium"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Mobile action bar */}
            <div className="xl:hidden fixed bottom-0 left-0 right-0 glass-nav border-t border-outline-variant/20 p-4 flex gap-3 z-40">
              <button
                onClick={() => handleSave('preview')}
                disabled={saving}
                className="flex-1 bg-primary text-on-primary py-3 rounded-xl text-sm font-bold disabled:opacity-60"
              >
                プレビュー確認
              </button>
              {isEdit && (
                <button
                  onClick={() => handleSave('settings')}
                  disabled={saving}
                  className="flex-1 border border-primary text-primary py-3 rounded-xl text-sm font-bold disabled:opacity-60"
                >
                  公開設定へ
                </button>
              )}
            </div>
          </main>

          <PreviewPanel data={previewData} />
        </div>
      </div>

      {/* Desktop floating action bar */}
      <div className="hidden xl:flex fixed bottom-6 right-6 z-50 gap-3">
        {isEdit && (
          <button
            onClick={() => handleSave('settings')}
            disabled={saving}
            className="flex items-center gap-2 bg-white text-primary border border-outline-variant px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:bg-surface-container-low transition-colors disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-base">settings</span>
            公開設定へ
          </button>
        )}
        <button
          onClick={() => handleSave('preview')}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full text-sm font-bold shadow-xl hover:opacity-90 transition-all disabled:opacity-60 active:scale-95"
        >
          <span className="material-symbols-outlined text-base">visibility</span>
          プレビューを確認
        </button>
      </div>
    </div>
  )
}

function SectionHeader({ num, title }: { num: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-7 h-7 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-xs font-bold shrink-0">
        {num}
      </span>
      <h3 className="text-lg font-bold text-primary font-headline">{title}</h3>
    </div>
  )
}

function Field({ label, hint, required, children }: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-on-surface-variant ml-1">
        {label}
        {required && <span className="ml-1 text-xs text-error">必須</span>}
      </label>
      {hint && <p className="text-xs text-on-surface-variant ml-1 -mt-0.5">{hint}</p>}
      {children}
    </div>
  )
}

function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${className}`} />
}

const inputCls =
  'w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary-fixed focus:ring-2 focus:ring-primary-fixed/20 transition-all placeholder:text-on-surface-variant/50'
