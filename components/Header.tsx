'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  lpId?: number
  onSave?: () => void
  saving?: boolean
}

export default function Header({ lpId, onSave, saving }: Props) {
  const pathname = usePathname()

  const tabs = lpId
    ? [
        { label: '作成', href: `/editor/${lpId}`, match: '/editor' },
        { label: 'プレビュー', href: `/preview/${lpId}`, match: '/preview' },
        { label: '公開設定', href: `/settings/${lpId}`, match: '/settings' },
      ]
    : []

  return (
    <header className="fixed top-0 w-full z-50 glass-nav shadow-sm h-16 flex items-center justify-between px-6">
      <div className="text-xl font-bold text-primary tracking-tight font-headline">
        LP Concierge
      </div>

      {tabs.length > 0 && (
        <nav className="hidden md:flex items-center gap-8">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.match)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`text-sm font-medium transition-colors pb-1 ${
                  isActive
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      )}

      <div className="flex items-center gap-3">
        {onSave && (
          <button
            onClick={onSave}
            disabled={saving}
            className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 shadow-sm"
          >
            {saving ? '保存中…' : '保存'}
          </button>
        )}
        <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined text-base">person</span>
        </div>
      </div>
    </header>
  )
}
