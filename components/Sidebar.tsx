interface Props {
  lpId?: number
}

const sections = [
  { icon: 'info', label: '基本情報', id: 'section-basic' },
  { icon: 'schedule', label: '営業情報', id: 'section-business' },
  { icon: 'share', label: 'SNS・導線', id: 'section-sns' },
  { icon: 'article', label: '掲載内容', id: 'section-content' },
]

export default function Sidebar({ lpId }: Props) {
  return (
    <aside className="hidden lg:flex flex-col w-60 h-[calc(100vh-64px)] sticky top-16 py-8 px-4 gap-1 bg-surface-container-low overflow-y-auto scrollbar-thin shrink-0">
      <div className="px-3 mb-5">
        <h2 className="text-primary font-bold text-sm font-headline">編集セクション</h2>
        <p className="text-on-surface-variant text-xs mt-0.5">LPの構成要素</p>
      </div>

      <nav className="space-y-1">
        {sections.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group text-sm ${
              i === 0
                ? 'bg-white text-primary shadow-sm font-medium'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:translate-x-0.5 font-medium'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{s.icon}</span>
            <span>{s.label}</span>
          </a>
        ))}
      </nav>

      <div className="mt-auto mx-1">
        <div className="bg-secondary-container/30 rounded-xl p-3 text-xs text-on-secondary-container leading-relaxed">
          入力した情報は右側のプレビューにリアルタイムで反映されます
        </div>
      </div>
    </aside>
  )
}
