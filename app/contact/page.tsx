import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function ContactPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 100, minHeight: '80vh', background: '#F8F9FA' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '60px 24px' }}>

          <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#1A1A1A', marginBottom: 8 }}>
            Contact
          </h1>
          <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1.2rem', color: '#9CBDB6', marginBottom: 48 }}>
            Une question ? On vous répond rapidement.
          </p>

          <div style={{ background: '#FFFFFF', borderRadius: 24, padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 40 }}>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>📧</div>
                <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1rem', color: '#1A1A1A', marginBottom: 4 }}>Email</h3>
                <a href="mailto:contact@caribbeone.com" style={{ fontFamily: "'Nunito', sans-serif", color: '#9CBDB6', textDecoration: 'none', fontSize: '0.95rem' }}>
                  contact@caribbeone.com
                </a>
              </div>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>🌴</div>
                <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1rem', color: '#1A1A1A', marginBottom: 4 }}>Basé en</h3>
                <p style={{ fontFamily: "'Nunito', sans-serif", color: '#6B7280', fontSize: '0.95rem', margin: 0 }}>
                  Guadeloupe, Antilles françaises
                </p>
              </div>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>⏰</div>
                <h3 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1rem', color: '#1A1A1A', marginBottom: 4 }}>Réponse sous</h3>
                <p style={{ fontFamily: "'Nunito', sans-serif", color: '#6B7280', fontSize: '0.95rem', margin: 0 }}>
                  24 à 48h ouvrées
                </p>
              </div>
            </div>

            <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: '0.88rem', color: '#374151', display: 'block', marginBottom: 6 }}>Nom</label>
                  <input type="text" placeholder="Jean Dupont" style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #E5E7EB', borderRadius: 12, padding: '12px 16px', fontFamily: "'Nunito', sans-serif", fontSize: '0.95rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: '0.88rem', color: '#374151', display: 'block', marginBottom: 6 }}>Email</label>
                  <input type="email" placeholder="jean@example.com" style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #E5E7EB', borderRadius: 12, padding: '12px 16px', fontFamily: "'Nunito', sans-serif", fontSize: '0.95rem', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: '0.88rem', color: '#374151', display: 'block', marginBottom: 6 }}>Sujet</label>
                <input type="text" placeholder="Votre sujet..." style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #E5E7EB', borderRadius: 12, padding: '12px 16px', fontFamily: "'Nunito', sans-serif", fontSize: '0.95rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: '0.88rem', color: '#374151', display: 'block', marginBottom: 6 }}>Message</label>
                <textarea rows={5} placeholder="Décrivez votre demande..." style={{ width: '100%', boxSizing: 'border-box', border: '2px solid #E5E7EB', borderRadius: 12, padding: '12px 16px', fontFamily: "'Nunito', sans-serif", fontSize: '0.95rem', outline: 'none', resize: 'vertical' }} />
              </div>
              <button type="submit" style={{ background: '#E07560', color: '#FFFFFF', padding: '14px 32px', borderRadius: 40, border: 'none', fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1rem', cursor: 'pointer', alignSelf: 'flex-start' }}>
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
