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
        background: scrolled ? 'rgba(250,250,248,0.97)' : 'rgba(250,250,248,0.95)',
        backdropFilter: 'blur(12px)',
        boxShadow: scrolled ? '0 2px 20px rgba(13,59,74,0.08)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(156,189,182,0.2)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <Image
            src="/logo.jpg"
            alt="CaribbeOne"
            width={48}
            height={48}
            className="object-cover"
            style={{ borderRadius: '12px' }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: '/evenements', label: 'Événements' },
            { href: '/organisateur', label: 'Organisateurs' },
            { href: '/#about', label: 'À propos' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{
                color: 'var(--color-noir)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {(user.role === 'organizer' || user.role === 'admin') && (
                <Link
                  href="/organisateur/evenements/nouveau"
                  className="px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{
                    background: 'var(--color-corail)',
                    color: '#fff',
                    fontFamily: 'var(--font-display)',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: '0.9rem',
                  }}
                >
                  Créer un événement
                </Link>
              )}
              <Link
                href="/compte"
                className="text-sm transition-colors hover:opacity-70"
                style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
              >
                Mon compte
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm transition-colors hover:opacity-70"
                style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/connexion"
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
              >
                Connexion
              </Link>
              <Link
                href="/organisateur/evenements/nouveau"
                className="px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: 'var(--color-corail)',
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                  borderRadius: 'var(--radius-xl)',
                  fontSize: '0.9rem',
                }}
              >
                Créer un événement
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          style={{ color: 'var(--color-noir)' }}
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
            background: 'rgba(250,250,248,0.99)',
            borderTop: '1px solid rgba(156,189,182,0.3)',
          }}
        >
          {[
            { href: '/evenements', label: 'Événements' },
            { href: '/organisateur', label: 'Organisateurs' },
            { href: '/#about', label: 'À propos' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-base font-medium py-2 border-b"
              style={{ color: 'var(--color-noir)', borderColor: 'rgba(13,59,74,0.08)' }}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

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
            <Link
              href="/auth/connexion"
              className="text-base py-2"
              style={{ color: 'var(--color-muted)' }}
              onClick={() => setMenuOpen(false)}
            >
              Connexion
            </Link>
          )}

          <Link
            href="/organisateur/evenements/nouveau"
            className="mt-2 py-3 text-center text-base font-semibold transition-opacity hover:opacity-90"
            style={{
              background: 'var(--color-corail)',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              borderRadius: 'var(--radius-xl)',
            }}
            onClick={() => setMenuOpen(false)}
          >
            Créer un événement
          </Link>
        </div>
      )}
    </header>
  )
}
