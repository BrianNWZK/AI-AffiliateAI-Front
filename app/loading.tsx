export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading AI Systems...</p>
        <p className="text-white/60 text-sm mt-2">Initializing multi-platform integrations</p>
      </div>
    </div>
  )
}
