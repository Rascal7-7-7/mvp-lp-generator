import LPForm from '@/components/LPForm'

export default function EditorPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-sm font-semibold text-indigo-600">LP ジェネレーター</span>
          <span className="text-xs text-gray-400">新規作成</span>
        </div>
      </nav>
      <LPForm />
    </main>
  )
}
