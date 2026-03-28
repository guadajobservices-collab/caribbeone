'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="flex items-center justify-center min-h-screen bg-[#1a1a1a] text-white">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Oups, quelque chose s&apos;est mal passé</h2>
          <p className="text-gray-400 mb-6">{error.message}</p>
          <button
            onClick={() => reset()}
            className="bg-[#8ab5a7] text-white px-6 py-3 rounded-lg font-semibold"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  )
}
