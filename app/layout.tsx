import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LP ジェネレーター',
  description: '小規模店舗向けランディングページ作成サービス',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}
