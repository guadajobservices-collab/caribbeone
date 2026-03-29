import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

// Filtres
const THEMES = ['FESTIVALS','CARNAVALS','CONCERTS','BEACH PARTYS','CROISIÈRES','SPORTS','GASTRONOMIE','NAUTISME','BUSINESS','PRO']
const ILES = ['GUADELOUPE','MARTINIQUE','ST MARTIN','ST BARTH','ST KITTS','ANTIGUA','ANGUILLA','ARUBA','CUBA','CURAÇAO','BARBADE','DOMINIQUE','GRENADE','HAÏTI','JAMAÏQUE','ÎLES VIERGES','PORTO RICO','MIAMI','MONTSERRAT','ST DOMINGUE','STE LUCIE','TRINIDAD & TOBAGO']
const MUSIQUES = ['SOCA','DANCE-HALL','REGGAE','ZOUK','LATINO','ELECTRO']

// Événements démo
const EVENTS_DEMO = [
  { id: '1', title: 'Festival Gwoka 2026', island: 'GUADELOUPE', category: 'FESTIVALS', music: 'ZOUK', date: '15 Juil 2026', price: 'Dès 25€', location: 'Sainte-Anne', img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80' },
  { id: '2', title: 'Carnaval de Martinique', island: 'MARTINIQUE', category: 'CARNAVALS', music: 'SOCA', date: '22 Fév 2026', price: 'Dès 15€', location: 'Fort-de-France', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80' },
  { id: '3', title: 'Beach Party SXM', island: 'ST MARTIN', category: 'BEACH PARTYS', music: 'DANCE-HALL', date: '4 Juil 2026', price: 'Dès 20€', location: 'Orient Bay', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
  { id: '4', title: 'Reggae Sunsplash Jamaïque', island: 'JAMAÏQUE', category: 'CONCERTS', music: 'REGGAE', date: '10 Août 2026', price: 'Dès 45€', location: 'Kingston', img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80' },
  { id: '5', title: 'Croisière Caraïbes', island: 'CUBA', category: 'CROISIÈRES', music: 'LATINO', date: '1 Sept 2026', price: 'Dès 299€', location: 'La Havane', img: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80' },
  { id: '6', title: 'Electro Night Curaçao', island: 'CURAÇAO', category: 'CONCERTS', music: 'ELECTRO', date: '18 Oct 2026', price: 'Dès 35€', location: 'Willemstad', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80' },
]

export default function HomePage() {
  return (
    <>
      <Header />
      <main>

        {/* ===== HERO ===== */}
        <section style={{
          background: 'linear-gradient(135deg, #0D3B4A 0%, #1A6B4A 100%)',
          minHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '100px 24px 60px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Cercles décoratifs */}
          <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(155,189,182,0.12)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(242,199,68,0.1)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: '1.3rem', color: '#9CBDB6', letterSpacing: 1 }}>
              ain&apos;t nothin&apos; like caribbean life !
            </span>

            <h1 style={{
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 800,
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: '#FFFFFF',
              lineHeight: 1.1,
              margin: '16px 0 24px',
            }}>
              Découvrez les meilleurs<br/>
              <span style={{ color: '#F2C744' }}>événements des Caraïbes</span>
            </h1>

            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '1.15rem', color: 'rgba(255,255,255,0.78)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
              Festivals, concerts, carnavals, croisières... Réservez vos billets et vos packs ferry + hébergement en quelques clics.
            </p>

            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/evenements" style={{
                background: '#E07560', color: '#FFFFFF',
                padding: '14px 32px', borderRadius: 999,
                fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1rem',
                textDecoration: 'none', transition: 'transform 0.2s',
              }}>
                Explorer les événements
              </Link>
              <Link href="/organisateur/evenements/nouveau" style={{
                background: 'transparent', color: '#FFFFFF',
                padding: '14px 32px', borderRadius: 999,
                border: '2px solid rgba(255,255,255,0.5)',
                fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1rem',
                textDecoration: 'none',
              }}>
                Je suis organisateur
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 48, justifyContent: 'center', marginTop: 56, flexWrap: 'wrap' }}>
              {[['22', 'Îles'], ['50+', 'Événements'], ['10K+', 'Festivaliers']].map(([n, l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '2rem', color: '#F2C744' }}>{n}</div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Vague */}
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', bottom: -1, left: 0, right: 0, width: '100%' }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F8F9FA"/>
          </svg>
        </section>

        {/* ===== FILTRES ===== */}
        <section style={{ background: '#F8F9FA', padding: '48px 0 40px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

            {/* Filtres par thème */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
                PAR THÈME
              </h3>
              <div className="scroll-x" style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
                {THEMES.map(t => (
                  <span key={t} className="filter-pill">{t}</span>
                ))}
              </div>
            </div>

            {/* Filtres par île */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
                PAR ÎLE
              </h3>
              <div className="scroll-x" style={{ display: 'flex', gap: 8, paddingBottom: 4 }}>
                {ILES.map(i => (
                  <span key={i} className="filter-pill teal">{i}</span>
                ))}
              </div>
            </div>

            {/* Filtres par musique */}
            <div>
              <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
                PAR STYLE MUSICAL
              </h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {MUSIQUES.map(m => (
                  <span key={m} className="filter-pill coral">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== ÉVÉNEMENTS ===== */}
        <section style={{ background: '#FFFFFF', padding: '60px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#1A1A1A', margin: 0, lineHeight: 1.1 }}>
                  Prochains événements
                </h2>
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1.2rem', color: '#9CBDB6', marginTop: 6 }}>
                  Des Antilles à toutes les Caraïbes
                </p>
              </div>
              <Link href="/evenements" style={{
                background: 'transparent', color: '#1A1A1A',
                padding: '10px 24px', borderRadius: 999,
                border: '2px solid #1A1A1A',
                fontFamily: "'Baloo 2', cursive", fontWeight: 700,
                textDecoration: 'none', fontSize: '0.9rem',
                whiteSpace: 'nowrap',
              }}>
                Voir tout →
              </Link>
            </div>

            {/* Grille événements */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 24,
            }}>
              {EVENTS_DEMO.map(event => (
                <Link key={event.id} href={`/evenements/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="event-card">
                    <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
                      <img
                        src={event.img}
                        alt={event.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      />
                      {/* Badge île */}
                      <span style={{
                        position: 'absolute', top: 12, left: 12,
                        background: '#9CBDB6', color: '#FFFFFF',
                        padding: '4px 12px', borderRadius: 999,
                        fontFamily: "'Baloo 2', cursive", fontWeight: 700,
                        fontSize: '0.75rem',
                      }}>
                        {event.island}
                      </span>
                      {/* Badge prix */}
                      <span style={{
                        position: 'absolute', top: 12, right: 12,
                        background: '#E07560', color: '#FFFFFF',
                        padding: '4px 12px', borderRadius: 999,
                        fontFamily: "'Baloo 2', cursive", fontWeight: 700,
                        fontSize: '0.75rem',
                      }}>
                        {event.price}
                      </span>
                    </div>
                    <div style={{ padding: '20px 20px 22px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.82rem', fontWeight: 600, color: '#E07560', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          {event.category}
                        </span>
                        <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.82rem', color: '#6B7280' }}>
                          {event.music}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.2rem', color: '#1A1A1A', margin: '0 0 10px', lineHeight: 1.3 }}>
                        {event.title}
                      </h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.88rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                          📅 {event.date}
                        </span>
                        <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.88rem', color: '#6B7280' }}>
                          📍 {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PACK ÎLES ===== */}
        <section style={{ background: '#F8F9FA', padding: '72px 0' }}>
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', marginTop: -1, transform: 'rotate(180deg)' }}>
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#FFFFFF"/>
          </svg>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#1A1A1A', marginBottom: 8 }}>
              Packs tout-en-un
            </h2>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1.2rem', color: '#9CBDB6', marginBottom: 48 }}>
              Ferry + Billet + Hébergement
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 960, margin: '0 auto' }}>
              {[
                { icon: '⛴️', title: 'Pack Ferry', desc: 'Réservez votre traversée inter-îles depuis votre point de départ', color: '#9CBDB6' },
                { icon: '🎟️', title: 'Pack Billet', desc: 'E-billet avec QR code, accès garanti à tous les événements', color: '#E07560' },
                { icon: '🏨', title: 'Pack Séjour', desc: "Hébergement sélectionné proche du lieu de l'événement", color: '#1A6B4A' },
              ].map(p => (
                <div key={p.title} style={{ background: '#FFFFFF', borderRadius: 20, padding: '36px 28px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.8rem', marginBottom: 16 }}>{p.icon}</div>
                  <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.3rem', color: '#1A1A1A', marginBottom: 10 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontFamily: "'Nunito', sans-serif", color: '#6B7280', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    {p.desc}
                  </p>
                  <div style={{ marginTop: 20, height: 3, background: p.color, borderRadius: 4 }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ORGANISATEURS ===== */}
        <section style={{ background: '#1A1A1A', padding: '80px 24px', textAlign: 'center' }}>
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', marginBottom: 48, transform: 'rotate(180deg)', marginTop: -80 }}>
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#F8F9FA"/>
          </svg>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#FFFFFF', lineHeight: 1.15, marginBottom: 16 }}>
              Vous organisez un événement ?
            </h2>
            <p style={{ fontFamily: "'Nunito', sans-serif", color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 36 }}>
              Publiez votre événement en autonomie, gérez vos packs transport et hébergement, encaissez directement via Stripe.
            </p>
            <Link href="/organisateur/evenements/nouveau" style={{
              background: '#9CBDB6', color: '#1A1A1A',
              padding: '16px 40px', borderRadius: 999,
              fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.1rem',
              textDecoration: 'none',
            }}>
              Créer mon événement gratuitement
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
