import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white/80 mb-4">Page Not Found</h2>
        <p className="text-white/60 mb-8">The page you're looking for doesn't exist.</p>
        <Link
          href="/"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}
