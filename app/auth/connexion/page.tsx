'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou mot de passe incorrect')
    } else {
      router.push(redirect)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0D3B4A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 420, boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/">
            <img src="/logo.png" alt="CaribbeOne" style={{ height: 60, width: 'auto', margin: '0 auto 12px', display: 'block' }} />
          </Link>
          <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.6rem', color: '#1A1A1A', margin: 0 }}>
            Administration
          </h1>
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1rem', color: '#9CBDB6', marginTop: 4 }}>
            ain't nothin' like caribbean life !
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', fontSize: '0.88rem', padding: '12px 16px', borderRadius: 12, marginBottom: 16, fontFamily: "'Nunito', sans-serif" }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: '0.9rem', color: '#374151', display: 'block', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="votre@email.com"
              style={{
                width: '100%', boxSizing: 'border-box',
                border: '2px solid #E5E7EB', borderRadius: 12,
                padding: '12px 16px', fontSize: '0.95rem',
                fontFamily: "'Nunito', sans-serif",
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#9CBDB6'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: '0.9rem', color: '#374151', display: 'block', marginBottom: 6 }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%', boxSizing: 'border-box',
                border: '2px solid #E5E7EB', borderRadius: 12,
                padding: '12px 16px', fontSize: '0.95rem',
                fontFamily: "'Nunito', sans-serif",
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = '#9CBDB6'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: '#0D3B4A', color: '#FFFFFF',
              padding: '14px', borderRadius: 12, border: 'none',
              fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/" style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', color: '#9CBDB6', textDecoration: 'none' }}>
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ConnexionPage() {
  return <Suspense><LoginForm /></Suspense>
}
