import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#0D3B4A', color: 'rgba(255,255,255,0.8)', padding: '48px 24px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <Image src="/logo.jpg" alt="CaribbeOne" width={120} height={40} style={{ height: 40, width: 'auto', marginBottom: 12 }} />
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1rem', color: '#9CBDB6', lineHeight: 1.5 }}>
              ain&apos;t nothin&apos; like caribean life !
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#FFFFFF', marginBottom: 16, fontSize: '1rem' }}>Événements</h4>
            {['Festivals','Concerts','Carnavals','Beach Partys'].map(l => (
              <Link key={l} href="#" style={{ display: 'block', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: 8, fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem' }}>{l}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#FFFFFF', marginBottom: 16, fontSize: '1rem' }}>Îles phares</h4>
            {['Guadeloupe','Martinique','St Martin','Jamaïque'].map(l => (
              <Link key={l} href="#" style={{ display: 'block', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: 8, fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem' }}>{l}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, color: '#FFFFFF', marginBottom: 16, fontSize: '1rem' }}>Organisateurs</h4>
            {['Créer un événement','Mon espace','Scanner QR','Mes ventes'].map(l => (
              <Link key={l} href="#" style={{ display: 'block', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: 8, fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem' }}>{l}</Link>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, textAlign: 'center', fontFamily: "'Nunito', sans-serif", fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
          © 2026 CaribbeOne · Tous droits réservés · <Link href="#" style={{ color: '#9CBDB6', textDecoration: 'none' }}>CGU</Link> · <Link href="#" style={{ color: '#9CBDB6', textDecoration: 'none' }}>Confidentialité</Link>
        </div>
      </div>
    </footer>
  )
}
