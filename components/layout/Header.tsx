'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface HeaderProps {
  user?: { email: string | undefined; role: string | undefined } | null
}

export default function Header({ user }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="CaribbeOne" style={{ height: 44, width: 'auto', objectFit: 'contain', display: 'block' }} />
        </Link>

        {/* Nav desktop */}
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="hidden md:flex">
          {['Événements', 'Îles', 'Organisateurs'].map(item => (
            <Link key={item} href="#" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, color: scrolled ? '#1A1A1A' : '#FFFFFF', fontSize: '0.95rem', textDecoration: 'none', transition: 'opacity 0.2s' }}>
              {item}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user ? (
            <Link href="/compte" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, color: scrolled ? '#1A1A1A' : '#FFFFFF', fontSize: '0.9rem', textDecoration: 'none' }}>
              Mon compte
            </Link>
          ) : (
            <Link href="/auth/connexion" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, color: scrolled ? '#1A1A1A' : '#FFFFFF', fontSize: '0.9rem', textDecoration: 'none' }}>
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
