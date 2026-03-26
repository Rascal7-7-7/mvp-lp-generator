import type { LandingPageWithRelations } from '@/lib/types'

interface Props {
  lp: LandingPageWithRelations
}

export default function LPPreview({ lp }: Props) {
  return (
    <div className="bg-white min-h-screen font-body">
      {/* LP Nav */}
      <nav className="flex justify-between items-center px-6 md:px-10 py-5 bg-white border-b border-outline-variant/10">
        <div className="text-xl font-headline font-extrabold tracking-tight text-primary">{lp.store_name}</div>
        <div className="hidden md:flex gap-8 text-xs font-medium tracking-widest text-on-surface-variant uppercase">
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <a href="#menu" className="hover:text-primary transition-colors">Menu</a>
          <a href="#access" className="hover:text-primary transition-colors">Access</a>
          {lp.cta_link && <a href={lp.cta_link} className="hover:text-primary transition-colors">Contact</a>}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[480px] md:min-h-[560px] flex items-center px-6 md:px-10 overflow-hidden">
        {lp.main_image_url ? (
          <>
            <div className="absolute inset-0 z-0">
              <img src={lp.main_image_url} alt={lp.store_name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-primary/60" />
            </div>
            <div className="relative z-10 max-w-2xl">
              {lp.category && (
                <span className="inline-block px-3 py-1 mb-4 bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest rounded-full uppercase">
                  {lp.category}
                </span>
              )}
              <h1 className="text-4xl md:text-6xl font-headline font-extrabold text-white leading-tight mb-6">
                {lp.catch_copy || lp.store_name}
              </h1>
              {lp.description && (
                <p className="text-white/80 text-base leading-relaxed mb-8 max-w-lg line-clamp-3">{lp.description}</p>
              )}
              {lp.cta_link && lp.cta_label && (
                <a
                  href={lp.cta_link}
                  className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3.5 rounded-xl font-bold shadow-xl hover:scale-105 transition-transform"
                >
                  {lp.cta_label}
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </a>
              )}
            </div>
            {lp.business_hours && (
              <div className="absolute bottom-8 right-8 hidden md:block bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <p className="text-white text-xs font-bold tracking-widest uppercase mb-1">営業時間</p>
                <p className="text-white/80 text-xs">{lp.business_hours}</p>
                {lp.closed_days && <p className="text-white/60 text-xs">定休日：{lp.closed_days}</p>}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-container" />
        )}
        {!lp.main_image_url && (
          <div className="relative z-10 max-w-2xl">
            {lp.category && (
              <span className="inline-block px-3 py-1 mb-4 bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest rounded-full uppercase">
                {lp.category}
              </span>
            )}
            <h1 className="text-4xl md:text-6xl font-headline font-extrabold text-white leading-tight mb-6">
              {lp.catch_copy || lp.store_name}
            </h1>
            {lp.description && (
              <p className="text-white/80 text-base leading-relaxed mb-8 max-w-lg line-clamp-3">{lp.description}</p>
            )}
            {lp.cta_link && lp.cta_label && (
              <a
                href={lp.cta_link}
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3.5 rounded-xl font-bold shadow-xl hover:scale-105 transition-transform"
              >
                {lp.cta_label}
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </a>
            )}
          </div>
        )}
      </section>

      {/* About */}
      {lp.description && (
        <section className="py-20 px-6 md:px-10 bg-surface" id="about">
          <div className="max-w-3xl mx-auto">
            <span className="text-secondary font-bold tracking-widest text-xs uppercase block mb-3">Our Story</span>
            <h2 className="text-3xl font-headline font-bold text-primary mb-8 leading-snug">
              心と体が喜ぶ、<br />本当にいいものを
            </h2>
            <p className="text-on-surface-variant leading-loose text-base whitespace-pre-wrap">{lp.description}</p>
          </div>
        </section>
      )}

      {/* Business info bento */}
      <section className="py-16 px-6 md:px-10 bg-white" id="access">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl font-headline font-bold text-primary">店舗情報</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Address */}
            {lp.address && (
              <div className="md:col-span-1 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                <div className="flex items-center gap-2 text-secondary mb-4">
                  <span className="material-symbols-outlined text-xl">location_on</span>
                  <h3 className="font-bold text-sm">アクセス</h3>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">{lp.address}</p>
              </div>
            )}

            {/* Hours */}
            {lp.business_hours && (
              <div className="bg-primary text-on-primary p-6 rounded-2xl">
                <span className="material-symbols-outlined text-2xl mb-4 block opacity-80">schedule</span>
                <h3 className="font-bold text-sm mb-3">営業時間</h3>
                <p className="text-2xl font-headline font-extrabold">{lp.business_hours}</p>
                {lp.closed_days && (
                  <p className="text-sm mt-2 opacity-70">定休日：{lp.closed_days}</p>
                )}
              </div>
            )}

            {/* Contact */}
            {lp.phone && (
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                <span className="material-symbols-outlined text-2xl text-primary mb-4 block">call</span>
                <h3 className="font-bold text-sm text-primary mb-2">お問い合わせ</h3>
                <a href={`tel:${lp.phone}`} className="text-xl font-bold text-primary hover:text-secondary transition-colors block">
                  {lp.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Menu */}
      {lp.services.length > 0 && lp.services[0].name && (
        <section className="py-20 px-6 md:px-10 bg-surface" id="menu">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <span className="text-secondary font-bold tracking-widest text-xs uppercase block mb-2">Our Specials</span>
              <h2 className="text-3xl font-headline font-bold text-primary">メニュー・サービス</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {lp.services.filter(s => s.name).map((svc, i) => (
                <div key={i} className="group">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-outline-variant">restaurant</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-primary mb-1">{svc.name}</h3>
                      {svc.description && (
                        <p className="text-sm text-on-surface-variant leading-relaxed">{svc.description}</p>
                      )}
                    </div>
                    {svc.price_text && (
                      <span className="shrink-0 text-base font-bold text-secondary">{svc.price_text}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* News */}
      {lp.notices.length > 0 && lp.notices[0].title && (
        <section className="py-16 px-6 md:px-10 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-headline font-bold text-primary">お知らせ</h2>
              <div className="h-px flex-1 bg-outline-variant/30" />
            </div>
            <div className="space-y-0">
              {lp.notices.filter(n => n.title).map((notice, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center gap-3 py-5 border-b border-outline-variant/20">
                  {notice.published_date && (
                    <span className="text-xs text-on-surface-variant font-medium shrink-0">{notice.published_date}</span>
                  )}
                  <span className="px-2.5 py-0.5 bg-secondary-container text-on-secondary-container text-xs font-bold rounded w-fit shrink-0">
                    お知らせ
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-primary">{notice.title}</p>
                    {notice.body && <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{notice.body}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SNS */}
      {(lp.instagram_url || lp.line_url) && (
        <section className="py-16 px-6 md:px-10 bg-surface">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-headline font-bold text-primary mb-6">SNS・連絡先</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              {lp.instagram_url && (
                <a
                  href={lp.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-outline-variant/20 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-pink-500">photo_camera</span>
                  Instagram をフォロー
                </a>
              )}
              {lp.line_url && (
                <a
                  href={lp.line_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3 bg-[#06C755] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined">chat</span>
                  LINE で友だち追加
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {lp.cta_label && lp.cta_link && (
        <section className="py-20 px-6 md:px-10 bg-primary relative overflow-hidden">
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-headline font-bold text-on-primary mb-6">
              お会いできるのを<br />楽しみにしています
            </h2>
            <a
              href={lp.cta_link}
              className="inline-block bg-white text-primary px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-transform"
            >
              {lp.cta_label}
            </a>
          </div>
        </section>
      )}

      <footer className="w-full py-8 bg-surface border-t border-outline-variant/15 flex flex-col items-center gap-3">
        <p className="text-sm font-headline font-bold text-primary">{lp.store_name}</p>
        <p className="text-xs text-on-surface-variant">© {new Date().getFullYear()} {lp.store_name}. All rights reserved.</p>
      </footer>
    </div>
  )
}
