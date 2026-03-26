export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <p className="text-4xl mb-4">🔍</p>
      <h1 className="text-xl font-bold text-gray-800 mb-2">ページが見つかりません</h1>
      <p className="text-sm text-gray-500 text-center">
        このURLのページは存在しないか、現在非公開です。
      </p>
    </div>
  )
}
