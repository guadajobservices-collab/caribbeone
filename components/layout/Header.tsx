'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface HeaderProps {
  user?: { email: string | undefined; role: string | undefined } | null
}

export default function Header({ user }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkColor = scrolled ? '#1A1A1A' : '#FFFFFF'

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="CaribbeOne" style={{ height: 72, width: 'auto', objectFit: 'contain', display: 'block' }} />
        </Link>

        {/* Nav desktop */}
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {[
            { label: 'Événements', href: '/evenements' },
            { label: 'Îles', href: '/evenements?type=ile' },
            { label: 'Contact', href: '/contact' },
          ].map(({ label, href }) => (
            <Link key={label} href={href} style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 600,
              color: linkColor, fontSize: '0.95rem', textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Admin — lien discret en bas à droite, visible uniquement si admin connecté OU accès direct */}
        <div>
          {user?.role === 'admin' ? (
            <Link href="/admin" style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 700,
              color: '#9CBDB6', fontSize: '0.85rem', textDecoration: 'none',
              border: '1px solid #9CBDB6', padding: '6px 14px', borderRadius: 40,
            }}>
              ⚙️ Admin
            </Link>
          ) : (
            /* Lien admin totalement discret — petit point en bas à droite */
            <Link href="/auth/connexion" style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'rgba(155,189,182,0.3)',
              display: 'block',
              transition: 'background 0.3s',
            }} title="Administration" />
          )}
        </div>

      </div>
    </header>
  )
}
