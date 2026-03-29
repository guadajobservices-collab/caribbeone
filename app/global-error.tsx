'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="fr">
      <body style={{ background: '#0D3B4A', color: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0, fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Oups, quelque chose s&apos;est mal passé</h2>
          <p style={{ marginBottom: '1.5rem', opacity: 0.6, fontSize: '0.9rem' }}>{error?.message}</p>
          <button
            onClick={() => reset()}
            style={{ background: '#9CBDB6', color: '#1A1A1A', padding: '0.75rem 1.5rem', border: 'none', cursor: 'pointer', fontWeight: 600, borderRadius: '40px' }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  )
}
