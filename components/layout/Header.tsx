'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Header({ user }: { user: { email?: string; role?: string } | null }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(13,13,13,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(91,168,160,0.15)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <Image
            src="/logo.jpg"
            alt="CaribbeOne"
            width={40}
            height={40}
            className="object-cover"
            style={{ borderRadius: 0 }}
          />
        </Link>

        {/* Desktop Nav — centré */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/evenements"
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
          >
            Événements
          </Link>
          <Link
            href="/organisateur"
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
          >
            Organisateurs
          </Link>
          <Link
            href="/#about"
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
          >
            À propos
          </Link>
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {(user.role === 'organizer' || user.role === 'admin') && (
                <Link
                  href="/organisateur/evenements/nouveau"
                  className="px-5 py-2 text-sm font-medium transition-colors"
                  style={{
                    background: 'var(--color-teal)',
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.9rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  CRÉER UN ÉVÉNEMENT
                </Link>
              )}
              <Link
                href="/compte"
                className="text-sm transition-colors"
                style={{ color: 'var(--color-muted)' }}
              >
                Mon compte
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm transition-colors"
                style={{ color: 'var(--color-muted)' }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/connexion"
                className="text-sm font-medium transition-colors"
                style={{ color: 'var(--color-muted)' }}
              >
                Connexion
              </Link>
              <Link
                href="/organisateur/evenements/nouveau"
                className="px-5 py-2 text-sm font-medium"
                style={{
                  background: 'var(--color-teal)',
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em',
                }}
              >
                CRÉER UN ÉVÉNEMENT
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          style={{ color: 'var(--color-text)' }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden px-4 py-6 flex flex-col gap-4"
          style={{
            background: 'rgba(13,13,13,0.98)',
            borderTop: '1px solid rgba(91,168,160,0.2)',
          }}
        >
          <Link
            href="/evenements"
            className="text-base font-medium py-2 border-b"
            style={{ color: 'var(--color-text)', borderColor: 'rgba(255,255,255,0.06)' }}
            onClick={() => setMenuOpen(false)}
          >
            Événements
          </Link>
          <Link
            href="/organisateur"
            className="text-base font-medium py-2 border-b"
            style={{ color: 'var(--color-text)', borderColor: 'rgba(255,255,255,0.06)' }}
            onClick={() => setMenuOpen(false)}
          >
            Organisateurs
          </Link>
          <Link
            href="/#about"
            className="text-base font-medium py-2 border-b"
            style={{ color: 'var(--color-text)', borderColor: 'rgba(255,255,255,0.06)' }}
            onClick={() => setMenuOpen(false)}
          >
            À propos
          </Link>
          {user ? (
            <>
              <Link
                href="/compte"
                className="text-base py-2"
                style={{ color: 'var(--color-muted)' }}
                onClick={() => setMenuOpen(false)}
              >
                Mon compte
              </Link>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false) }}
                className="text-left text-base py-2"
                style={{ color: 'var(--color-muted)' }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/connexion"
                className="text-base py-2"
                style={{ color: 'var(--color-muted)' }}
                onClick={() => setMenuOpen(false)}
              >
                Connexion
              </Link>
            </>
          )}
          <Link
            href="/organisateur/evenements/nouveau"
            className="mt-2 py-3 text-center text-base font-medium"
            style={{
              background: 'var(--color-teal)',
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.05em',
            }}
            onClick={() => setMenuOpen(false)}
          >
            CRÉER UN ÉVÉNEMENT
          </Link>
        </div>
      )}
    </header>
  )
}
