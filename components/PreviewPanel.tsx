export interface PreviewData {
  storeName: string
  category: string
  catchCopy: string
  description: string
  businessHours: string
  closedDays: string
  address: string
  phone: string
  instagramUrl: string
  lineUrl: string
  mainImageUrl: string
  ctaLabel: string
  ctaLink: string
  services: { name: string; description: string | null; price_text: string | null }[]
  notices: { title: string; body: string | null; published_date: string | null }[]
}

interface Props {
  data: PreviewData
}

export default function PreviewPanel({ data }: Props) {
  return (
    <div className="hidden xl:flex flex-col w-[400px] shrink-0 h-[calc(100vh-64px)] sticky top-16 bg-surface-container-low p-6 overflow-y-auto scrollbar-thin">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
          リアルタイムプレビュー
        </span>
        <span className="material-symbols-outlined text-base text-on-surface-variant">smartphone</span>
      </div>

      {/* Phone frame */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-outline-variant/20 flex flex-col flex-1">
        {/* Mini nav */}
        <div className="h-11 flex items-center justify-between px-4 border-b border-surface-container shrink-0">
          <span className="text-xs font-bold text-primary truncate">{data.storeName || 'お店の名前'}</span>
          <span className="material-symbols-outlined text-base text-on-surface-variant">menu</span>
        </div>

        {/* Hero */}
        <div className="relative h-36 bg-primary-container flex items-center justify-center overflow-hidden shrink-0">
          {data.mainImageUrl ? (
            <img src={data.mainImageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container opacity-80" />
          )}
          <div className="relative z-10 text-center px-4">
            {data.category && (
              <span className="block text-[9px] text-white/70 tracking-widest uppercase mb-1">{data.category}</span>
            )}
            <h4 className="text-white text-sm font-bold leading-snug line-clamp-2">
              {data.catchCopy || 'キャッチコピーがここに表示されます'}
            </h4>
            {data.ctaLabel && (
              <div className="mt-2 inline-block bg-white text-primary px-4 py-1.5 rounded-full text-[10px] font-bold shadow">
                {data.ctaLabel}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto scrollbar-thin flex-1">
          {/* Description */}
          {data.description && (
            <div>
              <p className="text-[10px] font-bold text-secondary tracking-widest uppercase mb-1">About</p>
              <p className="text-[11px] leading-relaxed text-on-surface-variant line-clamp-3">{data.description}</p>
            </div>
          )}

          {/* Services */}
          {data.services.some(s => s.name) && (
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant mb-2">メニュー・サービス</p>
              <div className="grid grid-cols-2 gap-2">
                {data.services.filter(s => s.name).slice(0, 2).map((svc, i) => (
                  <div key={i} className="bg-surface-container-low rounded-lg p-2">
                    <p className="text-[10px] font-bold text-primary truncate">{svc.name}</p>
                    {svc.price_text && (
                      <p className="text-[9px] text-secondary font-bold">{svc.price_text}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Business info */}
          {(data.businessHours || data.address) && (
            <div className="bg-surface p-3 rounded-xl space-y-2">
              <p className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">location_on</span>
                店舗情報
              </p>
              {data.businessHours && (
                <div className="flex justify-between text-[10px]">
                  <span className="text-on-surface-variant">営業時間</span>
                  <span className="font-bold text-primary">{data.businessHours}</span>
                </div>
              )}
              {data.address && (
                <p className="text-[10px] text-on-surface-variant leading-relaxed truncate">{data.address}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-surface-container text-center shrink-0">
          <p className="text-[8px] text-on-surface-variant/50">© {data.storeName || 'Your Shop'}</p>
        </div>
      </div>
    </div>
  )
}
