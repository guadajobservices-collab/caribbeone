'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="fr">
      <body style={{ background: '#0D0D0D', color: '#F7F3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0, fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Oups, quelque chose s&apos;est mal passé</h2>
          <button
            onClick={() => reset()}
            style={{ background: '#5BA8A0', color: '#1A1A1A', padding: '0.75rem 1.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  )
}
