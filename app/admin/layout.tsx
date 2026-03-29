'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin', label: 'Tableau de bord', icon: '📊' },
  { href: '/admin/evenements', label: 'Événements', icon: '🎪' },
  { href: '/admin/reservations', label: 'Réservations', icon: '🎟️' },
  { href: '/admin/blog', label: 'Blog', icon: '✍️' },
  { href: '/admin/pages', label: 'Pages', icon: '📄' },
  { href: '/admin/medias', label: 'Médias', icon: '🖼️' },
]

const FF_DISPLAY = '"Baloo 2", cursive'
const FF_BODY = '"Nunito", sans-serif'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FA' }}>
      <aside style={{ width: 240, background: '#0D3B4A', color: '#FFFFFF', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontFamily: FF_DISPLAY, fontWeight: 800, fontSize: '1.2rem', color: '#9CBDB6' }}>CaribbeOne</div>
          <div style={{ fontFamily: FF_BODY, fontSize: '0.75rem', color: 'rgba(155,189,182,0.7)', marginTop: 4 }}>Administration</div>
        </div>
        <nav style={{ padding: '16px 0', flex: 1 }}>
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 20px',
                background: active ? 'rgba(155,189,182,0.2)' : 'transparent',
                borderLeft: active ? '3px solid #9CBDB6' : '3px solid transparent',
                color: active ? '#9CBDB6' : 'rgba(255,255,255,0.75)',
                textDecoration: 'none',
                fontFamily: FF_BODY, fontWeight: active ? 700 : 500,
                fontSize: '0.92rem',
                transition: 'all 0.15s',
              }}>
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', textDecoration: 'none', fontFamily: FF_BODY }}>
            ← Voir le site
          </Link>
        </div>
      </aside>
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
