import type { LandingPageWithRelations } from '@/lib/types'

interface Props {
  lp: LandingPageWithRelations
}

export default function LPPreview({ lp }: Props) {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Hero */}
      <div className="relative">
        {lp.main_image_url ? (
          <div className="relative h-72 w-full overflow-hidden">
            <img
              src={lp.main_image_url}
              alt={lp.store_name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
              <p className="mb-2 text-xs font-medium tracking-widest uppercase opacity-80">{lp.category}</p>
              <h1 className="text-3xl font-bold leading-tight">{lp.store_name}</h1>
              {lp.catch_copy && (
                <p className="mt-3 text-base leading-relaxed opacity-90">{lp.catch_copy}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 px-6 py-16 text-center text-white">
            <p className="mb-2 text-xs font-medium tracking-widest uppercase opacity-80">{lp.category}</p>
            <h1 className="text-3xl font-bold leading-tight">{lp.store_name}</h1>
            {lp.catch_copy && (
              <p className="mt-3 text-base leading-relaxed opacity-90">{lp.catch_copy}</p>
            )}
          </div>
        )}
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* 説明文 */}
        {lp.description && (
          <section className="py-8 border-b border-gray-100">
            <p className="text-sm leading-loose text-gray-700 whitespace-pre-wrap">{lp.description}</p>
          </section>
        )}

        {/* お知らせ */}
        {lp.notices.length > 0 && lp.notices[0].title && (
          <section className="py-6 border-b border-gray-100">
            <SectionTitle>お知らせ</SectionTitle>
            {lp.notices.map((notice, i) => (
              <div key={i} className="mt-3 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                {notice.published_date && (
                  <p className="text-xs text-amber-600 mb-1">{notice.published_date}</p>
                )}
                <p className="text-sm font-semibold text-gray-800">{notice.title}</p>
                {notice.body && <p className="mt-1 text-xs text-gray-600 leading-relaxed">{notice.body}</p>}
              </div>
            ))}
          </section>
        )}

        {/* メニュー・サービス */}
        {lp.services.length > 0 && lp.services[0].name && (
          <section className="py-8 border-b border-gray-100">
            <SectionTitle>メニュー・サービス</SectionTitle>
            <div className="mt-4 space-y-3">
              {lp.services.map((svc, i) => (
                <div key={i} className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{svc.name}</p>
                      {svc.description && (
                        <p className="mt-1 text-xs text-gray-600 leading-relaxed">{svc.description}</p>
                      )}
                    </div>
                    {svc.price_text && (
                      <span className="shrink-0 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                        {svc.price_text}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 営業情報 */}
        <section className="py-8 border-b border-gray-100">
          <SectionTitle>店舗情報</SectionTitle>
          <dl className="mt-4 space-y-3">
            {lp.business_hours && (
              <InfoRow icon="🕐" label="営業時間" value={lp.business_hours} />
            )}
            {lp.closed_days && (
              <InfoRow icon="📅" label="定休日" value={lp.closed_days} />
            )}
            {lp.address && (
              <InfoRow icon="📍" label="住所" value={lp.address} />
            )}
            {lp.phone && (
              <InfoRow icon="📞" label="電話番号" value={lp.phone} isPhone />
            )}
          </dl>
        </section>

        {/* SNS */}
        {(lp.instagram_url || lp.line_url) && (
          <section className="py-8 border-b border-gray-100">
            <SectionTitle>SNS・連絡先</SectionTitle>
            <div className="mt-4 flex flex-col gap-3">
              {lp.instagram_url && (
                <a
                  href={lp.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xl">📸</span>
                  <span>Instagram をフォローする</span>
                </a>
              )}
              {lp.line_url && (
                <a
                  href={lp.line_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
                >
                  <span className="text-xl">💬</span>
                  <span>LINE で友だち追加</span>
                </a>
              )}
            </div>
          </section>
        )}

        {/* CTA */}
        {lp.cta_label && lp.cta_link && (
          <section className="py-10">
            <a
              href={lp.cta_link}
              className="block w-full rounded-2xl bg-indigo-600 px-6 py-4 text-center text-base font-bold text-white shadow-lg hover:bg-indigo-500 active:bg-indigo-700 transition-colors"
            >
              {lp.cta_label}
            </a>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center">
        <p className="text-xs text-gray-400">{lp.store_name}</p>
      </footer>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 after:flex-1 after:h-px after:bg-gray-200 after:ml-2">
      {children}
    </h2>
  )
}

function InfoRow({ icon, label, value, isPhone }: {
  icon: string
  label: string
  value: string
  isPhone?: boolean
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="shrink-0 w-5 text-base">{icon}</span>
      <dt className="w-20 shrink-0 text-gray-500">{label}</dt>
      <dd className="text-gray-800">
        {isPhone ? (
          <a href={`tel:${value}`} className="text-indigo-600 hover:underline">{value}</a>
        ) : value}
      </dd>
    </div>
  )
}
